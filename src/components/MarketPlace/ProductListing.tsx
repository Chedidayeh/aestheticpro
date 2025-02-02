'use client'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Card,
} from "@/components/ui/card"
import NextImage from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Skeleton } from '../ui/skeleton'
import { Product, Store, User } from '@prisma/client'
import { Badge } from "../ui/badge"
import { Label } from "@radix-ui/react-label"
import { Heart, Loader } from "lucide-react"
import { useToast } from "../ui/use-toast"
import { addProductToFavList, checkProductInFavList, removeProductFromFavList } from "@/actions/actions"
import { useRouter } from "next/navigation"
import clsx from "clsx"
import { useInView } from "react-intersection-observer"
import LoadingLink from "../LoadingLink"

interface Productswithstore extends Product {
  store : Store
}
interface ProductListingProps {
  user:User
  product: Productswithstore
  index: number
}

const ProductListing = ({
  user,
  product,
  index,
}: ProductListingProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isFavSaved, setIsFavSaved] = useState(false)
  const { toast } = useToast()
  const router  = useRouter()


 // Using useInView to detect when the product is in the viewport
 const { ref, inView } = useInView({
  triggerOnce: false, // Keep triggering while the product is in view
  threshold: 0.2, // Trigger when at least 50% of the element is visible
})


    // Interleave the arrays
    function interleaveArrays(arr1 : string[], arr2 : string[]) {
      const maxLength = Math.max(arr1.length, arr2.length);
      const result = [];
  
      for (let i = 0; i < maxLength; i++) {
        if (i < arr1.length) {
          result.push(arr1[i]);
        }
        if (i < arr2.length) {
          result.push(arr2[i]);
        }
      }
  
      return result;
    }

  const combinedUrls = interleaveArrays(
    product.croppedFrontProduct || [],
    product.croppedBackProduct || []
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [fade, setFade] = useState(false)
  useEffect(() => {
    if (inView && combinedUrls.length > 0) {
      const intervalId = setInterval(() => {
        setFade(true)
        setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % combinedUrls.length)
          setFade(false)
        }, 500) // Duration of fade out
      }, 5000)

      return () => clearInterval(intervalId)
    }
  }, [combinedUrls , inView])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, index * 475)
    return () => clearTimeout(timer)
  }, [index])

  useEffect(() => {
    const checkFavStatus = async () => {
      try {
        const isProductSaved = await checkProductInFavList(product.id, user.id)
        setIsFavSaved(isProductSaved)
      } catch (error) {
        console.error('Error checking favorite status:', error)
      }
    }
    checkFavStatus()
  }, [product.id, user?.id])

  const saveToFavList = useCallback(async () => {
    try {
      if (!user) {
        toast({
          title: 'No logged in user found!',
          description: 'Try to login first!',
          variant: 'destructive',
        })
        return
      }

      let result
      if (!isFavSaved) {
        result = await addProductToFavList(product.id, user.id)
        if (result) {
          setIsFavSaved(true)
          toast({
            title: 'Product added to fav list!',
            variant: 'default',
          })
          router.refresh()
        }
      } else {
        result = await removeProductFromFavList(product.id, user.id)
        if (result) {
          setIsFavSaved(false)
          toast({
            title: 'Product removed from fav list!',
            variant: 'default',
          })
          router.refresh()

        }
      }
    } catch (error) {
      console.error('Error saving product to Fav list:', error)
      toast({
        title: 'Error saving product to Fav list!',
        description: 'Please try again later.',
        variant: 'destructive',
      })
    }
  }, [user, isFavSaved, toast, product.id, router])





  if (!product || !isVisible ) return <ProductPlaceholder />

  if (isVisible && product) {
    return (

      <>

      
      
 <Card className="bg-muted/100">
      <div className="mx-1 my-1">
      <div className="mb-1 mt-0 flex flex-wrap items-center">
  <div className="flex-grow md:mb-0"> {/* Allows items to wrap */}
    <Badge variant="secondary" className="bg-slate-200 text-black hover:bg-slate-200">
      <LoadingLink
        href={`/MarketPlace/store/${product.store.storeName}`}
        className="animate-pulse font-bold group text-xs  hover:text-blue-500 cursor-pointer relative block"
      >
        {product.store.storeName}
        <span className="absolute font-normal bottom-5 left-1/2 transform -translate-x-1/2 w-max px-2 py-1 text-xs bg-black text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
          View store
        </span>
      </LoadingLink>
    </Badge>
  </div>
  
</div>


        <LoadingLink
        className={cn(
          'invisible  cursor-pointer group/main',
          {
            'visible animate-in fade-in-5': isVisible,
          }
        )}
        href={`/MarketPlace/product/${product.id}`}>
    <div className="border-2 overflow-hidden rounded-2xl">
    {combinedUrls.length > 0 && 
     (
        <>
 <div ref={ref}  className="relative w-full h-full" style={{ backgroundImage: `url(/Loading.png)` }}>
    <NextImage
      src={combinedUrls[currentIndex]}
      alt="Product Image"
      loading="lazy"
      width={1000}
      height={1000}
      placeholder="blur"
      blurDataURL="/Loading.png"
      className={clsx("transition-all duration-700 hover:scale-150", {
        "opacity-0": fade,
        "opacity-100": !fade,
      })}
      style={{ transitionProperty: "opacity, transform" }}
      onContextMenu={(e) => e.preventDefault()}
      draggable={false}
    />

      {product.NewProduct && (
  <div className="absolute top-0 right-0 m-1 text-xs lg:text-sm">
        <Badge variant="secondary" className="bg-blue-700  text-white">
        New
      </Badge>
  </div>
        )}

          {product.topSales && (
  <div className="absolute top-0 left-0 m-1 text-xs lg:text-sm">
        <Badge variant="secondary" className="bg-emerald-700 text-white">
          Best Sell
        </Badge>
  </div>
        )}

  {product.isDiscountEnabled && (
      <div className="absolute bottom-0 right-0 m-1 text-xs lg:text-sm">
    <Badge variant="secondary" className="bg-red-700 text-white">
    {product.discount}% OFF
  </Badge>
  </div>
      )}

  </div>
        </>
      )
      }
    </div>
        </LoadingLink>

        <div className="flex mt-1 ml-3 items-center justify-between">
    <div>
        <Label className="text-xs lg:text-sm">{product.title}</Label>
        <p className="text-xs lg:text-sm text-muted-foreground">{product.category}</p>
    </div>
        {/* add to fav list icon */}
    <div onClick={saveToFavList} className="relative group rounded-full p-1  text-gray-600 cursor-pointer ">
        <Heart className={`w-5 h-5 lg:w-6 lg:h-6  ${isFavSaved ? 'text-red-600 fill-current' : 'text-gray-600 hover:text-red-600'}`} />
        <span className="absolute bottom-12 left-[2%] transform -translate-x-1/2 w-max px-1 py-1 text-xs bg-black text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
        {isFavSaved ? 'Saved!' : 'Save in fav list'}
        </span>
    </div>
    
    </div>


      <div className="mt-1 flex items-center justify-between">
        <div className="ml-2">
        <div className="flex space-x-4">
          {product.isDiscountEnabled && (
          <div className="font-bold rounded-xl text-gray-400 lg:text-sm text-xs line-through">
            {(product.oldPrice ?? product.price  ).toFixed(2)} TND
          </div>
             )}
        <div className={`font-bold rounded-xl text-blue-600 lg:text-sm text-xs ${product.isDiscountEnabled ? 'animate-wiggle' : ''}`}>
        {(product.price).toFixed(2)} TND
          </div>
        </div>
        </div>
      </div>    
        </div>
    </Card>
             
    </>
      

    )
  }
}



const ProductPlaceholder = () => {
  return (
    <div className='flex flex-col'>
      <div className='rounded-2xl mb-2 mt-4'>
        <Skeleton className='h-4 w-20' />
      </div>
      <div className=' overflow-hidden rounded-2xl'>
      <Skeleton className='w-[320px] xl:h-[340px] h-[180px]' />
      </div>
      <div className='mx-3'>
        <Skeleton className='h-4 w-36 mt-3' />
        <Skeleton className='h-4 w-24 mt-2' />
      </div>
    </div>
  )
}



export default ProductListing
