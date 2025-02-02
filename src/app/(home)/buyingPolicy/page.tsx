/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
'use client'
import {  TriangleAlert } from 'lucide-react'
import { Separator } from "@/components/ui/separator"


const Page = () => {




  return (
    <>



    <div className=''>
      <div className='mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8'>
        <div className='max-w-3xl'>
          <p className='text-base font-medium text-primary'>Buying Policy !</p>
          <h1 className='mt-2 text-4xl font-bold tracking-tight sm:text-5xl'>
            Read it carefully!
          </h1>
          <div className='mt-2 flex items-center text-base text-zinc-500'>
              <TriangleAlert className="h-4 w-4 mr-2 text-red-500" />
              <p className='text-muted-foreground'>
                For better shopping experience.
              </p>
            </div>
        </div>

        <Separator className="my-8"/>

        <div className='mt-10 flex space-y-3 flex-col text-right'>
  <h4 className='font-semibold'>
  : بالعربية 
  </h4>
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
            <h4 className='font-semibold '>
              In English : 
            </h4>
            <p className=" text-muted-foreground inline-flex items-start flex-col space-y-4">
              <span>• When a product is delivered to you, you can check it yourself right away when the delivery man hands it over to you.</span>
              <span>• Products can only be exchanged if there is a clear defect. For example, you cannot return or exchange a product simply because you changed your mind after making the purchase.</span>
              <span>• We do not accept exchanges due to incorrect sizing or if you wish to change the size after receiving the product. All product dimensions are clearly detailed in centimeters on the product page, so please review them carefully before placing your order. As each item is custom-printed based on your specifications, we cannot resell a product that was printed specifically for you if an incorrect size was ordered.</span>
              <span>• When ordering multiple items, please note that once the order is processed, it cannot be returned or exchanged, as each product is printed uniquely for you. In such cases, we recommend ordering a sample first to ensure product quality before placing a larger order.</span>
              <span>• The product must be in its original condition, including all packaging and components, for any exchange to be processed.</span>
              <span>• If a product is exchanged due to a visible defect, it will be replaced with a new item within 7 business days, starting from the time the original product is returned to us.</span>
              <span>• In case of a return, we will cover the return shipping costs for products with manufacturing defects. However, the customer is responsible for the initial shipping fees.</span>
            </p>

          </div>





  

      </div>
    </div>
    </>
  )
}

export default Page


