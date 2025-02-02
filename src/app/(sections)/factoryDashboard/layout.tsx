
import { ReactNode } from "react";
import SideBar from "@/components/factoryDashboard/SideBar";
import NavBar from "@/components/factoryDashboard/NavBar";
import "@/app/globals.css";

import type { Metadata } from "next";
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
   title: "Factory Dashboard",
   description: "Tunisian Platfrom",
 };

const Layout = ({ children }: { children: ReactNode }) => {
    return (
         <div className="grid min-h-screen w-full md:grid-cols-[210px_1fr]"> {/* Updated grid columns */}
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