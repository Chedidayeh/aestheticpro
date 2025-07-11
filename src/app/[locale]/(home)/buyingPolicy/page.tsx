/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
'use client'
import {  TriangleAlert } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import { useTranslations } from 'next-intl';


const Page = () => {
  const t = useTranslations('BuyingPolicyPage');




  return (
    <>



    <div className=''>
      <div className='mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8'>
        <div className='max-w-3xl'>
          <p className='text-base font-medium text-primary'>{t('buyingPolicyTitle')}</p>
          <h1 className='mt-2 text-4xl font-bold tracking-tight sm:text-5xl'>
            {t('readItCarefully')}
          </h1>
          <div className='mt-2 flex items-center text-base text-zinc-500'>
              <TriangleAlert className="h-4 w-4 mr-2 text-red-500" />
              <p className='text-muted-foreground'>
                {t('betterShoppingExperience')}
              </p>
            </div>
        </div>

        <Separator className="my-8"/>

        <div className='mt-10 flex space-y-3 flex-col text-right'>

  <p className="text-muted-foreground inline-flex items-end flex-col space-y-4">
  <span> عند تسليم المنتج إليك، يمكنك التحقق منه بنفسك فورًا عندما يقوم موظف التوصيل بتسليمه لك</span>
  <span>يمكن استبدال المنتجات فقط إذا كان بها عيب ظاهر. على سبيل المثال، لا يمكنك إرجاع أو استبدال المنتج لمجرد أنك غيرت رأيك بعد الشراء</span>
  <span>لا نقبل استبدال المنتجات بناءً على عدم ملاءمة المقاس أو رغبتك في تغييره بعد استلام المنتج. جميع أبعاد المنتجات موضحة بالتفصيل بالسنتيمتر في صفحة المنتج، لذا يرجى مراجعتها بعناية قبل تقديم الطلب. حيث يتم طباعة كل منتج خصيصًا وفقًا لطلبك، لا يمكننا إعادة بيع المنتج إذا تم طلب مقاس غير صحيح</span>
  <span>في حالة طلب كمية كبيرة من المنتجات، يرجى ملاحظة أنه بمجرد تنفيذ الطلب، لا يمكن استرجاعه أو استبداله، حيث يتم طباعة كل منتج بشكل فريد لك. في هذه الحالة، نوصي بطلب عينة أولاً للتأكد من جودة المنتج قبل تقديم طلب الكمية المطلوبة</span>
  <span>إذا تم استبدال المنتج بسبب عيب ظاهر، سيتم استبداله بمنتج جديد في غضون 7 أيام عمل، بدءًا من وقت عودة المنتج الأصلي إلينا</span>
  <span>في حالة الاسترجاع، سنقوم بتغطية رسوم إعادة الشحن للمنتجات التي تحتوي على عيوب تصنيعية، لكن العميل يتحمل رسوم الشحن الأصلية</span>
  <span>يجب أن يكون المنتج في حالته الأصلية، بما في ذلك جميع المكونات والتغليف الأصلي، لأي عملية استبدال</span>
</p>
</div>

<Separator className="my-8"/>


        <div className='mt-10 flex space-y-3 flex-col'>

            <p className=" text-muted-foreground inline-flex items-start flex-col space-y-4">
              <span>• {t('whenProductDelivered')}</span>
              <span>• {t('productsCanOnlyBeExchanged')}</span>
              <span>• {t('weDoNotAcceptExchanges')}</span>
              <span>• {t('whenOrderingMultipleItems')}</span>
              <span>• {t('theProductMustBeInItsOriginalCondition')}</span>
              <span>• {t('ifProductExchangedDueToVisibleDefect')}</span>
              <span>• {t('inCaseOfReturn')}</span>
            </p>

          </div>





  

      </div>
    </div>
    </>
  )
}

export default Page


