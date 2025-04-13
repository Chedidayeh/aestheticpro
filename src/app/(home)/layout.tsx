import type { Metadata } from "next";
import "../globals.css";
import Footer from "@/components/Footer";
import HomeNavBar from "@/components/HomeNavBar";
import TopBar from "@/components/TopBar";
import { ReactNode } from "react";
import SearchBar from "@/components/MarketPlace/SearchBar";
import { fetchCartProductCount, getPlatformForTheWebsite, getUser, getUserOrders } from "@/actions/actions";
import { countBestSellingProducts, getUserFavoriteListProductsCount } from "../(sections)/MarketPlace/BestSelling/actions";
export const dynamic = 'force-dynamic';


export const metadata: Metadata = {
  title: "AestheticPro Platfrom",
  description: "Tunisian Platfrom",
};

type LayoutProps = {
  children: ReactNode;
};
const Layout = async ({ children }: LayoutProps) => {

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

    <SearchBar/>
        {/* Main content grows to fill available space */}
        <main className="flex-grow">
          {children}
        </main>    
    <Footer user={user!} platform={platform!} />
    </div>       

  );
}

export default Layout