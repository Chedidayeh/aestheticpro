'use server'

import { db } from "@/db";

export async function getPaymentRequestsForStore(storeId :string) {
    try {
      const paymentRequests = await db.paymentRequest.findMany({
        where: {
          storeId: storeId,
        },
      });
  
      return paymentRequests;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }


export async function deletePaymentRequestById(paymentRequestId : string) {
    try {
      await db.paymentRequest.delete({
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
