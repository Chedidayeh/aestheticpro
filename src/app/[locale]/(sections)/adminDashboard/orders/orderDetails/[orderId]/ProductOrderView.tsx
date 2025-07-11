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
  import {
    CircleAlert,
    CircleCheck,
      DatabaseBackup,
      FileType,

    } from "lucide-react"
    
    import { Badge } from "@/components/ui/badge"
    import { Button } from "@/components/ui/button"
    import {
      Card,
      CardContent,
      CardDescription,
      CardHeader,
      CardTitle,
    } from "@/components/ui/card"
    
    import {
      Table,
      TableBody,
      TableCell,
      TableHead,
      TableHeader,
      TableRow,
    } from "@/components/ui/table"
    
    
    import { cn } from "@/lib/utils";
    import React, { useState } from "react"
  import { Affiliate, AffiliateLink, ClientDesign, Commission, Order, OrderItem, OrderStatus, OrderType, Product, SellerDesign, Store, User } from "@prisma/client"
  import { useRouter } from "next/navigation"
  import { useToast } from "@/components/ui/use-toast"
  import { useTranslations } from 'next-intl';


import { Separator } from "@/components/ui/separator"
import { changeStatus, changeType, CheckIfMatches, updateRevenueAndSalesForProducts } from "./actions"
import LoadingState from "@/components/LoadingState"
import ImageSlider from "@/components/MarketPlace/ImageSlider"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ExtraProduct extends Product{
  store : Store
}

interface ExtarAffiliate extends Affiliate {
  user : User
}

interface ExtraLink extends AffiliateLink {
  affiliate : ExtarAffiliate
}

interface ExtraCommission extends Commission {
  affiliateLink : ExtraLink
}

interface ExtraOrderItem extends OrderItem {
    product: ExtraProduct | null 
    frontsellerDesign : SellerDesign | null
    backsellerDesign : SellerDesign | null
    frontclientDesign : ClientDesign | null
    backclientDesign: ClientDesign | null
    commission : ExtraCommission | null
}

interface ExtraOrder extends Order {
    orderItems : ExtraOrderItem[]
    user : User
}

interface itemProfit {
  productId: string | null;
  storeName: string | null;
  productQuantity: number;
  productTitle: string | null;
  totalProfit: number;
  affiliateProfit: number;
  affiliateUser : string | undefined
}

interface Profit {
  orderId : string
  orderItemProfits : itemProfit[];
  totalOrderProfit : number
  totalAffiliateProfit: number;

}
  
  
interface OrderViewProps {
    order: ExtraOrder | null
    profit : Profit 
}
  
  const ProductOrderView = ({ order , profit }: OrderViewProps ) => { 

    const router = useRouter();
    const { toast } = useToast()
    const t = useTranslations('AdminOrderDetailsPage');

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
          const newStatus =
          order!.status === OrderStatus.DELIVERED
            ? OrderStatus.PROCESSING
            : OrderStatus.DELIVERED;
            await changeStatus(order!.id , newStatus)
            toast({
                title: t('toast_status_changed'),
                variant: 'default',
              });
              setOpen(false)

            router.refresh()
            
        } catch (error) {
          setOpen(false)

            toast({
                title: t('toast_status_not_changed'),
                variant: 'destructive',
              });
            console.log(error)
            
        }
      }

      const handleType = async () =>{
        try {
          setOpen(true)

          const newType =
          order!.type === OrderType.CONFIRMED
            ? OrderType.NOT_CONFIRMED
            : OrderType.CONFIRMED;
            await changeType(order!.id , newType)
            toast({
                title: t('toast_type_changed'),
                variant: 'default',
              });
              setOpen(false)

            router.refresh()
            
        } catch (error) {
          setOpen(false)
            toast({
                title: t('toast_type_not_changed'),
                variant: 'destructive',
              });
            console.log(error)
            
        }
      }



       // Function to handle download
 const downloadDesign = async (imageUrl: string) => {
  if(imageUrl === '') {
    toast({
      title: t('toast_no_design_found'),
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
      title: t('toast_download_failed'),
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
      title: t('toast_download_failed'),
      variant: "destructive",
    });
  }
};


const handleUpdate = async (orderId : string , platformProfit : number) =>{
  try {
    setOpen(true)

    await updateRevenueAndSalesForProducts(orderId , platformProfit , order!.amount )
    toast({
      title: t('toast_profit_updated'),
      variant: "default",
    });
    setOpen(false)

    router.refresh()
  } catch (error) {
    setOpen(false)

    console.log(error)
    toast({
      title: t('toast_profit_update_failed'),
      variant: "destructive",
    });
  }
}

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
        title: t('toast_profit_updated'),
        description: `${t('toast_matched_order_id', { orderId: data.orderId! })}`,
        variant: "default",
      });
      setMatchedOrderId(data.orderId)
      setOpenMatchDialog(true)
    } else {
      toast({
        title: t('toast_no_matching_order_found'),
        variant: "default",
      });
    }

  } catch (error) {
    console.error(error);
    toast({
      title: t('toast_profit_updating_failed'),
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

<p className="text-sm text-muted-foreground mb-2">{t('admin_dashboard_order_details')}</p>
           <h1 className="text-2xl font-semibold">{t('order_details')}</h1>
     
  
  
        <div className="flex mt-4 flex-col gap-5 w-full">
  
      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
  
  
  
      <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
  <CardHeader className="flex flex-col md:flex-row items-center bg-muted/50">
    <div className="grid gap-2">
      <CardTitle className="font-extrabold">{t('order_infos')}:</CardTitle>
      <CardDescription>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mt-2">
          <div>
            <p className="font-bold">{t('order_id')}:</p>
            <p className="text-xs">{order?.id}</p>
          </div>
          <div>
            <p className="font-bold">{t('order_status')}:</p>
            <p>
              <Badge className={`text-white ${{
                'PROCESSING': 'bg-blue-700',
                'DELIVERED': 'bg-green-700',
                'REFUSED': 'bg-red-700',
                'CANCELED': 'bg-red-700'
              }[order.status]} hover:bg-gray-700`}>
                {order.status}
              </Badge>
            </p>
          </div>
          <div>
            <p className="font-bold">{t('order_type')}:</p>
            <p>
              <Badge className={`text-white ${order.type === 'CONFIRMED' ? 'bg-green-700' : order.type === 'NOT_CONFIRMED' ? 'bg-orange-400' : order.type === 'CANCELED' ? 'bg-red-700' : 'bg-gray-700'} hover:bg-gray-700`}>
                {order.type}
              </Badge>
            </p>
          </div>
          <div>
            <p className="font-bold">{t('is_order_paid')}:</p>
            <p>
              <Badge className={`text-white ${order.isPaid ? 'bg-green-700' : 'bg-red-700'} hover:bg-gray-700`}>
                {order.isPaid ? t('is_paid') : t('not_paid')}
              </Badge>
            </p>
          </div>
          <div>
            <p className="font-bold">{t('is_order_printed')}:</p>
            <p>
              <Badge className={` text-white ${order.printed ? 'bg-green-700' : 'bg-red-700'} hover:bg-gray-700`}>
                {order.printed ? t('printed') : t('not_printed')}
              </Badge>
            </p>
          </div>
          <div>
            <p className="font-bold">{t('is_seller_order')}:</p>
            <p>{order.isSellerOrder ? t('yes') : t('no')}</p>
          </div>
          {order.isSellerOrder && (
                         <div>
                             <p className="font-bold">{t('seller_store')}:</p>
                             <p>{order.sellerStore}</p>
                         </div>
                             )}
          <div>
            <p className="font-bold">{t('client_name')}:</p>
            <p>{order.clientName}</p>
          </div>
          <div>
            <p className="font-bold">{t('client_phone_number')}:</p>
            <p>{order?.phoneNumber}</p>
          </div>
          <div>
            <p className="font-bold">{t('shipping_address')}:</p>
            <p>{order.shippingAddress}</p>
          </div>
          <div>
            <p className="font-bold">{t('order_amount')}:</p>
            <p>{(order.amount).toFixed(2)} TND</p>
          </div>
          <div className="col-span-2 md:col-span-1">
            <Button onClick={handleChange} variant="link" className="block mb-2 md:mb-0">{t('change_status')} <DatabaseBackup className="ml-1"/></Button>
          </div>
          <div className="col-span-2 md:col-span-1">
          <Button onClick={handleType} variant="link" className="block">{t('change_type')} <FileType className="ml-1"/></Button>
          </div>
        </div>
      </CardDescription>
    </div>
  </CardHeader>
  <Separator className="w-full" />
  <CardContent>
    <p className="text-gray-600 font-extrabold mt-6">{t('order_items')}:</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ml-2 md:ml-10 mt-6">
      {order.orderItems.map((item, index) => (
        <div
          key={index}
          className={cn("aspect-square rounded-xl cursor-pointer", {
            "border-blue-500 border-2": index === selectedItemIndex,
          })}
          onClick={() => {
            setSelectedItem(item);
            handleItemClick(index);
          }}
        >
          <ImageSlider urls={item.capturedMockup} />
        </div>
      ))}
    </div>
  </CardContent>
</Card>



        {/* profit infos */}
      {!order.isClientMadeOrder  && (
      <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
            <CardHeader className="flex flex-row items-center bg-muted/50">
              <div className="grid gap-2">
                <CardTitle className="font-extrabold">{t('profit_infos')}: <span className="text-sm text-gray-600">{t('products')}</span></CardTitle>
                <CardDescription>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-8 mt-2">
                <div>
                            <p className="font-bold">{t('order_amount')}:</p>
                            <p>{(order.amount).toFixed(2)} TND</p>
                        </div>
                        
                        <div>
                            <p className="font-bold">{t('total_sellers_profit')}:</p>
                            <p>{(profit.totalOrderProfit).toFixed(2)} TND</p>
                        </div>

                        <div>
                            <p className="font-bold">{t('total_affiliate_users_profit')}:</p>
                            <p>{(profit.totalAffiliateProfit).toFixed(2)} TND</p>
                        </div>

                          <div>
                            <p className="font-bold">{t('total_platform_profit')}:</p>
                            <p>
                              {(
                                order.amount - 
                                profit.totalOrderProfit - 
                                profit.totalAffiliateProfit
                              ).toFixed(2)} TND
                            </p>
                          </div>

                        <div>
                            <p className="font-bold">{t('profit_updated')}: </p>
                            <p>
                              <Badge className={`text-white ${order.updated ? 'bg-green-700' :  'bg-red-700'} hover:bg-gray-700`}>
                              {order.updated ? t('yes') : t('no')}
                              </Badge>
                              </p>
                        </div>

                        {order.isPaid && order.status === 'DELIVERED' && !order.updated && (
                          <Button
                          onClick={() => 
                            handleUpdate(
                              order.id, 
                              order.amount - profit.totalOrderProfit - profit.totalAffiliateProfit
                            )
                          }
                          variant="link"
                          >
                            {t('update_profit_after_sale')}
                          </Button>
                          )}


      
                            
                        </div>
                    </CardDescription>

              </div>
            </CardHeader>
            <Separator className="w-full"/>
            <CardContent>
              <div className="mt-2">

              {profit.orderItemProfits.length > 0 ? (

              <Table>
              <ScrollArea
          className={`${
            profit.orderItemProfits.length < 10 ? "max-h-max" : "h-[384px]"
          } w-full border rounded-lg mt-4`}
        >   
                  <TableHeader>
                    <TableRow>
                    <TableHead>{t('product_id')}</TableHead>
                      <TableHead>{t('product_title')}</TableHead>
                      <TableHead>{t('item_quantity')}</TableHead>
                      <TableHead>{t('seller_profit')}</TableHead>
                      <TableHead>{t('store_name')}</TableHead>
                      <TableHead>{t('affiliate_profit')}</TableHead>
                      <TableHead>{t('affiliate_user')}</TableHead>

                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {profit.orderItemProfits.map((item) => (
                      <TableRow key={order.id}>
                        <TableCell>{item.productId}</TableCell>
                        <TableCell>{item.productTitle}</TableCell>
                        <TableCell>{item.productQuantity}</TableCell>
                        <TableCell>{(item.totalProfit).toFixed(2)} TND</TableCell>
                        <TableCell>{item.storeName}</TableCell>
                        <TableCell>{(item.affiliateProfit).toFixed(2)} TND</TableCell>
                        <TableCell>{item.affiliateUser ?? t('no_affiliate_user')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  </ScrollArea>
                </Table>

) : (
  <>
<div className="flex items-center justify-center flex-col text-muted-foreground mt-3">
<h1 className="text-center text-3xl font-bold">
  <CircleAlert />
</h1>
<p className="text-center text-sm mt-2">{t('no_records_found')}</p>
<p className="text-center text-xs mt-2">{t('new_data_will_appear')}</p>

</div>

</>
)}

              </div>
              

                
            </CardContent>

          </Card>
    )}


            {/* item infos */}

    {selectedItem && selectedItem.product && (
 <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
 <CardHeader className="flex flex-col md:flex-row items-center bg-muted/50">
   <div className="grid gap-2">
     <CardTitle className="font-extrabold">{t('order_item_infos')}:</CardTitle>
     <CardDescription>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-8 mt-2">
         <div>
           <p className="font-bold">{t('product_category')}:</p>
           <p>{selectedItem.productCategory}</p>
         </div>
         <div>
           <p className="font-bold">{t('product_title')}:</p>
           <p>{selectedItem.productTitle}</p>
         </div>
         <div>
           <p className="font-bold">{t('product_quantity')}:</p>
           <p>{selectedItem.quantity}</p>
         </div>
         <div>
           <p className="font-bold">{t('product_size')}:</p>
           <p>{selectedItem.productSize}</p>
         </div>
         <div>
           <p className="font-bold">{t('product_color')}:</p>
           <p>{selectedItem.productColor}</p>
         </div>
         <div>
           <p className="font-bold">{t('product_base_price')}:</p>
           <p>{(selectedItem.product.basePrice).toFixed(2)} TND</p>
         </div>
         <div>
           <p className="font-bold">{t('product_price')}:</p>
           <p>{(selectedItem.productPrice).toFixed(2)} TND</p>
         </div>
         <div>
           <p className="font-bold">{t('seller_profit')}:</p>
           <p>{(selectedItem.product.sellerProfit).toFixed(2)} TND</p>
         </div>
         <div>
           <p className="font-bold">{t('store_name')}:</p>
           <p>{selectedItem.product.store.storeName}</p>
         </div>
         {selectedItem.commission && (
          <div>
              <p className="font-bold">{t('affiliate_user_profit')}:</p>
              <p>{(selectedItem.commission.profit).toFixed(2)} TND</p>
          </div>
          )}

        {selectedItem.commission && (
          <div>
              <p className="font-bold">{t('affiliate_user')}:</p>
              <p>{selectedItem.commission.affiliateLink.affiliate.user.name}</p>
              <p>{selectedItem.commission.affiliateLink.affiliate.user.email}</p>

          </div>
          )}

         <div>
           <p className="font-bold">{t('check_match_order')}:</p>
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
 <Separator className="w-full" />
 <CardContent>
  <div className="mt-6 space-y-4">
    <Button onClick={() => { downloadMockup(selectedItem.capturedMockup) }} variant="link">{t('download_product_mockup')}</Button>

    <div className="text-sm">
      <div className="flex flex-col md:flex-row md:space-x-10 space-y-2 md:space-y-0">
        <div className="font-bold">{t('front_design_id')}:</div>
        <div className="text-gray-600 font-semibold text-xs">{selectedItem.frontsellerDesignId ?? t('na')}</div>
        <div className="font-bold">{t('front_design_name')}:</div>
        <div className="text-gray-600 font-semibold">{selectedItem.frontsellerDesign?.name ?? t('na')}</div>
      </div>
      <Button onClick={() => {
        const imageUrl = selectedItem.frontsellerDesign?.imageUrl;
        downloadDesign(imageUrl ?? '');
      }} variant="link">{t('download_front_design')}</Button>
    </div>

    <div className="text-sm">
      <div className="flex flex-col md:flex-row md:space-x-10 space-y-2 md:space-y-0">
        <div className="font-bold">{t('back_design_id')}:</div>
        <div className="text-gray-600 font-semibold text-xs">{selectedItem.backsellerDesignId ?? t('na')}</div>
        <div className="font-bold">{t('back_design_name')}:</div>
        <div className="text-gray-600 font-semibold">{selectedItem.backsellerDesign?.name ?? t('na')}</div>
      </div>
      <Button onClick={() => {
        const imageUrl = selectedItem.backsellerDesign?.imageUrl;
        downloadDesign(imageUrl ?? '');
      }} variant="link">{t('download_back_design')}</Button>
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