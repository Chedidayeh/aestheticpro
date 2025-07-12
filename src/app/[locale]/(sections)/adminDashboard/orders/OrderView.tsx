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
    Eye,
    Loader,
    OctagonAlert,
    Search,
    Trash2,
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
  import React, { useRef, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Commission, Order, OrderItem, User } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { TooltipProvider } from "@/components/ui/tooltip"
import { deleteOrderById, getAllOrders } from "./actions"
import LoadingState from "@/components/LoadingState"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useTranslations } from 'next-intl';
  
  



interface ExtraOrders extends Order {
    orderItems : OrderItem[]
    user : User
}
  
  
interface OrderViewProps {
  initialeOrders: ExtraOrders[]
  }
  
  const OrderView = ({ initialeOrders }: OrderViewProps ) => { 
    const t = useTranslations('AdminOrdersPage');
    const [orders, setOrders] = useState(initialeOrders)
    const router = useRouter();
    const { toast } = useToast()
    const [filterBy1, setFilterBy1] = useState('')
    const [filterBy2, setFilterBy2] = useState('')
    const [open, setOpen] = useState<boolean>(false);
    const [allOrders, setAllOrders] = useState(false)

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = async () => {
      try {
        setOpen(true);
        const orders = await getAllOrders(10, allOrders, searchQuery, filterBy1, filterBy2);
        setOrders(orders);
      } catch (error) {
        console.error("Error searching orders:", error);
        toast({
          title: t('toast_something_wrong'),
          variant: "destructive",
        });
      } finally {
        setOpen(false);
      }
    };

    const handleFilterBy1 = async (event: string) => {
      try {
        setOpen(true);
        setFilterBy1(event);
        const orders = await getAllOrders(10, allOrders, searchQuery, event, filterBy2);
        setOrders(orders);
      } catch (error) {
        console.error("Error filtering orders by filter 1:", error);
        toast({
          title: t('toast_something_wrong'),
          variant: "destructive",
        });
      } finally {
        setOpen(false);
      }
    };

    const handleFilterBy2 = async (event: string) => {
      try {
        setOpen(true);
        setFilterBy2(event);
        const orders = await getAllOrders(10, allOrders, searchQuery, filterBy1, event);
        setOrders(orders);
      } catch (error) {
        console.error("Error filtering orders by filter 2:", error);
        toast({
          title: t('toast_something_wrong'),
          variant: "destructive",
        });
      } finally {
        setOpen(false);
      }
    };

    const handleToggle = async () => {
      try {
        setOpen(true);
        setAllOrders(!allOrders); // Toggle the state
        const orders = await getAllOrders(10, !allOrders, searchQuery, filterBy1, filterBy2);
        setOrders(orders);
      } catch (error) {
        console.error("Error toggling order visibility:", error);
        toast({
          title: t('toast_something_wrong'),
          variant: "destructive",
        });
      } finally {
        setOpen(false);
      }
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



    // setOpen state
    const [openDialog, setOpenDialog] = useState(false);


    return (
      <>



  
  
  <p className="text-sm text-muted-foreground mb-2">{t('admin_dashboard_orders')}</p>
           <h1 className="text-2xl font-semibold">{t('manage_orders')}</h1>
  
  
  
     
  
  
        <div className="flex mt-4 flex-col gap-5 w-full">
  
      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-1 xl:grid-cols-1">
  
  
  
      <Card className="xl:col-span-4" x-chunk="dashboard-01-chunk-4">
        <CardHeader className="bg-muted/50">
          <div className="grid gap-2">
            <CardTitle>{t('orders')}</CardTitle>
            <CardDescription>{t('total_orders')} {orders.length}</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 items-center mt-2">
          <Select onValueChange={handleFilterBy1}>
    <SelectTrigger className="w-full sm:w-[180px] ">
      <SelectValue placeholder={t('filter_by')} />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>{t('select')}</SelectLabel>
        <SelectItem value="CONFIRMED">{t('confirmed')}</SelectItem>
        <SelectItem value="NOT_CONFIRMED">{t('not_confirmed')}</SelectItem>
        <SelectItem value="CANCELED">{t('canceled')}</SelectItem>
        <SelectItem value="DELIVERED">{t('delivered')}</SelectItem>
        <SelectItem value="PROCESSING">{t('processing')}</SelectItem>
        
      </SelectGroup>
    </SelectContent>
  </Select>
  <Select onValueChange={handleFilterBy2}>
    <SelectTrigger className="w-full sm:w-[180px] ">
      <SelectValue placeholder={t('filter_by')} />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>{t('select')}</SelectLabel>
        <SelectItem value="Paid">{t('paid')}</SelectItem>
        <SelectItem value="NOT_Paid">{t('not_paid')}</SelectItem>
        <SelectItem value="Printed">{t('printed')}</SelectItem>
        <SelectItem value="NOT_Printed">{t('not_printed')}</SelectItem>
        <SelectItem value="Sellerorder">{t('seller_order')}</SelectItem>
        <SelectItem value="Clientorder">{t('client_made_order')}</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
  <Input
    type="search"
    className="w-full sm:w-[50%] "
    placeholder="Enter the order Id, client Name, client Phone Number to make a search..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    />
    <Button
     disabled={searchQuery === ""}
     onClick={handleSearch}
     className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
    >
    Search
    <Search size={14} className="ml-1" />
  </Button>   


    <div className="flex items-center space-x-2">
      <Switch
        id="orders"
        defaultChecked={allOrders}
        onClick={handleToggle} // Handle the state change on toggle
      />
      <Label htmlFor="orders">{t('all_orders')}</Label>
    </div>

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
      <TableHead>{t('order_id')}</TableHead>

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
      <TableHead>{t('total_items')}</TableHead>

      {/* Order Amount column */}
      <TableHead>{t('order_amount')}</TableHead>

      {/* Actions column */}
      <TableHead>{t('actions')}</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {orders.map((order, index) => (
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
            {t(`status_${order.status.toLowerCase()}`)}
          </Badge>
        </TableCell>

        {/* Order Type cell */}
        <TableCell >
          <Badge className={`text-white ${order.type === 'CONFIRMED' ? 'bg-green-700' : order.type === 'NOT_CONFIRMED' ? 'bg-orange-400' : order.type === 'CANCELED' ? 'bg-red-700' : 'bg-gray-700'} hover:bg-gray-700`}>
            {t(`type_${order.type.toLowerCase()}`)}
          </Badge>
        </TableCell>

            {/* Order Type cell */}
          <TableCell>
          {new Date(order.createdAt).toLocaleString()}
        </TableCell>


        {/* Is Order Printed cell */}
        <TableCell>
          <Badge className={`text-white ${order.printed ? 'bg-green-700' : 'bg-red-700'} hover:bg-gray-700`}>
            {order.printed ? t('printed') : t('not_printed')}
          </Badge>
        </TableCell>

        {/* Is Client Made Order cell */}
        <TableCell>{order.isClientMadeOrder ? t('yes') : t('no')}</TableCell>

        {/* Is Seller Order cell */}
        <TableCell>{order.isSellerOrder ? t('yes') : t('no')}</TableCell>

        {/* Is Order Paid cell */}
        <TableCell>
          <Badge className={`text-white ${order.isPaid ? 'bg-green-700' : 'bg-red-700'} hover:bg-gray-700`}>
            {order.isPaid ? t('yes_paid') : t('not_paid')}
          </Badge>
        </TableCell>

        {/* Total Items cell */}
        <TableCell >{order.orderItems?.length || 0} {t('items')}</TableCell>


        {/* Order Amount cell */}
        <TableCell>{order.amount.toFixed(2)} TND</TableCell>

        {/* Actions cell */}
        <TableCell>
          <TooltipProvider>
            <div className="flex items-center">
              {/* View Icon */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Eye
                    onClick={() => {
                      setOpenDialog(true)
                      router.push(`/adminDashboard/orders/orderDetails/${order.id}`);
                    }}
                    className="cursor-pointer hover:text-blue-500"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('view')}</p>
                </TooltipContent>
              </Tooltip>

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
<p className="text-center text-xs mt-2">{t('new_orders_appear')}</p>

</div>

</>
)}

        </CardContent>
      </Card>  


      {selectedOrder && (
      <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
          <CardHeader className="flex flex-col md:flex-row items-center">
                 <div className="grid gap-2">
             <CardTitle className="font-extrabold">{t('order_infos')}</CardTitle>
             <CardDescription>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mt-2">
                          <div>
                             <p className="font-bold">{t('order_id')}:</p>
                             <p className="text-xs">{selectedOrder?.id}</p>
                         </div>
                         <div>
                             <p className="font-bold">{t('order_status')}:</p>
                             <Badge className={` text-white ${{
                               'PROCESSING': 'bg-blue-700',
                               'DELIVERED': 'bg-green-700',
                               'REFUSED': 'bg-red-700',
                               'CANCELED': 'bg-red-700'
                             }[selectedOrder.status]} hover:bg-gray-700`}>
                               {t(`status_${selectedOrder.status.toLowerCase()}`)}
                         </Badge>
                         </div>
                         <div>
                             <p className="font-bold">{t('order_type')}:</p>
                             <Badge className={` text-white ${selectedOrder.type === 'CONFIRMED' ? 'bg-green-700' : selectedOrder.type === 'NOT_CONFIRMED' ? 'bg-orange-400' : selectedOrder.type === 'CANCELED' ? 'bg-red-700' : 'bg-gray-700'} hover:bg-gray-700`}>
                             {t(`type_${selectedOrder.type.toLowerCase()}`)}
                             </Badge>
                         </div>
                         <div>
                             <p className="font-bold">{t('is_order_paid')}:</p>
                             <Badge className={` text-white ${selectedOrder.isPaid ? 'bg-green-700' :  'bg-red-700'} hover:bg-gray-700`}>
                            {selectedOrder.isPaid ? t('yes_paid') : t('not_paid')}
                      </Badge>
                         </div>
                         <div>
                             <p className="font-bold">{t('is_client_made_order')}:</p>
                             <p>{selectedOrder.isClientMadeOrder ? t('yes') : t('no')}</p>
                         </div>
                         <div>
                             <p className="font-bold">{t('is_seller_order')}:</p>
                             <p>{selectedOrder.isSellerOrder ? t('yes') : t('no')}</p>
                         </div>
                         {selectedOrder.isSellerOrder && (
                         <div>
                             <p className="font-bold">{t('seller_store')}:</p>
                             <p>{selectedOrder.sellerStore}</p>
                         </div>
                             )}
                         <div>
                             <p className="font-bold">{t('client_name')}:</p>
                             <p>{selectedOrder.clientName}</p>
                         </div>
                         <div>
                             <p className="font-bold ">{t('client_email')}:</p>
                             <p className="text-xs">{selectedOrder.user.email}</p>
                         </div>
                         <div>
                             <p className="font-bold">{t('client_phone_number')}:</p>
                             <p>{selectedOrder?.phoneNumber}</p>
                         </div>
                         <div>
                             <p className="font-bold">{t('shipping_address')}:</p>
                             <p>{selectedOrder.shippingAddress}</p>
                         </div>

                         <div>
                             <p className="font-bold">{t('order_amount')}:</p>
                             <p>{(selectedOrder.amount).toFixed(2)} TND</p>
                         </div>

                     </div>
                 </CardDescription>
           </div>
         </CardHeader>
       </Card>
      )}
        


      </section>
  
  
  
      <section className={cn(' grid grid-cols-1 p-11 gap-4 transition-all lg:grid-cols-4')}>
  </section>
  
    </div>

    <LoadingState isOpen={open} />

                          {/* The AlertDialog component */}
                          <AlertDialog open={openDialog} >
                          <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
                          <AlertDialogHeader className="flex flex-col items-center">
                              <div></div>
                              <AlertDialogTitle className="text-xl text-blue-700 font-bold text-center">
                              {t('loading_order_items')}
                              </AlertDialogTitle>
                              <AlertDialogDescription className="flex flex-col items-center">
                                {t('this_will_take_a_moment')}
                                <Loader className="text-blue-700 h-[30%] w-[30%] animate-spin mt-3" />
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                          </AlertDialogContent>
                        </AlertDialog>  




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

  
    </>
    );
  }
  
  export default OrderView;