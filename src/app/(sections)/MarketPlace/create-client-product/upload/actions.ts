'use server'

import { db } from '@/db';
import { PreOrderPreview } from '@prisma/client';




// get user preOrder
export async function getUserPreOrderByUserId(userId: string): Promise<PreOrderPreview | null> {
    try {
      // Fetch the PreOrderPreview associated with the given user
      const preOrder = await db.preOrderPreview.findFirst({
        where: {
          userId: userId,
        },
      });
  
      return preOrder; // Return the found preorder or null if not found
    } catch (error) {
      console.error('Error fetching user preorder:', error);
      throw new Error('Failed to fetch user preorder');
    }
  }





// User uploaded their own front and back design
export async function savePreOrderFBClient(
    userId:string , 
    frontDesignPath : string , 
    backDesignPath : string, 
    totalPrice : number,
    productPrice : number,
    quantity : number , 
    selectedColor : string , 
    selectedSize : string , 
    productCategory : string , 
    capturedProductPath :string[]
 ) {

  
    try {
        // Start a transaction
        const result = await db.$transaction(async (tx) => {


            // Create a new pre-order if none exists
        const preOrder =  await tx.preOrderPreview.create({
                data: {
                    userId: userId,
                    frontclientDesign: frontDesignPath,
                    backclientDesign : backDesignPath,
                    amount:totalPrice,
                    productPrice: productPrice,
                    quantity: quantity,
                    productColor: selectedColor,
                    productSize: selectedSize,
                    productCategory: productCategory,
                    capturedMockup: capturedProductPath,
                },
            });

            return { success: true , preOrderId :preOrder.id };
        },{
            maxWait: 10000, // Wait for a connection for up to 10 seconds
            timeout: 20000, // Allow the transaction to run for up to 20 seconds
          });

        return result;
    } catch (error) {
        console.error('Error saving pre-order preview:', error);
        return { success: false ,preOrderId :null };
    }
  }


// User selected a seller's front and back design
export async function savePreOrderFBSeller(
    userId:string , 
    selectedFrontDesignId : string , 
    selectedBackDesignId : string, 
    totalPrice : number,
    productPrice : number,
    quantity : number , 
    selectedColor : string , 
    selectedSize : string , 
    productCategory : string , 
    capturedProductPath :string[]
 ) {

  
    try {
        // Start a transaction
        const result = await db.$transaction(async (tx) => {


            // Create a new pre-order if none exists
        const preOrder =  await tx.preOrderPreview.create({
                data: {
                    userId: userId,
                    frontsellerDesignId: selectedFrontDesignId,
                    backsellerDesignId : selectedBackDesignId,
                    amount:totalPrice,
                    productPrice: productPrice,
                    quantity: quantity,
                    productColor: selectedColor,
                    productSize: selectedSize,
                    productCategory: productCategory,
                    capturedMockup: capturedProductPath,
                },
            });

            return { success: true , preOrderId :preOrder.id };
        });

        return result;
    } catch (error) {
        console.error('Error saving pre-order preview:', error);
        return { success: false ,preOrderId :null };
    }
  }


  
// User uploaded their own front design and selected a seller's back design
export async function savePreOrderFB1(
    userId:string , 
    frontDesignPath : string , 
    selectedBackDesignId : string, 
    totalPrice : number,
    productPrice : number ,
    quantity : number , 
    selectedColor : string , 
    selectedSize : string , 
    productCategory : string , 
    capturedProductPath :string[]
 ) {

  
    try {
        // Start a transaction
        const result = await db.$transaction(async (tx) => {


            // Create a new pre-order if none exists
        const preOrder =  await tx.preOrderPreview.create({
                data: {
                    userId: userId,
                    frontclientDesign: frontDesignPath,
                    backsellerDesignId : selectedBackDesignId,
                    amount:totalPrice,
                    productPrice: productPrice,
                    quantity: quantity,
                    productColor: selectedColor,
                    productSize: selectedSize,
                    productCategory: productCategory,
                    capturedMockup: capturedProductPath,
                },
            });

            return { success: true , preOrderId :preOrder.id };
        });

        return result;
    } catch (error) {
        console.error('Error saving pre-order preview:', error);
        return { success: false ,preOrderId :null };
    }
  }



  // User selected a seller's front design and uploaded their own back design
export async function savePreOrderFB2(
    userId:string , 
    backDesignPath : string , 
    selectedFrontDesignId : string, 
    totalPrice : number,
    productPrice : number,
    quantity : number , 
    selectedColor : string , 
    selectedSize : string , 
    productCategory : string , 
    capturedProductPath :string[]
 ) {

  
    try {
        // Start a transaction
        const result = await db.$transaction(async (tx) => {


            // Create a new pre-order if none exists
        const preOrder =  await tx.preOrderPreview.create({
                data: {
                    userId: userId,
                    frontsellerDesignId: selectedFrontDesignId,
                    backclientDesign : backDesignPath,
                    productPrice: productPrice,
                    amount:totalPrice,
                    quantity: quantity,
                    productColor: selectedColor,
                    productSize: selectedSize,
                    productCategory: productCategory,
                    capturedMockup: capturedProductPath,
                },
            });

            return { success: true , preOrderId :preOrder.id };
        });

        return result;
    } catch (error) {
        console.error('Error saving pre-order preview:', error);
        return { success: false ,preOrderId :null };
    }
  }



  //User uploaded their own front design or  User selected a seller's front design
  export async function savePreOrderF(
    userId: string,
    frontDesign: string,
    totalPrice: number,
    productPrice : number,
    quantity: number,
    selectedColor: string,
    selectedSize: string,
    productCategory: string,
    capturedProductPath: string[],
    value: boolean
) {
    try {
        const result = await db.$transaction(async (tx) => {
            // Determine the correct property based on 'value'
            const frontDesignProperty = value ? 'frontsellerDesignId' : 'frontclientDesign';

            // Create the pre-order
            const preOrder = await tx.preOrderPreview.create({
                data: {
                    userId,
                    [frontDesignProperty]: frontDesign,
                    amount:totalPrice,
                    productPrice: productPrice,
                    quantity,
                    productColor: selectedColor,
                    productSize: selectedSize,
                    productCategory,
                    capturedMockup: capturedProductPath,
                },
            });

            return { success: true, preOrderId: preOrder!.id };
        });

        return result;
    } catch (error) {
        console.error('Error saving pre-order preview:', error);
        return { success: false, preOrderId: null };
    }
}



// User uploaded their own back design or User selected a seller's back design
  export async function savePreOrderB(
    userId: string,
    backDesign: string,
    totalPrice: number,
    productPrice : number,
    quantity: number,
    selectedColor: string,
    selectedSize: string,
    productCategory: string,
    capturedProductPath: string[],
    value: boolean,
) {
    try {
        const result = await db.$transaction(async (tx) => {
            // Determine the correct property based on 'value'
            const backDesignProperty = value ? 'backsellerDesignId' : 'backclientDesign';

            // Create the pre-order
            const preOrder = await tx.preOrderPreview.create({
                data: {
                    userId,
                    [backDesignProperty]: backDesign,
                    amount:totalPrice,
                    productPrice: productPrice,
                    quantity,
                    productColor: selectedColor,
                    productSize: selectedSize,
                    productCategory,
                    capturedMockup: capturedProductPath,
                },
            });

            return { success: true, preOrderId: preOrder!.id };
        });

        return result;
    } catch (error) {
        console.error('Error saving pre-order preview:', error);
        return { success: false, preOrderId: null };
    }
}













  
