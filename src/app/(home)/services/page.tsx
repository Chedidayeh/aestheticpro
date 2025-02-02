/* eslint-disable react/no-unescaped-entities */
'use server'
import NextImage from 'next/image'
import {  CircleDollarSign, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import RedirectToCreateAffiliateAccount from '@/components/RedirectToCreateAffiliateAccount'
import RedirectToCreateSellerProfile from '@/components/RedirectToCreateSellerProfile'
import ProductListing from '@/components/MarketPlace/ProductListing'
import { fetchTrendingProducts, getUser } from '@/actions/actions'
import LoadingLink from '@/components/LoadingLink'


const Page = async () => {
  const user = await getUser();

  const trendingProducts = await fetchTrendingProducts()

  return (
    <>

    {/* buying section */}
<div className='py-10 mx-auto flex flex-col w-[80%] rounded-2xl bg-center border-2
    bg-[url("/bgBanner.png")]'>

  <div className="text-center flex flex-col items-center">
    <h1 className="text-3xl font-bold tracking-tight text-white">
      How we offer the best shopping experience{' '}
      <span className="inline-flex items-center gap-1 text-red-600">
        for you <Heart className="mt-[6px]" />
      </span>
    </h1>

    <p className='mt-4 text-sm max-w-prose text-gray-400'>
      Discover unique, high-quality designs from our talented creators, all in one place. Experience shopping like never before!
    </p>

    <div className="mt-6">
      <LoadingLink href="/MarketPlace">
        <Button className="px-4 py-3 text-sm font-semibold bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 transition">
          Start Shopping &rarr;
        </Button>
      </LoadingLink>
    </div>
  </div>

</div>

<section className='bg-muted/50 border-2 rounded-2xl border-slate-500 w-[90%] mx-auto my-8'>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 px-10">
    <div className="flex flex-col justify-center">
      <h2 className="text-xl font-semibold mb-2">Why Shop at AestheticPro.tn?</h2>
      <p className='my-1 text-md max-w-prose text-muted-foreground'>
        At AestheticPro.tn, we bring you the finest designs, crafted by talented creators. Each piece is a unique expression of creativity that you won’t find anywhere else.
      </p>

      <div className='my-2'>
        <LoadingLink href="/about">
          <Button className="" variant='link'>
            Learn More About Us &rarr;
          </Button>
        </LoadingLink>
      </div>

      <h2 className="text-xl font-semibold my-2">What we guarantee for you:</h2>

      <ul className="list-disc ml-6 my-2 space-y-2 text-md text-blue-500">
        <li>A vast collection of one-of-a-kind designs to match your style.</li>
        <li>High-quality products with premium printing and materials.</li>
        <li>Fast, reliable shipping with transparent tracking.</li>
        <li>Hassle-free returns and exchanges for a smooth shopping experience.</li>
        <li>Supporting local and emerging designers from Tunisia.</li>
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
      Ready to explore the latest collections?
    </p>
    <div className=''>
      <LoadingLink href="/MarketPlace">
        <Button className="text-red-500" variant='link'>
          Start Shopping Now &rarr;
        </Button>
      </LoadingLink>
    </div>
  </div>
</section>


{/* selling section */}
<div className='py-10 mt-2 mx-auto  flex flex-col w-[80%] rounded-2xl  bg-center  border-2
    bg-[url("/bgBanner.png")]'>

      <div className="text-center flex flex-col items-center">
<h1 className="text-3xl font-bold tracking-tight text-white">
  Want to make some{' '}
  <span className="inline-flex items-center gap-1 text-green-600">
    money <CircleDollarSign className="mt-[6px]" />
  </span>
</h1>

  <p className='mt-4 text-sm max-w-prose text-gray-400'>
    Become a seller, Sell your designs on our platform and gain profits !
  </p>

  <div className="mt-6">
      <RedirectToCreateSellerProfile />
  </div>

  </div>

</div>


<section className='bg-muted/50 border-2 rounded-2xl border-slate-500 w-[90%] mx-auto my-8'>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 px-10">
    
    {/* Left Side - Text */}
    <div className="flex flex-col justify-center">
      <h2 className="text-xl font-semibold mb-2">Why Sell on AestheticPro.tn?</h2>
      <p className='my-1 text-md max-w-prose text-muted-foreground'>
      AestheticPro.tn is the first platform in Tunisia offering opportunities to earn income through your creativity. Sell your designs, express your artistic vision, and watch your work come to life !
      </p>

      <div className='my-2'>
      <LoadingLink href="/about">
        <Button className="" variant='link'>
          Learn More About Us &rarr;
        </Button>
      </LoadingLink>
    </div>

       <h2 className="text-xl font-semibold my-2">What we guarantee for you :</h2>

      <ul className="list-disc ml-6 my-2 space-y-2 text-md text-blue-500">
        <li>Earning passive income by selling your designs.</li>
        <li>Reaching a wide audience and grow your personal brand.</li>
        <li>We handle production, shipping, and customer service for you.</li>
        <li>Joining a community of talented designers and creators.</li>
        <li>Free marketing support to promote your products across our platform and social media.</li>
        <li>Regular insights and tips to help you maximize your sales potential.</li>

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
      Wanna know about our Selling Policy?
    </p>
    <div className=''>
      <LoadingLink href="/sellingPolicy">
        <Button className="text-red-500" variant='link'>
          Learn More &rarr;
        </Button>
      </LoadingLink>
    </div>
  </div>
</section>


{/* Affiliate program section */}
{/* <div className='py-10 mt-2 mx-auto flex flex-col w-[80%] rounded-2xl bg-center  border-2
    bg-[url("/bgBanner.png")]'>

  <div className="text-center flex flex-col items-center">
    <h1 className="text-3xl font-bold tracking-tight text-white">
      Not a designer ?{' '}
      <span className="inline-flex items-center gap-1 text-purple-600">
        Join our Affiliate Program
      </span>
    </h1>

    <p className='mt-4 text-sm max-w-prose text-gray-400'>
      Earn money by promoting our products! Share with your audience and earn commissions for each sale made through your referral.
    </p>

    <div className="mt-6">
    <RedirectToCreateAffiliateAccount />
    </div>
  </div>

</div>

<section className='bg-muted/50 border-2 rounded-2xl border-slate-500 w-[90%] mx-auto my-8'>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 px-10">
    
    <div className="flex flex-col justify-center">
      <h2 className="text-xl font-semibold mb-2">Why Join Our Affiliate Program?</h2>
      <p className='my-1 text-md max-w-prose text-muted-foreground'>
        AestheticPro.tn offers an exciting opportunity for non-designers to earn income by promoting our unique products. Simply share your special affiliate link and earn a commission for every successful referral.
      </p>

      <h2 className="text-xl font-semibold my-2">What we guarantee for you:</h2>

      <ul className="list-disc ml-6 my-2 space-y-2 text-md text-blue-500">
        <li>Generous commission on every sale made through your referral.</li>
        <li>Real-time tracking of your performance and earnings.</li>
        <li>Support from our marketing team to maximize your impact.</li>
        <li>Flexible payouts and hassle-free withdrawal process.</li>
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
      We wish you the best
    </p>
    <div className=''>
      <LoadingLink href="/createAffiliateAccount">
        <Button className="text-purple-500" variant='link'>
          Learn More &rarr;
        </Button>
      </LoadingLink>
    </div>
  </div>
</section> */}

    </>
  )
}

export default Page


