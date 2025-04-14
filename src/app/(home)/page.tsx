/* eslint-disable react/no-unescaped-entities */
import {
  buttonVariants,
} from '@/components/ui/button'

import { fetchBestSellingProducts, fetchDiscountProductsDeals, fetchNewProducts, fetchTrendingProducts, getFollowedStoreProductsFirst, getProductsGroupedByCollection, getUser } from "@/actions/actions";
import ProductReel from "@/components/MarketPlace/ProductReel";
import { ArrowRight } from "lucide-react";
import PerkSection from '@/components/PerkSection';
import LoadingLink from '@/components/LoadingLink';
import ErrorState from '@/components/ErrorState';

export default async function Page() {

  try {
    

  const newProducts = await fetchNewProducts();
  const productsGroupedByCollection  = await getProductsGroupedByCollection()
  const bestSellingProducts = await fetchBestSellingProducts();
  const discountProductsDeals = await fetchDiscountProductsDeals()
  const trendingProducts = await fetchTrendingProducts()
  const user = await getUser();
  const followedStoresProducts = user ? await getFollowedStoreProductsFirst(user.id) : [];

  // Ensure products are not null or undefined
  const filteredTrendingProducts = trendingProducts ? trendingProducts : [];
  const filteredNewProducts = newProducts ? newProducts : [];
  const filteredBestSellingProducts = bestSellingProducts ? bestSellingProducts : [];
  const filteredDiscountProductsDeals = discountProductsDeals ? discountProductsDeals : [];
  const filteredFollowedStoresProducts = followedStoresProducts ? followedStoresProducts : [];


  return (

    <>


    <div className='pt-4 mx-auto text-center flex  flex-col w-full items-center'>
      <p className='text-sm max-w-prose  text-muted-foreground'>
       AestheticPro. Powered by Tunisian's most talented designers ✨
      </p>
    </div>

    {/* Followed Stores Products section */}
{filteredFollowedStoresProducts.length > 0 && (
    <section className='bg-muted/50 border-2 rounded-2xl border-slate-500 w-[97%] mx-auto my-8'>
      <div className='w-[95%] mx-auto'>
        <ProductReel
          user={user!}
          href='/MarketPlace/FollowedStores'
          title='Products from Stores You Follow'
          products={filteredFollowedStoresProducts}
          subtitle='Check out the latest products from your favorite stores!'
        />
      </div>
    </section>
  )}

{/* Followed Stores Products section */}
{filteredTrendingProducts.length > 0 && (
    <section className='bg-muted/50 border-2 rounded-2xl border-slate-500 w-[97%] mx-auto my-8'>
      <div className='w-[95%] mx-auto'>
        <ProductReel
          user={user!}
          href='/MarketPlace'
          title='Trending Products'
          products={filteredTrendingProducts}
          subtitle='Discover our Trending Style collection!'
        />
      </div>
    </section>
  )}






    {/* discountDeals section */}
    {filteredDiscountProductsDeals.length > 0  && (
    <section className='bg-muted/50 border-2 rounded-2xl border-slate-500 w-[97%] mx-auto my-8'>
      <div className='w-[95%] mx-auto'>
        <ProductReel
          user={user!}
          href='/MarketPlace/discountDeals'
          title='Discover Exclusive Deals'
          products={filteredDiscountProductsDeals}
          subtitle='Unveil the Magic of Our Exclusive Products at Special Prices!'
        />
      </div>
    </section>
      )}

            {/* Top selled section */}
    {filteredBestSellingProducts.length > 0 && (
  <section className='bg-muted/50 border-2 rounded-2xl border-slate-500 w-[97%] mx-auto my-8'>
  <div className='w-[95%] mx-auto'>
  <ProductReel
        user={user!}
        href='/MarketPlace/BestSelling'
        title='Best Selling Products'
        products={filteredBestSellingProducts}
        subtitle='Explore Our Bestselling Products!'
      />
  </div>
  </section>
)}
            {/* Newly released section */}
  {filteredNewProducts.length > 0 && (
  <section className='bg-muted/50 border-2 rounded-2xl border-slate-500 w-[97%] mx-auto my-8'>
  <div className='w-[95%] mx-auto'>
  <ProductReel
        user={user!}
        href='/MarketPlace/NewlyReleased'
        title='Newly released'
        products={filteredNewProducts}
        subtitle='Explore the new added products !'
      />
  </div>
  </section>
    )}




      {/* collections section */}

      {Object.entries(productsGroupedByCollection!).map(([collection, products]) => {
          // Check if the number of products is greater than 8
          if (products.length < 1) return null;

          return (
            <section key={collection} className='bg-muted/50 border-2 rounded-2xl border-slate-500 w-[97%] mx-auto my-8'>
              <div className='w-[95%] mx-auto'>
                <ProductReel
                  user={user!}
                  href={`/MarketPlace/collection/${collection}`}
                  title={`${collection.replace(/_/g, ' ')} Products`}
                  products={products}
                  subtitle={`Explore Our ${collection.replace(/_/g, ' ')} Products!`}
                />
              </div>
            </section>
          );
        })}


      <div className='py-10 mt-2 mx-auto flex flex-col w-[95%]  rounded-2xl bg-center 
      bg-[url("/bgBanner.png")]'>

      <div className="text-center flex flex-col items-center">
      <h1 className="text-3xl font-bold tracking-tight text-white">
        Try to customize{' '}
        <span className="inline-flex items-center gap-1 text-blue-600">
          your own product
        </span>
      </h1>

      <p className='mt-4 text-sm max-w-prose text-muted-foreground'>
      Create and customize your own products!   
      </p>

      <div className="mt-6">
      <LoadingLink      
                href='/MarketPlace/create-client-product/select-category'
                className={buttonVariants({
                  size: 'sm',
                  className: 'items-center gap-1 text-white',
                })}>
                Create your product
                <ArrowRight className='ml-1.5 h-5 w-5' />
              </LoadingLink>
      </div>
      </div>

      </div>

      <PerkSection/>





      <div className='py-10 mb-4 mt-2 mx-auto flex flex-col w-[95%]  rounded-2xl bg-center 
      bg-[url("/bgBanner.png")]'>

      <div className="text-center flex flex-col items-center">
      <h1 className="text-3xl font-bold tracking-tight text-white">
        Explore our main{' '}
        <span className="inline-flex items-center gap-1 text-red-600">
          services
        </span>
      </h1>

      <p className='mt-4 text-sm max-w-prose text-muted-foreground'>
      What our platform can offer you !   
      </p>

      <div className="mt-6">
      <LoadingLink      
                href='/services'
                className={buttonVariants({
                  size: 'sm',
                  className: 'items-center gap-1 bg-red-500 hover:bg-red-400 text-white',
                })}>
                Explore
                <ArrowRight className='ml-1.5 h-5 w-5' />
              </LoadingLink>
      </div>
      </div>

      </div>

  
</>
    



      
    
  )

} catch (error) {
  console.log(error)
  return <ErrorState/>
    
}
}

