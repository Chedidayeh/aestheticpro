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

  
  export async function createAffiliateClick(affiliateLink: AffiliateLink, user: User, isSessionId: boolean) {
    try {
      if (isSessionId) {
        const existingClick = await db.affiliateClick.findFirst({
          where: {
            affiliateLinkId: affiliateLink.id,
            sessionId: user.affiliateOrderSessionId!,
          },
        });
  
        if (!existingClick) {
          const [_, newClick] = await db.$transaction([
            db.affiliateLink.update({
              where: { id: affiliateLink.id },
              data: {
                totalViews: {
                  increment: 1,
                },
              },
            }),
            db.affiliateClick.create({
              data: {
                affiliateLinkId: affiliateLink.id,
                sessionId: user.affiliateOrderSessionId!,
                userId: user.id,
              },
            }),
          ]);
  
          return newClick;
        }
  
        return existingClick;
      } else {
        const newSessionId = crypto.randomUUID();
  
        const [_, __, click] = await db.$transaction([
          db.user.update({
            where: { id: user.id },
            data: {
              affiliateOrderSessionId: newSessionId,
            },
          }),
          db.affiliateLink.update({
            where: { id: affiliateLink.id },
            data: {
              totalViews: {
                increment: 1,
              },
            },
          }),
          db.affiliateClick.create({
            data: {
              affiliateLinkId: affiliateLink.id,
              sessionId: newSessionId,
              userId: user.id,
            },
          }),
        ]);
  
        return click;
      }
    } catch (error) {
      console.error("Error creating affiliate click:", error);
      return null;
    }
  }
  
