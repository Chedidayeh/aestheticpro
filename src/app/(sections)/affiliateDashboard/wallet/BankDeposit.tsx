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
import { proceedBankDepositRequest } from './actions';

interface ExtraAffiliate extends Affiliate {
  affiliatePaymentRequest : AffiliatePaymentRequest[]
}

interface Props {
  affiliate : ExtraAffiliate 
  }
const BankDeposit = ({ affiliate }:Props) => {

    const { toast } = useToast()
    const router = useRouter();
    const [open, setOpen] = useState<boolean>(false);

    
    const [bankName, setBankName] = useState(affiliate.bankName ?? "");
    const [bankAccountRIB, setBankAccountRIB] = useState(affiliate.bankAccount ?? "");
    const [accountHolder, setAccountHolder] = useState(affiliate.accountHolder ?? "");
    const [requestedAmount, setRequestedAmount] = useState(0);
  
    const isBankNameValid = bankName.trim() !== '';
    const isRIBValid = /^\d{20}$/.test(bankAccountRIB);
    const isAccounteHolderValid = accountHolder.trim() !== '';
    const isRequestedAmountValid =
      !isNaN(requestedAmount) && requestedAmount <= 100 && requestedAmount > 0;
  
    const isFormValid = isBankNameValid && isRIBValid && isAccounteHolderValid && isRequestedAmountValid;
  
    const [ribError, setRibError] = useState('');
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
                await proceedBankDepositRequest(affiliate.id , bankName , bankAccountRIB ,accountHolder , requestedAmount)
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
          alt="bank image"
          className="aspect-square w-44 rounded-md border-2"
          height={1000}
          src="/bank.jpg"
          width={1000}
        />
      </div>
      <div className="mt-4 flex items-center justify-center">
          <p className='text-xs text-muted-foreground'>Max 100 TND per request !</p>
      </div>
      <div className="mt-4 space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
        <div className="w-full sm:w-1/2">
          <Label>Bank Name* :</Label>
          <Input
            className="w-full mt-1"
            type="text"
            placeholder="Exemple: BIAT"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-1/2">
          <Label>Account Number* :</Label>
          <Input
           className={`${inputClassName} focus:ring-0  focus:border-green-500 mt-1`}
           type="number"
            placeholder="RIB"
            value={bankAccountRIB}
            onBlur={handleRIBBlur}
            onChange={(e) => setBankAccountRIB(e.target.value)}
          />
          {ribError && <p className="text-red-500 text-sm mt-1">{ribError}</p>}
        </div>
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
          <Label>Requested Amount* :</Label>
          <Input
            className="w-full mt-1"
            type="number"
            placeholder="Max 100 TND per Week"
            value={requestedAmount}
            onChange={(e) => setRequestedAmount(parseInt(e.target.value))}
          />
        </div>
      </div>

      <div className="flex items-center justify-center my-6">
        <Button disabled={!isFormValid} onClick={handleRequest}>
          Request Payment
        </Button>
      </div>

      <LoadingState isOpen={open} />
    </>
  );
};

export default BankDeposit;
