import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import {
  Button,
} from '@/components/ui/button'
import {
  DollarSign,
  HandCoins,
  Headset,
  Truck,
} from 'lucide-react'
import LoadingLink from './LoadingLink';

const PerkSection = () => {
  const perks = [
    {
      name: 'Sell Your Designs',
      Icon: HandCoins,
      description:
        'Launch your own brand by selling custom designs on our platform. Reach a wider audience and turn your creativity into profit.',
    },
    // {
    //   name: 'Affiliate Program',
    //   Icon: DollarSign,
    //   description:
    //     'Join our affiliate program to earn commissions by promoting our products. Share your unique link and get rewarded for every sale.',
    // },
    {
      name: 'Fast Printing & Delivery',
      Icon: Truck,
      description:
        'We take care of printing and shipping process.',
    },
    {
      name: 'Excellent Customer Support',
      Icon: Headset,
      description:
        'Our dedicated customer support team is here to help you with any questions or issues, ensuring a smooth and satisfying experience.',
    },

  ];

  return (
    <div className='items-center flex justify-center my-4'>
      <section className='border rounded-2xl w-[80%] border-gray-200'>
        <MaxWidthWrapper className='py-4'>
          <div className='items-center flex justify-center my-2'>
          <h2 className='text-2xl font-bold'>Our Services</h2>
          </div>
          <div className='grid grid-cols-1 gap-y-12 sm:grid-cols-1 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0'>
            {perks.map((perk) => (
              <div
                key={perk.name}
                className='text-center md:flex md:items-start md:text-left lg:block lg:text-center'>
                <div className='md:flex-shrink-0 flex justify-center'>
                  <div className='h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-900'>
                    {<perk.Icon className='w-1/3 h-1/3' />}
                  </div>
                </div>

                <div className='mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6'>
                  <h3 className='text-base font-medium'>
                    {perk.name}
                  </h3>
                  <p className='mt-3 text-xs text-muted-foreground'>
                    {perk.description}
                  </p>
                </div>
              </div>
            ))}
            <div>

            </div>
            
          </div>
          <div className='my-2 flex items-center justify-center'>
        <LoadingLink href="/services">
          <Button className="" variant='link'>
            Learn More about our services &rarr;
          </Button>
        </LoadingLink>
         </div>
        </MaxWidthWrapper>
      </section>
    </div>
  )
}

export default PerkSection;
