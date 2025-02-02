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

interface ExtraStore extends Store {
  paymentRequest  : PaymentRequest[]
}

interface Props {
    store : ExtraStore
  
  }
const Flouci = ({ store }:Props) => {

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
        setRibError('RIB must be exactly 20 digits.');
      } else {
        setRibError('');
      }
    };





    // handleRequest function
    const handleRequest = async () => {
        setOpen(true)
        if (store.revenue < 20) {
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

        
        else if ((store.revenue - store.receivedPayments) === 0) {
          toast({
            title: 'Request Denied!',
            description: 'Your Total Unreceived Payments is 0.00 TND.',
            variant: 'destructive',
          });
          setOpen(false);
          return;
        }

        else if ((store.revenue - store.receivedPayments) < requestedAmount) {
          toast({
            title: 'Request Denied!',
            description: 'Your Total Unreceived Payments is low.',
            variant: 'destructive',
          });
          setOpen(false);
          return;
        }

        
        
        
        else if (store.paymentRequest.some(request => request.status === 'PENDING')) {
          toast({
            title: 'You already have a pending request!',
            variant: 'destructive',
          });
          setOpen(false);
          return;
        }

        else{
            try {
                await proceedFlouciRequest(store.id , accountHolder , bankAccountRIB , requestedAmount)
                toast({
                    title: 'Your request has been saved !',
                    variant: 'default',
                  });
                router.push("/sellerDashboard/requests")
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
              alt="flouci logo"
              className="aspect-square object-cover w-44 rounded-md border-2"
              height={1000}
              src="/flouci.png"
              width={1000}
            />
          </div>
          <div className="mt-4 flex items-center justify-center">
          <p className='text-xs text-muted-foreground'>Max 100 TND per request !</p>
          </div>
          <div className="mt-4 space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
            <div className="w-full sm:w-1/2">
            <Label>Account Holder* :</Label>
            <Input
                className="w-full mt-1"
                type="text"
                placeholder="Foulen ben foulen"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-1/2">
             <Label>Bank Account* :</Label>
             <Input
                  className={`${inputClassName} focus:ring-0  focus:border-green-500 mt-1`}
                  type="text"
            placeholder="RIB"
            value={bankAccountRIB}
            onChange={handleRIBChange}
            onBlur={handleRIBBlur}
          />
          {ribError && <p className="text-red-500 text-sm mt-1">{ribError}</p>}
            </div>
            <div className="w-full sm:w-1/2">
              <Label>Requested Amount* :</Label>
              <Input
                className="w-full mt-1"
                type="number"
                placeholder="Max 100 TND per request"
                value={requestedAmount}
                onChange={(e) => setRequestedAmount(parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="flex items-center justify-center my-6 ">
            <Button disabled={!isFormValid} className='text-white' onClick={handleRequest}>Request Payment</Button>
          </div>

          <LoadingState isOpen={open} />

        </>
  );
};

export default Flouci;
