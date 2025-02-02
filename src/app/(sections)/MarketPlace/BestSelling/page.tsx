/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import { getAllProductsCategories, getAllProductCollectionNames, getUser, getPlatformForTheWebsite } from '@/actions/actions';
import BestSelling from './BestSelling';
import { fetchBestSellingProducts, fetchPriceRanges } from './actions';
import ErrorState from '@/components/ErrorState';

export default async function Page() {
  let user, categories, collections, platform, data, priceRanges;

  try {
    user = await getUser();
    categories = await getAllProductsCategories();
    collections = await getAllProductCollectionNames();
    platform = await getPlatformForTheWebsite();

    const limit = platform!.productsLimitPerPage; // Number of products per page
    const page = 1; // Initial page

    data = await fetchBestSellingProducts(page, limit);
    priceRanges = await fetchPriceRanges();

    return (
      <>
        {/* Best Selling section */}
        <section className='w-full mx-auto' >
        <div className="w-[92%] lg:w-[85%] mx-auto">
            <BestSelling
              initialProducts={data.products}
              totalCount={data.totalCount}
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
    );
  } catch (error) {
    console.error('Error loading page data:', error);
    return <ErrorState/>

  }
}