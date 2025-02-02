'use server'

import { db } from "@/db";
import { Store , PaymentRequest } from "@prisma/client";

interface ExtraStore extends Store {
  paymentRequest : PaymentRequest[]
}

// get seller Store by userId
export async function getStoreByUserId(userId : string) {
  try {
    const store = await db.store.findUnique({
      where: {
        userId: userId
      },
      include: {
        paymentRequest : true
      },
    });

    if (!store) {
      throw new Error('Store not found for the given userId');
    }

    return store as ExtraStore;
  } catch (error) {
    console.error('Error fetching store:', error);
    throw error;
  }
}

export async function proceedD17Request(storeId : string ,cardHolder: string, cardPhoneNumber: string, requestedAmount: number) {
    try {

      await db.$transaction(async (tx) => {
      // Create the D17 payment request
      await tx.paymentRequest.create({
        data: {
          storeId: storeId,
          method: 'D17',
          cardHolder,
          cardPhoneNumber,
          requestedAmount: requestedAmount,
          status: 'PENDING'
        }
      });

        // Update affiliate details
        await tx.store.update({
          where: { id: storeId },
          data: {
            cardHolder,
            cardPhoneNumber,
          },
        });
      });
    

  
    } catch (error) {
      console.error('Error creating payment request:', error);
    }
  }


  export async function proceedFlouciRequest(storeId : string ,accountHolder: string, bankAccountRIB: string, requestedAmount: number) {
    try {
    


      await db.$transaction(async (tx) => {
      // Create the Flouci payment request
      await tx.paymentRequest.create({
        data: {
          storeId: storeId,
          method: 'Flouci',
          bankAccount : bankAccountRIB,
          accountHolder: accountHolder,
          requestedAmount: requestedAmount,
          status: 'PENDING'
        }
      });
  
          // Update affiliate details
          await tx.store.update({
            where: { id: storeId },
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

  export async function proceedBankDepositRequest(storeId : string ,bankName: string, bankAccountRIB: string,accountHolder : string , requestedAmount: number) {
    try {
    

      await db.$transaction(async (tx) => {
        // Create the BankDeposit payment request
        await tx.paymentRequest.create({
          data: {
            storeId: storeId,
            method: 'BankDeposit',
            bankName : bankName,
            bankAccount : bankAccountRIB,
            accountHolder: accountHolder,
            requestedAmount: requestedAmount,
            status: 'PENDING'
          }
        });
    
            // Update affiliate details
            await tx.store.update({
              where: { id: storeId },
              data: {
                bankName : bankName,
                bankAccount : bankAccountRIB,
                accountHolder: accountHolder,
              },
            });
          });
  
    } catch (error) {
      console.error('Error creating payment request:', error);
    }
  }