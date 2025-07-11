/* eslint-disable react/no-unescaped-entities */
'use client'
import NextImage from 'next/image'
import {  RocketIcon } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import { useTranslations } from 'next-intl';


const Page = () => {
  const t = useTranslations('AboutPage');


  return (
    <>



    <div className=''>
      <div className='mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8'>
        <div className='max-w-3xl'>
          <div>
          <div className="flex  items-center justify-center lg:px-6">
        <div style={{ width: '300px', height: '300px' }} className=''>
          <NextImage
              src={"/aestheticProLogo.png"}
              width={1000}
              height={1000}
              alt="logo"
              onContextMenu={(e) => e.preventDefault()}
              draggable={false}
          />
      </div>
        </div>
          </div>
          <p className='text-base font-medium text-primary'>{t('about_us')}</p>
          <h1 className='mt-2 text-4xl font-bold tracking-tight sm:text-4xl'>
            {t('discover_brand_purpose')}
          </h1>
          <div className='mt-2 flex items-center text-base text-zinc-500'>
              <RocketIcon className="h-4 w-4 mr-2 text-primary" />
              <p className='text-muted-foreground'>
              {t('sky_level')}
              </p>
            </div>
        </div>

        <Separator className="my-8"/>




          <div className='mt-10 flex space-y-3 flex-col text-right'>
          <h4 className='font-semibold '>
            تعريف عملنا
          </h4>
          <p className="text-muted-foreground inline-flex items-center">
             تقدم منصتنا خدمة الطباعة حسب الطلب الفريدة، 
            مما يتيح للعملاء إنشاء وتصميم تصاميمهم الخاصة 
            على المنتجات التي يختارونها. نحن نمنح الفنانين 
            ورواد الأعمال وأي شخص يمتلك شغفًا إبداعيًا القدرة 
            على تحويل أفكارهم إلى واقع. من خلال توفير هذه 
            المنصة، نُمكّن المصممين التونسيين من إطلاق 
            إبداعهم، وتحويل رؤاهم إلى واقع، ومشاركة فنهم 
            من خلال علامتنا التجارية
          </p>
          </div>

          <div className='mt-10 flex space-y-3 flex-col text-right'>
            <h4 className='font-semibold '>
               الهدف الذي نريد تحقيقه
            </h4>
            <p className="text-muted-foreground inline-flex items-center">
               هدفنا هو أن نصبح الوجهة الأولى للمنتجات 
              المخصصة، مما يجعل التخصيص سهلًا وممتعًا 
              ومتاحة للجميع. نهدف إلى دعم الإبداع والابتكار، 
              وتوفير منصة حيث يمكن لأي شخص عرض تصاميمه، 
              الوصول إلى جمهور عالمي، وتحويل شغفه إلى ربح
            </p>
          </div>

          <div className='mt-10 flex space-y-3 flex-col text-right'>
            <h4 className='font-semibold '>
              لماذا نحن مختلفون عن العلامات التجارية الأخرى
            </h4>
            <p className="text-muted-foreground inline-flex items-center">
               ما يميزنا هو التزامنا بالجودة والاستدامة ورضا 
              العملاء. نستخدم عمليات طباعة صديقة للبيئة ومواد 
              مستدامة ومتينة وأخلاقية الإنتاج. تضمن واجهتنا 
              سهلة الاستخدام ودعم العملاء المخصص أن يحصل 
              كل عميل، سواء كان يصمم لنفسه أو يبدأ علامته 
              التجارية الخاصة، على تجربة سلسة من البداية 
              إلى النهاية. كما نقدم شحنًا سريعًا وضمان 
              رضا، حتى يتمكن عملاؤنا من التسوق بثقة
            </p>
          </div>
          <Separator className="my-8"/>



        <div className='mt-10 flex space-y-3 flex-col'>
            <h4 className='font-semibold '>
              {t('define_business_title')}
            </h4>
            <p className="text-muted-foreground inline-flex items-center">
            {t('define_business_desc')}
            </p>
          </div>

          <div className='mt-10 flex space-y-3 flex-col'>
            <h4 className='font-semibold '>
              {t('goal_title')}
            </h4>
            <p className="text-muted-foreground inline-flex items-center">
            {t('goal_desc')}
            </p>
          </div>

          <div className='mt-10 flex space-y-3 flex-col'>
            <h4 className='font-semibold '>
              {t('why_different_title')}
            </h4>
            <p className="text-muted-foreground inline-flex items-center">
            {t('why_different_desc')}
            </p>
          </div>


        




      </div>
    </div>
    </>
  )
}

export default Page


