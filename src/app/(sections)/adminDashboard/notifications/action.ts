'use server'

import { db } from "@/db";

//send notification to a store:
export async function createNotification(storeId : string, content : string, sender : string) {
    try {
      const notification = await db.notification.create({
        data: {
          storeId: storeId,
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
  
  //send notification to all stores:
  export async function createNotificationForAllStores(content : string, sender : string) {
    try {
      // Fetch all store IDs
      const stores = await db.store.findMany({
        select: {
          id: true,
        },
      });
  
      // Prepare notification data for each store
      const notifications = stores.map(store => ({
        storeId: store.id,
        content: content,
        sender: sender,
      }));
  
      // Create notifications in bulk
      const createdNotifications = await db.notification.createMany({
        data: notifications,
      });
  
      return true;
    } catch (error) {
      console.error('Error creating notifications for all stores:', error);
      return false
    }
  }
  