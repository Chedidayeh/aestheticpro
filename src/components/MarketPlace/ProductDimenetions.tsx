'use client'



interface ProductReelProps {
  title: string
  subtitle?: string

}

const FALLBACK_LIMIT = 4

const ProductDimenetions = (props: ProductReelProps) => {
  const { title, subtitle } = props

  return (
    <section className='py-12'>
      <div className='md:flex md:items-center md:justify-between mb-4'>
        <div className='max-w-2xl px-4 lg:max-w-4xl lg:px-0'>
          {title ? (
            <h1 className='text-xl font-bold  sm:text-xl'>
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className='mt-2 text-sm text-muted-foreground'>
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>

      <div className='relative'>
  <div className='mt-6 flex items-center w-full'>
  <div className='flex items-center justify-center'>

      Dimentions Image

    </div>
  </div>
</div>
    </section>
  )


  
}




export default ProductDimenetions