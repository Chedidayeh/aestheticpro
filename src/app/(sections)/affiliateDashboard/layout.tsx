
import { ReactNode } from "react";
import "@/app/globals.css";
import type { Metadata } from "next";
import SideBar from "@/components/affiliateDashboard/SideBar";
import NavBar from "@/components/affiliateDashboard/NavBar";
import BanUser from "@/components/BanUser";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
   title: "Affiliate Dashboard",
   description: "Tunisian Platfrom",
 };

const Layout = ({ children }: { children: ReactNode }) => {
    return (
         <div className="grid min-h-screen w-full xl:grid-cols-[230px_1fr]"> {/* Updated grid columns */}
         <BanUser/>
        <SideBar />
           <div className="flex flex-col">
        <NavBar />
        <div className="p-8">
        {children}
        </div>
        </div>
        </div>
  
  );
}

export default Layout