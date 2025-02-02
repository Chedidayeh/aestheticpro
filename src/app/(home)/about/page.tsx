/* eslint-disable react/no-unescaped-entities */
'use client'
import NextImage from 'next/image'
import {  RocketIcon } from 'lucide-react'
import { Separator } from "@/components/ui/separator"


const Page = () => {


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
          <p className='text-base font-medium text-primary'>About Us !</p>
          <h1 className='mt-2 text-4xl font-bold tracking-tight sm:text-5xl'>
            Dicover the purpose of our brand!
          </h1>
          <div className='mt-2 flex items-center text-base text-zinc-500'>
              <RocketIcon className="h-4 w-4 mr-2 text-primary" />
              <p className='text-muted-foreground'>
              Aesthetic Pro deliver Sky level.
              </p>
            </div>
        </div>

        <Separator className="my-8"/>


        <div className='mt-10 flex space-y-3 flex-col text-right'>
          <h4 className='font-semibold'>
          : بالعربية 
          </h4>
          </div>

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
              In English : 
            </h4>
          </div>

        <div className='mt-10 flex space-y-3 flex-col'>
            <h4 className='font-semibold '>
              1- Define our buisness : 
            </h4>
            <p className="text-muted-foreground inline-flex items-center">
            
            • Our platform offers a unique print-on-demand 
            service, allowing customers to create and 
            customize their own designs on their own choice
            of products. We empower artists, entrepreneurs, 
            and anyone with a creative spark to bring their 
            ideas to life. By providing this 
            platform, we enable tunisian designers to unleash 
            their creativity, transforming their visions into reality 
            and sharing their art through our brand.
            </p>
          </div>

          <div className='mt-10 flex space-y-3 flex-col'>
            <h4 className='font-semibold '>
              2- The goal we want to reach : 
            </h4>
            <p className="text-muted-foreground inline-flex items-center">
            • Our goal is to become the go-to destination 
            for personalized products, making customization 
            easy, fun, and accessible to everyone. 
            We aim to support creativity and innovation, 
            providing a platform where anyone can showcase 
            their designs, reach a global audience, 
            and turn their passion into profit.
            </p>
          </div>

          <div className='mt-10 flex space-y-3 flex-col'>
            <h4 className='font-semibold '>
              3- Why we're diffrent of others brands : 
            </h4>
            <p className="text-muted-foreground inline-flex items-center">
            • What sets us apart is our commitment to quality, 
            sustainability, and customer satisfaction. 
            We use eco-friendly printing processes and 
            source materials that are both durable and 
            ethically produced. Our user-friendly 
            interface and dedicated customer support 
            ensure that every customer, whether they're 
            designing for themselves or starting their 
            own brand, has a seamless experience from 
            start to finish. We also offer fast shipping 
            and a satisfaction guarantee, so our customers 
            can shop with confidence.
            </p>
          </div>


        




      </div>
    </div>
    </>
  )
}

export default Page


