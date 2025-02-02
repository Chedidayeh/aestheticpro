 'use server'
import { db } from '@/db';
import ProductView from './ProductView';
import { getLevelByNumber, getUser } from '@/actions/actions';
import { getAllCollections } from '../../adminDashboard/settings/actions';
import ErrorState from '@/components/ErrorState';

const Page = async () => {

  try {
    const user = await getUser();

    const collections = await getAllCollections()


    const store = await db.store.findUnique({
      where: { userId: user!.id },
      include: {
        products: {
          select: {
            totalViews: true, // Only include totalViews to minimize data load
          },
        },
      },
    });
    
    // Calculate the total product views
    const totalProductViews = store?.products.reduce((sum, product) => sum + product.totalViews, 0) || 0;


    const sellerProducts = await db.product.findMany({ where: { storeId: store?.id } , orderBy : {createdAt : 'desc'} });
  
    const level = await getLevelByNumber(store!.level)
  
    return (
     <ProductView
        sellerProductsData={sellerProducts}
        totalProductViews={totalProductViews}
        collections={collections}
        level={level}
        store={store!}
    />
    
    );
    
  } catch (error) {
    console.error('Error fetching data:', error);
    return <ErrorState/>

  }

};

export  default Page ;

