/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */



import View from './View'
import {  getAllProductsCategories, getAllProductCollectionNames, getUser, fetchPriceRanges, fetchProducts, getPlatformForTheWebsite } from '@/actions/actions'


import ErrorState from '@/components/ErrorState';

const Page = async () => {

  try {
    

  const user = await getUser()
  const categories = await getAllProductsCategories()
  const collections = await getAllProductCollectionNames()

  const platform = await getPlatformForTheWebsite()
  const limit = platform!.productsLimitPerPage;
  const page = 1; // Initial page
  const priceRanges = await fetchPriceRanges()


  const { products, totalCount } = await fetchProducts(page, limit);



  return (
    <>


          {/* new Released section */}
          <section className='w-full mx-auto' >
                <div className='w-[92%] lg:w-[85%] mx-auto'>
                <View
                     initialProducts={products}
                     totalCount={totalCount}
                     initialPage={page}
                     limit={limit}
                     priceRanges={priceRanges}
                     user={user!}
                     categories={categories!}
                     collections={collections}
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
export default Page

