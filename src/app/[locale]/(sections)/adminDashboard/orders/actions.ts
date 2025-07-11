'use server'

import { db } from "@/db";


export async function getAllOrders(
  limit: number,
  all : boolean,
  searchQuery?: string,
  filterBy1?: string,
  filterBy2?: string,
) {
  try {
    // Build `where` clause dynamically based on filters
    const where: any = {};

    // Search logic
    if (searchQuery && searchQuery.trim() !== "") {
      where.OR = [
        {
          id: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
        {
          clientName: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
        {
          phoneNumber: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
      ];
    }

    // Filter by Order Status (filterBy1)
    if (filterBy1) {
      switch (filterBy1) {
        case "DELIVERED":
          where.status = "DELIVERED";
          break;
        case "PROCESSING":
          where.status = "PROCESSING";
          break;
        case "REFUSED":
          where.status = "REFUSED";
          break;
        case "CANCELED":
          where.status = "CANCELED";
          break;
        case "CONFIRMED":
          where.type = "CONFIRMED";
          break;
        case "NOT_CONFIRMED":
          where.type = "NOT_CONFIRMED";
          break;
      }
    }

    // Filter by Order Type (filterBy2) (e.g., Paid/Not Paid, Seller Order/Client Order)
    if (filterBy2) {
      switch (filterBy2) {
        case "Paid":
          where.isPaid = true;
          break;
        case "NOT_Paid":
          where.isPaid = false;
          break;
        case "Printed":
          where.printed = true;
          break;
        case "NOT_Printed":
          where.printed = false;
          break;
        case "Sellerorder":
          where.isSellerOrder = true;
          break;
        case "Clientorder":
          where.isClientMadeOrder = true;
          break;
      }
    }

    // Pagination: Use `take` for limiting results

    // Fetch orders based on the constructed filters and pagination
    const orders = await db.order.findMany({
      where,
      include: {
        orderItems: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc", // Sort by creation date
      },
      take : all ? undefined : limit,
    });

    return orders;
  } catch (error) {
    console.error('Error retrieving orders with items and products:', error);
    throw new Error('Failed to retrieve orders with items and products from database');
  }
}




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