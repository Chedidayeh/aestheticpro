'use server'


import { getAllReturnedOrders } from "@/app/(sections)/adminDashboard/returns/actions";
import { db } from "@/db";
import { OrderItem } from "@prisma/client";


export async function CheckIfMatches(item: OrderItem) {
  try {
    const existingOrders = await getAllReturnedOrders();

    for (const order of existingOrders) {
      for (const existingItem of order.orderItems) {
        if (
          existingItem.productId === item.productId &&
          existingItem.productColor === item.productColor &&
          existingItem.productCategory === item.productCategory &&
          existingItem.productSize === item.productSize
        ) {
          return {match : true , orderId : order.id}; // Found a match
        }
      }
    }

    return {match : false , orderId : null}; // Found a match
  } catch (error) {
    console.error('Error checking for matching order item:', error);
    throw new Error('Failed to check for matching order items');
  }
}

export const getOrderWithItemsAndProducts = async (orderId : string) => {
    try {
      const order = await db.order.findUnique({
        where: { id: orderId },
        include: {
          orderItems: {
            include: {
              product: true,
              frontsellerDesign : true,
              backsellerDesign : true,
              frontclientDesign : true,
              backclientDesign :true,
            },
          },
          user : true
        },
      });
  
      return order;
    } catch (error) {
      console.error('Error retrieving order with items and products:', error);
      throw new Error('Failed to retrieve order with items and products from database');
    }
  };


  export async function togglePrinted(orderId: string) {
    try {
      // Fetch the current order details
      const order = await db.order.findUnique({
        where: { id: orderId },
      });
  
      if (!order) {
        throw new Error('Order not found');
      }
  
      // Determine the new value of 'printed'
      let newPrintedValue = !order.printed;
      if (order.isPaid && order.status === 'DELIVERED') {
        newPrintedValue = true;
      }
  
      // Update the order with the new 'printed' value
      const updatedOrder = await db.order.update({
        where: { id: orderId },
        data: { printed: newPrintedValue },
      });
  
      return updatedOrder;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error; // Re-throw the error after logging it
    }
  }





