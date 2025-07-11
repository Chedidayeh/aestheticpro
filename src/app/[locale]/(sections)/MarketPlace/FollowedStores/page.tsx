import {
  Button,
} from '@/components/ui/button'
import { getAllProductsCategories, getAllProductCollectionNames, getUser, getPlatformForTheWebsite } from '@/actions/actions'
import FollowedStores from './FollowedStores'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { OctagonAlert } from 'lucide-react';
import { fetchPriceRanges, getFollowedStoreProductsFirst } from './actions'
import ErrorState from '@/components/ErrorState';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';


export default async function Page() {

  try {
    const t = await getTranslations('FollowedStoresPage');


    const user = await getUser()

    if (!user) {
      return (
        <AlertDialog open={true} >
          <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
            <AlertDialogHeader className="flex flex-col items-center">
              <div className="text-gray-500 mb-2">
                <OctagonAlert className='' />
              </div>
              <AlertDialogTitle className="text-xl font-bold text-center">
                {t('no_user_found')}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t('sign_in_to_view')}
              </AlertDialogDescription>

            </AlertDialogHeader>
            <AlertDialogFooter>
              <Link href="/">
                <Button size={"sm"} variant={"outline"} className="">
                  &larr; {t('return_home')}
                </Button>
              </Link>
              <Link href="/auth/sign-in" ><Button size={"sm"} variant="default">
                {t('sign_in')} &rarr;
              </Button>
              </Link>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )
    }

    const platform = await getPlatformForTheWebsite()
    const limit = platform!.productsLimitPerPage;
    const page = 1; // Initial page
    const priceRanges = await fetchPriceRanges(user?.id ?? "")
    const { products, totalCount } = await getFollowedStoreProductsFirst(user!.id, page, limit);
    const categories = await getAllProductsCategories()
    const collections = await getAllProductCollectionNames()



    return (
      <>

        {/* best selling section */}
        <section className='w-full mx-auto' >
          <div className='w-[92%] lg:w-[85%] mx-auto'>
            <FollowedStores
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
    return <ErrorState />


  }
}

