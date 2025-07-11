'use server';

import { getAllProductCollectionNames, getAllProductsCategories, getPlatformForTheWebsite, getUser } from "@/actions/actions";
import SearchedProducts from "./SearchedProducts";
import { fetchPriceRanges, searchProducts } from "./actions";
import ErrorState from "@/components/ErrorState";

interface PageProps {
  params: {
    searchQuery: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { searchQuery } = params;

  try {

    const platform = await getPlatformForTheWebsite()
    const limit = platform!.productsLimitPerPage;

    const page = 1; // Initial page
    const priceRanges = await fetchPriceRanges(searchQuery)
    
    const user = await getUser()
    const { products, totalCount } = await searchProducts(searchQuery , page , limit)
    const categories = await getAllProductsCategories()
    const collections = await getAllProductCollectionNames()

        // Decode the URL-encoded string
    let decodedQuery = decodeURIComponent(searchQuery);

    // Use regex to remove 'dff gf' and any other unwanted characters
    decodedQuery = decodedQuery.replace(/dff\s*gf/g, '');

    return (
      <>

          {/* best selling section */}
          <section className='w-full mx-auto' >
          <div className='w-[92%] lg:w-[85%] mx-auto'>
                <SearchedProducts
                    initialProducts={products}
                    totalCount={totalCount}
                    initialPage={page}
                    limit={limit}
                    priceRanges={priceRanges}
                     user={user!}
                     categories={categories!}
                     collections={collections}
                     searchQuery={decodedQuery}
                />
                </div>
              </section>
          


    </>
    )


  } catch (error) {
    console.error(error)
    return <ErrorState/>

  }
};

export default Page;
