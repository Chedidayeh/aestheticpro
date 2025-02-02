/* eslint-disable @next/next/no-img-element */
'use client'
import NextImage from 'next/image'
import { Product, SellerDesign, User } from '@prisma/client'
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Store} from '@prisma/client'
import { followStore, unfollowStore } from "./actions"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductsView from './ProductsView'
import DesignView from './DesignView'
import { FaFacebook, FaInstagram } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import LoginModal from '@/components/LoginModal'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, UserRoundCheck, UserX, X } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
 
interface Productswithstore extends Product {
  store : Store
}
interface ProductReelProps {
  initialProducts : Productswithstore[]
  totalCount : number
  initialPage:number
  limit:number
  priceRanges : [number, number][]
  store : Store
  user : User
  storeProductsCount:number
  designs : SellerDesign[]
  categories : string[]
  collections : string[]
  followersCount : number
  follows:boolean
}
const StoreView = ({ initialProducts,totalCount,initialPage, limit, priceRanges,store, user ,storeProductsCount, designs , categories , collections , followersCount , follows }: ProductReelProps) => {
  
  const { toast } = useToast()
  const router = useRouter()
    const [activeTab, setActiveTab] = useState('Products');
    const handleTabChange = (value : string) => {
      setActiveTab(value);
    };

    const handleFacebookIconClick = () => {
      const url = store.facebookLink;
      window.open(url!, '_blank', 'noopener,noreferrer');
    };

    const handleInstagramIconClick = () => {
      const url = store.instagramLink;
      window.open(url!, '_blank', 'noopener,noreferrer');
    };


    const [isFollowing, setIsFollowing] = useState(follows);
  const [loading, setLoading] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false)

  const handleFollowToggle = async () => {
    if(!user){
      setIsLoginModalOpen(true)
      toast({
        title: 'No logged in user found !',
        description: 'You need to log In first !',
        variant: 'destructive',
      });
      return
    }
    setLoading(true);
    try {
      if (isFollowing) {
        await unfollowStore(user.id, store.id);
        setIsFollowing(false);
        toast({
          title: 'Store is unfollowed !',
          variant: 'default',
        });
        router.refresh()
      } else {
        await followStore(user.id, store.id);
        setIsFollowing(true);
        toast({
          title: 'Store is followed !',
          variant: 'default',
        });
        router.refresh()
      }
    } catch (error) {
      console.error("Error following/unfollowing store", error);
      toast({
        title: 'Error !',
        description : 'Try again later !',
        variant: 'destructive',
      });
      router.refresh()
    } finally {
      setLoading(false);
    }
  };

  return (

    <>
    <section className='py-4'>
     
     <div className='py-10 bg-muted/50 rounded-xl mx-auto text-center flex flex-col items-center max-w-1xl'>

     <div className="flex flex-col items-center text-center">

     <div className="relative w-[200px] h-[200px] rounded-full bg-gray-100 border-2 shadow-xl  border-gray-500 overflow-hidden">
          <NextImage
            src={store.logoUrl}
            alt="store"
            layout="fill"
            quality={40}
            className="rounded-full object-cover"
          />
     </div>
  
     <Badge className="text-center hover:bg-gray-200 bg-gray-200 font-semibold text-sm text-black mt-4">
          {store.storeName}
        </Badge>
        
  <p className="mt-2 text-sm text-muted-foreground">
    {store?.storeBio}
  </p>

     <div className='mt-4'>
      <p className="text-sm font-medium">{followersCount} {followersCount === 1 ? 'follower' : 'followers'}</p>
    </div>

    <div className={`mt-4 ${isFollowing ? '' : 'animate-wiggle'}`}>
      {isFollowing ? (
        <>
        <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button         
        disabled={loading}
        className={`relative border-2 animate-borderPulse ${
          loading ? 'animate-borderPulse' : ''
        }`} variant="outline">{loading ? "Loading..." : "Following" } <ChevronDown size={16} /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='bottom' className="w-18">
        <DropdownMenuLabel className='text-xs text-muted-foreground'>Unfollow this store</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleFollowToggle} className='cursor-pointer'>
            Unfollow
            <DropdownMenuShortcut><X size={16}/></DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
        </>
      ) : (

        <Button 
        variant={"outline"} 
        onClick={handleFollowToggle}
        disabled={loading}
        className={`relative border-2 ${
          loading ? 'animate-borderPulse' : ''
        }`}
      >
        {loading ? "Loading..." : "Follow this store"}
      </Button> 

      )}
   
</div>



</div>


<div className="mt-4 items-center justify-center flex">
            <Tabs defaultValue="Products" className="w-full sm:w-[500px]" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="Products">Store Products</TabsTrigger>
          <TabsTrigger value="Designs">Store Designs</TabsTrigger>
        </TabsList>
      </Tabs>

          </div>
     
          </div>


          {activeTab === 'Products' && (
            <div className='mt-2'>
            <ProductsView 
            initialProducts={initialProducts}
            totalCount={totalCount}
            initialPage={initialPage}
            limit={limit}
            priceRanges={priceRanges}
            storeId={store.id} 
            user={user} 
            storeProductsCount={storeProductsCount}
            categories={categories} 
            collections={collections} />
            </div>
            )}

          {activeTab === 'Designs' && (
            <div className='mt-2'>
            <DesignView designs={designs} />
            </div>
            )}

    </section>


    {store.displayContact && (
        <div className='flex justify-center my-4'>
      <section className='border rounded-2xl w-[50%] bg-muted/50 border-gray-200'>
        <MaxWidthWrapper className='py-4 text-center'>
          <div className='my-2'>
            <p className='text-sm'>Contact the seller</p>
          </div>
              <div className="flex justify-center gap-6 my-2">
                {store.facebookLink && (
                  <div className='border-1 rounded-full bg-white'>
                  <FaFacebook
                    className="text-2xl cursor-pointer text-blue-600"
                    onClick={handleFacebookIconClick}
                  />       
                  </div>
                )}
                {store.instagramLink && (
                  <div className='border-1 rounded-lg bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600'>
                  <FaInstagram
                    className="text-2xl cursor-pointer text-white"
                    onClick={handleInstagramIconClick}
                  />
                </div>
                )}
              </div>
              {(store.instagramLink || store.facebookLink) && (
              <div className='my-2'>
                <p className='text-sm'>or</p>
              </div>
                 )}
          <div className='my-2'>
          <p className="text-sm">
          +216{' '}
          {store.userPhoneNumber
            ?.replace(/^\+216/, '') // Remove +216 if present
            .replace(/(\d{2})(\d{3})(\d{3})/, '$1 $2 $3') // Format the number
          }
        </p>

          </div>
        </MaxWidthWrapper>
      </section>
    </div>
    )}

<LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />

    </>

  )


  
}




export default StoreView