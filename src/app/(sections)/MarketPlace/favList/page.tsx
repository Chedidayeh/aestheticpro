/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import { getAllProductsCategories, getAllProductCollectionNames, getUser } from '@/actions/actions'
import FavList from './FavList'
import { getUserFavoriteList } from './actions'
import ErrorState from '@/components/ErrorState';




export default async function Page() {

  try {
    

  const user = await getUser()
  const products = await getUserFavoriteList(user?.id? user?.id : "");
  const categories = await getAllProductsCategories()
  const collections = await getAllProductCollectionNames()

  return (
    <>

          {/* fav list section */}
          <section className='w-full mx-auto' >
          <div className='w-[95%] lg:w-[85%] mx-auto'>
                <FavList
                     user={user!}
                     products={products!}
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

