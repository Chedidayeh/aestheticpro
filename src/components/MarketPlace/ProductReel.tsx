'use client'

import LoadingLink from '../LoadingLink'
import ProductListing from './ProductListing'
import { Product, Store, User } from '@prisma/client'

interface Productswithstore extends Product {
  store : Store
}
interface ProductReelProps {
  user?: User
  title?: string
  href?: string
  products : Productswithstore[]
  subtitle?: string

}

const ProductReel = (props: ProductReelProps) => {
  const { user,title, subtitle, href , products } = props

  return (
    <section className='py-4'>
      <div className='md:flex md:items-center md:justify-between mb-4'>
        <div className='max-w-2xl px-4 lg:max-w-4xl lg:px-0'>
          {title ? (
            <h1 className='text-2xl font-bold  sm:text-2xl'>
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className='mt-2 text-sm text-muted-foreground'>
              {subtitle}
            </p>
          ) : null}
        </div>

        {href ? (
          <div className="text-center">
          <LoadingLink
            href={href}
            className=' text-sm font-medium text-blue-600 hover:text-blue-500'>
            Shop the collection{' '}
            <span aria-hidden='true'>&rarr;</span>
          </LoadingLink>
          </div>
        ) : null}
      </div>


            <div className='relative'>
            {products?.length === 0 ? (
              <div className='flex h-full flex-col items-center justify-center space-y-1'>
                <h3 className='font-semibold text-2xl'>
                  this section is empty for now !
                </h3>
                <p className='text-muted-foreground text-center'>
                  Whoops! Nothing to show here yet.
                </p>
              </div>
            ) : (
              <>
            <div className=' w-full grid p-2
              lg:grid-cols-4 
              md:grid-cols-2 
              sm:grid-cols-2
              grid-cols-2
              gap-y-4
              gap-2
              sm:gap-x-8  
              md:gap-y-10
              lg:gap-x-4'>

            {products?.map((product, index) => (
              <ProductListing
                user={user!}
                key={`product-${index}`}
                product={product}
                index={index+1}
              />
            ))} 

          </div>
        </>
            )}


      </div>
    </section>
  )


  
}




export default ProductReel