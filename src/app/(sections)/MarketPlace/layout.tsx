import "@/app/globals.css"
import SearchBar from "@/components/MarketPlace/SearchBar";
import Footer from "@/components/Footer";
import { ReactNode } from "react";
import TopBar from "@/components/TopBar";
import { Metadata } from "next";
import { fetchCartProductCount, getPlatformForTheWebsite, getUser, getUserOrders } from "@/actions/actions";
import { countBestSellingProducts, getUserFavoriteListProductsCount } from "./BestSelling/actions";
import HomeNavBar from "@/components/HomeNavBar";

export const metadata: Metadata = {
  title: "MarketPlace",
  description: "Tunisian Platfrom",
};

export const dynamic = 'force-dynamic';


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
        <SearchBar />
        
        {/* Main content grows to fill available space */}
        <main className="flex-grow">
          {children}
        </main>

        <Footer user={user!} platform={platform!} />
      </div>


  );
}

export default Layout