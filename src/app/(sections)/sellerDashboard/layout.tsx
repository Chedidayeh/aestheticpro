
import { ReactNode } from "react";
import SideBar from "@/components/sellerDashboard/SideBar";
import NavBar from "@/components/sellerDashboard/NavBar";
import "@/app/globals.css";
import type { Metadata } from "next";
import BanUser from "@/components/BanUser";
import { getStoreByUserId, getUnreadNotificationsForStore, getUser } from "@/actions/actions";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
   title: "Seller Dashboard",
   description: "Tunisian Platfrom",
 };

const Layout = async ({ children }: { children: ReactNode }) => {
   const user = await getUser()

   const store = await getStoreByUserId(user!.id!)
   const notifications = await getUnreadNotificationsForStore(store.id)
    return (
         <div className="grid min-h-screen w-full xl:grid-cols-[230px_1fr]">
         <BanUser user={user!} />
        <SideBar notifications={notifications}  />
           <div className="flex flex-col">
        <NavBar user={user!} notifications={notifications} storeName={store.storeName} />
        <div className="p-8">
        {children}
        </div>
        </div>
        </div>
  
  );
}

export default Layout