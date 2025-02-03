'use client'
import NextImage from "next/image"
import { formatDistanceToNow } from 'date-fns'; // Import for time formatting
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel, AlertDialogFooter } from '@/components/ui/alert-dialog';

interface ProductReelProps {
  title: string
  subtitle?: string
  user? : User
  productId : string
  productReviews:ExtraProductReviews[]

}

interface ExtraProductReviews extends ProductReviews{
  user: {
    name: string;
    image: string | null;
};
}

import { PencilLine, Terminal, X } from "lucide-react"
 
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Input } from "../../../../../components/ui/input"
import { Button } from "../../../../../components/ui/button"
import { ProductReviews, User } from "@prisma/client"
import LoginModal from "../../../../../components/LoginModal"
import { useToast } from "../../../../../components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useState } from "react"
import LoadingState from "../../../../../components/LoadingState"
import { createUserReview, removeReview } from "./actions"


const Reviews = (props: ProductReelProps) => {
  const { title, subtitle  , user , productId , productReviews} = props

  // currentUserId

  const { toast } = useToast()
  const router = useRouter()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false)
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState('')
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  // review Id 
  const [reviewId, setReviewId] = useState('')
  
  const createReview = async () => {
    if (!user) {
      setIsLoginModalOpen(true);
      toast({
        title: 'No logged-in user found!',
        description: 'Please log in to leave a review.',
        variant: 'destructive',
      });
      return;
    }
  
    try {
      setOpen(true);
  
      const newReview = await createUserReview(content ,user.id , productId); // Ensure this function returns a success/failure response
  
      if (newReview) {
        toast({
          title: 'Review submitted successfully!',
          description: 'Thank you for your feedback.',
          variant: 'default',
          duration: 5000,
        });

        setVisibleReviews((prevReviews) => [
          ...prevReviews,
          newReview, // Assuming the new review is returned with the same shape as existing reviews
        ]);
        
        setContent("")
        router.refresh();
        setOpen(false);
        return;
      }else {
        setOpen(false);
        toast({
          title: 'Error submitting review',
          description: 'Please try again later.',
          variant: 'destructive',
          });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error submitting review!',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setOpen(false);
    }
  };

  const handleRemoveReview = async () => {
    try {
      setOpenDeleteDialog(false)
      setOpen(true)
  
      // Make a request to the backend to delete the review from the database
      const response = await removeReview(reviewId)
  
      if (response) {
        // Remove the review from the local state (UI update)
        toast({
          title: 'Review removed successfully!',
          variant: 'default',
          duration: 3000,
        });
        setVisibleReviews((prevReviews) => 
          prevReviews.filter((review) => review.id !== reviewId)
        );
        router.refresh();
        setOpen(false);
        return
      } else {
        // Handle errors if the deletion fails
        toast({
          title: 'Failed to remove review.',
          description: 'There was an issue deleting the review.',
          variant: 'destructive',
          duration: 3000,
        });
        setOpen(false);
        return
      }
    } catch (error) {
      // Handle network errors or unexpected issues
      console.error('Error removing review:', error);
      toast({
        title: 'Error removing review.',
        description: 'Please try again later.',
        variant: 'destructive',
        duration: 3000,
      });
      setOpen(false);
      return
    }
  };
  

  const [visibleReviews, setVisibleReviews] = useState(productReviews.slice(0, 4)); // Initially show the first 4 reviews
  const [currentPage, setCurrentPage] = useState(0); // Initialize page starting from 0
  
  // Load more reviews function
  const loadMoreReviews = () => {
    const nextPage = currentPage + 1; // Calculate the next page
    const nextReviews = productReviews.slice(nextPage * 4, (nextPage + 1) * 4); // Get the next 4 reviews
    setVisibleReviews((prevReviews) => [...prevReviews, ...nextReviews]); // Append new reviews to the list
    setCurrentPage(nextPage); // Update the current page
  };

  

  return (
    <>
    <section className='py-12'>
      <div className='md:flex md:items-center md:justify-between mb-4'>
        <div className='max-w-2xl px-4 lg:max-w-4xl lg:px-0'>
          {title ? (
            <h1 className='text-xl font-bold  sm:text-xl'>
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className='mt-2 text-sm text-muted-foreground'>
              {subtitle} <span className="text-xs">(total: {productReviews.length})</span>
            </p>
          ) : null}
        </div>
      </div>

      <div className='relative'>
  <div className='mt-6 flex items-center w-full'>
    <div className='flex flex-col gap-4 w-full'>

    <Alert className="w-full">
        <PencilLine className="h-4 w-4" />
        <AlertTitle>Add yours :</AlertTitle>
        <AlertDescription className="space-y-4 mt-4">
        <Input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={100}
          placeholder="Describe your experience..."
          className="w-full text-xs p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
    <div className="text-right">
    <Button disabled={content.length===0 || content.length>100} onClick={createReview} size={"sm"} className="text-white" >Add</Button>
    </div>
    </AlertDescription>
    </Alert>


{visibleReviews.map((review: ExtraProductReviews, index: number) => (
  <Alert key={review.id} className="w-full">
    <div className="flex items-center justify-between gap-4">
      {/* User Avatar */}
      <div className="w-10 h-10 rounded-full cursor-pointer overflow-hidden border-2 border-gray-200">
        <NextImage 
          src={review.user.image ? review.user.image : "/default-avatar.png"} 
          alt={`${review.user.name}'s avatar`}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="space-y-2 flex-1">
        {/* User Name */}
        <AlertTitle className="text-xs">{review.user.name}</AlertTitle>
        {/* Review Content */}
        <AlertDescription className="text-xs break-all">{review.content}</AlertDescription>

        {/* Time Since Review */}
        <p className="text-xs text-muted-foreground mt-2">
          {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
        </p>
      </div>

      {/* Remove Button (Only if current user matches review user) */}
      {(review.userId === user?.id || user?.userType === 'ADMIN') && (
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => {
            setReviewId(review.id);
            setOpenDeleteDialog(true);
          }}
          className="text-red-500 hover:text-red-500 text-xs"
        >
          <X size={16} />
        </Button>
      )}
    </div>
  </Alert>
))}

{visibleReviews.length < productReviews.length && (
  <div className="text-center mt-2">
    <Button variant="outline" size="sm" onClick={loadMoreReviews}>
      Load More
    </Button>
  </div>
)}



    </div>
  </div>
</div>

    </section>

    <LoadingState isOpen={open} />

    <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />


    <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
    <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
    <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenDeleteDialog(false)}>
             Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRemoveReview} 
              className="bg-red-500 hover:bg-red-500 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </>
  )


  
}




export default Reviews