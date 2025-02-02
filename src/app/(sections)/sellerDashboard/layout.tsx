
import { ReactNode } from "react";
import SideBar from "@/components/sellerDashboard/SideBar";
import NavBar from "@/components/sellerDashboard/NavBar";
import "@/app/globals.css";
import type { Metadata } from "next";
import BanUser from "@/components/BanUser";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
   title: "Seller Dashboard",
   description: "Tunisian Platfrom",
 };

const Layout = ({ children }: { children: ReactNode }) => {
    return (
         <div className="grid min-h-screen w-full xl:grid-cols-[230px_1fr]">
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