import type { Metadata } from "next";
import { Recursive } from "next/font/google";
import Footer from "@/components/Footer";
import { ReactNode } from "react";
import HomeNavBar from "@/components/HomeNavBar";
import TopBar from "@/components/TopBar";
import { fetchCartProductCount, getPlatformForTheWebsite, getUser, getUserOrders } from "@/actions/actions";
import { countBestSellingProducts, getUserFavoriteListProductsCount } from "../(sections)/MarketPlace/BestSelling/actions";
import "@/app/globals.css";

const recursive = Recursive({ subsets: ["latin-ext"] });

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Authentication",
  description: "Tunisian Platform",
};

const Layout = async ({ children }: { children: ReactNode }) => {
  const platform = await getPlatformForTheWebsite()

  const user = await getUser()

  const cartProductList = await fetchCartProductCount(user?.id ? user.id : "")
  const orders = await getUserOrders(user?.id ? user.id : "")
  const favListProducts = await getUserFavoriteListProductsCount(user?.id? user?.id : "");
  const bestSellingProducts = await countBestSellingProducts();

  return (

      <div className="min-h-screen flex flex-col">
    <TopBar platform={platform!} />
    <HomeNavBar 
    user={user!} 
    platform={platform!} 
    cartProductList={cartProductList}  
    orders={orders} 
    favListProducts={favListProducts}  
    bestSellingProducts={bestSellingProducts ?? 0} />

        <main className="flex-grow">
          {children}
        </main>    
    <Footer user={user!} platform={platform!} />
    </div>

  );
}
export default Layout