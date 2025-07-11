'use server'

import { db } from "@/db";

// export async function updatePass(userId: string, newPass: string) {
//   try {
//     const hash = bcrypt.hashSync(newPass);

//     const user = await db.user.update({
//       where: { id: userId },
//       data: { password: hash },
//     });

//     return true
//   } catch (error) {
//     console.error('Error updating password:', error);
//     return false  
//   }
// }