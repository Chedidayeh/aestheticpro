'use client'

import React, { useState } from 'react';
import NextImage from 'next/image';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Affiliate, AffiliatePaymentRequest } from '@prisma/client';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import LoadingState from '@/components/LoadingState';
import { proceedD17Request } from './actions';
import { useTranslations } from 'next-intl';

interface ExtraAffiliate extends Affiliate {
  affiliatePaymentRequest : AffiliatePaymentRequest[]
}

interface Props {
  affiliate : ExtraAffiliate 
  }
const D17 = ({ affiliate }:Props) => {

    const { toast } = useToast()
    const router = useRouter();
    const [open, setOpen] = useState<boolean>(false);
    const t = useTranslations('AffiliateWalletD17Page');

    
  const [cardHolder, setcardHolder] = useState(affiliate.cardHolder ?? "");
  const [cardPhoneNumber, setcardPhoneNumber] = useState(affiliate.cardPhoneNumber ?? "");
  const [requestedAmount, setRequestedAmount] = useState(0);

 

  const iscardHolderValid = cardHolder.trim() !== '';
  const iscardPhoneNumberValid = /^\d{8}$/.test(cardPhoneNumber);
  const isRequestedAmountValid =
    !isNaN(requestedAmount) && requestedAmount <= 100 && requestedAmount > 0;

  const isFormValid =  (iscardHolderValid && iscardPhoneNumberValid && isRequestedAmountValid)



  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const phoneNumberValue = event.target.value;
    setcardPhoneNumber(phoneNumberValue);
  };

                    // check phone number length
                    const [phoneNumberError, setPhoneNumberError] = useState('');
                    const inputClassName = phoneNumberError ? 'border-red-500' : (cardPhoneNumber ? 'border-green-500' : '');
                    const handlePhoneNumberBlur = () => {
                      if (cardPhoneNumber.length !== 8) {
                        setPhoneNumberError(t('phoneNumberError'));
                      } else {
                        setPhoneNumberError('');
                      }
                    };


    // handleRequest function
    const handleRequest = async () => {
        setOpen(true)
        if (affiliate.totalIncome < 20) {
            toast({
                title: 'Your total revenue is less than 20.00 TND !',
                description: 'Unable to process your request.',
                variant: 'destructive',
              });
            setOpen(false)
            return
        }
        else if (requestedAmount < 20) {
          toast({
            title: 'Request Denied !',
            description: 'Minimum requested Amount is 20.00 TND.',
            variant: 'destructive',
          });
          setOpen(false);
          return;
        }

        
        else if ((affiliate.totalIncome - affiliate.receivedPayments) === 0) {
          toast({
            title: 'Request Denied!',
            description: 'Your Total Unreceived Payments is 0.00 TND.',
            variant: 'destructive',
          });
          setOpen(false);
          return;
        }

        else if ((affiliate.totalIncome - affiliate.receivedPayments) < requestedAmount) {
          toast({
            title: 'Request Denied!',
            description: 'Your Total Unreceived Payments is low.',
            variant: 'destructive',
          });
          setOpen(false);
          return;
        }

        
        
        
        else if (affiliate.affiliatePaymentRequest.some(request => request.status === 'PENDING')) {
          toast({
            title: 'You already have a pending request!',
            variant: 'destructive',
          });
          setOpen(false);
          return;
        }

        else{
            try {
                await proceedD17Request(affiliate.id , cardHolder , cardPhoneNumber , requestedAmount)
                toast({
                    title: 'Your request has been saved !',
                    variant: 'default',
                  });
                router.push("/affiliateDashboard/requests")
            }
            catch(error){
                setOpen(false)
                toast({
                    title: 'Error !',
                    description: "Please try again later !",
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
              alt={t('d17ImageAlt')}
              className="aspect-square w-44 rounded-md border-2"
              height={1000}
              src="/D17.png"
              width={1000}
            />
          </div>
          <div className="mt-4 flex items-center justify-center">
          <p className='text-xs text-muted-foreground'>{t('maxPerRequest')}</p>
          </div>
          <div className="mt-4 space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
            <div className="w-full sm:w-1/2">
              <Label>{t('cardHolderLabel')}</Label>
              <Input
                className="w-full mt-1"
                type="text"
                placeholder={t('cardHolderPlaceholder')}
                value={cardHolder}
                onChange={(e) => setcardHolder(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-1/2">
              <Label>{t('cardPhoneNumberLabel')}</Label>
              <Input 
                  id="phoneNumber" 
                  type="number" 
                  pattern="\d{8}"
                  onBlur={handlePhoneNumberBlur}
                  placeholder={t('phonePlaceholder')} 
                  defaultValue={cardPhoneNumber}
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
              <Label>{t('requestedAmountLabel')}</Label>
              <Input
                className="w-full mt-1"
                type="number"
                placeholder={t('requestedAmountPlaceholder')}
                value={requestedAmount}
                onChange={(e) => setRequestedAmount(parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="flex items-center justify-center my-6">
            <Button disabled={!isFormValid} size={"sm"} className='text-white' onClick={handleRequest}>{t('requestPayment')}</Button>
          </div>

          <LoadingState isOpen={open} />

        </>
  );
};

export default D17;
