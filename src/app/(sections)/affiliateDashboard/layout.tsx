
import { ReactNode } from "react";
import "@/app/globals.css";
import type { Metadata } from "next";
import SideBar from "@/components/affiliateDashboard/SideBar";
import NavBar from "@/components/affiliateDashboard/NavBar";
import BanUser from "@/components/BanUser";
import { getUnreadAffiliateNotifications, getUser } from "@/actions/actions";
import { getAffiliateIdByUserId } from "./products/actions";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
   title: "Affiliate Dashboard",
   description: "Tunisian Platfrom",
 };

const Layout = async ({ children }: { children: ReactNode }) => {
   const user = await getUser()
   const affiliateId = await getAffiliateIdByUserId(user!.id)
   const notifications = await getUnreadAffiliateNotifications(affiliateId)
    return (
         <div className="grid min-h-screen w-full xl:grid-cols-[230px_1fr]"> {/* Updated grid columns */}
         <BanUser user={user!} />
         <SideBar notifications={notifications}  />
         <div className="flex flex-col">
        <NavBar user={user!} notifications={notifications} />
        <div className="p-8">
        {children}
        </div>
        </div>
        </div>
  
  );
}

export default Layout