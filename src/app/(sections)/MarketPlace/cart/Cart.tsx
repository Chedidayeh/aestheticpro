'use client'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import { Platform, User } from '@prisma/client'
import { Check, Loader, X } from 'lucide-react'
import NextImage from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { createOrderInDb, emptyUserCart, removeProductFromCart } from './actions'
import { Badge } from "@/components/ui/badge"
import LoadingLink from "@/components/LoadingLink"
interface FormattedCartProduct {
  cartProductId: string;
  productId: string;
  title?: string;
  description?: string;
  price?: number;
  quantity?: number;
  color?: string;
  size?: string;
  category?: string;
  productImgs?: string[];
  frontDesignId?: string;
  backDesignId?: string;
}


interface CartProps {
  products: FormattedCartProduct[];
  user:User
  platform  : Platform
}

const Cart: React.FC<CartProps> = ({ products , user  , platform}) => {

  const router = useRouter();


  const [cartProducts, setCartProducts] = useState(products? products : [])
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [fee, setFee] = useState(platform.shippingFee)

  const { toast } = useToast()
  const [name, setName] = useState(user ? user.name : "");
  const [phoneNumber, setPhoneNumber] = useState<string>(user?.phoneNumber ?? "");
  const [address, setAddress] = useState(user?.address ?? "");
  const isValid = name.trim() !== "" && phoneNumber.length===8 && address.trim() !== ""


  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const phoneNumberValue = event.target.value;
      setPhoneNumber(phoneNumberValue);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

                  // check phone number length
                  const [phoneNumberError, setPhoneNumberError] = useState('');
                  const inputClassName = phoneNumberError ? 'border-red-500' : (phoneNumber ? 'border-green-500' : '');
                  const handlePhoneNumberBlur = () => {
                    if (phoneNumber!.length !== 8) {
                      setPhoneNumberError('Phone number must be 8 digits long.');
                    } else {
                      setPhoneNumberError('');
                    }
                  };


                  // save Order function
                  const createOrder = async () => {
                    try {
                      setOpenDialog(true)
                      const result = await createOrderInDb(user.id,address,name,phoneNumber,orderTotal,cartProducts,fee , user.affiliateOrderSessionId )

                      if(result.orderId && result.success){
                        await emptyUserCart(user.id)
                        toast({
                          title: 'Order Was Successfully Created',
                          variant: 'default',
                        });
                        router.push("/MarketPlace/thank-you?orderId="+result.orderId)
                      }
                      else {
                        setOpenDialog(false)
                        toast({
                          title: 'Something went wrong',
                          description: 'There was an error on our end. Please try again.',
                          variant: 'destructive',
                      });
                      router.refresh()
                      }
                      

                    } catch (error) {
                      setOpenDialog(false)
                      // Handle network errors or other exceptions
                        console.error('Error during order creating:', error)
                        toast({
                          title: 'Something went wrong',
                          description: 'There was an error on our end. Please try again.',
                          variant: 'destructive',
                      });
                      router.refresh()
                    }

                    };



                      const [openDialog, setOpenDialog] = useState(false);
                    





const removeItem = async (cartProductId : string) =>{
  const updatedProducts = cartProducts.filter(product => product.cartProductId !== cartProductId)
  setCartProducts(updatedProducts)
  try {
    const result = await removeProductFromCart(cartProductId,user.id)
        if(result){
        toast({
          title: 'Product removed from cart !',
          description: '',
          variant: 'default',
        });
        router.refresh()
        return
        }
  } catch (error) {
    console.log(error)
    toast({
      title: 'Error removing product from cart!',
      description: 'Please try again later.',
      variant: 'destructive',
    });
    return
    
  }

}

const calculateSubtotal = () => {
  return cartProducts.reduce((total, product) => {
    return total + (product.price || 0) * (product.quantity || 1)
  }, 0)
}

const subtotal = calculateSubtotal()
const orderTotal = subtotal + fee



useEffect(() => {
  // Set fee to 0 if cart products are more than 2
  if (subtotal >= platform.freeShippingFeeLimit) {
    setFee(0);
  } else {
    setFee(platform.shippingFee); // Otherwise, set it back to the default value
  }
}, [subtotal , platform.shippingFee , platform.freeShippingFeeLimit]);





  return (


    <>






        <div className=''>
      <div className='mx-auto max-w-2xl px-4 pb-24 pt-8 sm:px-6 lg:max-w-7xl lg:px-8'>
      <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>
            Shopping Cart
          </h1>
        </div>
        <div className='left-2 mt-4 justify-center items-center flex'>
          <p className='text-md '>Total Items: {cartProducts.length}</p>
        </div>


        <div className='mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16'>
  <div
    className={cn('lg:col-span-7', {
      'rounded-lg border-2 border-dashed border-zinc-200 p-12': cartProducts.length === 0,
    })}
  >
    {cartProducts.length === 0 ? (
      <div className='flex h-full flex-col items-center justify-center space-y-1'>
        <div aria-hidden='true' className='relative h-40 w-40 text-muted-foreground'>
          <NextImage src='/hippo-empty-cart.png' fill loading='eager' alt='empty shopping cart hippo' />
        </div>
        <h3 className='font-semibold text-2xl'>Your cart is empty</h3>
        <p className='text-muted-foreground text-center'>Whoops! Nothing to show here yet.</p>
        <LoadingLink href='/MarketPlace' className='text-blue-600 text-sm'>
                <Button variant='link'>
                Add items to your cart
                &rarr;
                </Button>
                </LoadingLink>
      </div>
    ) : (
      <div className="border-2 rounded-lg p-4">
      <Table >
              <TableCaption>        
                <LoadingLink href='/MarketPlace' className='text-blue-600 text-sm'>
                <Button variant='link'>
                Add other items to your cart &rarr;
                </Button>
                </LoadingLink>
                </TableCaption>
              <TableHeader>
                  <TableRow>
                  <TableHead>Product Image</TableHead>
                  <TableHead>Product Title</TableHead>
                  <TableHead>Product Price</TableHead>
                  <TableHead>Product Qunatity</TableHead>
                  <TableHead>Product Size</TableHead>
                  <TableHead>Product Color</TableHead>
                  <TableHead >Action</TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
              {cartProducts.map((product) => (
                <TableRow key={product.cartProductId}>
                  <TableCell>
                  <LoadingLink href={`/MarketPlace/product/${product.productId}`}>
                    <NextImage
                      src={product.productImgs![0]}
                      alt={product.title!}
                      width={400} // Adjust width as needed
                      height={400} // Adjust height as needed
                      className="object-cover" // Optional for styling
                      placeholder="blur"
                      blurDataURL="/Loading.png"
                      loading='lazy'
                    />
                    </LoadingLink>
                  </TableCell>
                  <TableCell>
                    <LoadingLink href={`/MarketPlace/product/${product.productId}`} className="font-medium hover:text-muted-foreground">
                      {product.title}
                    </LoadingLink>
                  </TableCell>
                  <TableCell>
                    <Badge className="text-white">                          
                      {(product.price || 0).toFixed(2)} TND
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {product.quantity}
                  </TableCell>
                  <TableCell>
                    {product.size}
                  </TableCell>
                  <TableCell>
                    {product.color}
                  </TableCell>
                  <TableCell >
                    <Button
                    className="hover:bg-red-500 hover:text-white text-red-500"
                      variant="secondary"
                      onClick={() => removeItem(product.cartProductId)} // Call removeItem function when clicked
                    >
                      <X className="h-5 w-5" aria-hidden="true" />
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              </TableBody>
              </Table>
    </div>
    )}


    {/* <ul className={cn({ 'divide-y divide-gray-200 border-b border-t border-gray-200': cartProducts.length > 0 })}>
      {cartProducts.map((product) => {
        return (
          <li key={product.cartProductId} className='flex flex-col sm:flex-row py-6 sm:py-10'>
            <div className='flex-shrink-0 mb-10'>
              <div className='relative h-52 w-52 xl:h-80 xl:w-80'>
                <ImageSlider urls={product.productImgs!} />
              </div>
            </div>

            <div className='ml-4 flex flex-1 flex-col justify-between sm:ml-6'>
              <div className='relative pr-9 sm:grid sm:grid-cols-1 sm:gap-x-6 sm:pr-0'>
                <div className='mt-10'>
                  <div className='flex justify-between'>
                    <h3 className='text-lg'>
                      <Link
                        href={`/MarketPlace/product/${product.productId}`}
                        className='font-medium hover:text-gray-800'
                      >
                        {product.title}
                      </Link>
                    </h3>
                  </div>

                  <div className='mt-2 flex text-sm'>
                    <p className='text-muted-foreground'>Category: {product.category}</p>
                  </div>
                  <div className='mt-2 flex text-sm'>
                    <p className='text-muted-foreground'>Color: {product.color}</p>
                  </div>
                  <div className='mt-2 flex text-sm'>
                    <p className='text-muted-foreground'>Quantity: {product.quantity}</p>
                  </div>
                  <div className='mt-2 flex text-sm'>
                    <p className='text-muted-foreground'>Size: {product.size}</p>
                  </div>
                  <div className='mt-2'>
                    <p className='mt-1 text-lg font-medium text-blue-600'>Price : {(product.price)!.toFixed(2)} TND</p>
                  </div>
                </div>

                <div className='mt-4 sm:mt-0 sm:pr-9 w-20'>
                  <div className='absolute right-0 top-0'>
                    <Button
                      className='hover:text-red-500 group'
                      aria-label='remove product'
                      onClick={() => removeItem(product.cartProductId)}
                      variant='secondary'
                    >
                      <X className='h-5 group: w-5' aria-hidden='true' />
                      <span className='absolute font-normal bottom-10 left-1/2 transform -translate-x-1/2 w-max px-2 py-1 text-xs bg-black text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity'>
                        Remove Item
                      </span>
                    </Button>
                  </div>
                </div>
              </div>

              <Link href={"/buyingPolicy"}>
              <p className='flex space-x-2 text-sm '>
                <TriangleAlert className='h-5 w-5 flex-shrink-0 text-red-500' />
                <span className='hover:text-red-500'>Read Buying Policy !</span>
              </p>
              </Link>

            </div>
          </li>
        );
      })}
    </ul> */}

  </div>

  <section className='mt-16 rounded-lg border-2 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8'>
    <h2 className='text-lg font-medium'>Order summary</h2>

    <div className='mt-6 space-y-4'>
      <div className='flex items-center justify-between'>
        <p className='text-sm '>Subtotal</p>
        <p className='text-sm font-medium '>{subtotal.toFixed(2)} TND</p>
      </div>

      <div className='flex items-center justify-between border-t border-gray-200 pt-4'>
        <div className='flex text-sm text-muted-foreground'>
          <span>Shipping fee</span>
        </div>
        <div className='text-sm font-medium '>{fee.toFixed(2)} TND</div>
      </div>
      <div className='flex items-center justify-between border-t border-gray-200 pt-4'>
        <div className='flex text-sm text-muted-foreground'>
          <p className='flex space-x-2 text-sm '>
            <Check className='h-5 w-5 flex-shrink-0 text-green-500' />
            <span>Delivery time: within 3 days!</span>
          </p>
        </div>
      </div>
      <div className='flex items-center justify-between border-t border-gray-200 pt-4'>
        <div className='flex text-sm text-muted-foreground'>
          <p className='flex space-x-2 text-sm '>
            <Check className='h-5 w-5 flex-shrink-0 text-green-500' />
            <span>Free shipping for more than {platform.freeShippingFeeLimit.toFixed(2)} TND!</span>
          </p>
        </div>
      </div>

      <div className='flex items-center justify-between border-t border-gray-200 pt-4'>
        <div className='text-base font-medium '>Order Total</div>
        <div className='text-base font-medium '>{cartProducts.length > 0 ? `${orderTotal.toFixed(2)} TND` : `0 TND`}</div>
      </div>
    </div>

    <div className='mt-6'>
      <Button disabled={cartProducts.length === 0} onClick={() => setIsConfirmOpen(true)} className='w-full text-white' size='lg'>
        Continue
      </Button>
    </div>
  </section>
</div>

      </div>
    </div>

                                {/* The AlertDialog loading component */}
                                <AlertDialog open={openDialog} >
          
                          <AlertDialogContent>
                            <AlertDialogHeader className="flex flex-col items-center">
                            <AlertDialogTitle className="text-xl text-blue-700 font-bold text-center">
                            Creating Your Order!
                              </AlertDialogTitle>
                              <AlertDialogDescription className="flex flex-col items-center">
                                This will take a moment.
          <Loader className="text-blue-700 h-[30%] w-[30%] animate-spin mt-3" />
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                          </AlertDialogContent>
                        </AlertDialog>



    {/* The AlertDialog create order component */}

<AlertDialog open={isConfirmOpen}>
      <AlertDialogTrigger asChild>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Creating your Order</AlertDialogTitle>
          <AlertDialogDescription>
            Please make sure to fill all the necessary details!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-left">
              Your Name :
            </Label>
            <Input id="name" type="text" className="col-span-3" value={name} onChange={handleNameChange} />
          </div>
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="phoneNumber">Phone Number:</Label>
            <div className="col-span-3">
              <Input 
                id="phoneNumber" 
                type="number" 
                pattern="\d{8}"
                defaultValue={phoneNumber}
                onBlur={handlePhoneNumberBlur}
                placeholder="99 999 999" 
                onChange={handlePhoneNumberChange}
                className={`${inputClassName} focus:ring-0 focus:border-green-500`}
                required 
              />
              {phoneNumberError && (
                <p className="text-sm text-red-500 mt-1">
                  {phoneNumberError}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-left">
              Your Address:
            </Label>
            <Input id="address" placeholder='Region And City | الولاية و المدينة' maxLength={20} type="text" className="col-span-3" value={address} onChange={handleAddressChange} />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={()=>setIsConfirmOpen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={!isValid} className="text-white"
          onClick={()=>{
            setIsConfirmOpen(false)
            createOrder()
            }}>Confirm Order</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    </>

  )
}

export default Cart
