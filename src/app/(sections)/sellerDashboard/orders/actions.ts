'use server'

import { db } from "@/db";


  // get the orders of the store products
export async function getProductsOrdersForStore(storeId : string, userId : string) {
  // Fetch the store based on storeId and userId
  const store = await db.store.findUnique({
    where: { id: storeId, userId: userId },
    include: {
      products: true,
    },
  });

  // Check if the store exists and belongs to the user
  if (!store) {
    throw new Error("Store not found for the given user");
  }

  // Extract product IDs from the store's products
  const productIds = store.products.map(product => product.id);

  // Fetch orders containing any of the store's products
  const orders = await db.order.findMany({
    where: {      
      orderItems: {
        some: {
          productId: {
            in: productIds,
          },
        },
      },
    },
    include: {
      orderItems: true,
    },
  });

  return orders;
}
  
  
  
    export const DeleteOrder = async ( orderId : string) => {
      try {
         await db.order.update({
          where: { id: orderId },
          data : {
            status : 'CANCELED',
            type : 'CANCELED' ,
          }
        });
        return ;
      } catch (error) {
        console.error('Error deleting order:', error);
        throw new Error('Failed to delete order in database');
      }
    };

// get the ordered designs
export async function getStoreDesignOrders(storeId : string) {
  try {
    const orders = await db.orderItem.findMany({
      where: {
        OR: [
          {
            frontsellerDesign: {
              storeId: storeId,
              isDesignForSale: true,
            },
          },
          {
            backsellerDesign: {
              storeId: storeId,
              isDesignForSale: true,
            },
          },
        ],
      },
      include: {
        order: true,
        frontsellerDesign: true,
        backsellerDesign: true,
      },
    });

    const result = orders.map((orderItem) => {

      const frontDesignName =
      orderItem.frontsellerDesign && orderItem.frontsellerDesign.storeId === storeId
        ? orderItem.frontsellerDesign.name
        : "N/A";
    const backDesignName =
      orderItem.backsellerDesign && orderItem.backsellerDesign.storeId === storeId
        ? orderItem.backsellerDesign.name
        : "N/A";

      const frontDesignProfit =
        orderItem.frontsellerDesign && orderItem.frontsellerDesign.storeId === storeId
          ? orderItem.frontsellerDesign.sellerProfit * orderItem.quantity
          : 0;
      const backDesignProfit =
        orderItem.backsellerDesign && orderItem.backsellerDesign.storeId === storeId
          ? orderItem.backsellerDesign.sellerProfit * orderItem.quantity
          : 0;

      return {
        order: orderItem.order,
        quantity : orderItem.quantity,
        frontDesignName,
        backDesignName,
        frontDesignProfit,
        backDesignProfit,
      };
    });

    return result;
  } catch (error) {
    console.error('Error retrieving store design orders:', error);
    throw error; // Rethrow the error after logging it
  }
}


export async function checkProductInStore(orderItemId : string, storeId : string) {
  try {
    // Fetch the order item with its related product
    const orderItem = await db.orderItem.findUnique({
      where: { id: orderItemId },
      include: { product: true },
    });

    // If the order item or product does not exist, return false
    if (!orderItem || !orderItem.product) {
      return false;
    }

    // Check if the product's store ID matches the provided store ID
    if (orderItem.product.storeId === storeId) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error checking product in store:", error);
    return false;
  }
}



