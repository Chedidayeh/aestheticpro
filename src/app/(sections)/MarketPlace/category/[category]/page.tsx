/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import {
  getAllProductCollectionNames,
  getPlatformForTheWebsite,
  getUser,
} from '@/actions/actions';
import ProductsByCategory from './ProductsByCategory';
import { fetchPriceRanges, fetchProductsByCategory } from './actions';
import NotFound from '@/app/(home)/[...not-found]/page';
import ErrorState from "@/components/ErrorState";
import { db } from '@/db';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { OctagonAlert } from "lucide-react";
import LoadingLink from '@/components/LoadingLink';
import { Button } from '@/components/ui/button';

interface PageProps {
  params: {
    category: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { category } = params;
  let platform, data, user, collections, priceRanges;

  try {
    platform = await getPlatformForTheWebsite();
    const limit = platform!.productsLimitPerPage;
    const page = 1; // Initial page
    const decodedCategory = decodeURIComponent(category);

    const cat = await db.category.findFirst({
      where : {label : decodedCategory}
    })

    if (cat?.disableCategory === true) return (
      <>
      <AlertDialog open={true} >
      <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
      <AlertDialogHeader className="flex flex-col items-center">
<div className="text-red-500 mb-2">
<OctagonAlert className=''/>
</div>
<AlertDialogTitle className="text-xl font-bold text-center">
This category is unavailable for now ! 
</AlertDialogTitle>
<AlertDialogDescription>
Please return to the home page !
</AlertDialogDescription>
<LoadingLink  href="/" ><Button size={"sm"} variant="default">
  Return 
    </Button>
    </LoadingLink>
</AlertDialogHeader>
</AlertDialogContent>
      </AlertDialog>
      <div className="mb-96"></div>
      </>
    )
    data = await fetchProductsByCategory(decodedCategory, page, limit);
    user = await getUser();
    collections = await getAllProductCollectionNames();
    priceRanges = await fetchPriceRanges(decodedCategory);

    if (data.products.length === 0) return <NotFound />;
    

    return (
      <>
        {/* New Released section */}
        <section className='w-full mx-auto' >
        <div className="w-[92%] lg:w-[85%] mx-auto">
            <ProductsByCategory
              initialProducts={data.products}
              totalCount={data.totalCount}
              initialPage={page}
              limit={limit}
              priceRanges={priceRanges}
              user={user!}
              category={decodedCategory}
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