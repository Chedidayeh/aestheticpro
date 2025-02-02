'use server'
import {db} from "@/db"

export const  getUserByEmail = async(email : string)=>{
    try{
        const user = await db.user.findUnique({
            where : {email}
        })
        return user;
    }catch{
        return null;
    }
}

// compare user password 
// export const comparePassword = async (email: string, password: string) => {
//     try {
//         const user = await getUserByEmail(email);
//         if (!user) {
//             return false;
//             }
//             const passwordMatch = await bcrypt.compare(
//                 password,
//                 user.password!,
//             );            
//             return passwordMatch;
//             } catch {
//                 return false;
//  }
//   }


//check if user logged in with google 

export const checkGoogleLoggedInUser = async (email : string) => {
    try {
        const user = await db.user.findUnique({
            where: { email },
            select : {
                accounts : true
            }
            })
            return user?.accounts.length! > 0;

            } catch {
                return null;
     }
}

export const  getUserById = async(id : string)=>{
    try{
        const user = await db.user.findUnique({
            where : {id}
        })
        return user;
    }catch{
        return null;
    }
}



export const  getUserByToken= async(token : string)=>{
    try{
        const user = await db.user.findUnique({
            where : {verificationToken : token}
        })
        return user;
    }catch{
        return null;
    }
}

export const  getUserByresetToken= async(token : string)=>{
    try{
        const user = await db.user.findUnique({
            where : {resetPassToken : token}
        })
        return user;
    }catch{
        return null;
    }
}
