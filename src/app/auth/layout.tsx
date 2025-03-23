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
import { fetchCartProductCount, getPlatformForTheWebsite, getUser, getUserOrders } from "@/actions/actions";
import { countBestSellingProducts, getUserFavoriteListProductsCount } from "../(sections)/MarketPlace/BestSelling/actions";

const recursive = Recursive({ subsets: ["latin-ext"] });

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Authentication",
  description: "Tunisian Platfrom",
};

const Layout = async ({ children }: { children: ReactNode }) => {
  const platform = await getPlatformForTheWebsite()

  const user = await getUser()
  const cartProductList = await fetchCartProductCount(user?.id ? user.id : "")
  const orders = await getUserOrders(user?.id ? user.id : "")
  const favListProducts = await getUserFavoriteListProductsCount(user?.id? user?.id : "");
  const bestSellingProducts = await countBestSellingProducts();


  return (

<>
    <TopBar platform={platform!} />
    <HomeNavBar 
    user={user!} 
    platform={platform!} 
    cartProductList={cartProductList}  
    orders={orders} 
    favListProducts={favListProducts}  
    bestSellingProducts={bestSellingProducts ?? 0} />
    {children}      
    <Footer user={user!} platform={platform!} />
    </>   

  );
}
export default Layout