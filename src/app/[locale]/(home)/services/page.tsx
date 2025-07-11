/* eslint-disable react/no-unescaped-entities */
'use server'
import NextImage from 'next/image'
import {  CircleDollarSign, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import RedirectToCreateAffiliateAccount from '@/components/RedirectToCreateAffiliateAccount'
import RedirectToCreateSellerProfile from '@/components/RedirectToCreateSellerProfile'
import ProductListing from '@/components/MarketPlace/ProductListing'
import { fetchTrendingProducts, getPlatformForTheWebsite, getUser } from '@/actions/actions'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'


const Page = async () => {
  const t = await getTranslations('ServicesPage');
  const user = await getUser();
  const platform = await getPlatformForTheWebsite()

  const trendingProducts = await fetchTrendingProducts()

  return (
    <>

    {/* buying section */}
<div className='py-10 mx-auto flex flex-col w-[80%] rounded-2xl bg-center border-2
    bg-[url("/bgBanner.png")]'>

  <div className="text-center flex flex-col items-center">
    <h1 className="text-3xl font-bold tracking-tight text-white">
      {t('buying_section_title_1')}{' '}
      <span className="inline-flex items-center gap-1 text-red-600">
        {t('buying_section_title_2')} <Heart className="mt-[6px]" />
      </span>
    </h1>

    <p className='mt-4 text-sm max-w-prose text-gray-400'>
      {t('buying_section_subtitle')}
    </p>

    <div className="mt-6">
      <Link href="/MarketPlace">
        <Button size={"sm"} className="px-4 py-3 text-sm font-semibold bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 transition">
          {t('buying_section_button')}
        </Button>
      </Link>
    </div>
  </div>

</div>

<section className='bg-muted/50 border-2 rounded-2xl border-slate-500 w-[90%] mx-auto my-8'>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 px-10">
    <div className="flex flex-col justify-center">
      <h2 className="text-xl font-semibold mb-2">{t('why_shop_title')}</h2>
      <p className='my-1 text-md max-w-prose text-muted-foreground'>
        {t('why_shop_paragraph')}
      </p>

      <div className='my-2'>
        <Link href="/about">
          <Button className="" variant='link'>
            {t('learn_more_about_us')}
          </Button>
        </Link>
      </div>

      <h2 className="text-xl font-semibold my-2">{t('guarantee_title')}</h2>

      <ul className="list-disc ml-6 my-2 space-y-2 text-md text-blue-500">
        <li>{t('guarantee_buying_1')}</li>
        <li>{t('guarantee_buying_2')}</li>
        <li>{t('guarantee_buying_3')}</li>
        <li>{t('guarantee_buying_4')}</li>
        <li>{t('guarantee_buying_5')}</li>
      </ul>
    </div>

    {/* Right Side - Image */}
    <div className="flex justify-center ">
      <div className="w-[95%] xl:w-[55%]">
        {trendingProducts.length > 0 && (
      <ProductListing
        user={user!}
        product={trendingProducts[0]}
        index={0}
         />
        )}
      </div>
    </div>
  </div>

  <div className='flex flex-col items-center justify-center mt-2'>
    <p className='mt-4 text-sm max-w-prose text-muted-foreground'>
      {t('explore_latest_collections')}
    </p>
    <div className=''>
      <Link href="/MarketPlace">
        <Button  className="text-red-500" variant='link'>
          {t('start_shopping_now')}
        </Button>
      </Link>
    </div>
  </div>
</section>


{/* selling section */}
<div className='py-10 mt-2 mx-auto  flex flex-col w-[80%] rounded-2xl  bg-center  border-2
    bg-[url("/bgBanner.png")]'>

      <div className="text-center flex flex-col items-center">
<h1 className="text-3xl font-bold tracking-tight text-white">
  {t('selling_section_title_1')}{' '}
  <span className="inline-flex items-center gap-1 text-green-600">
    {t('selling_section_title_2')} <CircleDollarSign className="mt-[6px]" />
  </span>
</h1>

  <p className='mt-4 text-sm max-w-prose text-gray-400'>
    {t('selling_section_subtitle')}
  </p>

  <div className="mt-6">
      <RedirectToCreateSellerProfile className='px-4 py-3 text-sm font-semibold bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition' href='/MarketPlace/create-seller-profile' >
        {t('selling_section_button')}
      </RedirectToCreateSellerProfile>
  </div>

  </div>

</div>


<section className='bg-muted/50 border-2 rounded-2xl border-slate-500 w-[90%] mx-auto my-8'>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 px-10">
    
    {/* Left Side - Text */}
    <div className="flex flex-col justify-center">
      <h2 className="text-xl font-semibold mb-2">{t('why_sell_title')}</h2>
      <p className='my-1 text-md max-w-prose text-muted-foreground'>
      {t('why_sell_paragraph')}
      </p>

      <div className='my-2'>
      <Link href="/about">
        <Button className="" variant='link'>
          {t('learn_more_about_us')}
        </Button>
      </Link>
    </div>

       <h2 className="text-xl font-semibold my-2">{t('guarantee_title')}</h2>

      <ul className="list-disc ml-6 my-2 space-y-2 text-md text-blue-500">
        <li>{t('guarantee_selling_1')}</li>
        <li>{t('guarantee_selling_2')}</li>
        <li>{t('guarantee_selling_3')}</li>
        <li>{t('guarantee_selling_4')}</li>
        <li>{t('guarantee_selling_5')}</li>
        <li>{t('guarantee_selling_6')}</li>

      </ul>
    </div>

    {/* Right Side - Image */}
    <div className="flex justify-center my-8">
    <div className='px-2 lg:px-10'>
              <div className='mt-2 flow-root sm:mt-24'>
                <div className='-m-10 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-16 lg:rounded-2xl lg:p-4'>
                  <NextImage
                    src={"/Seller Dashboard.png"}
                    alt='seller store preview'
                    width={1013}
                    height={1013}
                    quality={100}
                    className='rounded-md bg-white object-fill shadow-2xl ring-1 ring-gray-900/10'
                  />
                </div>
              </div>
            </div>
    </div>
  </div>

  <div className='flex flex-col items-center justify-center mt-2'>
    <p className='mt-4 text-sm max-w-prose text-muted-foreground'>
      {t('selling_policy_question')}
    </p>
    <div className=''>
      <Link href="/sellingPolicy">
        <Button className="text-red-500" variant='link'>
          {t('learn_more')}
        </Button>
      </Link>
    </div>
  </div>
</section>


{/* Affiliate program section */}

{!platform?.closeAffiliateProgram && (

<>
<div className='py-10 mt-2 mx-auto flex flex-col w-[80%] rounded-2xl bg-center  border-2
    bg-[url("/bgBanner.png")]'>

  <div className="text-center flex flex-col items-center">
    <h1 className="text-3xl font-bold tracking-tight text-white">
      {t('affiliate_section_title_1')}{' '}
      <span className="inline-flex items-center gap-1 text-purple-600">
        {t('affiliate_section_title_2')}
      </span>
    </h1>

    <p className='mt-4 text-sm max-w-prose text-gray-400'>
      {t('affiliate_section_subtitle')}
    </p>

    <div className="mt-6">
      <RedirectToCreateAffiliateAccount className='px-4 py-3 text-sm font-semibold bg-purple-600 text-white rounded-md shadow-md hover:bg-purple-700 transition' href='/createAffiliateAccount' >
        {t('affiliate_section_button')}
      </RedirectToCreateAffiliateAccount>
    </div>
  </div>

</div>

<section className='bg-muted/50 border-2 rounded-2xl border-slate-500 w-[90%] mx-auto my-8'>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 px-10">
    
    <div className="flex flex-col justify-center">
      <h2 className="text-xl font-semibold mb-2">{t('why_affiliate_title')}</h2>
      <p className='my-1 text-md max-w-prose text-muted-foreground'>
        {t('why_affiliate_paragraph')}
      </p>

      <h2 className="text-xl font-semibold my-2">{t('guarantee_title')}</h2>

      <ul className="list-disc ml-6 my-2 space-y-2 text-md text-blue-500">
        <li>{t('guarantee_affiliate_1')}</li>
        <li>{t('guarantee_affiliate_2')}</li>
        <li>{t('guarantee_affiliate_3')}</li>
        <li>{t('guarantee_affiliate_4')}</li>
      </ul>
    </div>

    <div className="flex justify-center my-8">
    <div className='px-2 lg:px-10'>
              <div className='mt-2 flow-root sm:mt-16'>
                <div className='-m-10 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-16 lg:rounded-2xl lg:p-4'>
                  <NextImage
                    src={"/Affiliate Dashboard.png"}
                    alt='affiliate dashboard preview'
                    width={1013}
                    height={1013}
                    quality={100}
                    className='rounded-md bg-white object-fill shadow-2xl ring-1 ring-gray-900/10'
                  />
                </div>
              </div>
            </div>
    </div>

  </div>

  <div className='flex flex-col items-center justify-center mt-2'>
    <p className='mt-4 text-sm max-w-prose text-muted-foreground'>
      {t('affiliate_wish')}
    </p>
    <div className=''>
      <Link href="/createAffiliateAccount">
        <Button className="text-purple-500" variant='link'>
          {t('learn_more')}
        </Button>
      </Link>
    </div>
  </div>
</section>

</>
)}

    </>
  )
}

export default Page


