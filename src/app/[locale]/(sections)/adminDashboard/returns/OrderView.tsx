/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
'use client'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    
  } from "@/components/ui/alert-dialog"
import {
  CircleAlert,
    Loader,
    OctagonAlert,
    Trash2,
  } from "lucide-react"
  
  import { Badge } from "@/components/ui/badge"
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
  
  
  import React, { ChangeEvent, useEffect, useRef, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Order, OrderItem, Product, SellerDesign, User } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { TooltipProvider } from "@/components/ui/tooltip"
import { deleteOrderById } from "./actions"
import ImageSlider from "@/components/MarketPlace/ImageSlider"
import { useTranslations } from 'next-intl';
  
  
interface ExtraOrderItem extends OrderItem {
  product :Product | null
  frontsellerDesign :SellerDesign | null
  backsellerDesign : SellerDesign | null
}


interface ExtraOrders extends Order {
    orderItems : ExtraOrderItem[]
    user : User
}
  
  
interface OrderViewProps {
    orders: ExtraOrders[]
  }
  
  const OrderView = ({ orders }: OrderViewProps ) => { 
    const router = useRouter();
    const { toast } = useToast()
    const t = useTranslations('AdminReturnsPage');


    const [searchQuery, setSearchQuery] = useState('');
    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredOrders, setFilteredOrders] = useState(orders);
  
    useEffect(() => {
      let updatedOrders = [...orders];
  
      if (searchQuery) {
        const lowercasedQuery = searchQuery.toLowerCase();
        updatedOrders = updatedOrders.filter(order =>
          order.orderItems.some(item =>
            (item.orderId.toLowerCase().startsWith(lowercasedQuery)) ||
            (item.product?.title?.toLowerCase().startsWith(lowercasedQuery)) ||
            (item.frontsellerDesign?.name?.toLowerCase().startsWith(lowercasedQuery)) ||
            (item.backsellerDesign?.name?.toLowerCase().startsWith(lowercasedQuery))
          )
        );
      }
  
      if (filterCriteria) {
        updatedOrders = updatedOrders.filter(order => {
          if (filterCriteria === 'CONFIRMED') {
            return order.type === 'CONFIRMED';
          } else if (filterCriteria === 'NOT_CONFIRMED') {
            return order.type === 'NOT_CONFIRMED';
          } else if (filterCriteria === 'CANCELED') {
            return order.type === 'CANCELED';
          } else if (filterCriteria === 'DELIVERED') {
            return order.status === 'DELIVERED';
          } else if (filterCriteria === 'Paid') {
            return order.isPaid === true;
          } else if (filterCriteria === 'NOT_Paid') {
            return order.isPaid === false;
          } else if (filterCriteria === 'Sellerorder') {
            return order.isSellerOrder === true;
          } else if (filterCriteria === 'Clientorder') {
            return order.isClientMadeOrder === true;
          } else if (filterCriteria === 'Printed') {
            return order.printed === true;
          } else if (filterCriteria === 'NOT_Printed') {
            return order.printed === false;
          }
          return true;
        });
      }
  
      setFilteredOrders(updatedOrders);
    }, [searchQuery, filterCriteria, orders]);
  
    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    };
  
    const handleFilterChange = (value: string) => {
      setFilterCriteria(value);
    };




    const [isDeleteOpen, setisDeleteOpen] = useState(false);
    const [ orderId , setorderId] = useState("")
    const handleDelete = async () =>{
        try {
            await deleteOrderById(orderId)
            setisDeleteOpen(false)
            toast({
                title: t('toast_order_deleted'),
                variant: 'default',
              });
            router.refresh()
        } catch (error) {
            setisDeleteOpen(false)
            console.log(error)
            toast({
                title: t('toast_order_not_deleted'),
                variant: 'destructive',
              });
        }
    }





    const [selectedOrder, setSelectedOrder] = useState<ExtraOrders | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const handleRowClick = (order: ExtraOrders, index: number) => {
      if (selectedIndex === index) {
        setSelectedOrder(null);
        setSelectedIndex(null);
      } else {
        setSelectedOrder(order);
        setSelectedIndex(index);
      }
    };



    


    



    return (
      <>


      




                          {/* The AlertDialog delete design component  */}
                          <AlertDialog open={isDeleteOpen}>
                          <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
                          <AlertDialogHeader className="flex flex-col items-center">
                                       <div className="text-red-500 mb-2">
                                           <OctagonAlert className=''/>
                                               </div>
                                              <AlertDialogTitle className="text-xl font-bold text-center">
                                                {t('are_you_absolutely_sure_delete_order')}
                                              </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                   {t('this_action_cannot_be_undone')}
                                                   {t('it_will_permanently_remove_order_from_server')}<br/><br/>
                                                    </AlertDialogDescription>
                                                   </AlertDialogHeader>
                                                  <AlertDialogFooter>
                                              <AlertDialogCancel onClick={()=>setisDeleteOpen(false)}>{t('cancel')}</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete()} 
                                     className='bg-red-500 hover:bg-red-500' >{t('delete')}</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                     </AlertDialog> 
  
  
  <p className="text-sm text-muted-foreground mb-2">{t('admin_dashboard_returns')}</p>
           <h1 className="text-2xl font-semibold">{t('manage_returned_orders')}</h1>
  
  
  
     
  
  
        <div className="flex mt-4 flex-col gap-5 w-full">
  
      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-1 xl:grid-cols-1">
  
  
  
      <Card className="xl:col-span-4" x-chunk="dashboard-01-chunk-4">
        <CardHeader className="bg-muted/50">
          <div className="grid gap-2">
            <CardTitle>{t('returned_orders')}</CardTitle>
            <CardDescription>{t('total')} {orders.length}</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 items-center mt-2">
  <Input
    type="search"
    className="w-full sm:w-[50%] "
    placeholder="search by product title or design name..."
    value={searchQuery}
    onChange={handleSearchChange}
  />
  <Select onValueChange={handleFilterChange}>
    <SelectTrigger className="w-full sm:w-[180px] ">
      <SelectValue placeholder="Filter By" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Select</SelectLabel>
        <SelectItem value="Sellerorder">{t('seller_order')}</SelectItem>
        <SelectItem value="Clientorder">{t('client_made_order')}</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</div>
        </CardHeader>
        <CardContent>

        {orders.length > 0 ? (



        <Table>
        <ScrollArea
          className={`${
            orders.length < 10 ? "max-h-max" : "h-[384px]"
          } w-full border rounded-lg mt-4`}
        >        
        <TableHeader>
          <TableRow>
            {/* Order Id column */}
            <TableHead >{t('order_id')}</TableHead>

            {/* Order Status column */}
            <TableHead>{t('order_status')}</TableHead>

            {/* Order Type column */}
            <TableHead>{t('order_type')}</TableHead>

            <TableHead>{t('creation_date')}</TableHead>

            {/* Is Order Printed column */}
            <TableHead>{t('is_order_printed')}</TableHead>

            {/* Is Client Made Order column */}
            <TableHead>{t('is_client_made_order')}</TableHead>

            {/* Is Seller Order column */}
            <TableHead>{t('is_seller_order')}</TableHead>

            {/* Is Order Paid column */}
            <TableHead>{t('is_order_paid')}</TableHead>

            {/* Total Items column */}
            <TableHead >{t('total_items')}</TableHead>

            {/* Order Amount column */}
            <TableHead >{t('order_amount')}</TableHead>

            {/* Actions column */}
            <TableHead>{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((order, index) => (
            <TableRow
              key={order.id}
              className={`cursor-pointer ${selectedIndex === index ? 'border-2 border-blue-500' : ''}`}
              onClick={() => handleRowClick(order, index)}
            >
              {/* Order Id cell */}
              <TableCell className=" text-xs">{order.id}</TableCell>

              {/* Order Status cell */}
              <TableCell className="">
                <Badge className={`text-white ${{
                  'PROCESSING': 'bg-blue-700',
                  'DELIVERED': 'bg-green-700',
                  'REFUSED': 'bg-red-700',
                  'CANCELED': 'bg-red-700'
                }[order.status]} hover:bg-gray-700`}>
                  {order.status}
                </Badge>
              </TableCell>

              {/* Order Type cell */}
              <TableCell>
                <Badge className={`text-white ${order.type === 'CONFIRMED' ? 'bg-green-700' : order.type === 'NOT_CONFIRMED' ? 'bg-orange-400' : order.type === 'CANCELED' ? 'bg-red-700' : 'bg-gray-700'} hover:bg-gray-700`}>
                  {order.type}
                </Badge>
              </TableCell>

                  {/* Order Type cell */}
                <TableCell>
                {new Date(order.createdAt).toLocaleString()}
              </TableCell>


              {/* Is Order Printed cell */}
              <TableCell>
                <Badge className={`text-white ${order.printed ? 'bg-green-700' : 'bg-red-700'} hover:bg-gray-700`}>
                  {order.printed ? "Printed" : "Not Printed"}
                </Badge>
              </TableCell>

              {/* Is Client Made Order cell */}
              <TableCell>{order.isClientMadeOrder ? 'Yes' : 'No'}</TableCell>

              {/* Is Seller Order cell */}
              <TableCell>{order.isSellerOrder ? 'Yes' : 'No'}</TableCell>

              {/* Is Order Paid cell */}
              <TableCell>
                <Badge className={`text-white ${order.isPaid ? 'bg-green-700' : 'bg-red-700'} hover:bg-gray-700`}>
                  {order.isPaid ? "Is Paid" : "Not Paid"}
                </Badge>
              </TableCell>

              {/* Total Items cell */}
              <TableCell >{order.orderItems?.length || 0} items</TableCell>

              {/* Order Amount cell */}
              <TableCell>{order.amount.toFixed(2)} TND</TableCell>

              {/* Actions cell */}
              <TableCell>
                <TooltipProvider>
                  <div className="flex items-center">
                    {/* Delete Icon */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Trash2
                          onClick={() => {
                            setisDeleteOpen(true);
                            setorderId(order.id);
                          }}
                          className="cursor-pointer hover:text-red-500 ml-2"
                        />
                      </TooltipTrigger>
                      <TooltipContent className="bg-red-500">
                        <p>{t('delete')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              </TableCell>
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
<p className="text-center text-xs mt-2">{t('returned_orders_will_appear_here')}</p>

</div>

</>
)}

        </CardContent>
      </Card>  


      {selectedOrder && (
      <Card className="xl:col-span-4" x-chunk="dashboard-01-chunk-4">
          <CardHeader className="flex flex-col md:flex-row items-center">
                 <div className="grid gap-2">
             <CardTitle className="font-extrabold">{t('order_infos')}</CardTitle>
             <CardDescription>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mt-2">
                          <div>
                             <p className="font-bold">{t('order_id')}</p>
                             <p>{selectedOrder?.id}</p>
                         </div>
                         <div>
                             <p className="font-bold">{t('order_status')}</p>
                             <p><Badge className={`${{
                               'PROCESSING': 'bg-blue-700',
                               'DELIVERED': 'bg-green-700',
                               'REFUSED': 'bg-red-700',
                               'CANCELED': 'bg-red-700'
                             }[selectedOrder.status]} hover:bg-gray-700`}>
                               {selectedOrder.status}
                         </Badge></p>
                         </div>
                         <div>
                             <p className="font-bold">{t('order_type')}</p>
                             <p><Badge className={`${selectedOrder.type === 'CONFIRMED' ? 'bg-green-700' : selectedOrder.type === 'NOT_CONFIRMED' ? 'bg-orange-400' : selectedOrder.type === 'CANCELED' ? 'bg-red-700' : 'bg-gray-700'} hover:bg-gray-700`}>
                             {selectedOrder.type}
                             </Badge>
                         </p>
                         </div>
                         <div>
                             <p className="font-bold">{t('is_order_paid')}</p>
                             <p><Badge className={`${selectedOrder.isPaid ? 'bg-green-700' :  'bg-red-700'} hover:bg-gray-700`}>
                            {selectedOrder.isPaid ? "Is Paid" : "Not Paid"}
                      </Badge></p>
                         </div>
                         <div>
                             <p className="font-bold">{t('is_client_made_order')}</p>
                             <p>{selectedOrder.isClientMadeOrder ? "Yes" : "No"}</p>
                         </div>
                         <div>
                             <p className="font-bold">{t('is_seller_order')}</p>
                             <p>{selectedOrder.isSellerOrder ? "Yes" : "No"}</p>
                         </div>
                         {selectedOrder.isSellerOrder && (
                         <div>
                             <p className="font-bold">{t('seller_store')}</p>
                             <p>{selectedOrder.sellerStore}</p>
                         </div>
                        )}
                         <div>
                             <p className="font-bold">{t('client_name')}</p>
                             <p>{selectedOrder.clientName}</p>
                         </div>
                         <div>
                             <p className="font-bold">{t('client_email')}</p>
                             <p>{selectedOrder.user.email}</p>
                         </div>
                         <div>
                             <p className="font-bold">{t('client_phone_number')}</p>
                             <p>{selectedOrder?.phoneNumber}</p>
                         </div>
                         <div>
                             <p className="font-bold">{t('shipping_address')}</p>
                             <p>{selectedOrder.shippingAddress}</p>
                         </div>
                         <div>
                             <p className="font-bold">{t('order_amount')}</p>
                             <p>{selectedOrder.amount.toFixed(2)} TND</p>
                         </div>
                     </div>
                 </CardDescription>
 
           </div>
         </CardHeader>
         <CardContent>
            <p className="text-gray-600 font-extrabold mt-6">{t('order_items')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ml-2 md:ml-10 mt-6">
              {selectedOrder.orderItems.map((item, index) => (
               <div key={index} className="relative aspect-square rounded-xl">
               <ImageSlider urls={item.capturedMockup} />
               
               {/* Fixing the position of the size badge */}
               <div className="absolute top-2 left-2 z-10">
                 <Badge className="text-white">{t('size')} {item.productSize}</Badge>
               </div>

               <div className="absolute top-2 right-2 z-10">
                 <Badge className="text-white">{t('quantity')} {item.quantity}</Badge>
               </div>
               
               <div className="text-center">
                 {selectedOrder.isClientMadeOrder ? (
                   <Badge className="text-white">
                     {item.frontsellerDesign?.name ?? "No front design"} / {item.backsellerDesign?.name ?? "No back design"}
                   </Badge>
                 ) : (
                   <Badge className="text-white">{item.product?.title}</Badge>
                 )}
               </div>
             </div>
             
              ))}
            </div>
      </CardContent>
       </Card>
      )}
        

      </section>
  
    </div>
  
    </>
    );
  }
  
  export default OrderView;