/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
'use client'

import {  Shield } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import { useTranslations } from 'next-intl';

const Page = () => {
  const t = useTranslations('PrivacyPolicyPage');





 


  return (
    <>



    <div className=''>
      <div className='mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8'>
        <div className='max-w-3xl'>
          <p className='text-base font-medium text-primary'>{t('privacyPolicyTitle')}</p>
          <h1 className='mt-2 text-4xl font-bold tracking-tight sm:text-5xl'>
            {t('readItCarefully')}
          </h1>
          <div className='mt-2 flex items-center text-base text-zinc-500'>
              <Shield className="h-4 w-4 mr-2 text-blue-500" />
              <p className='text-muted-foreground'>
                {t('allDataIsSafe')}
              </p>
            </div>
        </div>

        <Separator className="my-8"/>

        <div className='mt-10 flex space-y-3 flex-col text-right'>

  <p className="text-muted-foreground inline-flex items-end flex-col space-y-4 text-right">
  <span>: المعلومات التي نجمعها</span>
  <span>المعلومات الشخصية: الاسم، البريد الإلكتروني، العنوان</span>
  <span>معلومات التصميم: ملفات التصميم والبيانات المتعلقة بها</span>

  <span>: كيفية استخدام معلوماتك</span>
  <span>معالجة الطلبات: لتلبية الطلبات والتواصل معك</span>
  <span>تحسين الخدمة: لتحسين وتطوير منصتنا</span>
  <span>التواصل: لإرسال التحديثات والمواد الترويجية</span>
  
  <span>: مشاركة البيانات</span>
  <span>مزودو الخدمة: نشارك المعلومات مع أطراف ثالثة تساعدنا في التشغيل</span>
  <span>المتطلبات القانونية: قد نكشف عن المعلومات حسب الحاجة بموجب القانون</span>
  
  <span>: أمان البيانات</span>
  <span>نستخدم تدابير لحماية معلوماتك </span>
  
  <span>: حقوقك</span>
  <span>الوصول والتصحيح: يمكنك الوصول إلى معلوماتك وتحديثها</span>
  <span>الحذف: طلب حذف معلوماتك حيثما أمكن</span>
  
  <span>: الاتصال</span>
  <span>للاستفسارات، اتصل بنا على </span>
</p>

</div>

<Separator className="my-8"/>


        <div className='mt-10 flex space-y-3 flex-col'>

            <p className="text-muted-foreground inline-flex items-start flex-col space-y-4">
              <span>{t('informationWeCollect')}</span>
              <span>{t('personalInformation')}</span>
              <span>{t('designInformation')}</span>

              <span>{t('howWeUseYourInformation')}</span>
              <span>{t('orderProcessing')}</span>
              <span>{t('serviceImprovement')}</span>
              <span>{t('communication')}</span>
              
              <span>{t('dataSharing')}</span>
              <span>{t('serviceProviders')}</span>
              <span>{t('legalRequirements')}</span>
              
              <span>{t('dataSecurity')}</span>
              <span>{t('dataProtection')}</span>
              
              <span>{t('yourRights')}</span>
              <span>{t('accessAndCorrection')}</span>
              <span>{t('deletion')}</span>
              
              <span>{t('contact')}</span>
              <span>{t('contactUs')}</span>
            </p>



          </div>





  

      </div>
    </div>
    </>
  )
}

export default Page


