'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'
import { Platform, Product, User } from '@prisma/client'
import { useToast } from '../ui/use-toast'
import { addProductToCart } from '@/actions/actions'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader } from 'lucide-react'
import LoginModal from '../LoginModal'
import { useRouter } from 'next/navigation'
const AddToCartButton = ({
  user,
  product,
  size,
  color,
  quantity,
  index,
  platform
}: {
  user :  User
  product: Product
  size : string
  color : string
  quantity : number
  index : number
  platform: Platform
}) => {
  const { toast } = useToast()
  const router = useRouter()

    const [isSuccess, setIsSuccess] = useState<boolean>(false)

    useEffect(() => {
      const timeout = setTimeout(() => {
        setIsSuccess(false)
      }, 2000)

      return () => clearTimeout(timeout)
    }, [isSuccess])
  
    const productImgs = getProductImages(product.croppedFrontProduct[index],product.croppedBackProduct[index])
    const price = product.price
    const category = product.category
  
    const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false)



  const saveToCartProducts = async () =>{

    if(size === "") {
      toast({
        title: "Select a size !",
        description: "Please select a size to continue",
        variant : "destructive",
        duration: 2000,
      })
      return
    }

    if(color === "") {
      toast({
        title: "Select a color !",
        description: "Please select a color to continue",
        variant : "destructive",
        duration: 2000,
      })
      return
    }

    if (!user) {
      setIsLoginModalOpen(true)
      toast({
        title: 'No logged in user found !',
        description: 'Try to login first!',
        variant: 'destructive',
      });
      return;
    }

    try {

  
      setOpenDialog(true)
      const result = await addProductToCart(product.id,user.id,price,category,size,color,quantity,productImgs)
      if(result){
        setOpenDialog(false)
        setIsSuccess(true)
      toast({
        title: 'Product added to cart !',
        description: '',
        variant: 'default',
        duration: 5000,

      });
      router.refresh()
      return
      }
      if(!result) {
        setOpenDialog(false)
        toast({
          title: 'You already added this product to your cart !',
          description: 'try to change the color or the size or other detail to continue',
          variant: 'destructive',
          duration: 5000,
        });
        return

      }
  
      
    } catch (error) {
      setOpenDialog(false)
      console.error('Error saving product to cart:', error);
      toast({
        title: 'Error saving product to cart!',
        description: 'Please try again later.',
        variant: 'destructive',
      });
      return
    }
    

  }


  function getProductImages(frontImg?: string | null, backImg?: string | null): string[] {
    const images: string[] = [];
  
    if (frontImg !== null && frontImg !== undefined) {
      images.push(frontImg);
    }
  
    if (backImg !== null && backImg !== undefined) {
      images.push(backImg);
    }
  
    return images;
  }
    


  const [openDialog, setOpenDialog] = useState(false);


    return (

      <>


{/* The AlertDialog component */}
                            <AlertDialog  open={openDialog}>
                          <AlertDialogContent>
                            <AlertDialogHeader className="flex flex-col items-center">
                              <div></div>
                              <AlertDialogTitle className="text-xl text-blue-700 font-bold text-center">
                              Adding to cart!
                              </AlertDialogTitle>
                              <AlertDialogDescription className="flex flex-col items-center">
                                This will take a moment.
                              <Loader className="text-blue-700 h-[30%] w-[30%] animate-spin mt-3" />
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                          </AlertDialogContent>
                        </AlertDialog>  

    <Button
      disabled={quantity > platform.maxProductQuantity || quantity < 1 || !quantity}
      onClick={saveToCartProducts}
      size='lg'
      variant={'default'}
      className='w-[60%] animate-wiggle text-white'>
      {isSuccess ? 'Added !' : 'Add to cart'}
    </Button>
    
    <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />

      </>

      
    )


}

export default AddToCartButton
