'use server'

import { auth } from "@/auth";
import { db } from "@/db"
import { Order, OrderItem, Product, SellerDesign, Store, UserType } from "@prisma/client";

export async function createPlatform(userId:string) {

  await db.platform.create({
    data:{
      userId : userId
    }
  })
}

  // get the auth user
export async function getUser() {
  try {
      const session = await auth()
      if(!session) return null
      const user = await db.user.findUnique({
        where:{ id : session.user.id}
      })
      return user
  } catch (error) {
    console.log(error)    
  }
  
}








// get user by type 




// get the categories
export async function getAllCategories() {
  try {
    const categories = await db.category.findMany({
      include: {
        colors: true,
        sizes: true,
        frontBorders: true,
        backBorders: true,
      },
    })
    return categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error;
  }
}

// returns an array of all the available categories 

export async function getAllProductsCategories() {
  try {
    const categories = await db.product.findMany({
      where : {isProductAccepted : true , disableCategory : false , privateProduct : false},
      select: {
        category: true,
      },
      distinct: ['category']
    });
    return categories.map(product => product.category);
  } catch (error) {
    console.error("Error retrieving categories:", error);
    throw error;
  }
}

// returns an array of all the available collections 

export async function getAllProductCollectionNames(): Promise<string[]> {
  try {
    // Fetch unique collection names from accepted public products
    const productsWithCollections = await db.product.findMany({
      where: {
        isProductAccepted: true,
        privateProduct: false,
        disableCategory : false,
      },
      include: {
        collection : true
      }
    });

    // Extract unique collection names
    const uniqueCollectionNames = [
      ...new Set(
        productsWithCollections
          .map((product) => product.collection?.name)
          .filter((name): name is string => !!name) // Filter out `null` or `undefined` values
      ),
    ];

    return uniqueCollectionNames;
  } catch (error) {
    console.error("Error retrieving collection names:", error);
    throw new Error("Failed to retrieve collection names.");
  }
}



// get categorie by id
export async function getCategorieById(catId : string) {
  try {
    const categorie = await db.category.findUnique({
      where: { id: catId },
      include: {
        colors: true,
        sizes: true,
        frontBorders: true,
        backBorders: true,
      },
    })
    return categorie
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}


// get seller Store by userId
export async function getStoreByUserId(userId : string) {
  try {
    const store = await db.store.findUnique({
      where: {
        userId: userId
      },
      include: {
        products: true,
        designs: true,
      },
    });

    if (!store) {
      throw new Error('Store not found for the given userId');
    }

    return store;
  } catch (error) {
    console.error('Error fetching store:', error);
    throw error;
  }
}

export async function getStore(userId : string) {
  try {
    const store = await db.store.findUnique({
      where: {
        userId: userId
      },
    });

    if (!store) {
      throw new Error('Store not found for the given userId');
    }

    return store;
  } catch (error) {
    console.error('Error fetching store:', error);
    throw error;
  }
}


export async function fetchOrdersByStoreId(storeId: string) {

  try {
    // Step 1: Fetch orders with order items related to products of the store
    const orders = await db.order.findMany({
      where: {
        orderItems: {
          some: {
            product: {
              storeId: storeId,
            },
          },
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return orders;
  } catch (error) {
    console.log(error)
  }
}




// Helper function to check if the design of an item exists in the store
async function checkDesignInStore(orderItemId: string, storeId: string) {
  try {
    // Fetch the order item with its related designs
    const orderItem = await db.orderItem.findUnique({
      where: { id: orderItemId },
      include: {
        frontsellerDesign: true,
        backsellerDesign: true,
      },
    });

    // If the order item or designs do not exist, return false
    if (!orderItem || (!orderItem.frontsellerDesign && !orderItem.backsellerDesign)) {
      return false;
    }

    // Check if the design's store ID matches the provided store ID
    if ((orderItem.frontsellerDesign && orderItem.frontsellerDesign.storeId === storeId) ||
        (orderItem.backsellerDesign && orderItem.backsellerDesign.storeId === storeId)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error checking design in store:", error);
    return false;
  }
}




// get the orders of the store products
interface Orderwithitems extends Order {
  orderItems: OrderItemwithdesigns[];
}
interface OrderItemwithdesigns extends OrderItem {
  frontDesignName?: string | null;
  backDesignName?: string | null;
}
export async function getDesignsOrdersForStore(storeId: string, userId: string) {

  // Fetch the store based on storeId and userId
  const store = await db.store.findUnique({
    where: {  id: storeId, userId: userId  },
    include: {
      designs: true,
    },
  });

  // Check if the store exists and belongs to the user
  if (!store) {
    throw new Error("Store not found for the given user");
  }

  // Extract design IDs from the store's designs
  const designIds = store.designs.map(design => design.id);

  // Fetch orders containing any of the store's designs
  const orders = await db.order.findMany({
    where: {
      orderItems: {
        some: {
          OR: [
            {
              frontsellerDesignId: {
                in: designIds,
              },
            },
            {
              backsellerDesignId: {
                in: designIds,
              },
            }
          ]
        },
      },
    },
    include: {
      orderItems: {
        include: {
          frontsellerDesign: true,
          backsellerDesign: true,
        },
      },
    },
  });

  // Filter and format orders
  const filteredOrders = await Promise.all(orders.map(async order => {
    const filteredOrderItems = await Promise.all(order.orderItems.map(async item => {
      const isFrontDesignInStore = item.frontsellerDesignId ? await checkDesignInStore(item.id, storeId) : false;
      const isBackDesignInStore = item.backsellerDesignId ? await checkDesignInStore(item.id, storeId) : false;

      if (isFrontDesignInStore && item.frontsellerDesign?.isDesignForSale) {
        return {
          ...item,
          frontDesignName: item.frontsellerDesign.name,
          backDesignName: item.backsellerDesign ? item.backsellerDesign.name : null,
        };
      } else if (isBackDesignInStore && item.backsellerDesign?.isDesignForSale) {
        return {
          ...item,
          frontDesignName: item.frontsellerDesign ? item.frontsellerDesign.name : null,
          backDesignName: item.backsellerDesign.name,
        };
      } else {
        return null;
      }
    }));

    return {
      ...order,
      orderItems: filteredOrderItems.filter(item => item !== null),
    };
  }));

  return filteredOrders.filter(order => order.orderItems.length > 0) as Orderwithitems[];
}





// get the orders of the store design
export async function getDesignOrders(storeId: string, userId: string) {
  const store = await db.store.findUnique({
    where: { id: storeId },
  });

  if (!store) {
    throw new Error("Store not found");
  }

  const orders = await db.order.findMany({
    where: {
      userId: userId,
      orderItems: {
        some: {
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
      },
    },
    include: {
      orderItems: {
        include: {
          frontsellerDesign: true,
          backsellerDesign: true,
        },
      },
    },
  });

  return orders;
}





// get the deisgns that were ordered
interface OrderedDesign extends SellerDesign {
  orderCount: number;
  totalOrderedQuantity: number; // New field for total ordered quantity

}
export async function getOrderedDesignsByStoreId(storeId: string): Promise<OrderedDesign[]> {
  try {
    // Find all distinct designs from the specified store that have valid orders
    const orderedDesigns = await db.sellerDesign.findMany({
      where: {
        storeId: storeId,
        isDesignForSale: true,
        OR: [
          { frontOrders: { some: {
            order: {
              status: {
                not: 'CANCELED'
              },
              type: {
                not: 'CANCELED'
              }
            }
          } } },
          { backOrders: { some: {
            order: {
              status: {
                not: 'CANCELED'
              },
              type: {
                not: 'CANCELED'
              }
            }
          } } } 
        ]
      },
      include: {
        frontOrders: {
          include: {
            order: true
          }
        },
        backOrders: {
          include: {
            order: true
          }
        }
      }
    });

    // Calculate the order count for each design
    const designsWithOrderCount = orderedDesigns.map(design => {
      // Filter orders to exclude those with CANCELED status or type
      const validFrontOrders = design.frontOrders.filter(orderItem =>
        orderItem.order.status !== 'CANCELED' && orderItem.order.type !== 'CANCELED'
      );

      const validBackOrders = design.backOrders.filter(orderItem =>
        orderItem.order.status !== 'CANCELED' && orderItem.order.type !== 'CANCELED'
      );

      // Calculate total ordered quantity for the product
      const totalFrontOrderedQuantity = validFrontOrders.reduce((total, orderItem) => {
        return total + orderItem.quantity; // Accumulate quantity from each order item
      }, 0);

       // Calculate total ordered quantity for the product
       const totalBackOrderedQuantity = validBackOrders.reduce((total, orderItem) => {
        return total + orderItem.quantity; // Accumulate quantity from each order item
      }, 0);


      return {
        ...design,
        orderCount: validFrontOrders.length + validBackOrders.length, // Count the number of valid orders for the design
        totalOrderedQuantity: totalFrontOrderedQuantity + totalBackOrderedQuantity // Count the number of valid orders for the design

      };
    });

    return designsWithOrderCount;
  } catch (error) {
    console.error('Error fetching ordered designs for store:', error);
    throw error; // Handle or rethrow as needed
  }
}




// get the products that were ordered
interface OrderedProduct extends Product {
  orderCount: number;
  totalOrderedQuantity: number; // New field for total ordered quantity
}
export async function getOrderedProductsByStoreId(storeId: string): Promise<OrderedProduct[]> {
  try {
    // Find all distinct products from the specified store that have valid orders
    const orderedProducts = await db.product.findMany({
      where: {
        storeId: storeId,
        order: {
          some: {
            order: {
              status: {
                not: 'CANCELED'
              },
              type: {
                not: 'CANCELED'
              }
            }
          }
        }
      },
      include: {
        order: {
          include: {
            order: true // Include related orders
          }
        }
      }
    });

    // Calculate the order count for each product
    const productsWithOrderCount = orderedProducts.map(product => {
      // Filter orders to exclude those with CANCELED status or type
      const validOrders = product.order.filter(orderItem => 
        orderItem.order.status !== 'CANCELED' && orderItem.order.type !== 'CANCELED'
      );

      // Calculate total ordered quantity for the product
      const totalOrderedQuantity = validOrders.reduce((total, orderItem) => {
        return total + orderItem.quantity; // Accumulate quantity from each order item
      }, 0);

      return {
        ...product,
        orderCount: validOrders.length,
        totalOrderedQuantity: totalOrderedQuantity
      };
      });

    return productsWithOrderCount;
  } catch (error) {
    console.error('Error fetching ordered products for store:', error);
    throw error; // Handle or rethrow as needed
  }
}


// get all orders 
export async function getAllOrder(){
  try {
    const order = await db.order.findMany({
      include: {
        user: true, // Include the user relation
        orderItems: true // Include the orderItems relation
      },
      take:20,
      orderBy : {
        createdAt : "desc"
      }
    });
      return order
      } catch (error) {
        console.log(error)
        return null
      }
    }

  // get order by orderId 
  export async function getOrder(orderId: string): Promise<Order | null> {
    try {
      const order = await db.order.findUnique({
        where: {
          id: orderId,
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


// return the products of the given ids
export async function getProductsByIds(productIds : string[]) {
  try {
    // Fetch products where the id is in the list of productIds
    const products = await db.product.findMany({
      where: {
        id: {
          in: productIds
        }
      },
      include : {
        store : true
      }
    });

    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}


export async function getAllProductsLength() {
  try {
    const count = await db.product.count({
      where: { isProductAccepted: true, privateProduct: false , disableCategory : false,
 },
    });
    return count ;
  } catch (error) {
    console.error(error);
    return 0
  }
}


// fetch Products for marketplace

export async function fetchProducts(
  page: number,
  limit: number,
  sortBy?: string,
  filterByCategory?: string,
  filterByCollection?: string,
  priceRange?: [number, number]
) {
  const offset = Math.max((page - 1) * limit, 0); // Ensure non-negative offset
  
  // Map supported sort options to Prisma `orderBy` format
  const sortOptions: Record<string, object> = {
    high: { price: 'desc' }, // Sort by highest price
    low: { price: 'asc' },  // Sort by lowest price
    sales: { totalSales: 'desc' }, // Sort by most sold
  };

  // Fallback to default sorting if `sortBy` is invalid or not provided
  const orderBy = sortOptions[sortBy!] || { totalViews: 'desc' };

  // Construct `where` filter object dynamically based on the filters provided
  const where: any = {
    isProductAccepted: true,
    privateProduct: false,
    disableCategory : false,
    ...(filterByCategory && { category: filterByCategory }), // Filter by category
    ...(filterByCollection && { collectionName: filterByCollection }), // Filter by collection
    ...(priceRange && priceRange[0] !== 0 && priceRange[1] !== 0 && { price: { gte: priceRange[0], lte: priceRange[1] } }), // Filter by price range, avoid invalid range [0, 0]
  };

  const products = await db.product.findMany({
    where, // Apply dynamic filters
    orderBy, // Dynamically apply sorting
    include: {
      store: true,
    },
    skip: offset,
    take: limit,
  });

  const totalCount = await db.product.count({
    where, // Apply the same filters for counting
  });

  return { products, totalCount };
}


export async function fetchPriceRanges(): Promise<[number, number][]> {
  // Fetch all product prices from the database
  const products = await db.product.findMany({
    where: {
      isProductAccepted: true,
      privateProduct: false,
      disableCategory:false,
    },
    select: {
      price: true, // Only fetch the price field
    },
  });

  // Calculate and return price ranges
  return await calculatePriceRanges(products);
}

interface ProductPrice {
  price: number;
}
export async function calculatePriceRanges(products: ProductPrice[]): Promise<[number, number][]> {
  if (products.length === 0) return [];

  const prices = products.map(product => product.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = maxPrice - minPrice;

  // If all prices are the same, return a single range
  if (range === 0) return [[minPrice, maxPrice]];

  // Determine the number of ranges based on the price distribution
  const numberOfRanges = range < 5 ? 1 : 3; // Use 1 range for small price ranges, otherwise 3

  const step = Math.ceil(range / numberOfRanges);

  const priceRanges: [number, number][] = [];

  for (let i = 0; i < numberOfRanges; i++) {
    const start = minPrice + i * step;
    const end = i === numberOfRanges - 1 ? maxPrice : start + step - 1;
    priceRanges.push([start, end]);
  }

  return priceRanges;
}




export async function fetchTrendingProducts() {
  try {
    const trendingProducts = await db.product.findMany({
      where: {
        isProductAccepted : true,
         privateProduct : false,
         disableCategory : false
      },
      include : {
        store : true
      },
      orderBy: {
        totalViews: 'desc',
      },
      take: 4,
    });

    return trendingProducts;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getFollowedStoreProductsFirst = async (
  userId: string,
) => {

  const followedStores = await db.storeFollow.findMany({
      where: { userId },
      select: { storeId: true },
    });

  const storeIds = followedStores.map((follow) => follow.storeId);

  
  // Fetch new products from followed stores first
  const followedStoreProducts = await db.product.findMany({
    where:{storeId: { in: storeIds },
    isProductAccepted: true,disableCategory : false,
    privateProduct: false,},
    include : {
      store : true
    },
    orderBy : {
      totalViews : 'desc'
    },
    take : 4
  });
  
  return  followedStoreProducts 

};






  export async function fetchBestSellingProducts() {
    try {  
      // Batch update topSales in a single query
      await db.product.updateMany({
        where: {
          isProductAccepted: true,
          privateProduct: false,
          disableCategory : false,
          totalSales: { gt: 9 },
          topSales : false,
        },
        data: { topSales: true },
      });
  
      // Fetch updated best-selling products with pagination
      const bestSellingProducts = await db.product.findMany({
        where: { topSales: true, isProductAccepted: true, privateProduct: false , disableCategory : false },
        include: {
          store: true
        },
        orderBy: {
          totalSales: 'desc',
        },
        take: 4,
      });
  
  
      return bestSellingProducts;
    } catch (error) {
      console.error('Error fetching products:', error);
      return []
    }
  }


  // fetch products group by collection
  interface Productswithstore extends Product {
    store : Store
  } 
  export async function getProductsGroupedByCollection() {
    try {
      // Fetch collections and their top 4 products
      const collections = await db.product.findMany({
        where: { isProductAccepted: true, privateProduct: false , disableCategory : false },
        select: {
          collectionName: true,
        },
        distinct: ['collectionName'], // Select distinct collection names
      });
  
      // Initialize the result object to store the final groups
      const groupedByCollection: Record<string, Productswithstore[]> = {}; // Use Product type here
  
      // For each collection, fetch the top 4 products
      for (const collection of collections) {
        const products = await db.product.findMany({
          where: { 
            collectionName: collection.collectionName, 
            isProductAccepted: true, 
            privateProduct: false,
            disableCategory : false,

          },
          orderBy: { totalViews: 'desc' },
          take: 4, // Limit to 4 products per collection
          include: { store: true }, // Include store data if needed
        });
  
        // Store the products in the result object
        groupedByCollection[collection.collectionName] = products;
      }
  
      return groupedByCollection;
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }


  // for the new released products
 export async function fetchNewProducts() {
    try {
      const products = await db.product.findMany({
        where : {isProductAccepted : true , NewProduct : true , privateProduct : false , disableCategory : false },
        orderBy: {
          createdAt: 'desc'
        },
        include : {
          store : true
        },
        take : 4
      });

      const oneWeekInMillis = 7 * 24 * 60 * 60 * 1000; // One week in milliseconds
      const currentDate = new Date();

      const count = await db.product.count({
        where: {
          NewProduct: true,
          isProductAccepted: true,
          privateProduct: false,
          disableCategory : false,
          createdAt: {
            lt: new Date(currentDate.getTime() - oneWeekInMillis), // Filter by created date older than one week
          },
        },
      });

      if(count> 0) {
        await updateNewProductStatus()
      }

      

  
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  // helper function : Manage new added products : 
  export async function updateNewProductStatus(): Promise<void> {
    const oneWeekInMillis = 7 * 24 * 60 * 60 * 1000; // One week in milliseconds
    const currentDate = new Date();
  
    // Update all products that are marked as NewProduct and older than a week in one query
    await db.product.updateMany({
      where: {
        NewProduct: true,
        isProductAccepted: true,
        privateProduct: false,
        disableCategory : false,
        createdAt: {
          lt: new Date(currentDate.getTime() - oneWeekInMillis), // Filter by created date older than one week
        },
      },
      data: {
        NewProduct: false, // Set NewProduct to false for all matching products
      },
    });
  }
  


// fetch Discount Products Deals
export async function fetchDiscountProductsDeals() {
  try {
    const products = await db.product.findMany({
      where : {isProductAccepted : true  , privateProduct : false, isDiscountEnabled : true , disableCategory : false},
      orderBy: {
        totalViews: 'desc'
      },
      include : {
        store : true
      },
      take : 4
    });



    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return null;
  }
}

































        // fav list functions

// check if a product exists in a user fav list
export async function checkProductInFavList(productId: string, userId: string) {
  try {
    // Find the user's favorite list including products
    const favList = await db.favList.findUnique({
      where: {
        userId: userId,
      },
      include: {
        products: true,
      },
    });

    if (!favList || !favList.products) {
      // If the favorite list doesn't exist or it has no products, the product can't be in it
      return false;
    }

    // Check if the product exists in the favorite list items
    const isProductInFavList = favList.products.some(product => product.id === productId);

    return isProductInFavList;
  } catch (error) {
    console.error("Error checking product in favList:", error);
    throw error; // Propagate the error for handling elsewhere
  }
}


  // add product to a user fav list :
  export async function addProductToFavList(productId: string, userId: string): Promise<boolean | null> {
    try {
      // Upsert favorite list in one step
      const favList = await db.favList.upsert({
        where: { userId },
        create: { userId },
        update: {}, // No updates needed for existing records
      });
  
      if (!favList) {
        return false;
      }
  
      // Add product to the user's favorite list
      const result = await db.favList.update({
        where: { id: favList.id },
        data: {
          products: {
            connect: { id: productId }, // Connect product directly
          },
        },
      });
  
      return !!result;
    } catch (error) {
      console.error("Error adding product to favList:", error);
      return null;
    }
  }
  


  // remove product from user's fav list
  export async function removeProductFromFavList(productId: string, userId: string): Promise<boolean| null> {
    try {
      // Directly attempt to disconnect the product from the user's favorite list
      const result = await db.favList.update({
        where: { userId },
        data: {
          products: {
            disconnect: { id: productId },
          },
        },
      });
  
      // If no error is thrown, assume success
      return !!result;
    } catch (error) {
      console.error("Error removing product from favList:", error);
      return null
    }
  }
  










        // cart functions

// check if a product exists in a user cart :
export async function checkProductInCart(productId: string , userId: string): Promise<boolean> {
  try {
    // Find the user's cart and include selectedProducts
    const userCart = await db.cart.findUnique({
      where: { userId: userId },
      include: { selectedProducts: true },
    });

    // If user has no cart or cart is empty, return false
    if (!userCart || userCart.selectedProducts.length === 0) {
      return false;
    }

    // Check if the product exists in the user's cart
    const existingProduct = userCart.selectedProducts.some(product => product.productId === productId);

    return existingProduct;

  } catch (error) {
    console.error('Error checking product in cart:', error);
    throw error; // Throw error for the caller to handle
  }
}


// add product to a user cart : 
export async function addProductToCart( 
  productId: string ,
  userId: string,
  price:number,
  category:string,
  size : string,
  color : string,
  quantity : number,
  productImgs : string[]


): Promise<boolean | null> {
  try {

    // Create or find user's cart
    let userCart = await db.cart.findUnique({
      where: { userId: userId },
    });

    if (!userCart) {
      userCart = await db.cart.create({
        data: {
          userId: userId,
        },
      });
    }

    const user = await db.user.findUnique({
      where: { id: userId } , 
      include : {
        cart : {
          include : {
            selectedProducts : true
          }
        }
      }
    })
    

    // Check if product with productId already exists in the cart
    const existingCartProduct = user?.cart?.selectedProducts.find(
      (product) => (product.productId === productId && product.category === category
        && product.size === size && product.color === color
        && product.quantity === quantity
        && product.price === price
      )
    );

    if(existingCartProduct) return false


    // Add product to the cart
    await db.cartProduct.create({
      data: {
        productId: productId,
        cartId: userCart.id,
        price:price,
        quantity:quantity,
        color:color,
        size:size,
        category:category,
        productImg: productImgs,
      },
    });

    return true; // Successfully added product to cart
  } catch (error) {
    console.error(`Error adding product to cart for user ${userId}:`, error);
    return null; // Handle error as per your application's needs
  }
}



// get user cart products count : 
export async function fetchCartProductCount(userId: string) {
  try {
    // Find the user and include only the cart and its selectedProducts to count them
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        cart: {
          include : {
            selectedProducts : true
          }
        },
      },
    });

    // Return 0 if the user or their cart is not found
    if (!user || !user.cart) {
      return 0;
    }

    // Count the number of selected products in the cart
    const cartProductCount = user.cart.selectedProducts.length;

    return cartProductCount;
  } catch (error) {
    console.error('Error fetching cart product count:', error);
    throw error;
  }
}


// get user orders : 
export async function getUserOrders(userId: string) {
  try {
    const orders = await db.order.findMany({
      where: {
        userId: userId,
        isSellerOrder: false,
        status: {
          not: "CANCELED", // Adjust based on the actual status value for canceled orders
        },
      },
      include: {
        orderItems: true, // Include order items if you need them
      },
    });

    // Filter out orders that don't have any order items
    const filteredOrders = orders.filter(order => order.orderItems.length > 0);

    return filteredOrders;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
}




//return unreded notififcations for a store
export async function getUnreadNotificationsForStore(storeId : string) {
  try {
    const unreadNotifications = await db.notification.findMany({
      where: {
        storeId: storeId,
        isViewed: false,
      },
      orderBy : {
        createdAt : 'desc'
      }
    });

    return unreadNotifications;
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    throw error;
  }
}



//get the platform model
export async function getPlatformForTheWebsite() {
  try {
    

  const platform = await db.platform.findFirst({
  })
  return platform

} catch (error) {
  console.log(error)
    
}

}

// get the count infos for the admin dashboard :
export async function getTotalCounts() {
  const [
    userCount, 
    productCount, 
    storeCount, 
    sellerDesignCount , 
    awaitingActionProductCount,
    awaitingActionDesignCount,
  ] = await Promise.all([
    db.user.count(),
    db.product.count(),
    db.store.count(),
    db.sellerDesign.count({
      where: {isDesignForSale : true}
    }),
    db.product.count({
      where : {isProductAccepted : false , isProductRefused : false}
    }),
    db.sellerDesign.count({
      where : {isDesignAccepted : false , isDesignRefused : false , isDesignForSale : true} 
    })

  ])
  return {
    userCount,
    productCount,
    storeCount,
    sellerDesignCount,
    awaitingActionProductCount,
    awaitingActionDesignCount
  };
}

// get the count infos for the admin dashboard side bar :
export async function getSideBarTotalCounts() {
  const [
    printedOrdersCount,
    awaitingActionProductCount,
    awaitingActionDesignCount,
    storeRequestsCount,
    affiliateRequestsCount,
    returnedOrders,
  ] = await Promise.all([
    db.order.count({
      where : {printed : true , type : "CONFIRMED" , status: "PROCESSING"}
    }),


    db.product.count({
      where : {isProductAccepted : false , isProductRefused : false}
    }),


    db.sellerDesign.count({
      where : {isDesignAccepted : false , isDesignRefused : false , isDesignForSale : true} 
    }),

    db.paymentRequest.count({
      where : { status : "PENDING"}
    }),

    db.affiliatePaymentRequest.count({
      where : { status : "PENDING"}
    }),

    db.order.count({
      where : {printed : true , type : "CONFIRMED" , status : "CANCELED" , isPaid : false}
    }),

  ])


  return {
    printedOrdersCount,
    awaitingActionProductCount,
    awaitingActionDesignCount,
    storeRequestsCount,
    affiliateRequestsCount,
    returnedOrders,

  };
}


// get the count for factory dashboard
export async function getFactoryDashboardCounts() {
  const [confirmedOrdersCount, deliveredOrdersCount, canceledOrdersCount , totalOrdersCount , notPrintedOrders] = await Promise.all([
    db.order.count({where : { type : "CONFIRMED" }}),
    db.order.count({where : { status : "DELIVERED"}}),
    db.order.count({where : { status : "CANCELED"}}),
    db.order.count(),
    db.order.count({where : { type : "CONFIRMED" , printed:false }}),

  ]);

  return {
    confirmedOrdersCount,
    deliveredOrdersCount,
    canceledOrdersCount,
    totalOrdersCount,
    notPrintedOrders
  };
}













// Return a list of strings containing categories, tags, and titles and collection that start with the same characters as the given query
export async function searchProducts(query: string) {
  try {
      const decodedQuery = decodeURIComponent(query).toLowerCase(); // Decode the URI-encoded query string and convert to lowercase

      // Fetch all products from the database
      const products = await db.product.findMany({
        where : {isProductAccepted : true , privateProduct : false , disableCategory : false},
          select: {
              category: true,
              title: true,
              tags: true,
              store : true,
              collection : true
          },
          take:8
      });

      // Filter products where category, title, or tags start with the query (case insensitive)
      const results: string[] = [];

      products.forEach((product) => {
          if (product.category.toLowerCase().startsWith(decodedQuery) || product.category.toLowerCase().includes(decodedQuery) ) {
              results.push(product.category);
          }
          if (product.title.toLowerCase().startsWith(decodedQuery) || product.title.toLowerCase().includes(decodedQuery) ) {
              results.push(product.title);
          }
          if (product.tags.some(tag => tag.toLowerCase().startsWith(decodedQuery)) || product.tags.some(tag => tag.toLowerCase().includes(decodedQuery))) {
              // results.push(...product.tags.filter(tag => tag.toLowerCase().startsWith(decodedQuery)));
              results.push(product.title);
          }
          if (product.store.storeName.toLowerCase().startsWith(decodedQuery) || product.store.storeName.toLowerCase().includes(decodedQuery) ) {
            results.push(product.store.storeName);
        }
        if (product.collection?.name.toLowerCase().startsWith(decodedQuery) || product.collection?.name.toLowerCase().includes(decodedQuery) ) {
          results.push(product.collection?.name);
      }
      });

      // Deduplicate and return results
      const uniqueResults = [...new Set(results)]; // Remove duplicates

      return uniqueResults;
  } catch (error) {
      console.error('Error searching products:', error);
      throw error;
  }
}









// affiliate program

export async function getAffiliateLinksAndCommissions(userId: string) {
  try {
    const affiliate = await db.affiliate.findUnique({
      where: {
        userId: userId, // Fetch the affiliate account by userId
      },
      include: {
        links: {
          include: {
            commission: true, // Include related commissions for each affiliate link
          },
        },
        affiliatePaymentRequest : true
      },
    });

    return affiliate
  }
catch (error) {
  console.error('Error fetching affiliate links and commissions:', error);
}}

export async function getAffiliatePaymentRequest(userId: string) {
  try {
    const affiliate = await db.affiliate.findUnique({
      where: {
        userId: userId, // Fetch the affiliate account by userId
      },
      include: {
        affiliatePaymentRequest : true
      },
    });

    return affiliate
  }
catch (error) {
  console.error('Error fetching affiliate links and commissions:', error);
}}

export async function getAffiliateStats(userId: string) {
  try {
    // Fetch the affiliate account by userId
    const affiliate = await db.affiliate.findUnique({
      where: {
        userId: userId,
      },
      include: {
        links: {
          include: {
            commission: true, // Include commissions for each link
          },
        },
      },
    });

    if (!affiliate) {
      throw new Error(`Affiliate account not found for userId: ${userId}`);
    }

    // Calculate total income, total clicks, and total sales
    const totalIncome = affiliate.links.reduce((acc, link) => {
      const linkIncome = link.commission.reduce((commissionAcc, commission) => {
        return commissionAcc + commission.profit;
      }, 0);
      return acc + linkIncome;
    }, 0);

    const totalClicks = affiliate.links.reduce((acc, link) => acc + link.totalViews, 0);
    const totalSales = affiliate.links.reduce((acc, link) => acc + link.totalSales, 0);

    return {
      totalIncome,
      totalClicks,
      totalSales,
    };
  } catch (error) {
    console.error(error);
    throw new Error('Error calculating affiliate stats.');
  }
}


export async function getAllCommissionsByAffiliateId(affiliateId: string) {
  try {
    const affiliateLinks = await db.affiliateLink.findMany({
      where: {
        affiliateId: affiliateId, // Filter by affiliate ID
      },
      include: {
        commission: true, // Include related commissions for each affiliate link
        product: true,    // Include the related product
      },
    });

    // Check if the affiliate has any links
    if (affiliateLinks.length === 0) {
      return []
    }

    // Extract and return all commissions for each affiliate link
    const commissions = affiliateLinks.flatMap(link =>
      link.commission.map(commission => ({
        commissionId: commission.id,
        affiliateLinkId: link.id,
        productTitle: link.product?.title || 'Unknown Product', // Access the product title
        profit: commission.profit,
        createdAt: commission.createdAt,
      }))
    );

    return commissions;
  } catch (error) {
    console.error(error);
    throw new Error('Error retrieving commissions.');
  }
}

// 
export async function getUnreadAffiliateNotifications(affiliateId : string) {
  try {
    const unreadNotifications = await db.affiliateNotification.findMany({
      where: {
        affiliateId: affiliateId,
        isViewed: false,
      },
    });

    return unreadNotifications;
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    throw error;
  }
}


// create notis : 
export async function createAffiliateNotification(affiliateId : string, content : string, sender : string) {
  try {
    const notification = await db.affiliateNotification.create({
      data: {
        affiliateId: affiliateId,
        content: content,
        sender: sender,
      },
    });
    return true;
  } catch (error) {
    console.error('Error creating notification:', error);
    return false
  }
}


// chart : 

// for seller dashboard
export async function getProductViewsChartData(storeId: string , month: number, year: number) {
  // Calculate the start and end dates for the given month
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0); // Last day of the month


  // Generate all dates in the range
  const allDates = [];
  for (
    let d = new Date(startDate);
    d <= endDate;
    d.setDate(d.getDate() + 1)
  ) {
    allDates.push(d.toISOString().split("T")[0]); // Format: YYYY-MM-DD
  }

  // Fetch all products for the given storeId
  const products = await db.product.findMany({
    where: { storeId },
    select: { id: true, title: true }, // Fetch product ids and titles
  });

  const productIds = products.map((product) => product.id);
  const productTitles = Object.fromEntries(
    products.map((product) => [product.id, product.title])
  );

  // Query product views for the last month for these products
  const productViewsPerDay = await db.productViews.groupBy({
    by: ["viewedAt", "productId"], // Include productId in the grouping
    _count: {
      productId: true,
    },
    where: {
      productId: { in: productIds }, // Only include views for products from the given store
      viewedAt: {
        gte: startDate, // Start date: One month ago
        lte: endDate, // End date: Today
      },
    },
    orderBy: {
      viewedAt: "asc", // Sort by the date of view
    },
  });

  // Aggregate views and product details by day
  const dailyData: {
    [key: string]: {
      views: number;
      productDetails: { title: string; views: number }[];
    };
  } = {};

  // Populate daily data with views
  productViewsPerDay.forEach((view) => {
    const date = view.viewedAt.toISOString().split("T")[0]; // Extract "YYYY-MM-DD" from Date
    if (!dailyData[date]) {
      dailyData[date] = { views: 0, productDetails: [] };
    }

    // Increment total views
    dailyData[date].views += view._count.productId;

    // Update product-level views
    const product = dailyData[date].productDetails.find(
      (p) => p.title === productTitles[view.productId]
    );
    if (product) {
      product.views += view._count.productId;
    } else {
      dailyData[date].productDetails.push({
        title: productTitles[view.productId],
        views: view._count.productId,
      });
    }
      // Limit linkDetails to the top 4 most-viewed links
      dailyData[date].productDetails = dailyData[date].productDetails
      .sort((a, b) => b.views - a.views) // Sort by views descending
      .slice(0, 4); // Take the top 4

  });

  // Generate chart data for all dates in the range
  const chartData = allDates.map((date) => ({
    date,
    views: dailyData[date]?.views || 0,
    productDetails: dailyData[date]?.productDetails || [],
  }));

  // Return the chart data
  return chartData;
}

// for admin dashboard
export async function getViewsChartData( month: number, year: number) {
  // Calculate the start and end dates for the given month
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0); // Last day of the month


  // Generate all dates in the range
  const allDates = [];
  for (
    let d = new Date(startDate);
    d <= endDate;
    d.setDate(d.getDate() + 1)
  ) {
    allDates.push(d.toISOString().split("T")[0]); // Format: YYYY-MM-DD
  }

  // Fetch all products for the given storeId
  const products = await db.product.findMany({
    select: { id: true, title: true }, // Fetch product ids and titles
  });

  const productIds = products.map((product) => product.id);
  const productTitles = Object.fromEntries(
    products.map((product) => [product.id, product.title])
  );

  // Query product views for the last month for these products
  const productViewsPerDay = await db.productViews.groupBy({
    by: ["viewedAt", "productId"], // Include productId in the grouping
    _count: {
      productId: true,
    },
    where: {
      productId: { in: productIds }, // Only include views for products from the given store
      viewedAt: {
        gte: startDate, // Start date: One month ago
        lte: endDate, // End date: Today
      },
    },
    orderBy: {
      viewedAt: "asc", // Sort by the date of view
    },
  });

  // Aggregate views and product details by day
  const dailyData: {
    [key: string]: {
      views: number;
    };
  } = {};

  // Populate daily data with views
  productViewsPerDay.forEach((view) => {
    const date = view.viewedAt.toISOString().split("T")[0]; // Extract "YYYY-MM-DD" from Date
    if (!dailyData[date]) {
      dailyData[date] = { views: 0 };
    }

    // Increment total views
    dailyData[date].views += view._count.productId;
  });

  // Generate chart data for all dates in the range
  const chartData = allDates.map((date) => ({
    date,
    views: dailyData[date]?.views || 0,
  }));

  // Return the chart data
  return chartData;
}



export async function getAffiliateChartData(affiliateId: string , month: number, year: number) {
  // Calculate the start and end dates for the given month
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0); // Last day of the month

  // Generate all dates in the range
  const allDates = [];
  for (
    let d = new Date(startDate);
    d <= endDate;
    d.setDate(d.getDate() + 1)
  ) {
    allDates.push(d.toISOString().split("T")[0]); // Format: YYYY-MM-DD
  }

  // Fetch affiliate links for the given affiliateId
  const affiliateLinks = await db.affiliateLink.findMany({
    where: { affiliateId },
    select: { id: true, productId: true, product: { select: { title: true } } },
  });

  const affiliateLinkIds = affiliateLinks.map((link) => link.id);
  const productTitles = Object.fromEntries(
    affiliateLinks.map((link) => [link.id, link.product.title])
  );

  // Query affiliate clicks grouped by day
  const affiliateClicksPerDay = await db.affiliateClick.groupBy({
    by: ["clickedAt", "affiliateLinkId"], // Group by the date and link ID
    _count: {
      affiliateLinkId: true,
    },
    where: {
      affiliateLinkId: { in: affiliateLinkIds }, // Include only clicks for this affiliate's links
      clickedAt: {
        gte: startDate, // Start date: One month ago
        lte: endDate, // End date: Today
      },
    },
    orderBy: {
      clickedAt: "asc", // Sort by the click date
    },
  });

  // Aggregate clicks and link details by day
  const dailyData: {
    [key: string]: {
      linkClicks: number;
      linkDetails: { title: string; views: number }[];
    };
  } = {};

  affiliateClicksPerDay.forEach((click) => {
    const date = click.clickedAt.toISOString().split("T")[0]; // Extract "YYYY-MM-DD" from Date
    if (!dailyData[date]) {
      dailyData[date] = { linkClicks: 0, linkDetails: [] };
    }

    // Increment total clicks
    dailyData[date].linkClicks += click._count.affiliateLinkId;

    // Update link-level views
    const productTitle = productTitles[click.affiliateLinkId];
    const product = dailyData[date].linkDetails.find((p) => p.title === productTitle);
    if (product) {
      product.views += click._count.affiliateLinkId;
    } else {
      dailyData[date].linkDetails.push({
        title: productTitle,
        views: click._count.affiliateLinkId,
      });
    }
      // Limit linkDetails to the top 4 most-viewed links
      dailyData[date].linkDetails = dailyData[date].linkDetails
      .sort((a, b) => b.views - a.views) // Sort by views descending
      .slice(0, 3); // Take the top 4
  });

  // Generate chart data for all dates in the range
  const chartData = allDates.map((date) => ({
    date,
    linkClicks: dailyData[date]?.linkClicks || 0,
    linkDetails: dailyData[date]?.linkDetails || [],
  }));

  // Return the chart data
  return chartData;
}

interface ChartData {
  date: string;        // Date in "YYYY-MM-DD" format
  totalOrders: number; // Total number of orders on this day
  paidOrders: number;  // Number of paid orders on this day
  totalAmount: number; // Total amount for all orders on this day
  receivedAmount: number; // Total amount received for paid orders
}
export async function getOrderChartData(month: number, year: number) {
  // Calculate the start and end dates for the given month
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0); // Last day of the month

  // Generate all dates in the range
  const allDates: string[] = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    allDates.push(d.toISOString().split("T")[0]); // Format: YYYY-MM-DD
  }

  // Fetch orders within the specified month
  const orders = await db.order.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      createdAt: true,
      amount: true,
      isPaid: true,
    },
  });

  // Aggregate data per day
  const dailyData: {
    [key: string]: {
      totalOrders: number;
      paidOrders: number;
      totalAmount: number;
      receivedAmount: number;
    };
  } = {};

  orders.forEach((order) => {
    const date = order.createdAt.toISOString().split("T")[0];
    if (!dailyData[date]) {
      dailyData[date] = {
        totalOrders: 0,
        paidOrders: 0,
        totalAmount: 0,
        receivedAmount: 0,
      };
    }

    // Update daily stats
    dailyData[date].totalOrders += 1;
    dailyData[date].totalAmount += order.amount;
    if (order.isPaid) {
      dailyData[date].paidOrders += 1;
      dailyData[date].receivedAmount += order.amount;
    }
  });

  // Generate chart data for all dates in the range
  const chartData: ChartData[] = allDates.map((date) => ({
    date,
    totalOrders: dailyData[date]?.totalOrders || 0,
    paidOrders: dailyData[date]?.paidOrders || 0,
    totalAmount: dailyData[date]?.totalAmount || 0,
    receivedAmount: dailyData[date]?.receivedAmount || 0,
  }));

  // Return the chart data
  return chartData;
}


export async function getStoreStats() {
  // Fetch stores and related data
  const stores = await db.store.findMany({
    select: {
      products: {
        where : {isProductAccepted : true}
      },
      designs: {
        where : {isDesignForSale : true , isDesignAccepted : true}
      },
      followers: true,
      storeName : true,
      revenue : true,
      totalSales : true,
      logoUrl : true,
      id:true,
      level : true
    },
  });

  const chartData = stores.map((store) => {
    // Calculate totalViews for the store's accepted products
    const storeTotalViews = store.products.reduce((sum, product) => sum + (product.totalViews || 0), 0);

    return {
      storeId: store.id,
      store: store.storeName,
      totalRevenue: store.revenue,
      totalSales: store.totalSales,
      totalProducts: store.products.length,
      totalDesigns: store.designs.length,
      totalFollowers: store.followers.length,
      totalViews: storeTotalViews,
      logo : store.logoUrl,
      level : store.level
    };
  });

  return chartData;
}























  



export async function getStoreProductsViewsCount(storeId: string): Promise<number> {
  try {
    const result = await db.product.aggregate({
      _sum: {
        totalViews: true, // Aggregate the totalViews field
      },
      where: {
        storeId: storeId, // Filter by the store ID
      },
    });

    // Return the sum of totalViews, defaulting to 0 if there are no views
    return result._sum.totalViews || 0;
  } catch (error) {
    console.error("Error fetching store products views count:", error);
    throw new Error("Failed to retrieve store product views count.");
  }
}


// levels : 


export async function getLevelByNumber(levelNumber: number) {
  try {
    const level = await db.level.findUnique({
      where: {
        levelNumber: levelNumber,
      },
    });

    if (!level) {
      throw new Error(`Level with number ${levelNumber} not found`);
    }

    return level;
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while fetching the level');
  }
}


