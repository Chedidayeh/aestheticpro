/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
'use client'

import {  Shield } from 'lucide-react'
import { Separator } from "@/components/ui/separator"

const Page = () => {





 


  return (
    <>



    <div className=''>
      <div className='mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8'>
        <div className='max-w-3xl'>
          <p className='text-base font-medium text-primary'>Privacy Policy !</p>
          <h1 className='mt-2 text-4xl font-bold tracking-tight sm:text-5xl'>
            Read it carefully!
          </h1>
          <div className='mt-2 flex items-center text-base text-zinc-500'>
              <Shield className="h-4 w-4 mr-2 text-blue-500" />
              <p className='text-muted-foreground'>
                All Data is safe.
              </p>
            </div>
        </div>

        <Separator className="my-8"/>

        <div className='mt-10 flex space-y-3 flex-col text-right'>
  <h4 className='font-semibold'>
  : بالعربية 
  </h4>
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
            <h4 className='font-semibold '>
              In English : 
            </h4>
            <p className="text-muted-foreground inline-flex items-start flex-col space-y-4">
              <span>Information We Collect :</span>
              <span>Personal Information: Name, email, address</span>
              <span>Design Information: Design files and related data</span>

              <span>How We Use Your Information :</span>
              <span>Order Processing: To fulfill orders and communicate with you</span>
              <span>Service Improvement: To enhance and develop our platform</span>
              <span>Communication: To send updates and promotional materials</span>
              
              <span>Data Sharing :</span>
              <span>Service Providers: We share information with third parties that assist us in operating</span>
              <span>Legal Requirements: We may disclose information as required by law</span>
              
              <span>Data Security :</span>
              <span>We use measures to protect your information</span>
              
              <span>Your Rights :</span>
              <span>Access and Correction: You can access and update your information</span>
              <span>Deletion: Request deletion of your information where possible</span>
              
              <span>Contact :</span>
              <span>For inquiries, contact us at</span>
            </p>



          </div>





  

      </div>
    </div>
    </>
  )
}

export default Page


