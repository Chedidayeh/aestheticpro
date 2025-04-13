 'use server'
import ProductView from './ProductView';
import { getAllProductsCategories, getAllProductCollectionNames, getPlatformForTheWebsite, getUser } from '@/actions/actions';
import { fetchAllProducts, getAffiliateIdByUserId } from './actions';
import ErrorState from '@/components/ErrorState';

const Page = async () => {

  try {


  
  
  
  


    const user = await getUser()
    const affiliateId = await getAffiliateIdByUserId(user?.id!)
    const categories = await getAllProductsCategories()
    const collections = await getAllProductCollectionNames()
    const platform = await getPlatformForTheWebsite()
    const limit = platform!.productsLimitPerPage;
    const page = 1; // Initial page
    const { products, totalCount } = await fetchAllProducts(page, limit);

    return (
     <ProductView
     initialProducts={products}
     totalCount={totalCount}
     initialPage={page}
     limit={limit}
     user={user!}
     affiliateId={affiliateId!}
     categories={categories!}
     collections={collections}
     platform={platform!}
    />
    
    );
    
  } catch (error) {
    console.error('Error fetching data:', error);
    return <ErrorState/>

  }

};

export  default Page ;

