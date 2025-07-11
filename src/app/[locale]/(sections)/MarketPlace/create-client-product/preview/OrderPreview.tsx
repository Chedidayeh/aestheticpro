/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
'use client'
import NextImage from 'next/image'

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
import { ArrowRight, ChevronLeft, ChevronRight, Loader, TriangleAlert, X } from 'lucide-react'
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
import { Platform, PreOrderDraft, User } from '@prisma/client'
import { deletePreOrder, deletePreOrderWithImages, saveOrder } from "./actions"
import ImageSlider from "@/components/MarketPlace/ImageSlider"
import LoadingState from "@/components/LoadingState"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import type SwiperType from 'swiper'
import { Pagination } from 'swiper/modules'
import Link from 'next/link'
import { useTranslations } from 'next-intl';


const OrderPreview =  ({preOrder , user , platform , preOrders} : {preOrder?: PreOrderDraft | null , user :User , platform : Platform , preOrders : PreOrderDraft[]}) => {


  const router = useRouter(); // Ensure this is placed within the component where the router is available
  const [openSheet, setOpenSheet] = useState(false)
  const [selectedDraft, setSelectedDraft] = useState<number | null>(null);
  const [draft, setDraft] = useState<PreOrderDraft | null>(() => preOrder ?? preOrders?.[0] ?? null);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber ?? "");
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const inputClassName = phoneNumberError ? 'border-red-500' : (phoneNumber ? 'border-green-500' : '');
  const [address, setAddress] = useState(user.address ?? "");
  const [clientName, setclientName] = useState(user.name);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const isCheckoutEnabled = phoneNumber.length === 8 && address.trim() !== ''  && clientName.trim() !== '';
  const { toast } = useToast()
  const [fee, setFee] = useState(platform.shippingFee)
  const orderTotal = preOrder?.amount! + fee
  const [open, setOpen] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState(false);


  const [swiper, setSwiper] = useState<null | import('swiper').default>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const [slideConfig, setSlideConfig] = useState({
    isBeginning: true,
    isEnd: (draft?.capturedMockup ?? []).length <= 1,
  });
  

  useEffect(() => {
    if (!swiper) return
  
    const onSlideChange = ({ activeIndex }: SwiperType) => {
      setActiveIndex(activeIndex);
    
      const capturedMockups = draft?.capturedMockup ?? [];
    
      setSlideConfig({
        isBeginning: activeIndex === 0,
        isEnd: activeIndex === capturedMockups.length - 1,
      });
    };
    
  
    swiper.on('slideChange', onSlideChange)
  
    return () => {
      swiper.off('slideChange', onSlideChange)
    }
  }, [draft, swiper])
  
  useEffect(() => {
    // When draft changes, reset slider
    setActiveIndex(0)
    setSlideConfig({
      isBeginning: true,
      isEnd: (draft?.capturedMockup ?? []).length <= 1,
    });
    
  
    if (swiper) swiper.slideTo(0)
  }, [draft, swiper])
  

  const activeStyles =
  'active:scale-[0.97] grid opacity-100 hover:scale-105 absolute top-1/2 -translate-y-1/2 aspect-square h-8 w-8 z-50 place-items-center rounded-full border-2 bg-white border-zinc-300'
const inactiveStyles = 'hidden text-gray-400'



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
    const result = await saveOrder(user!.id,draft as PreOrderDraft,clientName,address,phoneNumber,orderTotal)
    if(result.success){
      await deletePreOrder(draft!.id)
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








  const handleDelete = async (draftId: string) => {
    try {
      setOpen(true);
      const result = await deletePreOrderWithImages(draftId);
      if (result) {
        toast({
          title: 'Your draft was successfully deleted!',
          variant: 'default',
        });
  
        // Filter out the deleted draft from the list
        const updatedDrafts = preOrders.filter((item) => item.id !== draftId);
  
        // Update the currently selected draft
        if (updatedDrafts.length > 0) {
          setSelectedDraft(0)
          setDraft(updatedDrafts[0]); // pick first one, or use logic to restore last viewed
        } else {
          setDraft(null); // No drafts left
        }
  
        setOpen(false);
        setIsDelete(false)
        router.refresh();
        return;
      }
    } catch (error) {
      setOpen(false);
      toast({
        title: 'Error',
        description: 'Failed to delete draft! Please try again later.',
        variant: 'destructive',
      });
      return;
    }
  };
  




const [openDialog, setOpenDialog] = useState(false);
const t = useTranslations('MarketPlaceOrderPreview');


  return (
    <>

                      {/* The AlertDialog component */}
                      <AlertDialog open={openDialog} >
                      <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
                      <AlertDialogHeader className="flex flex-col items-center">
                              <div></div>
                              <AlertDialogTitle className="text-xl text-blue-700 font-bold text-center">{t('confirming_order')}</AlertDialogTitle>
                              <AlertDialogDescription className="flex flex-col items-center">
                                This will take a moment.
                                {/* Replace Loader with your loader component */}
                              <Loader className="text-blue-700 h-[30%] w-[30%] animate-spin mt-3" />
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                          </AlertDialogContent>
                        </AlertDialog>


              {!draft && preOrders.length === 0 &&(
                <>

                    <div className='flex h-full flex-col items-center justify-center space-y-2 mt-10 px-4 text-center'>
                    <h3 className='font-semibold text-lg sm:text-2xl'>
                      {t('no_preorder_found')}
                      </h3>
                      <div
                        aria-hidden='true'
                        className='relative h-32 w-32 sm:h-40 sm:w-40 text-muted-foreground'
                      >
                        <NextImage
                          fill
                          src='/hippo-empty-cart.png'
                          loading='eager'
                          alt='empty shopping cart hippo'
                        />
                      </div>

                      <Link href="/MarketPlace/create-client-product/select-category">
                      <Button variant="link" size="default">&larr; {t('return_to_category_selection')}</Button>
                      </Link>
                    </div>
                
                </>

              )}






{draft && (

  <>

<div className="mt-6 flex flex-col justify-center items-center sm:col-span-9 md:row-end-1">
<div className="text-center flex items-center">
<h3 className="text-2xl sm:text-3xl font-bold tracking-tight ">
  {t('preorder_saved_as_draft')}
</h3>
</div>
<div className="text-center">
<div className="mt-3 text-blue-500 flex items-center gap-1.5 text-sm">
{t('feel_free_to_order_draft')} </div>
</div>

<div className='flex mt-3 items-center justify-center'>
<Sheet open={openSheet} onOpenChange={setOpenSheet}>
<SheetTrigger asChild>
    <Button size={"sm"} className='text-white' variant="default">{t('select_draft')}</Button>
  </SheetTrigger>
  <SheetContent side="bottom">
    <SheetHeader>
      <SheetTitle>{t('select_draft')}</SheetTitle>
      <SheetDescription />
    </SheetHeader>
    <ScrollArea className="w-full h-[420px]">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 bg-gray-900/5 p-6 rounded-xl">
    {preOrders.map((draft, index) => (
      <div key={index} className="relative w-full">
        {/* Draft Number Badge - centered above the card */}
        <div className="absolute top-[-16px] left-1/2 transform -translate-x-1/2 z-10">
          <Badge className="bg-indigo-600 hover:bg-indigo-600  text-white" variant="secondary">
            {t('draft_number', {number: index + 1})}
          </Badge>
        </div>

        {/* Card */}
        <Card onClick={()=>{
          setDraft(draft)
          setSelectedDraft(index)
          router.push(`/MarketPlace/create-client-product/preview?preOrderId=${draft.id}`)
          setOpenSheet(false)
         }}  className={cn("border cursor-pointer", selectedDraft === index && "border-primary border-2")}>
  
          <CardContent className="flex justify-center p-1 relative">
            <NextImage
              width={1000}
              height={1000}
              src={draft.capturedMockup[0]!}
              alt={draft.id}
              placeholder="blur"
              blurDataURL="/Loading.png"
              loading="lazy"
              className="h-full w-full rounded-xl object-cover"
              onContextMenu={(e) => e.preventDefault()}
              draggable={false}
            />
            <div className="absolute top-2 left-2">
              <Badge className="bg-gray-800 hover:bg-gray-800 text-white" variant="secondary">
                {draft.productCategory}
              </Badge>
            </div>
            <div className="absolute top-2 right-2">
              <Badge className="bg-gray-800 hover:bg-gray-800 text-white" variant="secondary">
                {t('price_label', {price: draft.productPrice.toFixed(2)})}
              </Badge>
            </div>
            <div className="absolute bottom-2 left-2">
              <Badge className="bg-gray-800 hover:bg-gray-800 text-white" variant="secondary">
                {t('size_label', {size: draft.productSize})}
              </Badge>
            </div>
            <div className="absolute bottom-2 right-2">
              <Badge className="bg-gray-800 hover:bg-gray-800 text-white" variant="secondary">
                {t('quantity_label', {quantity: draft.quantity})}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    ))}
  </div>
</ScrollArea>


    <SheetFooter>
      <SheetClose asChild />
    </SheetFooter>
  </SheetContent>
</Sheet>
</div>

</div>


<div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-4 px-4">
    


    {/* left Side */}
    <div className="flex justify-center ">
    <div className='px-2 lg:px-10'>
    <div className='flex-shrink-0 mb-10'>
      <div className='relative h-[316px] w-[316px] xl:h-[484px] xl:w-[484px] '>
      <Card className={cn('border')}>
      <CardContent className="flex justify-center p-1 relative">
        {/* Slider or Single Image */}
        {draft.capturedMockup.length > 1 ? (
          <div className="group relative h-full w-full rounded-xl overflow-hidden">
            {/* Slide Buttons */}
            <div className="absolute z-10 inset-0 pointer-events-none">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  swiper?.slidePrev()
                }}
                className={cn(activeStyles, 'left-3 pointer-events-auto transition', {
                  [inactiveStyles]: slideConfig.isBeginning,
                  'hover:bg-primary-300 text-primary-800 opacity-100': !slideConfig.isBeginning,
                })}
                aria-label="previous image">
                <ChevronLeft className="h-4 w-4 text-zinc-700" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  swiper?.slideNext()
                }}
                className={cn(activeStyles, 'right-3 pointer-events-auto transition', {
                  [inactiveStyles]: slideConfig.isEnd,
                  'hover:bg-primary-300 text-primary-800 opacity-100': !slideConfig.isEnd,
                })}
                aria-label="next image">
                <ChevronRight className="h-4 w-4 text-zinc-700" />
              </button>
            </div>

            {/* Swiper Images */}
            <Swiper
              pagination={{
                renderBullet: (_, className) =>
                  `<span class="rounded-full transition ${className}"></span>`,
              }}
              onSwiper={(swiper) => setSwiper(swiper)}
              spaceBetween={50}
              modules={[Pagination]}
              slidesPerView={1}
              className="h-full w-full"
            >
              {draft.capturedMockup.map((url, index) => (
                <SwiperSlide key={index}>
                  <NextImage
                    width={1000}
                    height={1000}
                    src={url}
                    alt={`Mockup ${index}`}
                    placeholder="blur"
                    blurDataURL="/Loading.png"
                    loading="lazy"
                    className="h-full w-full object-cover object-center rounded-xl"
                    onContextMenu={(e) => e.preventDefault()}
                    draggable={false}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <NextImage
            width={1000}
            height={1000}
            src={draft.capturedMockup[0]!}
            alt={draft.id}
            placeholder="blur"
            blurDataURL="/Loading.png"
            loading="lazy"
            className="h-full w-full rounded-xl object-cover"
            onContextMenu={(e) => e.preventDefault()}
            draggable={false}
          />
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 z-10">
          <Badge className="bg-gray-800 hover:bg-gray-800 text-white" variant="secondary">
            {draft.productCategory}
          </Badge>
        </div>
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-gray-800 hover:bg-gray-800 text-white" variant="secondary">
            {t('price_label', {price: draft.productPrice.toFixed(2)})}
          </Badge>
        </div>
        <div className="absolute bottom-2 left-2 z-10">
          <Badge className="bg-gray-800 hover:bg-gray-800 text-white" variant="secondary">
            {t('size_label', {size: draft.productSize})}
          </Badge>
        </div>
        <div className="absolute bottom-2 right-2 z-10">
          <Badge className="bg-gray-800 hover:bg-gray-800 text-white" variant="secondary">
            {t('quantity_label', {quantity: draft.quantity})}
          </Badge>
        </div>
      </CardContent>
    </Card>
     </div>
     </div>
            </div>
    </div>

    {/* right Side  */}
    <div className="flex flex-col justify-center">
    <div className="w-full">
          <Card>
            <CardHeader>
              <CardTitle>{t('add_order_details')}</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">{t('your_name')}</Label>
                <Input defaultValue={clientName} onChange={handleNameChange} id="name" placeholder={t('enter_your_name')} />
              </div>

              <div className="space-y-1">
                <Label htmlFor="phoneNumber">{t('phone_number')}</Label>
                <Input
                  id="phoneNumber"
                  type="number"
                  pattern="\d{8}"
                  defaultValue={phoneNumber}
                  onBlur={handlePhoneNumberBlur}
                  placeholder={t('enter_phone_number')}
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
                  {t('your_address')}
                  <p className="text-xs text-zinc-500 mb-4">{t('region_and_city')}</p>
                </Label>
                <Input
                  defaultValue={address}
                  onChange={handleAddressChange}
                  id="address"
                  placeholder={t('where_you_can_pick_up_your_order')}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
  <Link href="/buyingPolicy">
    <p className="flex space-x-2 text-sm animate-wiggle">
      <TriangleAlert className="h-5 w-5 flex-shrink-0 text-red-500" />
      <span className="hover:text-red-500">{t('read_buying_policy')}</span>
    </p>
  </Link>
  <div className="flex items-center space-x-2">
    <Checkbox id="terms" onClick={handleTermsCheckboxChange} />
    <label
      htmlFor="terms"
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {t('accept_buying_policy_and_conditions')}
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
            <p className="font-semibold ">{t('subtotal')}</p>
            <p className="font-semibold ">{preOrder?.amount.toFixed(2)} TND</p>
          </div>
          <div className="flex items-center justify-between py-2">
            <p className="font-semibold ">{t('shipping_fee')}</p>
            <p className="font-semibold ">{fee.toFixed(2)} TND</p>
          </div>
          <div className="my-2 h-px bg-gray-200" />
          <div className="flex items-center justify-between py-2">
            <p className="font-semibold ">{t('order_total')}</p>
            <p className="font-semibold ">{orderTotal.toFixed(2)} TND</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center">

      <Button
          onClick={()=>{
            setIsDelete(true)
            handleDelete(draft.id)
          }}
          variant="outline"
          className="flex ml-3 px-1 bg-red-500 hover:bg-red-400 text-white hover:text-white sm:px-6"
        >
          <span className="ml-1">{t('delete_this_draft')}</span>
          <X className="h-4 w-4 mt-0.5 inline ml-2" />
        </Button>

        <Button
          onClick={handleOrder}
          disabled={!isCheckoutEnabled || isDelete}
          loadingText="Loading..."
          className="px-4 sm:px-6 lg:px-8 ml-8 text-white"
        >
          {t('confirm_order')} <ArrowRight className="h-4 w-4 mt-0.5 ml-1.5 inline" />
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
