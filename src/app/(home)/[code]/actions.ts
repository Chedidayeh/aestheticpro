'use server'

import { db } from "@/db";
import { AffiliateLink, User } from "@prisma/client";

export async function getAffiliateLinkByCode(code: string) {
    try {
      // Fetch the affiliate link using the provided code
      const affiliateLink = await db.affiliateLink.findUnique({
        where: { code },
      });
  
      // Return the link if found, otherwise return null
      return affiliateLink || null;
    } catch (error) {
      console.error('Error fetching affiliate link:', error);
      return null;
    }
  }



  export async function createAffiliateClick(affiliateLink: AffiliateLink, user : User ,isSessionId : boolean) {
    try {

      // if the user already have a sessionId for the affiliate order
      if(isSessionId) {

              // Check for existing click based on sessionId
      let existingClick = await db.affiliateClick.findFirst({
        where: {
          affiliateLinkId: affiliateLink.id, // The affiliate link ID
          sessionId: user.affiliateOrderSessionId, // Use sessionId only for checking
        },
      });
  
      // Create a new click record if it doesn't exist
      if (!existingClick) {
        await db.affiliateLink.update({
          where: { id : affiliateLink.id },
          data: {
            totalViews: {
              increment: 1, // Increment totalViews by 1
            },
          },
        });

        existingClick = await db.affiliateClick.create({
          data: {
            affiliateLinkId: affiliateLink.id, // The affiliate link ID
            sessionId: user.affiliateOrderSessionId, // Use sessionId only for creating
          },
        });
      }
  
      return existingClick; // Return the existing or newly created click event


      } else {

        const newSessionId = crypto.randomUUID();
        
        await db.user.update({
          where: { id : user.id },
          data: {
            affiliateOrderSessionId: newSessionId
          }
        })

        await db.affiliateLink.update({
          where: { id : affiliateLink.id },
          data: {
            totalViews: {
              increment: 1, // Increment totalViews by 1
            },
          },
        });

        const click = await db.affiliateClick.create({
          data: {
            affiliateLinkId: affiliateLink.id, // The affiliate link ID
            sessionId: newSessionId, // Use sessionId only for creating
          },
        });

        return click

      }


      

    } catch (error) {
      console.error('Error creating affiliate click:', error);
      throw new Error('Failed to create affiliate click event.');
    }
  }
  