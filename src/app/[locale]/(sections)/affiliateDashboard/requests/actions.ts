'use server'

import { db } from "@/db";


export async function deletePaymentRequestById(paymentRequestId : string) {
    try {
      await db.affiliatePaymentRequest.delete({
        where: {
          id: paymentRequestId,
        },
      });
  
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false
    } 
  }
