/* eslint-disable react/no-unescaped-entities */
import {
  buttonVariants,
} from '@/components/ui/button'

import { fetchBestSellingProducts, fetchDiscountProductsDeals, fetchNewProducts, fetchTrendingProducts, getFollowedStoreProductsFirst, getProductsGroupedByCollection, getUser } from "@/actions/actions";
import ProductReel from "@/components/MarketPlace/ProductReel";
import { ArrowRight } from "lucide-react";
import PerkSection from '@/components/PerkSection';
import ErrorState from '@/components/ErrorState';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('HomePage');

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
      {t('title')} ✨
      </p>
    </div>

    {/* Followed Stores Products section */}
{filteredFollowedStoresProducts.length > 0 && (
    <section className='bg-muted/50 border-2 rounded-2xl border-slate-500 w-[97%] mx-auto my-8'>
      <div className='w-[95%] mx-auto'>
        <ProductReel
          user={user!}
          href='/MarketPlace/FollowedStores'
          title={t('Followed_Stores_Products_section')}
          products={filteredFollowedStoresProducts}
          subtitle={t('Followed_Stores_Products_subtitle')}
        />
      </div>
    </section>
  )}

{/* Trending Products section */}
{filteredTrendingProducts.length > 0 && (
    <section className='bg-muted/50 border-2 rounded-2xl border-slate-500 w-[97%] mx-auto my-8'>
      <div className='w-[95%] mx-auto'>
        <ProductReel
          user={user!}
          href='/MarketPlace'
          title={t('Trending_Products_section')}
          products={filteredTrendingProducts}
          subtitle={t('Trending_Products_subtitle')}
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
          title={t('Discount_Deals_section')}
          products={filteredDiscountProductsDeals}
          subtitle={t('Discount_Deals_subtitle')}
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
        title={t('Best_Selling_Products_section')}
        products={filteredBestSellingProducts}
        subtitle={t('Best_Selling_Products_subtitle')}
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
        title={t('Newly_Released_section')}
        products={filteredNewProducts}
        subtitle={t('Newly_Released_subtitle')}
      />
  </div>
  </section>
    )}

      {/* collections section */}
      {Object.entries(productsGroupedByCollection!).map(([collection, products]) => {
          if (products.length < 1) return null;
          return (
            <section key={collection} className='bg-muted/50 border-2 rounded-2xl border-slate-500 w-[97%] mx-auto my-8'>
              <div className='w-[95%] mx-auto'>
                <ProductReel
                  user={user!}
                  href={`/MarketPlace/collection/${collection}`}
                  title={`${t('Collection_section', { collection: collection.replace(/_/g, ' ') })}`}
                  products={products}
                  subtitle={`${t('Collection_subtitle', { collection: collection.replace(/_/g, ' ') })}`}
                />
              </div>
            </section>
          );
        })}

      <div className='py-10 mt-2 mx-auto flex flex-col w-[95%]  rounded-2xl bg-center 
      bg-[url("/bgBanner.png")]'>
      <div className="text-center flex flex-col items-center">
      <h1 className="text-3xl font-bold tracking-tight text-white">
        {t('Customize_section_title_1')}{' '}
        <span className="inline-flex items-center gap-1 text-blue-600">
          {t('Customize_section_title_2')}
        </span>
      </h1>
      <p className='mt-4 text-sm max-w-prose text-muted-foreground'>
      {t('Customize_section_subtitle')}
      </p>
      <div className="mt-6">
      <Link      
                href='/MarketPlace/create-client-product/select-category'
                className={buttonVariants({
                  size: 'sm',
                  className: 'items-center gap-1 text-white',
                })}>
                {t('Customize_section_button')}
                <ArrowRight className='ml-1.5 h-5 w-5' />
              </Link>
      </div>
      </div>
      </div>
      <PerkSection/>
      <div className='py-10 mb-4 mt-2 mx-auto flex flex-col w-[95%]  rounded-2xl bg-center 
      bg-[url("/bgBanner.png")]'>
      <div className="text-center flex flex-col items-center">
      <h1 className="text-3xl font-bold tracking-tight text-white">
        {t('Services_section_title_1')}{' '}
        <span className="inline-flex items-center gap-1 text-red-600">
          {t('Services_section_title_2')}
        </span>
      </h1>
      <p className='mt-4 text-sm max-w-prose text-muted-foreground'>
      {t('Services_section_subtitle')}
      </p>
      <div className="mt-6">
      <Link      
                href='/services'
                className={buttonVariants({
                  size: 'sm',
                  className: 'items-center gap-1 bg-red-500 hover:bg-red-400 text-white',
                })}>
                {t('Services_section_button')}
                <ArrowRight className='ml-1.5 h-5 w-5' />
              </Link>
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

