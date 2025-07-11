/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import {    getPlatformForTheWebsite, getUser } from '@/actions/actions'
import ProductsByCategory from './ProductsByCollection'
import { fetchPriceRanges, fetchProductsByCollection, getCollectionProductsCategories } from './actions'

import NotFound from '@/app/[locale]/(home)/[...not-found]/page';
import ErrorState from '@/components/ErrorState';

interface PageProps {
  params: {
    collection: string
  }
}

export default async function Page({ params }: PageProps) {
  try {
    

  const { collection } = params
  const platform = await getPlatformForTheWebsite()
  const limit = platform!.productsLimitPerPage;
  const page = 1; // Initial page
  const decodedCollection = decodeURIComponent(collection)
  const data = await fetchProductsByCollection(decodedCollection , page , limit);
  const user = await getUser()
  const categories = await getCollectionProductsCategories(decodedCollection)
  const priceRanges = await fetchPriceRanges(decodedCollection)

  if(data.products.length === 0 ) return <NotFound/>
  
  return (
    <>

          {/* new Released section */}
          <section className='w-full mx-auto' >
          <div className='w-[92%] lg:w-[85%] mx-auto'>
                <ProductsByCategory
                     initialProducts={data.products}
                     totalCount={data.totalCount}
                     initialPage={page}
                     limit={limit}
                     priceRanges={priceRanges}
                     user={user!}
                     collection={decodedCollection}
                     categories = {categories}
                />
                </div>
              </section>
          

    </>
  )

} catch (error) {
  console.error(error)
  return <ErrorState/>

    
}

}

