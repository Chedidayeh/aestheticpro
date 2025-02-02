'use server'

import { db } from "@/db";



    export async function proceedD17Request(
      affiliateId: string,
      cardHolder: string,
      cardPhoneNumber: string,
      requestedAmount: number
    ) {
      try {
        await db.$transaction(async (tx) => {
          // Create the D17 payment request
          await tx.affiliatePaymentRequest.create({
            data: {
              affiliateId,
              method: 'D17',
              cardHolder,
              cardPhoneNumber,
              requestedAmount,
              status: 'PENDING',
            },
          });

          // Update affiliate details
          await tx.affiliate.update({
            where: { id: affiliateId },
            data: {
              cardHolder,
              cardPhoneNumber,
            },
          });
        });

        console.log('Transaction successful: Payment request created and affiliate updated');
      } catch (error) {
        console.error('Transaction failed:', error);
      }
    }


  export async function proceedFlouciRequest(affiliateId : string ,accountHolder: string, bankAccountRIB: string, requestedAmount: number) {
    try {

      await db.$transaction(async (tx) => {
      // Create the Flouci payment request
      await tx.affiliatePaymentRequest.create({
        data: {
          affiliateId: affiliateId,
          method: 'Flouci',
          bankAccount : bankAccountRIB,
          accountHolder: accountHolder,
          requestedAmount: requestedAmount,
          status: 'PENDING'
        }
      });

        // Update affiliate details
        await tx.affiliate.update({
          where: { id: affiliateId },
          data: {
            bankAccount : bankAccountRIB,
            accountHolder: accountHolder,
          },
        });
      });
    

  
    } catch (error) {
      console.error('Error creating payment request:', error);
    }
  }

  export async function proceedBankDepositRequest(affiliateId : string ,bankName: string, bankAccountRIB: string,accountHolder : string , requestedAmount: number) {
    try {

      await db.$transaction(async (tx) => {

        await tx.affiliatePaymentRequest.create({
          data: {
            affiliateId: affiliateId,
            method: 'BankDeposit',
            bankName : bankName,
            bankAccount : bankAccountRIB,
            accountHolder: accountHolder,
            requestedAmount: requestedAmount,
            status: 'PENDING'
          }
        });
          // Update affiliate details
          await tx.affiliate.update({
            where: { id: affiliateId },
            data: {
              bankName : bankName,
              bankAccount : bankAccountRIB,
              accountHolder: accountHolder,
            },
          });
        });
    
      // Create the D17 payment request

  
    } catch (error) {
      console.error('Error creating payment request:', error);
    }
  }