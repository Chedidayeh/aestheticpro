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
import { proceedFlouciRequest } from './actions';
import { useTranslations } from 'next-intl';

interface ExtraStore extends Store {
  paymentRequest  : PaymentRequest[]
}

interface Props {
    store : ExtraStore
  
  }
const Flouci = ({ store }:Props) => {
  const t = useTranslations('SellerWalletPage');

    const { toast } = useToast()
    const router = useRouter();
    const [open, setOpen] = useState<boolean>(false);

    
  const [accountHolder, setAccountHolder] = useState(store.accountHolder ?? "");
  const [requestedAmount, setRequestedAmount] = useState(0);
  const [bankAccountRIB, setBankAccountRIB] = useState(store.bankAccount ?? "");
  const [ribError, setRibError] = useState('');
 

  const isAccounteHolderValid = accountHolder.trim() !== '';
  const isRequestedAmountValid =
    !isNaN(requestedAmount) && requestedAmount <= 100 && requestedAmount > 0;
  const isRIBValid = /^\d{20}$/.test(bankAccountRIB);

  const isFormValid =
    isAccounteHolderValid &&
    isRequestedAmountValid &&
    isRIBValid;


    const handleRIBChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const ribValue = event.target.value;
      setBankAccountRIB(ribValue);
    };

    const inputClassName = ribError ? 'border-red-500' : (bankAccountRIB ? 'border-green-500' : '');
    const handleRIBBlur = () => {
      if (!isRIBValid) {
        setRibError(t('rib_length_error'));
      } else {
        setRibError('');
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
                await proceedFlouciRequest(store.id , accountHolder , bankAccountRIB , requestedAmount)
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
              alt="flouci logo"
              className="aspect-square object-cover w-44 rounded-md border-2"
              height={1000}
              src="/flouci.png"
              width={1000}
            />
          </div>
          <div className="mt-4 flex items-center justify-center">
          <p className='text-xs text-muted-foreground'>{t('max_per_request')}</p>
          </div>
          <div className="mt-4 space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
            <div className="w-full sm:w-1/2">
            <Label>{t('account_holder_label')}</Label>
            <Input
                className="w-full mt-1"
                type="text"
                placeholder={t('account_holder_placeholder')}
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-1/2">
             <Label>{t('bank_account_label')}</Label>
             <Input
                  className={`${inputClassName} focus:ring-0  focus:border-green-500 mt-1`}
                  type="text"
            placeholder={t('rib_placeholder')}
            value={bankAccountRIB}
            onChange={handleRIBChange}
            onBlur={handleRIBBlur}
          />
          {ribError && <p className="text-red-500 text-sm mt-1">{ribError}</p>}
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

export default Flouci;
