import type { Metadata } from "next";
import { Recursive } from "next/font/google";
import "../globals.css";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/components/Providers";
import { StoreProvider } from "@/store/StoreProvider";
import HomeNavBar from "@/components/HomeNavBar";
import { ThemeProvider } from "@/components/theme-provider";
import TopBar from "@/components/TopBar";
import { ReactNode } from "react";
import SearchBar from "@/components/MarketPlace/SearchBar";
import { SessionProvider } from "next-auth/react";
const recursive = Recursive({ subsets: ["latin-ext"] });
export const dynamic = 'force-dynamic';


export const metadata: Metadata = {
  title: "AestheticPro Platfrom",
  description: "Tunisian Platfrom",
};

type LayoutProps = {
  children: ReactNode;
};
const Layout = ({ children }: LayoutProps) => {


  return (

<>
    <TopBar/>
    <HomeNavBar/>
    <SearchBar/>
    {children}      
    <Footer />
</>       

  );
}

export default Layout