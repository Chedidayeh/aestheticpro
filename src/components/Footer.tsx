
import NextImage from 'next/image'
import MaxWidthWrapper from './MaxWidthWrapper'
import { FaFacebook, FaInstagram } from 'react-icons/fa'
import { getPlatformForTheWebsite, getUser } from '@/actions/actions'
import LoadingLink from './LoadingLink'
import Link from 'next/link'

const Footer = async () => {


  const user = await getUser()
  const platform = await getPlatformForTheWebsite()

  return (

<footer className='relative bottom-0 w-full bg-muted/100 border-t border-gray-800 dark:border-gray-200'>
  <MaxWidthWrapper>
    <div className='p-4'>
        <div className="flex justify-center flex-col sm:flex-row items-center sm:space-x-8">

        <div className="p-5 text-center sm:text-start">
          <ul>
            <p className="font-bold text-xl pb-4">Services</p>

            <Link href={"/MarketPlace"}>
                        <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                       Start Shopping
               </li>
            </Link>

            {/* {!user && (
            <Link href={"/createAffiliateAccount"}>
                        <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                       Affiliate  Marketing <span className='text-green-500'>$</span>
               </li>
            </Link>
             )}

            {user?.isAffiliate === false && (
            <Link href={"/createAffiliateAccount"}>
                        <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                       Affiliate  Marketing <span className='text-green-500'>$</span>
               </li>
            </Link>
             )}

              {user?.isAffiliate === true && (
            <LoadingLink href={"/createAffiliateAccount"}>
                        <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                        Affiliate Dashboard
               </li>
            </LoadingLink>
             )} */}

                {!user && (
                       <Link href={"/MarketPlace/create-seller-profile"}>
                       <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                       Become a Seller  <span className='text-green-500'>$</span>
                       </li>
                     </Link>
                 )} 

            {platform?.closeStoreCreation && user && user.userType === "USER" && (
            <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
            Become a Seller : Soon Available !
          </li>
            )} 

          {!platform?.closeStoreCreation && user && user.userType === "USER" && (
                        <Link href={"/MarketPlace/create-seller-profile"}>
                        <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                        Become a Seller  <span className='text-green-500'>$</span>
                        </li>
                      </Link>
            )} 
            
            {user && user.userType === "SELLER" && (
              <LoadingLink href={"/sellerDashboard"}>
              <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
              Seller Dashboard
            </li>
            </LoadingLink>
            )}

            {user && user.userType === "ADMIN" && (
              <LoadingLink href={"/adminDashboard"}>
              <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
              Admin Dashboard
            </li>
            </LoadingLink>
            )}

            {user && user.userType === "FACTORY" && (
              <LoadingLink href={"/factoryDashboard"}>
              <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
              Factory Dashboard
            </li>
            </LoadingLink>
            )}

          </ul>
        </div>
        <div className="p-5 text-center sm:text-start">
          <ul>
            <p className="font-bold text-xl pb-4">Platform</p>
            <LoadingLink href={"/about"}>
              <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                About Us
              </li>
            </LoadingLink>

            <LoadingLink href={"/contact"}>
            <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                Contact
                </li>
          </LoadingLink>  



          </ul>
        </div>
        <div className="p-5 text-center sm:text-start">
          <ul>
            <p className="font-bold text-xl pb-4">Policy</p>
            <LoadingLink href='/sellingPolicy'>
            <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
              Selling Policy
              </li>
            </LoadingLink>
            <LoadingLink href={"/buyingPolicy"}>
              <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                Buying Policy
              </li>
            </LoadingLink>

          </ul>
        </div>
        </div>



      <div className='flex flex-col sm:flex-row sm:justify-between justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4'>
        <div className='text-center sm:text-left'>
          <p className='text-sm font-semibold text-muted-foreground mt-1 mx-4'>
            &copy; {new Date().getFullYear()}. All rights reserved. AestheticPro.tn
          </p>
        </div>

        <div className='flex items-center justify-center'>
          <div className='flex flex-col sm:flex-row gap-4 sm:space-x-8'>

          <LoadingLink href='/privacyPolicy' className="text-muted-foreground text-sm mt-1 font-semibold hover:text-blue-600 cursor-pointer">
              Privacy Policy
            </LoadingLink>
  
            <div className="text-muted-foreground text-sm font-semibold flex flex-col sm:flex-row items-center justify-center gap-2">
              Social Media:
              <div className="flex gap-3 mb-1">
              <LoadingLink href={"https://www.facebook.com/profile.php?id=61564936846426"} className='border-1 rounded-full bg-white'>
              <FaFacebook className="text-2xl cursor-pointer hover:text-blue-600 text-blue-600" />
              </LoadingLink>
              <LoadingLink href={"https://www.instagram.com/aestheticpro.tn/"}  className='border-1 rounded-lg bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600'>
              <FaInstagram className="text-2xl cursor-pointer text-white" />
              </LoadingLink>
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