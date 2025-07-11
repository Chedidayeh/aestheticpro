/* eslint-disable react/no-unescaped-entities */
'use client'
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
import {
    Pagination,
    PaginationContent,
    PaginationItem,
  } from "@/components/ui/pagination"
import React, { useEffect, useRef, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Order, OrderItem } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { CircleCheck, CircleX, OctagonAlert, Palette, Truck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { DeleteOrder } from "./actions";
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import ImageSlider from "@/components/MarketPlace/ImageSlider"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from 'next-intl';

  
interface OrderWithItems extends Order {
    orderItems: OrderItem[];
  }
  
  
  interface ViewProps {
    ordersData: OrderWithItems[];
    }

const MobileView = ({ordersData}: ViewProps) => {

  const { toast } = useToast()
  const router = useRouter();
  const t = useTranslations('UserOrdersPage');
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const currentOrder = ordersData[currentIndex];

          useEffect(() => {
            if (currentOrder && ref.current) {
              ref.current!.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start', // Try 'start' or 'center' depending on your needs
                  inline: 'nearest', // Try 'center', 'start', or 'nearest' depending on your needs
                });
            }
          }, [currentOrder , ref]);
  
  

  const showPreviousOrder = () => {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    };
  
    const showNextOrder = () => {
      if (currentIndex < ordersData.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    };
  



      //delete order code
      const [isDeleteOpen, setisDeleteOpen] = useState(false);
      const [selectedOrderId, setselectedOrderId] = useState("");

      const handleDelete = async () => {
        try {
            setisDeleteOpen(false)
            await DeleteOrder(selectedOrderId)
            toast({
                title: t('toast_delete_success'),
                variant: 'default',
              });
              router.refresh()
        } catch (error) {
            console.error('Error deleting order:', error);
            toast({
                title: t('toast_delete_error_title'),
                description: t('toast_delete_error_desc'),
                variant: 'destructive',
            });
        }
    };

  return (
    <>

    {currentOrder && (
  <Card key={currentOrder.id} ref={ref} className="overflow-hidden mb-4" x-chunk="dashboard-05-chunk-4">
    <CardHeader className="bg-muted/50">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <div className="grid gap-0.5 flex-1 min-w-0">
          <CardTitle className="group flex flex-wrap items-center gap-2 text-sm sm:text-base">
            {t('order_id')}: <p className="text-xs sm:text-sm text-gray-600 break-all">{currentOrder.id}</p>
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            <span className="text-green-600 text-xs sm:text-sm">{t('call_confirmation')}</span><br/>
            {t('creation_date')}: <time dateTime={currentOrder.createdAt ? currentOrder.createdAt.toISOString() : undefined}>
              {currentOrder.updatedAt ? new Date(currentOrder.updatedAt).toLocaleString() : ''}
            </time>
          </CardDescription>
        </div>
        <CardDescription className="flex flex-col xs:flex-row gap-2 sm:gap-1 flex-shrink-0 w-full sm:w-auto my-2 sm:my-0">
          <Badge
            variant="outline"
            className={`h-8 max-w-max bg-slate-200 dark:bg-slate-600/50 gap-1 ${currentOrder.type  === "NOT_CONFIRMED" ? 'text-red-500' : currentOrder.type === 'CANCELED' ? 'text-red-500' : currentOrder.type === 'CONFIRMED' ? 'text-green-500' : ''}`}
          >
            {currentOrder.type === "CONFIRMED" ? (
              <CircleCheck className="h-3.5 w-3.5" />
            ) : (
              <CircleX className="h-3.5 w-3.5" />
            )}
            <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
              {currentOrder.type}
            </span>
          </Badge>
          <Badge
            variant="outline"
            className={`h-8 max-w-max bg-slate-200 dark:bg-slate-600/50 gap-1 ${!currentOrder.printed ? 'text-red-500' :  'text-green-500'}`}
          >
            <Palette className="h-3.5 w-3.5" />
            <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
              {currentOrder.printed ? t('printed') : t('not_printed')}
            </span>
          </Badge>
          <Badge
            variant="outline"
            className={`h-8 max-w-max bg-slate-200 dark:bg-slate-600/50 gap-1 ${currentOrder.status === 'CANCELED' ? 'text-red-500' : currentOrder.status === 'PROCESSING' ? 'text-blue-500' : currentOrder.status === 'DELIVERED' ? 'text-green-500' : ''}`}
          >
            <Truck className="h-3.5 w-3.5" />
            <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
              {currentOrder.status}
            </span>
          </Badge>
        </CardDescription>
      </div>
      {currentOrder.status !== "CANCELED" && !currentOrder.printed && currentOrder.type !== "CONFIRMED"  && (
        <div className="flex w-full sm:w-auto items-end justify-end mt-2 sm:mt-0">
          <Button
            onClick={() => {
              setisDeleteOpen(true);
              setselectedOrderId(currentOrder.id);
            }}
            className="bg-red-500 text-white hover:bg-red-300 w-full sm:w-auto"
          >
            {t('cancel_order')}
          </Button>
        </div>
      )}
    </CardHeader>
    
    <CardContent className="p-6 text-sm">
      <div className="grid gap-3">
        <div className="font-semibold">{t('order_details')}</div>
        {currentOrder.orderItems.length > 0 &&(
          <ul className="grid gap-3">
          {currentOrder.orderItems.map((item) => (
            <li key={item.id} className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {item.productTitle} x <span>{item.quantity} ({item.productCategory})</span>
              </span>
              <span>{`${((item.productPrice ?? 0) * (item.quantity ?? 1)).toFixed(2)}`} TND</span>
            </li>
          ))}
        </ul>
        )}
        

        <Separator className="my-2" />
        <ul className="grid gap-3">
          <li className="flex items-center justify-between">
            <span className="text-muted-foreground">{t('subtotal')}</span>
            <span>{`${(currentOrder.amount - currentOrder.shippingFee).toFixed(2)} TND`}</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-muted-foreground">{t('shipping')}</span>
            <span>{currentOrder.shippingFee.toFixed(2)} TND</span>
          </li>
          <li className="flex items-center justify-between font-semibold">
            <span className="text-muted-foreground">{t('total_label')}</span>
            <span>{`${currentOrder.amount.toFixed(2)} TND`}</span>
          </li>
        </ul>
      </div>
      <Separator className="my-4" />
      <div className="grid gap-3">
        <div className="font-semibold">{t('shipping_info')}</div>
        <dl className="grid gap-3">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">{t('address')}</dt>
            <dd>{currentOrder.shippingAddress}</dd>
          </div>
        </dl>
      </div>
      <Separator className="my-4" />
      <div className="grid gap-3">
        <div className="font-semibold">{t('customer_info')}</div>
        <dl className="grid gap-3">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">{t('customer')}</dt>
            <dd>{currentOrder.clientName}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">{t('phone')}</dt>
            <dd>
              {currentOrder.phoneNumber}
            </dd>
          </div>
        </dl>
      </div>

      <Separator className="my-4" />
      <div className="font-semibold">{t('order_items')}</div>
      <div className="p-6 flex items-center justify-center text-sm">

      <ul
                  className={cn({
                    'divide-y divide-gray-200 border-b border-t border-gray-200':
                    currentOrder.orderItems.length > 1,
                  })}>
                  {currentOrder.orderItems.map((item) => {

                      return (
                        <li
                          key={item.id}
                          className='flex py-2'>
                          <div className='flex-shrink-0 mb-10'>
                            <div className='h-52 w-52'>
                            <ImageSlider urls={item.capturedMockup}/>
                            </div>
                          </div>
                        </li>
                      )
                    })}
                </ul>
                </div>
        
    </CardContent>
    <CardFooter className="flex flex-row border-t bg-muted/50 px-6 py-3">
      <div className="text-xs text-muted-foreground">
        {t('total_orders', { count: ordersData.length })}
      </div>
      <div className="">
      {ordersData.length > 1 && (
            <Pagination>
      <PaginationContent className="ml-6 mr-0 w-auto flex items-end justify-end">
        <PaginationItem>
          <Button variant="outline" onClick={showPreviousOrder}>
            {t('previous_order')}
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Button variant="outline" onClick={showNextOrder}>
            {t('next_order')}
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>

             )}
       </div>

    </CardFooter>
  </Card>
)}

       {/* The AlertDialog delete order component  */}
       <AlertDialog open={isDeleteOpen}>
               <AlertDialogTrigger asChild>
                         </AlertDialogTrigger>
                         <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
                         <AlertDialogHeader className="flex flex-col items-center">
                                       <div className="text-red-500 mb-2">
                                           <OctagonAlert className=''/>
                                               </div>
                                              <AlertDialogTitle className="text-xl font-bold text-center">
                                                 {t('delete_order_title')}
                                               </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                   {t('delete_order_desc')} 
                                                   </AlertDialogDescription>
                                                   </AlertDialogHeader>
                                                  <AlertDialogFooter>
                                              <AlertDialogCancel onClick={()=>setisDeleteOpen(false)}>{t('cancel')}</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete()} 
                                     className='bg-red-500 hover:bg-red-500 text-white' >{t('confirm_cancel')}</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                     </AlertDialog> 

</>
  )
}

export default MobileView
