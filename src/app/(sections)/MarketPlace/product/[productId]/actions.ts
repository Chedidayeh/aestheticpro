'use server'

import { db } from "@/db";



export const removeReview = async (reviewId: string) => {
  try {
    // Delete the review from the ProductReviews table
    const deletedReview = await db.productReviews.delete({
      where: { id: reviewId },
    });

    return true;
  } catch (error) {
    console.error('Error removing review:', error);
    return false
  }
};


export const getProductReviews = async (productId: string) => {
  try {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    const reviews = await db.productReviews.findMany({
      where: { productId },
      include: {
        user: {
          select: { name: true, image: true },
        },
      },
      orderBy: { createdAt: 'desc' }, // Sort by newest first
    });

    return reviews;
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    throw new Error('Failed to fetch product reviews.');
  }
};

// review :

export async function createUserReview (content: string, userId: string, productId: string ) {
  try {
    const review = await db.productReviews.create({
      data: {
        content,
        userId,
        productId,
      },
      include : {
        user : {
          select : {name : true , image : true}
        }
      }
    })
    

    return review ; // Return the created review
  } catch (error) {
    console.error('Error creating review:', error);
    throw new Error('Failed to create review. Please try again.');
  }
};

export async function getCategory(categoryLabel: string) {
  try {
    const category = await db.category.findFirst({
      where: {label : categoryLabel }
    });


    // Extract the labels from the sizes
    return category;
  } catch (error) {
    console.error(error);
    return null
  }
}


export async function getSizes(categoryLabel: string) {
    try {
      const category = await db.category.findFirst({
        where: {
          label: categoryLabel,
        },
        include: {
          sizes: true,
        },
      });
  
  
      // Extract the labels from the sizes
      const sizeLabels = category!.sizes.map(size => size.label);
      return sizeLabels;
    } catch (error) {
      console.error(error);
    }
  }

// Server Action: Track product views
export async function trackProductView(
  productId: string, 
  sessionId: string, 
  userId?: string
) {
  try {
    let existingView;

    if (userId) {
      // Check for an existing view with the given userId
      existingView = await db.productViews.findFirst({
        where: {
          productId,
          userId,
        },
      });
    }

    if (!existingView) {
      // If no existing view is found for userId, check for sessionId
      existingView = await db.productViews.findFirst({
        where: {
          productId,
          sessionId,
        },
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of the day

    const isSameDay =
      existingView &&
      existingView.viewedAt &&
      new Date(existingView.viewedAt).setHours(0, 0, 0, 0) === today.getTime();

    // If no existing view or existing view is from a different day, create a new one
    if (!existingView || !isSameDay) {
      await db.productViews.create({
        data: {
          productId,
          sessionId,
          userId: userId || null, // Store userId if available, otherwise null
        },
      });

      // Optionally, increment the product view count
      await db.product.update({
        where: { id: productId },
        data: { totalViews: { increment: 1 } },
      });
    }
  } catch (error) {
    console.error("Error tracking product view:", error);
  }
}

  // fetch products by category
  export async function fetchProductsByCategory(category : string) {
    const products = await db.product.findMany({
      where: {
        category: category,
        isProductAccepted : true,
        privateProduct : false,
        disableCategory : false,
      },
      take: 5,
      include : {
        store : true
      },
      orderBy: {totalViews: 'desc'},
    });

  
    return products
  }

    // fetch design by id 

    export async function fetchDesignById(designId : string) {

      try {
        const design = await db.sellerDesign.findFirst({
          where: { id: designId }
        });
    
        return design?.imageUrl
      } catch (error) {
  
        console.log(error)
        return null
        
      }
    }






  