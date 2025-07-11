/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client'

import NextImage from 'next/image'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const Steps = () => {
  const t = useTranslations('CommonComponents');
  const STEPS = [
    {
      name: t('step1Name'),
      description: t('step1Desc'),
      url: '/select-category',
      href : '/MarketPlace/create-client-product/select-category'
    },
    {
      name: t('step2Name'),
      description: t('step2Desc'),
      url: '/upload',
      href : '/MarketPlace/create-client-product/upload'

    },
    {
      name: t('step3Name'),
      description: t('step3Desc'),
      url: '/preview',
      href : '/MarketPlace/create-client-product/preview'

    },
  ];
  const pathname = usePathname()

  return (
    <ol className='rounded-md lg:flex lg:rounded-none lg:border-l lg:border-r lg:border-gray-200'>
      {STEPS.map((step, i) => {
        const isCurrent = pathname.endsWith(step.url)
        const isCompleted = STEPS.slice(i + 1).some((step) =>
          pathname.endsWith(step.url)
        )
        return (
          <li key={step.name} className='relative cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600/50 overflow-hidden lg:flex-1'>
                      <Link href={step.href} >
            <div>
              <span
                className={cn(
                  'absolute left-0 top-0 h-full w-1 bg-zinc-400 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full',
                  {
                    'bg-blue-200': isCurrent,
                    'bg-primary': isCompleted,
                  }
                )}
                aria-hidden='true'
              />

              <span
                className={cn(
                  i !== 0 ? 'lg:pl-9' : '',
                  'flex items-center px-6 py-4 text-sm font-medium'
                )}>

                <span className='ml-4 h-full mt-0.5 flex min-w-0 flex-col justify-center'>
                  <span
                    className={cn('text-sm font-semibold', {
                      'text-primary': isCompleted,
                      'text-blue-700 animate-pulse': isCurrent,
                    })}>
                    {step.name}
                  </span>
                  <span className='text-sm text-muted-foreground '>
                    {step.description}
                  </span>
                </span>
              </span>

              {/* separator */}
              {i !== 0 ? (
                <div className='absolute inset-0  hidden w-3 lg:block'>
                  <svg
                    className='h-full w-full '
                    viewBox='0 0 12 82'
                    fill='none'
                    preserveAspectRatio='none'>
                    <path
                      d='M0.5 0V31L10.5 41L0.5 51V82'
                      stroke='currentcolor'
                      vectorEffect='non-scaling-stroke'
                    />
                  </svg>
                </div>
              ) : null}
            </div>
            </Link>

          </li>
        )
      })}
    </ol>
  )
}

export default Steps
