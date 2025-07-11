/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
    
    import { Badge } from "@/components/ui/badge"
    import { Button } from "@/components/ui/button"
    import {
      Card,
      CardContent,
      CardDescription,
      CardHeader,
      CardTitle,
    } from "@/components/ui/card"
    
    
    
    import { cn } from "@/lib/utils";
    import React, { useState } from "react"
  import { ClientDesign, Order, OrderItem, Product, SellerDesign, User } from "@prisma/client"
  import { useRouter } from "next/navigation"
  import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { CheckIfMatches, togglePrinted } from "./actions"
import LoadingState from "@/components/LoadingState"
import ImageSlider from "@/components/MarketPlace/ImageSlider"
import { CircleCheck } from "lucide-react"
import { useTranslations } from 'next-intl';

interface ExtraOrderItem extends OrderItem {
    product: Product | null 
    frontsellerDesign : SellerDesign | null
    backsellerDesign : SellerDesign | null
    frontclientDesign : ClientDesign | null
    backclientDesign: ClientDesign | null
}

interface ExtraOrder extends Order {
    orderItems : ExtraOrderItem[]
    user : User
}


  
  
interface OrderViewProps {
    order: ExtraOrder | null
}
  
  const ProductOrderView = ({ order }: OrderViewProps ) => { 

    const router = useRouter();
    const { toast } = useToast()
    const t = useTranslations('FactoryDashboardPage');

    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
    const [selectedItem, setSelectedItem] = useState<ExtraOrderItem | null>(null);


    const handleItemClick = (index: number) => {
        if (index === selectedItemIndex) {
          setSelectedItemIndex(null);
          setSelectedItem(null);
        } else {
          setSelectedItemIndex(index);
          setSelectedItem(order?.orderItems[index] || null);
        }
      };



      const [open, setOpen] = useState<boolean>(false);


      const handleChange = async () =>{
        try {
            setOpen(true)
            await togglePrinted(order!.id)
            toast({
                title: t('state_changed'),
                variant: 'default',
              });
            setOpen(false)
            router.refresh()
            
        } catch (error) {
          setOpen(false)
            toast({
                title: t('state_not_changed'),
                variant: 'destructive',
              });
            console.log(error)
            
        }
      }




       // Function to handle download
 const downloadDesign = async (imageUrl: string) => {
  if(imageUrl === '') {
    toast({
      title: t('no_design_found'),
      variant: "destructive",
    });
    return;
  }
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "design_image.png"; // You can set the filename here
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (error) {
    console.error("Error downloading design:", error);
    toast({
      title: t('download_failed'),
      variant: "destructive",
    });
  }
};

// Function to handle download
const downloadMockup = async (imageUrls: string[]) => {
  try {

    // Loop through each imageUrl and download
    for (let i = 0; i < imageUrls.length; i++) {
      const response = await fetch(imageUrls[i]);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `design_image_${i + 1}.png`; // Set dynamic filename or customize as needed
      document.body.appendChild(a);
      a.click();
      a.remove();
    }

  } catch (error) {
    console.error("Error downloading mockup:", error);
    toast({
      title: t('download_failed'),
      variant: "destructive",
    });
  }
};



// openMatchDialog state
const [openMatchDialog, setOpenMatchDialog] = useState(false);
// matchedOrderId sate
const [matchedOrderId, setMatchedOrderId] = useState<string | null>(null);

const checkMatch = async (item: ExtraOrderItem) => {
  try {
    setOpen(true); // Open loading state

    const data = await CheckIfMatches(item); // Await match check

    if (data.match) {
      toast({
        title: t('profit_updated'),
        description: t('matched_with_order', {orderId: data.orderId!}),
        variant: "default",
      });
      setMatchedOrderId(data.orderId)
      setOpenMatchDialog(true)
    } else {
      toast({
        title: t('no_matching_order'),
        variant: "default",
      });
    }

  } catch (error) {
    console.error(error);
    toast({
      title: t('profit_updating_failed'),
      variant: "destructive",
    });
  } finally {
    setOpen(false); // Ensure it closes regardless of success/failure
  }
};

    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = () => {
      navigator.clipboard.writeText(matchedOrderId!)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000); // Reset the copied state after 2 seconds
        })
        .catch((err) => {
          console.error('Failed to copy the text: ', err);
        });
    };



    return(

        <>



        {order && (
            <>

<p className="text-sm text-muted-foreground mb-2">{t('factory_orders')}</p>
<h1 className="text-2xl font-semibold">{t('order_details')}</h1>
     
  
  
        <div className="flex mt-4 flex-col gap-5 w-full">
  
      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
  
  
  
      <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
      <CardHeader className="flex flex-col md:flex-row items-center">
      <div className="grid gap-2">
            <CardTitle className="font-extrabold">{t('order_infos')}</CardTitle>
            <CardDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mt-2">
            <div>
                            <p className="font-bold">{t('order_id_label')}</p>
                            <p className="text-xs">{order?.id}</p>
                        </div>
                        <div>
                            <p className="font-bold">{t('order_status_label')}</p>
                            <p><Badge className={`text-white ${{
                              'PROCESSING': 'bg-blue-700',
                              'DELIVERED': 'bg-green-700',
                              'REFUSED': 'bg-red-700',
                              'CANCELED': 'bg-red-700'
                            }[order.status]} hover:bg-gray-700`}>
                              {order.status}
                        </Badge></p>
                        </div>
                        <div>
                            <p className="font-bold">{t('order_type_label')}</p>
                            <p><Badge className={`text-white ${order.type === 'CONFIRMED' ? 'bg-green-700' : order.type === 'NOT_CONFIRMED' ? 'bg-orange-400' : order.type === 'CANCELED' ? 'bg-red-700' : 'bg-gray-700'} hover:bg-gray-700`}>
                            {order.type}
                            </Badge>
                        </p>
                        </div>
                        <div>
                            <p className="font-bold">{t('order_printed_label')}</p>
                            <p><Badge className={`text-white ${order.printed ? 'bg-green-700' :  'bg-red-700'} hover:bg-gray-700`}>
                              {order.printed ? "Printed" : "Not Printed"}
                              </Badge>
                              </p>
                        </div>
                        <div>
                        <Button onClick={handleChange} variant={"link"}>{t('change_printing_state')}</Button>
                        </div>
                    </div>
                </CardDescription>

          </div>
        </CardHeader>
        <Separator className="w-full"/>
        <CardContent>
            <p className="text-gray-600 font-extrabold mt-6">{t('order_items_label')}</p>
            <p className="text-red-600 text-sm">
        <span className="text-red-600 font-medium">{t('guide')}:</span> {t('click_on_product')}
      </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ml-2 md:ml-10 mt-6">
            {order.orderItems.map((item, index) => (
                      <div
                        key={index}
                        className={cn("aspect-square rounded-xl cursor-pointer", {
                          "border-blue-500 border-2": index === selectedItemIndex,
                        })}
                        onClick={() => {
                            setSelectedItem(item)
                            handleItemClick(index)}}
                      >
                        <ImageSlider urls={item.capturedMockup} />
                      </div>
                    ))}
                  </div>
                </CardContent>

      </Card>  





            {/* item infos */}

    {selectedItem && selectedItem.product && (
        <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
 <CardHeader className="flex flex-col md:flex-row items-center">
 <div className="grid gap-2">
            <CardTitle className="font-extrabold">{t('order_item_infos')}</CardTitle>
            <CardDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-8 mt-2">
            <div>
                            <p className="font-bold">{t('product_category_label')}</p>
                            <p>{selectedItem.productCategory}</p>
                        </div>
                        <div>
                            <p className="font-bold">{t('product_quantity_label')}</p>
                            <p>{selectedItem.quantity}</p>
                        </div>
                        <div>
                            <p className="font-bold">{t('product_size_label')}</p>
                            <p>{selectedItem.productSize}</p>
                        </div>
                        <div>
                            <p className="font-bold">{t('product_color_label')}</p>
                            <p>{selectedItem.productColor}</p>
                        </div>

                                 <div>
                                   <p className="font-bold">{t('check_match_order_label')}</p>
                                   <Button
                                    onClick={() => checkMatch(selectedItem)}
                                    variant="link"
                                    >          
                                   {t('check_match')}
                                  </Button>
                                 </div>

                        
                    </div>
                </CardDescription>

          </div>
        </CardHeader>
        <Separator className="w-full"/>
        <CardContent>
        <div className="mt-6 space-y-4">
        <Button onClick={()=>{downloadMockup(selectedItem.capturedMockup)}} variant={"link"}>{t('download_product_mockup')}</Button>

          <div className="text-sm">
          <div className="flex flex-col md:flex-row md:space-x-10 space-y-2 md:space-y-0">
            <div className="font-bold">{t('front_design_name_label')}: <span className="text-gray-600 font-semibold">
                {selectedItem.frontsellerDesign?.name ?? "N/A"}
              </span>
            </div>
          </div>

          <Button onClick={()=>{
            const imageUrl = selectedItem.frontsellerDesign?.imageUrl;
            downloadDesign(imageUrl ?? '')}} variant={"link"}>{t('download_front_design')}</Button>
          </div>



          <div className="text-sm">
          <div className="flex flex-col md:flex-row md:space-x-10 space-y-2 md:space-y-0">
            <div className="font-bold">{t('back_design_name_label')}: <span className="text-gray-600 font-semibold">
                {selectedItem.backsellerDesign?.name ?? "N/A"}
              </span>
            </div>
          </div>

              <Button onClick={()=>{
            const imageUrl = selectedItem.backsellerDesign?.imageUrl;
            downloadDesign(imageUrl ?? '')}} variant={"link"}>{t('download_back_design')}</Button>
          </div>



            
          </div>
          

            
        </CardContent>

      </Card> 
        
    )}



  

      </section>
  
  
  
  
    </div>

            </>
        )}

<AlertDialog open={openMatchDialog}>
<AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
<AlertDialogHeader className="flex flex-col items-center">
              <div className="text-green-500 mb-2">
                <CircleCheck size={42} />
              </div>
              <AlertDialogTitle className="text-xl font-bold text-center">{t('matched_order_id_title')}</AlertDialogTitle>
              <AlertDialogDescription>
                <p className="text-xs mt-2">
                  {t('click_to_copy_link')}
                </p>
                <Badge 
                  onClick={copyToClipboard} 
                  className="my-4 text-white text-xs animate-pulse font-bold cursor-pointer transition-colors"
                  aria-label="Click to copy affiliate link"
                >                  
                {matchedOrderId}
                </Badge>
                {isCopied && (
              <p className="text-xs text-green-500">{t('link_copied_to_clipboard')}</p>
            )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
              onClick={()=>setOpenMatchDialog(false)}
                className='bg-blue-500 hover:bg-blue-300'
              >
                {t('done')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

<LoadingState isOpen={open} />


        </>
        
    )


  }

  export default ProductOrderView