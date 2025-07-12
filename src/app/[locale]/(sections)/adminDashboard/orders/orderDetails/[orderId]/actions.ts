'use server'


import { createAffiliateNotification, getUser } from "@/actions/actions";
import { db } from "@/db";
import { OrderItem, OrderStatus, OrderType } from "@prisma/client";
import { createNotification } from "../../../notifications/action";
import { sendAffiliateProductSoldEmail, sendDesignSoldEmail, sendLevelUpEmail, sendProductSoldEmail } from "@/lib/mailer";
import { getAllReturnedOrders } from "../../../returns/actions";


export const getOrderWithItemsAndProducts = async (orderId: string) => {
  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                store: true
              }
            },
            frontsellerDesign: true,
            backsellerDesign: true,
            frontclientDesign: true,
            backclientDesign: true,
            commission: {
              include: {
                affiliateLink: {
                  include: {
                    affiliate: {
                      include: {
                        user: true
                      }
                    }
                  }
                }
              }
            }
          },
        },
        user: true,
      },
    });

    return order;
  } catch (error) {
    console.error('Error retrieving order with items and products:', error);
    throw new Error('Failed to retrieve order with items and products from database');
  }
};


export const changeStatus = async (orderId: string, status: OrderStatus) => {
  try {
    // Define the data object to update based on status
    let dataToUpdate: any = { status: status };

    // If status is 'DELIVERED', set isPaid to true; otherwise, set it to false
    dataToUpdate.isPaid = status === OrderStatus.DELIVERED;

    // Update the order in the database
    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: dataToUpdate,
    });

    return updatedOrder;
  } catch (error) {
    console.error('Error changing order status:', error);
    throw new Error('Failed to change order status in the database');
  }

};

export const changeType = async (orderId: string, type: OrderType) => {
  try {
    // Update the order status in the database
    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: { type: type },
    });

    return updatedOrder;
  } catch (error) {
    console.error('Error changing order status:', error);
    throw new Error('Failed to change order status in the database');
  }
};



// check total sales and update level
export async function updateStoreLevel(storeId: string) {
  try {
    // Fetch the store by its ID
    const store = await db.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new Error("Store not found");
    }

    // Fetch the highest level
    const highestLevel = await db.level.findFirst({
      orderBy: { levelNumber: 'desc' },
    });

    if (!highestLevel) {
      throw new Error("No levels defined in the system.");
    }

    if (store.level != highestLevel.levelNumber) {
      // Check if the store's total sales meet or exceed the highest level's minSales
      if (store.totalSales >= highestLevel.minSales) {
        // If the store has reached the highest level, enable unlimited creation
        const store = await db.store.update({
          where: { id: storeId },
          data: {
            level: highestLevel.levelNumber,
            unlimitedCreation: true,
          },
          include: { user: true }
        });

        console.log(
          `Store has reached the highest level (${highestLevel.levelNumber}). Unlimited creation enabled.`
        );
        const notificationContent = `Great News: Your Store has reached the highest level (${highestLevel.levelNumber}). Unlimited creation enabled`;

        await createNotification(store.id, notificationContent, "Admin")

        try {
          await sendLevelUpEmail(store.user.email, store.user.name!, store.storeName, highestLevel.levelNumber, true)
        } catch (error) {
          // Log the error, but do not stop the order process
          console.error("Failed to send order email:", error);
        }

        return;
      }
    }


    // Get the next level based on the store's current level
    const nextLevel = await db.level.findFirst({
      where: { levelNumber: store.level + 1 },
    });

    if (!nextLevel) {
      console.log("Store is already at the highest level.");
      return;
    }

    // Check if the store's total sales meet the next level's minSales
    if (store.totalSales >= nextLevel.minSales) {
      // Update the store's level
      const store = await db.store.update({
        where: { id: storeId },
        data: {
          level: nextLevel.levelNumber,
          unlimitedCreation: false, // Keep false for intermediate levels
        },
        include: { user: true }
      });

      console.log(`Store level updated to ${nextLevel.levelNumber}`);
      const notificationContent = `Great News: Your Store have reached level ${nextLevel.levelNumber}`;

      await createNotification(store.id, notificationContent, "Admin")

      try {
        await sendLevelUpEmail(store.user.email, store.user.name!, store.storeName, nextLevel.levelNumber, false)
      } catch (error) {
        // Log the error, but do not stop the order process
        console.error("Failed to send order email:", error);
      }

    } else {
      console.log("Store has not reached the next level sales threshold.");
    }
  } catch (error) {
    console.error("Error updating store level:", error);
    throw new Error("Failed to update store level");
  }
}



export async function calculateTotalSellerProfitForProducts(orderId: string) {
  try {
    // Fetch the order with its items and related products
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                store: true,
              },
            },
            commission: {
              include: {
                affiliateLink: {
                  include: {
                    affiliate: {
                      include: {
                        user: true
                      }
                    }
                  }
                }
              }
            }, // Include commission to check for affiliate commissions
          },
        },
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    // Initialize total profit for the order
    let totalOrderProfit = 0;
    let totalAffiliateProfit = 0; // Initialize total affiliate profit

    // Calculate total seller profit for each product in each order item
    const orderItemProfits = order.orderItems.map(item => {
      let totalProfit = 0;
      let affiliateProfit = 0;

      if (item.product) {
        totalProfit = item.product.sellerProfit * item.quantity;
        totalOrderProfit += totalProfit;

        // Check if the item has an associated affiliate commission
        if (item.commission) {
          affiliateProfit = item.commission.profit;
          totalAffiliateProfit += affiliateProfit;
        }

        return {
          productId: item.productId,
          storeName: item.product.store?.storeName ?? 'Unknown Store',
          productQuantity: item.quantity,
          productTitle: item.productTitle,
          totalProfit,
          affiliateProfit,
          affiliateUser: item.commission?.affiliateLink.affiliate.user.email
        };
      } else {
        return {
          productId: null,
          storeName: 'Not found',
          productQuantity: item.quantity,
          productTitle: 'Product not found',
          totalProfit: 0,
          affiliateProfit: 0,
          affiliateUser: "No affiliate user",
        };
      }
    });

    // Return the result including the total order profit and total affiliate profit
    return {
      orderId,
      orderItemProfits,
      totalOrderProfit,
      totalAffiliateProfit, // Include total affiliate profit in the result
    };
  } catch (error) {
    console.error('Error calculating total seller profit:', error);
    throw error;
  }
}


// update for products
export async function updateRevenueAndSalesForProducts(orderId: string, platformProfit: number, totalIncome: number) {
  try {
    // Fetch the order with its items and related products
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                store: true, // Include store information for each product
              },
            },
            commission: true
          },
        },
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    // Step 1: Handle commissions for each order item

    for (const orderItem of order.orderItems) {
      if (orderItem.commission) {
        // Fetch the affiliate link related to this order item
        const affiliateLink = await db.affiliateLink.findUnique({
          where: { id: orderItem.commission.affiliateLinkId },
          include: { affiliate: true }, // Include the affiliate relation to access totalIncome
        });

        if (affiliateLink) {
          // Update total sales for the affiliate link
          await db.affiliateLink.update({
            where: { id: affiliateLink.id },
            data: {
              totalSales: { increment: 1 }, // Increment total sales
            },
          });

          // Update total income for the affiliate
          const affiliate = await db.affiliate.update({
            where: { id: affiliateLink.affiliateId }, // Ensure this field exists in your AffiliateLink
            data: {
              totalIncome: { increment: orderItem.commission.profit }, // Increment total income
            },
            include: {
              user: true
            }
          });

          const product = await db.product.findFirst({
            where: { id: affiliateLink.productId },
          });

          if (product) {
            const notificationContent = `Great News: Your affiliate product "${product.title}" has been sold`;
            await createAffiliateNotification(affiliateLink.affiliateId, notificationContent, 'Admin');
            // send email
            try {
              await sendAffiliateProductSoldEmail(affiliate.user.email, affiliate.user.name, product.title, orderItem.commission.profit)
            } catch (error) {
              // Log the error, but do not stop the order process
              console.error("Failed to send order email:", error);
            }
          }
        }
      }
    }



    // Filter out order items with null productId
    const validOrderItems = order.orderItems.filter((item) => item.productId !== null);

    // Update each product's revenue and increment total sales
    const updatePromises = validOrderItems.map(async (item) => {
      if (!item.product) {
        return
      }

      const newRevenue = item.product.sellerProfit * item.quantity;

      // Update product's revenue and total sales
      await db.product.update({
        where: { id: item.productId! },
        data: {
          revenue: { increment: newRevenue },
          totalSales: { increment: 1 },
        },
      });

      await checkAndSetTopSales(item.productId!)



      // Update store's revenue and total sales
      if (item.product.store) {
        const store = await db.store.update({
          where: { id: item.product.store.id },
          data: {
            revenue: { increment: newRevenue },
            totalSales: { increment: 1 },
          },
          include: {
            user: true
          }
        });
        const notificationContent = `Great News: Your product "${item.product.title}" has been sold`;

        await createNotification(item.product.store.id, notificationContent, "Admin")

        // to do send email 
        try {
          await sendProductSoldEmail(store.user.email, store.user.name, store.storeName, item.product.title, newRevenue)
        } catch (error) {
          // Log the error, but do not stop the order process
          console.error("Failed to send order email:", error);
        }

        await updateStoreLevel(store.id)

      } else {
        throw new Error(`Store not found for product ${item.product.id}`);
      }
    });

    // Wait for all updates to complete
    await Promise.all(updatePromises);




    // Mark order as updated
    await db.order.update({
      where: { id: order.id },
      data: {
        updated: true,
      },
    });


    // Update platform profit
    const user = await getUser(); // Assuming this function gets the current user
    if (user) {
      await db.platform.update({
        where: { userId: user.id },
        data: {
          profit: { increment: platformProfit },
          totalIncome: { increment: totalIncome }
        },
      });
    } else {
      throw new Error('admin not found');
    }

    return {
      message: 'Product revenue and total sales updated successfully.',
    };
  } catch (error) {
    console.error('Error updating product revenue and total sales:', error);
    throw error;
  }
}





// profit for designs
export async function calculateTotalSellerProfitForDesigns(orderId: string) {
  try {
    // Fetch the order with its items and related designs
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            frontsellerDesign: {
              include: {
                store: true
              }
            },
            backsellerDesign: {
              include: {
                store: true
              }
            },
            frontclientDesign: true,
            backclientDesign: true,
          }
        }
      }
    });

    if (!order) {
      throw new Error('Order not found');
    }

    // Initialize total profit for the order
    let totalOrderProfit = 0;

    // Calculate total seller profit for each design in each order item
    const orderItemProfits = order.orderItems.flatMap(item => {
      const profits = [];
      let designId = ''
      let designName = ''
      // Calculate profit for front designs
      if (item.frontsellerDesign) {
        designId = item.frontsellerDesign.id
        designName = item.frontsellerDesign.name
        const frontProfit = item.frontsellerDesign.sellerProfit * item.quantity;
        totalOrderProfit += frontProfit;
        profits.push({
          store: item.frontsellerDesign.store!.storeName,
          designId,
          designName,
          designType: 'front seller Design',
          productQuantity: item.quantity,
          totalProfit: frontProfit
        });
      }

      if (item.frontclientDesign) {
        designId = item.frontclientDesign.id
        designName = item.frontclientDesign.name ?? "client design"
        profits.push({
          store: "No store",
          designId,
          designName,
          designType: 'front client Design',
          productQuantity: item.quantity,
          totalProfit: 0
        });
      }

      // Calculate profit for back designs
      if (item.backsellerDesign) {
        designId = item.backsellerDesign.id
        designName = item.backsellerDesign.name
        const backProfit = item.backsellerDesign.sellerProfit * item.quantity;
        totalOrderProfit += backProfit;
        profits.push({
          store: item.backsellerDesign.store!.storeName,
          designId,
          designName,
          designType: 'back seller Design',
          productQuantity: item.quantity,
          totalProfit: backProfit
        });
      }

      if (item.backclientDesign) {
        designId = item.backclientDesign.id
        designName = item.backclientDesign.name ?? "client design"
        profits.push({
          store: "No store",
          designId,
          designName,
          designType: 'back client Design',
          productQuantity: item.quantity,
          totalProfit: 0
        });
      }

      return profits;
    });

    // Return the result including the total order profit
    return {
      orderId,
      orderItemProfits,
      totalOrderProfit
    };
  } catch (error) {
    console.error('Error calculating total seller profit:', error);
    throw error;
  }
}

// Update revenue and sales for seller designs and their respective stores
export async function updateRevenueAndSalesForDesigns(orderId: string, platformProfit: number, totalIncome: number) {
  try {
    // Fetch the order with its items and related products
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            frontsellerDesign: true, // Include front seller design
            backsellerDesign: true,  // Include back seller design
          },
        },
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    // Prepare to update both front and back seller designs
    const updatePromises = [];

    // Function to update revenue and sales for a design and its store
    const updateDesignAndStore = async (designId: string, quantity: number) => {
      const design = await db.sellerDesign.findUnique({
        where: { id: designId },
        include: {
          store: true,
        },
      });

      if (!design) {
        throw new Error(`Seller Design with id ${designId} not found`);
      }

      const newRevenue = design.sellerProfit * quantity;

      // Update design's revenue and total sales
      await db.sellerDesign.update({
        where: { id: designId },
        data: {
          revenue: { increment: newRevenue },
          totalSales: { increment: 1 },
        },
      });

      // Update store's revenue and total sales
      if (design.store) {
        const store = await db.store.update({
          where: { id: design.store.id },
          data: {
            revenue: { increment: newRevenue },
            totalSales: { increment: 1 },
          },
          include: {
            user: true
          }
        });
        const notificationContent = `Great News: Your Design "${design.name}" has been sold`;

        await createNotification(design.store.id, notificationContent, "Admin")

        // to do send email 
        try {
          await sendDesignSoldEmail(store.user.email, store.user.name, store.storeName, design.name, newRevenue)
        } catch (error) {
          // Log the error, but do not stop the order process
          console.error("Failed to send order email:", error);
        }

      } else {
        throw new Error(`Store not found for seller design ${designId}`);
      }
    };

    // Iterate through order items and update seller designs
    for (const item of order.orderItems) {
      if (item.frontsellerDesignId) {
        updatePromises.push(updateDesignAndStore(item.frontsellerDesignId, item.quantity));
      }
      if (item.backsellerDesignId) {
        updatePromises.push(updateDesignAndStore(item.backsellerDesignId, item.quantity));
      }
    }

    // Wait for all updates to complete
    await Promise.all(updatePromises);

    // Mark order as updated
    await db.order.update({
      where: { id: order.id },
      data: {
        updated: true,
      },
    });

    // Update platform profit
    const user = await getUser(); // Assuming this function gets the current user
    if (user) {
      await db.platform.update({
        where: { userId: user.id },
        data: {
          profit: { increment: platformProfit },
          totalIncome: { increment: totalIncome }
        },
      });
    } else {
      throw new Error('User not found');
    }

    return {
      message: 'Seller design revenue and total sales updated successfully.',
    };
  } catch (error) {
    console.error('Error updating seller design revenue and total sales:', error);
    throw error;
  }
}




async function checkAndSetTopSales(productId: string) {
  try {
    // Find the product by ID
    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Check if total sales are equal to or greater than 20
    if (product.totalSales >= 10) {
      // Update the product to set topSales to true
      await db.product.update({
        where: { id: productId },
        data: { topSales: true },
      });
      console.log(`Product ${productId} is now marked as topSales`);
    } else {
      console.log(`Product ${productId} does not meet the sales threshold`);
    }
  } catch (error) {
    console.error('Error checking and setting topSales:', error);
  }
}


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
          return { match: true, orderId: order.id }; // Found a match
        }
      }
    }

    return { match: false, orderId: null }; // Found a match
  } catch (error) {
    console.error('Error checking for matching order item:', error);
    throw new Error('Failed to check for matching order items');
  }
}
