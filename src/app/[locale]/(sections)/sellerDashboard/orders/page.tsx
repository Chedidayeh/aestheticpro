'use server'

import {  getStoreByUserId, getUser } from '@/actions/actions';
import ProductsView from './ProductsView';
import DesignView from './DesignView';
import { checkProductInStore, getProductsOrdersForStore, getStoreDesignOrders } from './actions';
import ErrorState from '@/components/ErrorState';
import { getTranslations } from 'next-intl/server';


interface GroupedOrder {
  id: string;
  date : Date
  status : string;
  type : string;
  isSellerOrder : boolean;
  isPaid : boolean
  items: OrderItem[];
}

interface OrderItem {
  id: string;
  productCategory: string;
  productTitle: string;
  productColor: string;
  quantity: number;
  productSize: string;
  productPrice: number;
  capturedMockup : string[]
}



const Page = async () => {
  const t = await getTranslations('SellerOrdersPage');

  try {

  const user = await getUser()
  const store = await getStoreByUserId(user!.id!)
  const storeOrdersForProducts = await getProductsOrdersForStore(store!.id , user!.id)

  
  const orderedDesigns = await getStoreDesignOrders(store!.id)


    // group the products by order id
  const groupedProductsOrders: Record<string, GroupedOrder> = {};

  for (const order of storeOrdersForProducts) {
    const orderId = order.id;
    if (!groupedProductsOrders[orderId]) {
      groupedProductsOrders[orderId] = { id: orderId, date : order.createdAt, status : order.status , type : order.type, isSellerOrder : order.isSellerOrder, isPaid : order.isPaid , items: [] };
    }

    for (const item of order.orderItems) {
      const isProductInStore = await checkProductInStore(item.id, store!.id);
      if (isProductInStore) {
        const orderItem: OrderItem = {
          id: item.id,
          productCategory: item.productCategory,
          productTitle: item.productTitle ?? '',
          productColor: item.productColor ?? '',
          quantity: item.quantity ?? 0,
          productSize: item.productSize ?? '',
          productPrice: item.productPrice ?? 0,
          capturedMockup : item.capturedMockup,
        };
        groupedProductsOrders[orderId].items.push(orderItem);
      }
    }
  }

  const groupedProductsOrdersArray = Object.values(groupedProductsOrders);   




    return (
      <>

    <p className="text-sm text-muted-foreground mb-2">{t('breadcrumb')}</p>
    <h1 className="text-2xl font-semibold mb-8">{t('allOrders')}</h1>
      
      <ProductsView
        ordersData={storeOrdersForProducts}
        groupedOrders={groupedProductsOrdersArray}
    />
      <DesignView
        orderedDesigns={orderedDesigns}
    />

    </>

    );


  
} catch (error) {
  // Handle the error here
  console.error('Error fetching data:', error);
  return <ErrorState/>

}


};

export  default Page ;

