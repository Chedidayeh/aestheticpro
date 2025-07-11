'use client'

import React, { useState } from 'react';
import NextImage from 'next/image';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Store  , PaymentRequest } from '@prisma/client';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import LoadingState from '@/components/LoadingState';
import { proceedD17Request } from './actions';
import { useTranslations } from 'next-intl';

interface ExtraStore extends Store {
  paymentRequest  : PaymentRequest[]
}

interface Props {
    store : ExtraStore
  
  }
const D17 = ({ store }:Props) => {
  const t = useTranslations('SellerWalletPage');

    const { toast } = useToast()
    const router = useRouter();
    const [open, setOpen] = useState<boolean>(false);

    
  const [cardHolder, setcardHolder] = useState(store.cardHolder ?? "");
  const [cardPhoneNumbe, setcardPhoneNumbe] = useState(store.cardPhoneNumber ?? "");
  const [requestedAmount, setRequestedAmount] = useState(0);

 

  const iscardHolderValid = cardHolder.trim() !== '';
  const iscardPhoneNumbeValid = /^\d{8}$/.test(cardPhoneNumbe);
  const isRequestedAmountValid =
    !isNaN(requestedAmount) && requestedAmount <= 100 && requestedAmount > 0;

  const isFormValid =  (iscardHolderValid && iscardPhoneNumbeValid && isRequestedAmountValid)



  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const phoneNumberValue = event.target.value;
    setcardPhoneNumbe(phoneNumberValue);
  };

                    // check phone number length
                    const [phoneNumberError, setPhoneNumberError] = useState('');
                    const inputClassName = phoneNumberError ? 'border-red-500' : (cardPhoneNumbe ? 'border-green-500' : '');
                    const handlePhoneNumberBlur = () => {
                      if (cardPhoneNumbe.length !== 8) {
                        setPhoneNumberError(t('phone_number_length_error'));
                      } else {
                        setPhoneNumberError('');
                      }
                    };


    // handleRequest function
    const handleRequest = async () => {
        setOpen(true)
        if (store.revenue < 20) {
            toast({
                title: t('toast_revenue_too_low'),
                description: t('toast_unable_to_process'),
                variant: 'destructive',
              });
            setOpen(false)
            return
        }
        else if (requestedAmount < 20) {
          toast({
            title: t('toast_request_denied'),
            description: t('toast_minimum_amount'),
            variant: 'destructive',
          });
          setOpen(false);
          return;
        }

        
        else if ((store.revenue - store.receivedPayments) === 0) {
          toast({
            title: t('toast_request_denied'),
            description: t('toast_unreceived_zero'),
            variant: 'destructive',
          });
          setOpen(false);
          return;
        }

        else if ((store.revenue - store.receivedPayments) < requestedAmount) {
          toast({
            title: t('toast_request_denied'),
            description: t('toast_unreceived_low'),
            variant: 'destructive',
          });
          setOpen(false);
          return;
        }

        
        
        
        else if (store.paymentRequest.some(request => request.status === 'PENDING')) {
          toast({
            title: t('toast_pending_request'),
            variant: 'destructive',
          });
          setOpen(false);
          return;
        }

        else{
            try {
                await proceedD17Request(store.id , cardHolder , cardPhoneNumbe , requestedAmount)
                toast({
                    title: t('toast_request_saved'),
                    variant: 'default',
                  });
                router.push("/sellerDashboard/requests")
            }
            catch(error){
                setOpen(false)
                toast({
                    title: t('toast_error'),
                    description: t('toast_try_again_later'),
                    variant: 'destructive',
                    });
                return
            }
        }


    }

  return (

        <>
          <div className="mt-4 flex items-center justify-center">
            <NextImage
              alt="D17 image"
              className="aspect-square w-44 rounded-md border-2"
              height={1000}
              src="/D17.png"
              width={1000}
            />
          </div>
          <div className="mt-4 flex items-center justify-center">
          <p className='text-xs text-muted-foreground'>{t('max_per_request')}</p>
          </div>
          <div className="mt-4 space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
            <div className="w-full sm:w-1/2">
              <Label>{t('card_holder_label')}</Label>
              <Input
                className="w-full mt-1"
                type="text"
                placeholder={t('card_holder_placeholder')}
                value={cardHolder}
                onChange={(e) => setcardHolder(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-1/2">
              <Label>{t('card_phone_label')}</Label>
              <Input 
                  id="phoneNumber" 
                  type="number" 
                  pattern="\d{8}"
                  onBlur={handlePhoneNumberBlur}
                  placeholder={t('phone_number_placeholder')} 
                  value={cardPhoneNumbe}
                  onChange={handlePhoneNumberChange}
                  className={`${inputClassName} focus:ring-0  focus:border-green-500 mt-1`}
                  required 
                />
                {phoneNumberError && (
                  <p className="text-sm text-red-500 mt-1">
                    {phoneNumberError}
                  </p>
                )}
            </div>
            <div className="w-full sm:w-1/2">
              <Label>{t('requested_amount_label')}</Label>
              <Input
                className="w-full mt-1"
                type="number"
                placeholder={t('max_per_request')}
                value={requestedAmount}
                onChange={(e) => setRequestedAmount(parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="flex items-center justify-center my-6 ">
            <Button disabled={!isFormValid} size={"sm"} className='text-white' onClick={handleRequest}>{t('request_payment_button')}</Button>
          </div>

          <LoadingState isOpen={open} />

        </>
  );
};

export default D17;
