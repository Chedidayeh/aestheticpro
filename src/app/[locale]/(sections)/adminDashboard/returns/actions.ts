'use server'

import { db } from "@/db";



export const getAllReturnedOrders = async () => {
    try {
      const orders = await db.order.findMany({
        where : { isPaid : false , printed : true , type : "CONFIRMED" , status : "CANCELED"},
        include: {
          orderItems : {
            include : {product : true , frontsellerDesign :true , backsellerDesign : true}
          },
          user : true
        }
      });
      return orders;
    } catch (error) {
      console.error('Error retrieving orders with items and products:', error);
      throw new Error('Failed to retrieve orders with items and products from database');
    }
  };



  export const deleteOrderById = async (orderId: string) => {
    try {
      // Start a transaction to ensure atomicity
      await db.$transaction(async (transaction) => {
        // Delete the order items associated with the order
        await transaction.orderItem.deleteMany({
          where: { orderId: orderId },
        });
  
        // Delete the order
        await transaction.order.delete({
          where: { id: orderId },
        });
      },{
        maxWait: 10000, // Wait for a connection for up to 10 seconds
        timeout: 20000, // Allow the transaction to run for up to 20 seconds
      });
  
      return { message: 'Order and associated items deleted successfully' };
    } catch (error) {
      console.error('Error deleting order and associated items:', error);
    }
  };