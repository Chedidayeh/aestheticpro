
import { ReactNode } from "react";
import SideBar from "@/components/sellerDashboard/SideBar";
import NavBar from "@/components/sellerDashboard/NavBar";
import "@/app/globals.css";
import type { Metadata } from "next";
import BanUser from "@/components/BanUser";
import { getStoreByUserId, getUnreadNotificationsForStore, getUser } from "@/actions/actions";
import { redirect } from "next/navigation";
import Redirecting from "@/components/Redirecting";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
   title: "Seller Dashboard",
   description: "Tunisian Platform",
 };

const Layout = async ({ children }: { children: ReactNode }) => {
   const user = await getUser()

   if(!user || user.userType !== "SELLER"){
      return <Redirecting/>
   }
   
   const store = await getStoreByUserId(user ?user.id : "")
   const notifications = await getUnreadNotificationsForStore(store ? store.id : "")

    return (
         <div className="grid min-h-screen w-full xl:grid-cols-[230px_1fr]">
         <BanUser user={user!} />
        <SideBar notifications={notifications}  />
           <div className="flex flex-col">
        <NavBar user={user!} notifications={notifications} storeName={store!.storeName} />
        <div className="p-8">
        {children}
        </div>
        </div>
        </div>
  
  );
}

export default Layout