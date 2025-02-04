
import { ReactNode } from "react";
import "@/app/globals.css";
import SideBar from "@/components/adminDashboard/SideBar";
import NavBar from "@/components/adminDashboard/NavBar";

import type { Metadata } from "next";
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Tunisian Platfrom",
};

const Layout = ({ children }: { children: ReactNode }) => {
    return (

    <div className="grid min-h-screen w-full xl:grid-cols-[240px_1fr]">
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