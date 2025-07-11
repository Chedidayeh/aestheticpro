'use server'

import { db } from "@/db";

export async function verifyEmail(userId : string) {
    try {
      const user = await db.user.update({
        where: { id: userId },
        data: { emailVerified: true },
      });
      console.log('Email verified successfully:', user);
    } catch (error) {
      console.error('Error verifying email:', error);
    }
  }