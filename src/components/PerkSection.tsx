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
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const PerkSection = () => {
  const t = useTranslations('CommonComponents');
  const perks = [
    {
      name: t('sellYourDesigns'),
      Icon: HandCoins,
      description: t('sellYourDesignsDesc'),
    },
    // {
    //   name: t('affiliateProgram'),
    //   Icon: DollarSign,
    //   description: t('affiliateProgramDesc'),
    // },
    {
      name: t('fastPrintingDelivery'),
      Icon: Truck,
      description: t('fastPrintingDeliveryDesc'),
    },
    {
      name: t('excellentCustomerSupport'),
      Icon: Headset,
      description: t('excellentCustomerSupportDesc'),
    },
  ];

  return (
    <div className='items-center flex justify-center my-4'>
      <section className='border rounded-2xl w-[80%] border-gray-200'>
        <MaxWidthWrapper className='py-4'>
          <div className='items-center flex justify-center my-2'>
          <h2 className='text-2xl font-bold'>{t('ourServices')}</h2>
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
        <Link href="/services">
          <Button className="" variant='link'>
            {t('learnMoreAboutServices')}
          </Button>
        </Link>
         </div>
        </MaxWidthWrapper>
      </section>
    </div>
  )
}

export default PerkSection;
