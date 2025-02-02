'use server'

import { db } from "@/db";

export async function getAffiliateNotification(affiliateId : string) {
  try {
    const notifications = await db.affiliateNotification.findMany({
      where: {
        affiliateId: affiliateId,
      },
      orderBy  : {
        createdAt: 'desc',
      }
    });

    return notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
}

export async function deleteNotificationById(notificationId : string) {
    try {
      const deletedNotification = await db.affiliateNotification.delete({
        where: {
          id: notificationId,
        },
      });
  
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false
    } 
  }


export async function markNotificationAsViewed(notificationId : string) {
    try {
      const updatedNotification = await db.affiliateNotification.update({
        where: {
          id: notificationId,
        },
        data: {
          isViewed: true,
        },
      });
  
      return updatedNotification;
    } catch (error) {
      console.error('Error marking notification as viewed:', error);
      throw error;
    }
  }

  export async function markAllNotificationsAsViewed() {
    try {
      const updatedNotifications = await db.affiliateNotification.updateMany({
        data: {
          isViewed: true,
        },
      });
  
      return updatedNotifications;
    } catch (error) {
      console.error('Error marking notifications as viewed:', error);
      throw error;
    }
  }
  