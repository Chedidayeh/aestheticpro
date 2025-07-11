/* eslint-disable react/jsx-no-undef */
/* eslint-disable @next/next/no-img-element */
'use client'
import NextImage from 'next/image'

import * as React from "react";
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getUser } from "@/actions/actions";
import { useToast } from "@/components/ui/use-toast";
import { BackBorder, Category, Color, FrontBorder, PreOrderDraft, Size } from "@prisma/client";
import LoadingState from "@/components/LoadingState";
import LoginModal from '@/components/LoginModal';
import { useState } from 'react';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface fetchedCat extends Category {
  colors : Color[]
  sizes : Size[]
  frontBorders : FrontBorder[]
  backBorders : BackBorder[]
}

interface CategoryViewProps {
    categories: fetchedCat[];
    preOrders : PreOrderDraft[]
  }

const CategoryView: React.FC<CategoryViewProps> = ({ categories , preOrders  }) => {

  const [open, setOpen] = React.useState<boolean>(false);



  const router = useRouter();
  const [selectedCard, setSelectedCard] = React.useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<Category>();
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(true);
  const [isButtonPressed, setIsButtonPressed] = React.useState(false);
  const { toast } = useToast()
  const t = useTranslations('MarketPlaceCreateClientProductSelectCategory');

  const handleCardClick = (index: number, category: Category) => {
    if (category.disableCategory) {
      toast({
        title: t('category_unavailable'),
        variant: "destructive",
      });
      return; // Prevent further execution
    }
    setSelectedCategory(category)
    setSelectedCard((prevState) => (prevState === index ? null : index));
  };
  

  React.useEffect(() => {
    setIsButtonDisabled(selectedCard === null);
  }, [selectedCard]);


  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false)


  const handleButtonClick = async (index: number | null) => {
    if (index !== null && index !== undefined && selectedCategory) {
      const user = await getUser()
      if(!user){
        setIsLoginModalOpen(true)
        toast({
          title: t('no_logged_in_user'),
          description: t('sign_in_first'),
          variant: 'destructive',
        });
        return
      }
      setIsButtonPressed(true)
      router.push(`/MarketPlace/create-client-product/upload?category=${selectedCategory?.label}`);
      setIsButtonDisabled(true)

    }
  };



  

  

  

  return (
    <>


<div className={cn(
  'relative h-full border-2 flex-1 my-8 w-full rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl flex justify-center flex-col items-center',
)}>

{preOrders.length > 0 && (


  <>

<div className='my-8  space-y-4'>
  <div className='text-center sm:col-span-9 md:row-end-1'>
            <h3 className='text-xl font-bold tracking-tight'>
              {t('continue_with_drafts')}
            </h3>
          </div>

<div className='flex items-center justify-center'>
<Sheet>
  <SheetTrigger asChild>
    <Button size={"sm"} className='text-white' variant="default">{t('select')}</Button>
  </SheetTrigger>
  <SheetContent side="bottom">
    <SheetHeader>
      <SheetTitle>{t('select_draft')}</SheetTitle>
      <SheetDescription />
    </SheetHeader>
    <ScrollArea className="w-full h-[420px]">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 bg-gray-600/5 p-6 rounded-xl">
    {preOrders.map((draft, index) => (
      <div key={index} className="relative w-full">
        {/* Draft Number Badge - centered above the card */}
        <div className="absolute top-[-16px] left-1/2 transform -translate-x-1/2 z-10">
          <Badge className="bg-indigo-600 hover:bg-indigo-600  text-white" variant="secondary">
            {t('draft_number', { number: index + 1 })}
          </Badge>
        </div>

        {/* Card */}
        <Link href={`/MarketPlace/create-client-product/preview?preOrderId=${draft.id}`}>
        <Card className={cn("border", selectedCard === index && "border-primary")}>
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
                {t('price_label', { price: draft.productPrice.toFixed(2) })}
              </Badge>
            </div>
            <div className="absolute bottom-2 left-2">
              <Badge className="bg-gray-800 hover:bg-gray-800 text-white" variant="secondary">
                {t('size_label', { size: draft.productSize })}
              </Badge>
            </div>
            <div className="absolute bottom-2 right-2">
              <Badge className="bg-gray-800 hover:bg-gray-800 text-white" variant="secondary">
                {t('quantity_label', { quantity: draft.quantity })}
              </Badge>
            </div>
          </CardContent>
        </Card>
        </Link>
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


<div className="flex items-center w-full gap-4 text-muted-foreground">
  <Separator className="h-0.5 flex-1 text-muted-foreground" />
  <span className="text-sm">{t('or')}</span>
  <Separator className="h-0.5 flex-1 text-muted-foreground" />
</div>

</>

)}


  {categories.length > 0 ? (
    <>
      <div className='mt-8 relative flex flex-1 flex-col items-center justify-center w-full'>
        <div className='text-center sm:col-span-9 md:row-end-1'>
          <h3 className='text-xl font-bold tracking-tight'>
            {t('select_category')}
          </h3>
        </div>

        <div className="mt-2 w-full max-w-md px-4 sm:max-w-lg lg:max-w-xl">
          <div className='flex gap-4 items-center justify-center'>
            <Button
              isLoading={isButtonPressed}
              loadingText={t('loading')}
              size="sm"
              className='text-white'
              onClick={() => handleButtonClick(selectedCard)}
              disabled={isButtonDisabled}
            >
              {t('continue')}
              <ArrowRight className='h-4 w-4 ml-1.5 inline' />
            </Button>
          </div>
        </div>





        <div className="grid mt-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-2 w-full max-w-6xl">
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(index, category)}
              className='cursor-pointer'
            >
              <Card className={cn("border", selectedCard === index && "border-primary")}>
                <CardContent className="flex justify-center p-1 relative">
                  <NextImage
                    width={1000}
                    height={1000}
                    src={category.value!}
                    alt={category.label}
                    placeholder="blur"
                    blurDataURL="/Loading.png"
                    loading='lazy'
                    className="h-full w-full rounded-xl object-cover"
                    onContextMenu={(e) => e.preventDefault()}
                    draggable={false}
                  />
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="secondary">{category.label}</Badge>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary">{t('category_price', { price: category.price.toFixed(2) })}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>





      </div>
    </>
  ) : (
    <div className='flex h-full flex-col items-center justify-center space-y-4 px-4 text-center'>
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
      <h3 className='font-semibold text-lg sm:text-2xl'>
        {t('no_categories_found')}
      </h3>
      <p className='text-muted-foreground text-sm sm:text-base'>
        {t('nothing_to_show')}
      </p>
    </div>
  )}
</div>


<LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />

    <LoadingState isOpen={open} />


    </>
  );
}


export default CategoryView;
