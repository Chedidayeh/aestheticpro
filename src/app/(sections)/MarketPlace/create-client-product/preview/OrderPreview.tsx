/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
'use client'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation' // Import useRouter from next/router
import { Button } from '@/components/ui/button'
import { ArrowRight, Loader, TriangleAlert, X } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {  useToast } from '@/components/ui/use-toast'
import { Platform, PreOrderPreview, User } from '@prisma/client'
import { deletePreOrder, deletePreOrderWithImages, saveOrder } from "./actions"
import ImageSlider from "@/components/MarketPlace/ImageSlider"
import LoadingState from "@/components/LoadingState"
import LoadingLink from "@/components/LoadingLink"




const OrderPreview =  ({preOrder , user , platform} : {preOrder?: PreOrderPreview , user :User , platform : Platform}) => {


  const router = useRouter(); // Ensure this is placed within the component where the router is available
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber ?? "");
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const inputClassName = phoneNumberError ? 'border-red-500' : (phoneNumber ? 'border-green-500' : '');
  const [address, setAddress] = useState(user.address ?? "");
  const [clientName, setclientName] = useState(user.name);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const isCheckoutEnabled = phoneNumber.length === 8 && address.trim() !== '' && termsAccepted && clientName.trim() !== '';
  const { toast } = useToast()
  const [fee, setFee] = useState(platform.shippingFee)
  const orderTotal = preOrder?.amount! + fee
  const [open, setOpen] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState(false);



  useEffect(() => {
    // Set fee to 0 if cart products are more than 2
    if (preOrder?.amount! >= 150) {
      setFee(0);
    } else {
      setFee(platform.shippingFee); // Otherwise, set it back to the default value
    }
  }, [preOrder?.amount , platform.shippingFee]);


  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(event.target.value);
  };

  const handlePhoneNumberBlur = () => {
    if (phoneNumber.length !== 8) {
      setPhoneNumberError('Phone number must be 8 digits long.');
    } else {
      setPhoneNumberError('');
    }
  };

  // Event handler for terms checkbox change
  const handleTermsCheckboxChange = () => {
    if(!termsAccepted){
    setTermsAccepted(true);
  }
  else{
    setTermsAccepted(false);
  }
  };

    // Event handler for address change
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setclientName(event.target.value);
    };


  // Event handler for address change
  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };





  const handleOrder = async () => {
    try {
      setOpenDialog(true)
    const result = await saveOrder(user!.id,preOrder as PreOrderPreview,clientName,address,phoneNumber,orderTotal)
    if(result.success){
      await deletePreOrder(user.id)
      toast({
      title: 'Great!',
      description: 'Order Saved successfully.',
      variant: 'default',
      }); 
      //push to thank-you page
      router.push("/MarketPlace/thank-you?orderId="+result.orderId)
      return
    }
    else{
      setOpenDialog(false)
      toast({
    title: 'Error',
    description: 'Failed to Save you Order! Please try again later.',
    variant: 'destructive',
    });
    return
    }


    } catch (error) {
      setOpenDialog(false)
      toast({
        title: 'Something went wrong',
        description: 'There was an error on our end. Please try again.',
        variant: 'destructive',
    });
    }

    
  };








  const handleDelete = async () => {

    try {
      setOpen(true)
      const result = await deletePreOrderWithImages(user.id)
      if(result){
        toast({
          title: 'Your PreOrder was successfully deleted !',
          variant: 'default',
        });
        router.refresh()
        setOpen(false)
        return
      }

    } catch (error) {
      setOpen(false)
      toast({
        title: 'Error',
        description: 'Failed to delete preOrder! Please try again later.',
        variant: 'destructive',
      });
      return
      
    }

}




const [openDialog, setOpenDialog] = useState(false);



  return (
    <>

                      {/* The AlertDialog component */}
                      <AlertDialog open={openDialog} >
                          <AlertDialogContent>
                            <AlertDialogHeader className="flex flex-col items-center">
                              <div></div>
                              <AlertDialogTitle className="text-xl text-blue-700 font-bold text-center">
                              Confirming your order !
                              </AlertDialogTitle>
                              <AlertDialogDescription className="flex flex-col items-center">
                                This will take a moment.
                                {/* Replace Loader with your loader component */}
          <Loader className="text-blue-700 h-[30%] w-[30%] animate-spin mt-3" />
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                          </AlertDialogContent>
                        </AlertDialog>


              {!preOrder &&(
              <div className='mt-6 mb-20 text-center sm:col-span-9 md:row-end-1'>
              <h3 className='text-3xl font-bold tracking-tight '>
              Your don't have any preOrders for now ! try to create one.
              </h3>
              <LoadingLink href="/MarketPlace/create-client-product/upload">
              <Button variant="link" size="default">Create PreOrder</Button>
              </LoadingLink>
              </div>
              )}






{preOrder && (

  <>

<div className="mt-6 flex flex-col justify-center items-center sm:col-span-9 md:row-end-1">
<h3 className="text-2xl sm:text-3xl font-bold tracking-tight ">
  Your preOrder is safely saved
</h3>
<div className="text-center">
<div className="mt-3 text-red-500 flex items-center gap-1.5 text-sm sm:text-base">
  You can't make a new preOrder until this one is confirmed or deleted!
</div>
</div>

</div>


<div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-4 px-4">
    


    {/* Right Side */}
    <div className="flex justify-center my-8">
    <div className='px-2 lg:px-10'>
    <div className='flex-shrink-0 mb-10'>
      <div className='relative h-64 w-64 xl:h-96 xl:w-96 '>
        <ImageSlider urls={preOrder.capturedMockup} />
     </div>
     </div>
            </div>
    </div>

    {/* Left Side  */}
    <div className="flex flex-col justify-center">
    <div className="w-full">
          <Card>
            <CardHeader>
              <CardTitle>Add Your Order Details</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Your Name</Label>
                <Input defaultValue={clientName} onChange={handleNameChange} id="name" placeholder="Enter your name" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="phoneNumber">Phone Number</Label>
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
                  <p className="text-sm">
                    <span className="text-red-500">{phoneNumberError}</span>
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="address">
                  Your Address
                  <p className="text-xs text-zinc-500 mb-4">Region And City</p>
                </Label>
                <Input
                  defaultValue={address}
                  onChange={handleAddressChange}
                  id="address"
                  placeholder="where you can pick up your order"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
  <LoadingLink href="/buyingPolicy">
    <p className="flex space-x-2 text-sm animate-wiggle">
      <TriangleAlert className="h-5 w-5 flex-shrink-0 text-red-500" />
      <span className="hover:text-red-500">Read Buying Policy!</span>
    </p>
  </LoadingLink>
  <div className="flex items-center space-x-2">
    <Checkbox id="terms" onClick={handleTermsCheckboxChange} />
    <label
      htmlFor="terms"
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      Accept buying policy and conditions
    </label>
  </div>
</CardFooter>

          </Card>
    </div>

    <div className="mt-4">

        <div className=" p-6 sm:rounded-lg sm:p-8">
        <div className="flow-root text-sm">
          <div className="my-2 h-px bg-gray-200" />
          <div className="flex items-center justify-between py-2">
            <p className="font-semibold ">SubTotal</p>
            <p className="font-semibold ">{preOrder?.amount.toFixed(2)} TND</p>
          </div>
          <div className="flex items-center justify-between py-2">
            <p className="font-semibold ">Shipping fee</p>
            <p className="font-semibold ">{fee.toFixed(2)} TND</p>
          </div>
          <div className="my-2 h-px bg-gray-200" />
          <div className="flex items-center justify-between py-2">
            <p className="font-semibold ">Order total</p>
            <p className="font-semibold ">{orderTotal.toFixed(2)} TND</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={()=>{
            setIsDelete(true)
            handleDelete()
          }}
          variant="outline"
          className="flex ml-3 px-1 hover:text-red-500 sm:px-6 lg:px-8"
        >
          <span className="ml-1">Delete PreOrder</span>
          <X className="h-4 w-4 inline" />
        </Button>
        <Button
          onClick={handleOrder}
          disabled={!isCheckoutEnabled || isDelete}
          loadingText="Loading..."
          className="px-4 sm:px-6 lg:px-8 ml-12 text-white"
        >
          Confirm Order <ArrowRight className="h-4 w-4 ml-1.5 inline" />
        </Button>
      </div>
    </div>

    </div>
  </div>


</>

) }

<LoadingState isOpen={open} />


    </>
  )
}

export default OrderPreview
