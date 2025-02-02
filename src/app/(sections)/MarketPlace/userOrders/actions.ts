'use server'

import { db } from "@/db";



export async function getUserOrders(userId: string) {
  try {
    const orders = await db.order.findMany({
      where: {
        userId: userId,
        isSellerOrder: false,
      },
      include: {
        orderItems: true, // Include order items if you need them
      },
      orderBy : {
        createdAt : "desc"
      }
    });

    // Filter out orders that don't have any order items
    const filteredOrders = orders.filter(order => order.orderItems.length > 0);

    return filteredOrders;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
}




      export async function DeleteOrder(orderId : string) {
        try {
          const updatedOrder = await db.order.update({
            where: { id: orderId },
            data: { 
              type: 'CANCELED',
              status : 'CANCELED'
             },
          });
          console.log('Order canceled:', updatedOrder);
        } catch (error) {
          console.error('Error canceling order:', error);
        }
      }




      export const getItems = async ( orderId : string) => {
        try {
          const items = await db.orderItem.findMany({
            where: { orderId: orderId },
          });
          return items;
        } catch (error) {
          console.error('Error finding item:', error);
          return null
        }
      };