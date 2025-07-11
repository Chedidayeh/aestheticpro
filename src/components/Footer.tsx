
'use client'


import NextImage from 'next/image'
import MaxWidthWrapper from './MaxWidthWrapper'
import { FaFacebook, FaInstagram } from 'react-icons/fa'
import { getPlatformForTheWebsite, getUser } from '@/actions/actions'
import Link from 'next/link'
import { Platform, User } from '@prisma/client'
import { useTranslations } from 'next-intl';

const Footer = ({user , platform} : {user : User , platform : Platform}) => {
  const t = useTranslations('CommonComponents');


  const handleFacebookIconClick = () => {
    const url = "https://www.facebook.com/profile.php?id=61564936846426"
    window.open(url!, '_blank', 'noopener,noreferrer');
  };

  const handleInstagramIconClick = () => {
    const url = "https://www.instagram.com/aestheticpro.tn/"
    window.open(url!, '_blank', 'noopener,noreferrer');
  };

  return (

<footer className='relative bottom-0 w-full bg-muted/100 border-t border-gray-800 dark:border-gray-200'>
  <MaxWidthWrapper>
    <div className='p-4'>
        <div className="flex justify-center flex-col sm:flex-row items-center sm:space-x-8">

        <div className="p-5 text-center sm:text-start">
          <ul>
            <p className="font-bold text-xl pb-4">{t('services')}</p>


            {platform.closeAffiliateProgram ? (
            <Link href="/MarketPlace">
              <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                {t('startShopping')}
              </li>
            </Link>
          ) : (
            <>
              {!user || user?.isAffiliate === false ? (
                <Link href="/createAffiliateAccount">
                  <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                    {t('affiliateMarketing')} <span className="text-green-500">$</span>
                  </li>
                </Link>
              ) : (
                <Link href="/affiliateDashboard">
                  <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                    {t('affiliateDashboard')}
                  </li>
                </Link>
              )}
            </>
          )}




           

          {(!user || (user.userType === "USER" && !platform?.closeStoreCreation)) && (
            <Link href="/MarketPlace/create-seller-profile">
              <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                {t('becomeSeller')} <span className="text-green-500">$</span>
              </li>
            </Link>
          )}

          {user?.userType === "USER" && platform?.closeStoreCreation && (
            <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
              {t('becomeSellerSoon')}
            </li>
          )}

            
            {user && user.userType === "SELLER" && (
              <Link href={"/sellerDashboard"}>
              <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
              {t('sellerDashboard')}
            </li>
            </Link>
            )}

            {user && user.userType === "ADMIN" && (
              <Link href={"/adminDashboard"}>
              <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
              {t('adminDashboard')}
            </li>
            </Link>
            )}

            {user && user.userType === "FACTORY" && (
              <Link href={"/factoryDashboard"}>
              <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
              {t('factoryDashboard')}
            </li>
            </Link>
            )}

          </ul>
        </div>
        <div className="p-5 text-center sm:text-start">
          <ul>
            <p className="font-bold text-xl pb-4">{t('platform')}</p>
            <Link href={"/about"}>
              <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                {t('aboutUs')}
              </li>
            </Link>

            <Link href={"/contact"}>
            <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                {t('contact')}
                </li>
          </Link>  



          </ul>
        </div>
        <div className="p-5 text-center sm:text-start">
          <ul>
            <p className="font-bold text-xl pb-4">{t('policy')}</p>
            <Link href='/sellingPolicy'>
            <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
              {t('sellingPolicy')}
              </li>
            </Link>
            <Link href={"/buyingPolicy"}>
              <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                {t('buyingPolicy')}
              </li>
            </Link>

          </ul>
        </div>
        </div>



      <div className='flex flex-col sm:flex-row sm:justify-between justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4'>
        <div className='text-center sm:text-left'>
          <p className='text-sm font-semibold text-muted-foreground mt-1 mx-4'>
            &copy; {new Date().getFullYear()}. {t('allRightsReserved')}
          </p>
        </div>

        <div className='flex items-center justify-center'>
          <div className='flex flex-col sm:flex-row gap-4 sm:space-x-8'>

          <Link href='/privacyPolicy' className="text-muted-foreground text-sm mt-1 font-semibold hover:text-blue-600 cursor-pointer">
              {t('privacyPolicy')}
            </Link>
  
            <div className="text-muted-foreground text-sm font-semibold flex flex-col sm:flex-row items-center justify-center gap-2">
              {t('socialMedia')}
              <div className="flex gap-3 mb-1">
              <div onClick={handleFacebookIconClick} className='border-1 rounded-full bg-white'>
              <FaFacebook className="text-2xl cursor-pointer hover:text-blue-600 text-blue-600" />
              </div>
              <div  onClick={handleInstagramIconClick} className='border-1 rounded-lg bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600'>
              <FaInstagram className="text-2xl cursor-pointer text-white" />
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </MaxWidthWrapper>
</footer>


  )
}

export default Footer