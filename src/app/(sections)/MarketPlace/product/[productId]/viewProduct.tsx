/* eslint-disable @next/next/no-img-element */
"use client"
import NextImage from 'next/image'
import AddToCartButton from '@/components/MarketPlace/AddToCartButton'
import ProductReel from '@/components/MarketPlace/ProductReel'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { Category, Platform, Product, ProductReviews, SellerDesign, Store, User } from '@prisma/client'
import { ArrowDown, Check, Plus, Shield, SquareMinus, SquarePlus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label'
import { ChangeEvent, useEffect, useState } from 'react'
import React from 'react'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import ProductDimenetions from "@/components/MarketPlace/ProductDimenetions"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import LoadingState from "@/components/LoadingState"
import { trackProductView } from "./actions"
import ViewCategoryQuality from "@/components/MarketPlace/ViewCategoryQuality"
import clsx from 'clsx'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import LoadingLink from '@/components/LoadingLink'
import Reviews from './Reviews'
import ViewDesign from '@/components/MarketPlace/ViewDesign'

  

const BREADCRUMBS = [
  { id: 1, name: 'Home', href: '/' },
  { id: 2, name: 'MarketPlace', href: '/MarketPlace' },
]

interface ExtraProductReviews extends ProductReviews{
  user: {
    name: string;
    image: string | null;
};
}

interface Productswithstore extends Product {
  store : Store
}
interface ViewProductProps {
  product: Productswithstore;
  frontDesign : SellerDesign
  backDesign : SellerDesign
  user? : User
  categoryProducts:Productswithstore[]
  category : Category
  sizes : string[]
  platform: Platform
  productReviews:ExtraProductReviews[]
}
const ViewProduct: React.FC<ViewProductProps> = ({ product , frontDesign , backDesign , user ,categoryProducts , category , sizes , platform , productReviews}) => {

  const router = useRouter()


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

const combinedUrls = interleaveArrays(product.croppedFrontProduct, product.croppedBackProduct);

  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  // const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   const newQuantity = parseInt(event.target.value);
  //   if (!isNaN(newQuantity) && newQuantity >= 1 && newQuantity <= platform.maxProductQuantity) {
  //     setQuantity(newQuantity);
  //   }
  // };


  const handleQuantityChange = (value : string) => {
    setQuantity(parseInt(value));
    console.log('Selected Quantity:', value); // You can remove or modify this based on your needs
  };

  const increaseQuantity = () => {
    if (quantity < platform.maxProductQuantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };


    const handleColorChange = (color: string, index: number) => {
      setSelectedColor(color);
      setSelectedColorIndex(index);
      setSelectedImage(product.croppedFrontProduct ? product.croppedFrontProduct[index] : product.croppedBackProduct[index] ); // Update the main image based on the selected color
    };
    

  const [selectedSize, setSelectedSize] = useState<string>(sizes[0]);



  const handleSizeChange = (event: string) => {
    setSelectedSize(event);
  }


  const [open, setOpen] = useState<boolean>(false);

  const [selectedImage, setSelectedImage] = useState(combinedUrls[0]);


// reidrectToCart function 
const redirectToCart = () => {
  router.prefetch('/MarketPlace/cart');
  router.push("/MarketPlace/cart")
}


  // New useEffect for sessionId and tracking product views

  // useEffect(() => {
  //   const trackView = async () => {
  //     const sessionId = localStorage.getItem("viewSessionId");
  
  //     if (!sessionId) {
  //       const newSessionId = crypto.randomUUID();
  //       localStorage.setItem("viewSessionId", newSessionId);
  
  //       // Track the product view with the new sessionId
  //       await trackProductView(product, newSessionId , user?.id);
  //     } else {
  //       // Track the product view with the existing sessionId
  //       await trackProductView(product, sessionId ,user?.id);
  //     }
  //   };
  
  //   trackView();
  // }, [product.id, user?.id]);
  


  return (
<>

    <MaxWidthWrapper>


      {/* <div className='pb-4 mx-auto text-center flex flex-col items-center max-w-1xl'>
      <h1 className='text-4xl font-bold tracking-tight md:text-5xl'>
      Product{' '}
            <span className='text-blue-600'>
              Details
            </span>
          </h1>
        </div> */}




        <div className='bg-muted/50 border-gray-400 border-2 rounded-xl mx-auto max-w-2xl px-4 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8'>
          


      {/* Product images */}
      <div className='mt-8 lg:col-end-2 lg:row-span-2 lg:self-center'>
        <div className="border-2 overflow-hidden rounded-2xl">
            <NextImage
            src={selectedImage ? selectedImage : combinedUrls[0]}
            alt="Product Image"
            width={1000}
            height={1000}
            placeholder="blur"
            blurDataURL="/Loading.png"
            loading='lazy'
            className={clsx("transition-transform duration-700 hover:scale-150")}
            onContextMenu={(e) => e.preventDefault()}
            draggable={false}
          />
        </div>
        {/* Thumbnail images */}
        <div className="my-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2">          
          {combinedUrls.map((url, index) => (
            <div
              key={index}
              className={clsx(
                "cursor-pointer border-2 overflow-hidden rounded-md bg-slate-50",
                selectedImage === url ? "border-blue-500" : "border-gray-200"
              )}
              onClick={() => setSelectedImage(url)}
            >
              <NextImage
                src={url}
                placeholder="blur"
                blurDataURL="/Loading.png"
                loading="eager"
                alt={`Thumbnail ${index + 1}`}
                width={420}
                height={420}
                className="xl:object-cover object-contain w-full h-40"
                onContextMenu={(e) => e.preventDefault()}
                draggable={false}
              />
            </div>
          ))}
        </div>

      </div>
          

          {/* Product Details */}
          <div className='py-10 lg:max-w-lg lg:self-end'>
          <div className="flex justify-between items-center sm:mt-10 lg:mt-4">
            <ol className="flex items-center space-x-2">
              {BREADCRUMBS.map((breadcrumb, i) => (
                <li key={breadcrumb.href}>
                  <div className="flex items-center text-sm">
                    <LoadingLink
                      href={breadcrumb.href}
                      className="font-medium text-sm text-muted-foreground hover:text-gray-700">
                      {breadcrumb.name}
                    </LoadingLink>
                    {i !== BREADCRUMBS.length - 1 ? (
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        className="ml-2 h-5 w-5 flex-shrink-0 text-gray-300">
                        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                      </svg>
                    ) : null}
                  </div>
                </li>
                
              ))}
            </ol>
            <div className="flex items-center flex-col">
              <LoadingLink href={`/MarketPlace/create-client-product/select-category`} >
                <Button variant="link">try other designs &rarr;</Button>
              </LoadingLink>
            </div>
          </div>



             <div className='flex items-center mt-2'>
                <div className='text-muted-foreground border-gray-300 '>
                  Store : <span className='cursor-pointer hover:text-blue-700'>
                    <LoadingLink
                    className='animate-pulse font-bold text-blue-500'
                    href={`/MarketPlace/store/${product.store.storeName}`}>
                    {product.store.storeName}
                    </LoadingLink>
                    </span>
                </div>
                <div className='ml-4 border-l text-muted-foreground border-gray-300 pl-4'>
                  Category : <span className='cursor-pointer hover:text-blue-700'>
                    <LoadingLink
                    className='animate-pulse text-blue-500'
                    href={`/MarketPlace/category/${product.category}`}>
                    {product.category}
                    </LoadingLink>
                    </span>
                </div>
              </div>

              <Separator className='mt-2 w-[80%]'/>


 

            <section className='mt-2'>

            <div className="my-4"> {/* Adding margin bottom for separation */}
                <ViewDesign frontDesign={frontDesign} backDesign={backDesign}/>
              </div>
              

            <div className="my-4"> {/* Adding margin bottom for separation */}
                <ViewCategoryQuality category={category}/>
              </div>

            {product.NewProduct && (
                <div className=""> {/* Added margin for separation */}
                <Badge variant="outline" className="bg-blue-700 text-white">New</Badge>
              </div>
                )}
                 {product.topSales && (
                <div className=""> {/* Added margin for separation */}
                <Badge variant="outline" className="bg-emerald-700 text-white">Best sell</Badge>
              </div>
                )}
                 {product.isDiscountEnabled && (
                  <>
                <div className=""> {/* Added margin for separation */}
                <Badge variant="outline" className="bg-red-700 text-white">{product.discount}% OFF</Badge>
              </div>
              </>
                )}
            

            <div className='mt-2'>
              <p className=' text-xl font-bold tracking-tight'>
                {product.title}
              </p>
            </div>

              <div className='flex items-center mt-2'>
                <p className=' text-gray-900'>
                {product.isDiscountEnabled && (
          <div className="font-bold rounded-xl text-gray-400 text-md line-through">
            {(product.oldPrice ?? product.price  ).toFixed(2)} TND
          </div>
             )}
                <span className='text-xl font-bold text-blue-700'>
                  {(product.price).toFixed(2)} TND 
              </span>
                </p>
              </div>
              
              <div className='mt-4 space-y-6'>
                <p className='text-base text-muted-foreground'>
                Product Description: <br/>
                  <span className="text-xs">{product.description}</span>
                </p>
              </div>

              <Separator className='mt-2 '/>


              <div className='mt-6 flex items-center'>
              <Label htmlFor="username" className="text-left">
                Select Size :
             </Label>
             <div className='ml-3'>
             <Select value={selectedSize} onValueChange={handleSizeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a size" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select a size</SelectLabel>
                {sizes && sizes.map((size, index) => (
                  <SelectItem key={index} value={size}>{size}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
             </Select>

             </div>

            </div>

            
              <div className='mt-6 flex items-center'>
          <Label htmlFor="username" className="text-left">
            Select Color :
          </Label>


          <div className="ml-3 w-full"> {/* Set full width for responsive layout */}
            <ToggleGroup
              type="single"
              value={selectedColor}
              onValueChange={(value) => {
                const index = product.colors.indexOf(value);
                handleColorChange(value, index);
              }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2" // Responsive grid layout
            >
              {product.colors.map((color, index) => (
                <ToggleGroupItem
                  key={index}
                  value={color}
                  className={`px-4 py-2 border-2 flex items-center space-x-2 rounded bg-gray-300 hover:bg-gray-200 text-black dark:text-white dark:bg-gray-800`}
                  >
                  {color}
                  {selectedColor === color && (
                    <Check
                      className="w-4 h-4 ml-1"
                      aria-hidden="true"
                    />
                  )}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>


              <div className='mt-6 flex items-center'>
              <Label htmlFor="username" className="text-left">
                Select Quantity : 
             </Label>
             {/* <div className='ml-3 flex items-center gap-2'>
             <SquareMinus 
                className='text-muted-foreground hover:text-blue-600 cursor-pointer' 
                onClick={decreaseQuantity} 
              />              
              <div className='rounded-lg border border-muted-foreground w-10 text-center bg-gray-50 flex items-center justify-center'>
                        {quantity}
                      </div>
                      <SquarePlus 
                className='text-muted-foreground hover:text-blue-600 cursor-pointer' 
                onClick={increaseQuantity} 
              />            
              </div> */}
              <div className='ml-3'>
              <Select value={String(quantity)} onValueChange={(value) => handleQuantityChange(value)}>
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="Select quantity" />
              </SelectTrigger>
              <SelectContent className="w-[70px]">
                <SelectGroup>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

             </div>

             </div>
             <p className='text-xs text-muted-foreground mt-1'>( max {platform.maxProductQuantity} ) </p>




            <div className="mt-6">
              <p className="text-gray-400 text-sm">Scroll down to view product dimentions </p>
              <ArrowDown className="text-gray-400 h-5 animate-bounce"/>
             </div>


             
            </section>
                      {/* add to cart part */}
          <div className='mt-10 lg:col-start-1 lg:row-end-2 lg:max-w-lg lg:self-start'>
            <div>
              <div className='mt-10 flex justify-center items-center'>
                <AddToCartButton 
                user = {user!}
                product={product}
                size={selectedSize}
                color={selectedColor}
                quantity={quantity}
                index={selectedColorIndex}
                platform={platform} 
                stock={category.stock}
                 />
              </div>
              <div className="flex justify-center items-center my-4">
              <Button onClick={()=>
              {setOpen(true)
              redirectToCart()}} 
              variant="link" className="flex justify-center text-green-500 animate-pulse items-center">
                View Cart &rarr;
              </Button>
              </div>

       
              
             
              <div className=' text-center'>
                <div className='group inline-flex text-sm text-medium'>
                  <Shield
                    aria-hidden='true'
                    className='mr-2 h-5 w-5 flex-shrink-0 text-gray-400'
                  />
                  <span className='text-muted-foreground hover:text-gray-700'>
                    Payment at delivery available
                  </span>
                </div>
              </div>
            </div>
          </div>
          </div>

         





          
        </div>
        
      <ProductDimenetions
        title={`Product Dimentions`}
        subtitle={`Choose your product size carefully`}
      />

      <Reviews
        title={`Reviews ✨`}
        subtitle={`Clients reviews on this product`}
        user={user}
        productId={product.id}
        productReviews={productReviews}
      />




      <ProductReel
        user={user!}
        href={`/MarketPlace/category/${product.category}`}
        title={`Similar ${product.category}`}
        products={categoryProducts}
        subtitle={`Browse similar high-quality ${product.category} just like '${product.title}'`}
      />
    </MaxWidthWrapper>

    <LoadingState isOpen={open} />

    </>
  )
}

export default ViewProduct