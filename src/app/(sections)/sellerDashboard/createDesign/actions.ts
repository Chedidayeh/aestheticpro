
'use server'

import { db } from '@/db';
import { Store } from '@prisma/client';



export const addDesignToDb = async (store : Store ,path : string , width:number
   , height: number , designName: string , designPrice : number,
   sellerProfit:number, tags : string[] ) => {
    try {
      const sellerDesign = await db.sellerDesign.create({
        data: {
          isDesignForSale : true,
          storeId:store.id,
          name: designName,
          width:width,
          height:height,
          imageUrl:path,
          price:designPrice,
          sellerProfit:sellerProfit,
          tags:tags,
        },
      });
  
      return sellerDesign.id;
  
  
    } catch (error) {
      console.error('Error Adding design in database:', error);
      throw new Error('Failed to add design in database');
    }
  };


  export async function getStoreWithDesignsCount(userId: string) {
    try {
      const store = await db.store.findUnique({
        where: {
          userId: userId,
        },
      });
  
      if (!store) {
        throw new Error('Store not found for the given userId');
      }
  
      const designsCount = await db.sellerDesign.count({
        where: {
          isDesignForSale :true,
          storeId: store.id, // Assuming there is a storeId field in the product table
        },
      });
  
      return {
        ...store,
        designsCount,
      };
    } catch (error) {
      console.error('Error fetching store:', error);
      throw error;
    }
  }



  