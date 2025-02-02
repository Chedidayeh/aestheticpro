import type { Metadata } from "next";
import { Recursive } from "next/font/google";
import "../globals.css";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/components/Providers";
import { StoreProvider } from "@/store/StoreProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { ReactNode } from "react";
import HomeNavBar from "@/components/HomeNavBar";
import TopBar from "@/components/TopBar";

const recursive = Recursive({ subsets: ["latin-ext"] });

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Authentication",
  description: "Tunisian Platfrom",
};

const Layout = ({ children }: { children: ReactNode }) => {


  return (

   <>
            <TopBar/>
           <HomeNavBar/>
            {children}
            <Footer/>
            </>    

  );
}
export default Layout