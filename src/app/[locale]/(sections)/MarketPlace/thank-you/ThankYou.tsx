/* eslint-disable react/no-unescaped-entities */

'use client'

import NextImage from 'next/image'
import { Order } from '@prisma/client'
import { useEffect, useState } from 'react'
import Confetti from 'react-dom-confetti'
import Link from 'next/link'
import { useTranslations } from 'next-intl';


const ThankYouPage = ({
  order,
}: {order : Order | null}) => {
    const t = useTranslations('ThankYouPage');

  const [showConfetti, setShowConfetti] = useState<boolean>(false)

    useEffect(() => {
      const ShowConfetti = async () => {
        try {
            setShowConfetti(true)
        } catch (error) {
          console.error("Error fetching platform data:", error);
        }
      };
  
      ShowConfetti();
    }, []);

  
  return (

    <>

    {!order && (

<main className='relative lg:min-h-full mb-32'>
<div>
  <div className='mb-8'>
    <div className="flex flex-col items-center justify-center space-y-1">
            <div
               aria-hidden="true"
            className="relative  h-40 w-40 text-muted-foreground">
            <NextImage
             fill
            src='/hippo-empty-cart.png'
             loading='eager'
             alt='empty shopping cart hippo'
             />
            </div>
           <h3 className="font-bold text-2xl">
             {t('no_order_title')}
            </h3>
          <p className="text-muted-foreground text-center">
          {t('no_order_desc')}
          </p>
           <div className='mt-4 text-sm font-medium'>
        <div className=''>
          <Link
            href='/MarketPlace'
            className='text-sm font-medium text-blue-600 hover:text-blue-500'>
            {t('continue_shopping')}
          </Link>
        </div>
      </div>
    </div>
  </div>
</div>
</main>

    )}

    
    
    {order && (

        <>

            <div
                      aria-hidden='true'
                      className='pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center'>
                      <Confetti
                        active={showConfetti}
                        config={{ elementCount: 100, spread: 50 }}
                      />
                    </div>

    <main className='relative lg:min-h-full'>
        <div className='mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:gap-x-8 lg:px-8  xl:gap-x-24'>
          <div className='lg:col-start-2'>
            <p className='text-sm font-medium text-blue-600'>
              {t('order_success')}
            </p>
            <h1 className='mt-2 text-4xl font-bold sm:text-5xl'>
              {t('thanks_for_ordering')}
            </h1>
              <p className='mt-2 text-base text-muted-foreground'>
                {t('processing_message')}
              </p>

              
              <ul className='mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground'>
                
              </ul>
              <div className='text-end mt-4'>
              <p className='text-sm font-medium text-blue-600'>
                الطلب تم بنجاح
                </p>
                <h1 className='mt-2 text-2xl font-bold sm:text-3xl'>
                شكراً لطلبك
                </h1>
                <p className='mt-2 text-base text-muted-foreground'>
                نحن نقدر طلبك ونعمل حالياً على معالجته. يرجى الانتظار، وسنقوم بإرساله إليك في أقرب وقت 
                </p>
                </div>

                <ul className='mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground'>
                
                </ul>

              <div className=' mt-2 text-left'>
                <Link
                  href='/MarketPlace/userOrders'
                  className='text-sm font-medium text-blue-600 hover:text-blue-500'>
                  {t('view_orders')}
                </Link>
              </div>

            <div className='mt-16 text-sm font-medium'>
              <div className='text-muted-foreground'>
                {t('order_id')}
              </div>
              <div className='mt-2 '>
              {order.id}
              </div>

              <div className='mt-2'>
              <span className=' text-blue-500 text-sm'>{t('call_confirmation')}</span>
              </div>

              <ul className='mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground'>
                
              </ul>

              <div className='space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-muted-foreground'>
                <div className='flex justify-between'>
                  <p>{t('subtotal')}</p>
                  <p className=''>
                  {(order.amount - order.shippingFee).toFixed(2) } TND
                  </p>
                </div>

                <div className='flex justify-between'>
                  <p>{t('shipping_fee')}</p>
                  <p className=''>
                    {order.shippingFee.toFixed(2)} TND
                  </p>
                </div>

                <div className='flex items-center justify-between border-t border-gray-200 pt-6 '>
                  <p className='text-base'>{t('total')}</p>
                  <p className='text-base'>
                  {order?.amount.toFixed(2)} TND

                  </p>
                </div>
              </div>

              <div className='mt-16 border-t border-gray-200 py-6 text-right'>
                <Link
                  href='/MarketPlace'
                  className='text-sm font-medium text-blue-600 hover:text-blue-500'>
                  {t('continue_shopping')}
                </Link>
              </div>
            </div>
          </div>
        </div>
    </main>

</>

   )}
    </>
  )
}

export default ThankYouPage