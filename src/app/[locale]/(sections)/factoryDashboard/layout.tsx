
import { ReactNode } from "react";
import SideBar from "@/components/factoryDashboard/SideBar";
import NavBar from "@/components/factoryDashboard/NavBar";
import "@/app/globals.css";

import type { Metadata } from "next";
import { getFactoryDashboardCounts, getUser } from "@/actions/actions";
import Redirecting from "@/components/Redirecting";
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
   title: "Factory Dashboard",
   description: "Tunisian Platform",
 };

const Layout = async ({ children }: { children: ReactNode }) => {
   const totalCounts = await getFactoryDashboardCounts();
   const user = await getUser()
   if(!user || user.userType !== "FACTORY"){
      return <Redirecting/>
   }
    return (
         <div className="grid min-h-screen w-full md:grid-cols-[230px_1fr]"> {/* Updated grid columns */}
        <SideBar totalCounts={totalCounts} />
           <div className="flex flex-col">
        <NavBar user={user!} totalCounts={totalCounts} />
        <div className="p-8">
        {children}
        </div>
        </div>
        </div>
  );
}

export default Layout