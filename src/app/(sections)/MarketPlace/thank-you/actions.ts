'use server'

import { db } from "@/db";
import { Order } from "@prisma/client";


  // get order by orderId  and userId
  export async function getOrder(orderId: string , userId : string): Promise<Order | null> {
    try {
      const order = await db.order.findUnique({
        where: {
          id: orderId,
          userId,
        },
        include: {
          user: true, // Include the user relation
          orderItems: true // Include the orderItems relation
        },
      });
        return order
        } catch (error) {
          console.log(error)
          return null
        }
      }