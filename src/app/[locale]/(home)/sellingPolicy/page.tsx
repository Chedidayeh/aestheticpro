/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
'use client'
import {  TriangleAlert } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import { useTranslations } from 'next-intl';

const Page = () => {
  const t = useTranslations('SellingPolicyPage');





 


  return (
    <>



    <div className=''>
      <div className='mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8'>
        <div className='max-w-3xl'>
          <p className='text-base font-medium text-primary'>Selling Policy !</p>
          <h1 className='mt-2 text-4xl font-bold tracking-tight sm:text-5xl'>
            Read it carefully!
          </h1>
          <div className='mt-2 flex items-center text-base text-zinc-500'>
              <TriangleAlert className="h-4 w-4 mr-2 text-red-500" />
              <p className='text-muted-foreground'>
                For better working experience.
              </p>
            </div>
        </div>

        <Separator className="my-8"/>

        <div className='mt-10 flex space-y-3 flex-col text-right'>

  <p className="text-muted-foreground inline-flex items-start flex-col space-y-4">
  <span>جودة التصاميم: لضمان أفضل جودة للمنتجات، يجب أن تكون التصاميم المقدمة عالية الدقة. يساهم هذا في الحفاظ على وضوح التفاصيل وضمان طباعة مثالية على المنتجات</span>
  <span>حقوق الملكية الفكرية: يجب أن تكون جميع التصاميم التي تقدمها من إبداعك الخاص أو لديك الحقوق الكاملة لاستخدامها. لا يُسمح بنشر أو بيع أي تصاميم تنتهك حقوق الملكية الفكرية لأي جهة أخرى. إذا تم اكتشاف انتهاك لهذه الحقوق، سيتم إزالة التصميم فورًا، وقد يتم اتخاذ إجراءات قانونية</span>
  <span>محتوى التصاميم: نرحب بجميع الأساليب الفنية، ولكن يجب أن تكون التصاميم ملتزمة بالمعايير الأخلاقية والقانونية. لا يُسمح بنشر أي محتوى عنصري، أو جنسي، أو سياسي متطرف، أو يروج للكراهية أو العنف</span>
  <span>عملية الموافقة: سيتم مراجعة جميع التصاميم من قبل فريقنا لضمان توافقها مع سياسات المنصة. قد يستغرق ذلك بعض الوقت، وستتلقى إشعارًا بمجرد قبول التصميم أو رفضه مع توضيح الأسباب</span>
  <span>التسعير والأرباح: يمكنك تحديد سعر البيع المناسب لتصميمك، مع مراعاة أن الأسعار التنافسية تزيد من فرص البيع. ستحصل على نسبة مئوية من الأرباح عن كل عملية بيع لتصميمك، والتي سيتم تحويلها إلى حسابك بشكل دوري</span>
  <span>التحديثات والإدارة: لديك الحرية في تحديث تصاميمك أو إزالة أي تصميم من المنصة في أي وقت. كما يمكنك إدارة مجموعة تصاميمك بسهولة من خلال لوحة التحكم المخصصة لك</span>
  <span>التواصل والدعم: نحن هنا لدعمك! إذا واجهت أي مشكلة أو كان لديك استفسار، فريق الدعم لدينا متاح لمساعدتك وضمان تجربة سلسة ومربحة على منصتنا</span>
</p>


</div>
<Separator className="my-8"/>

        <div className='mt-10 flex space-y-3 flex-col'>
  
            <p className="text-muted-foreground inline-flex items-start flex-col space-y-4">
              <span>{t('design_quality')}</span>
              <span>{t('intellectual_property_rights')}</span>
              <span>{t('content_guidelines')}</span>
              <span>{t('approval_process')}</span>
              <span>{t('pricing_and_earnings')}</span>
              <span>{t('updates_and_management')}</span>
              <span>{t('support_and_communication')}</span>
            </p>


          </div>





  

      </div>
    </div>
    </>
  )
}

export default Page


