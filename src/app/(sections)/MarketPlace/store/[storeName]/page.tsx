/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { OctagonAlert } from "lucide-react";
import Link from "next/link";
import {
  getAllProductsCategories,
  getAllProductCollectionNames,
  getUser,
  getPlatformForTheWebsite,
} from "@/actions/actions";
import StoreView from "./StoreView";
import {
  checkIfUserFollowsStore,
  fetchPriceRanges,
  getDesignsByStoreId,
  getStoreByStoreName,
  getStoreFollowersCount,
  getStoreProducts,
  getStoreProductsCount,
} from "./actions";
import NotFound from "@/app/(home)/[...not-found]/page";
import ErrorState from "@/components/ErrorState";

interface PageProps {
  params: {
    storeName: string;
  };
}

export default async function Page({ params }: PageProps) {

  try {
  
  const { storeName } = params;
  const platform = await getPlatformForTheWebsite()
  const limit = platform!.productsLimitPerPage;
  const page = 1; // Initial page
  const decodedStoreName = decodeURIComponent(storeName);

  const user = await getUser();
  const store = await getStoreByStoreName(decodedStoreName);

  if (!store) {
        return <NotFound />;

  } else {

      const storeProductsCount = await getStoreProductsCount(store.id!);
      const { products, totalCount } = await getStoreProducts(
        store.id!,
        page,
        limit
      );
      const storeDesigns = await getDesignsByStoreId(store?.id ?? "");
      const categories = await getAllProductsCategories();
      const collections = await getAllProductCollectionNames();
      const followersCount = await getStoreFollowersCount(store!.id);
      const follows = await checkIfUserFollowsStore(user?.id ?? "", store!.id);
      const priceRanges = await fetchPriceRanges(store?.id!);

      return (
        <>
              <section className='w-full mx-auto' >
              <div className="w-[92%] lg:w-[85%] mx-auto">
              <StoreView
                initialProducts={products}
                totalCount={totalCount}
                initialPage={page}
                limit={limit}
                priceRanges={priceRanges}
                store={store}
                user={user!}
                storeProductsCount={storeProductsCount}
                designs={storeDesigns!}
                categories={categories}
                collections={collections}
                followersCount={followersCount}
                follows={follows}
              />
            </div>
          </section>
        </>
      );
  }

} catch (error) {
  console.error("Error rendering store page:", error);
  return <ErrorState/>
}
}
