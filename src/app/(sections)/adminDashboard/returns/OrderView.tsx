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
                title: 'order Was Successfully Deleted',
                variant: 'default',
              });
            router.refresh()
        } catch (error) {
            setisDeleteOpen(false)
            console.log(error)
            toast({
                title: 'order Was Not Deleted',
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
                                                 Are you absolutely sure you want to delete this order ?
                                               </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                   This action cannot be undone. 
                                                   It will permanently remove the order from our server.<br/><br/>
                                                    </AlertDialogDescription>
                                                   </AlertDialogHeader>
                                                  <AlertDialogFooter>
                                              <AlertDialogCancel onClick={()=>setisDeleteOpen(false)}>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete()} 
                                     className='bg-red-500 hover:bg-red-500' >Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                     </AlertDialog> 
  
  
  <p className="text-sm text-muted-foreground mb-2">AdminDashboard/returns</p>
           <h1 className="text-2xl font-semibold">Manage Returned Orders</h1>
  
  
  
     
  
  
        <div className="flex mt-4 flex-col gap-5 w-full">
  
      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-1 xl:grid-cols-1">
  
  
  
      <Card className="xl:col-span-4" x-chunk="dashboard-01-chunk-4">
        <CardHeader className="flex flex-row items-center bg-muted/50">
          <div className="grid gap-2">
            <CardTitle>Returned Orders</CardTitle>
            <CardDescription>Total: {orders.length}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>

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
        <SelectItem value="Sellerorder">Seller Order</SelectItem>
        <SelectItem value="Clientorder">Client Made Order</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</div>


        <Table>
        <ScrollArea className="mt-4 w-full h-96">
        <TableHeader>
          <TableRow>
            {/* Order Id column */}
            <TableHead >Order Id</TableHead>

            {/* Order Status column */}
            <TableHead>Order Status</TableHead>

            {/* Order Type column */}
            <TableHead>Order Type</TableHead>

            <TableHead>Creation Date</TableHead>

            {/* Is Order Printed column */}
            <TableHead>Is Order Printed</TableHead>

            {/* Is Client Made Order column */}
            <TableHead>Is Client Made Order</TableHead>

            {/* Is Seller Order column */}
            <TableHead>Is Seller Order</TableHead>

            {/* Is Order Paid column */}
            <TableHead>Is Order Paid</TableHead>

            {/* Total Items column */}
            <TableHead >Total Items</TableHead>

            {/* Order Amount column */}
            <TableHead >Order Amount</TableHead>

            {/* Actions column */}
            <TableHead>Actions</TableHead>
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
                        <p>Delete</p>
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
        </CardContent>
      </Card>  


      {selectedOrder && (
      <Card className="xl:col-span-4" x-chunk="dashboard-01-chunk-4">
          <CardHeader className="flex flex-col md:flex-row items-center">
                 <div className="grid gap-2">
             <CardTitle className="font-extrabold">Order Infos :</CardTitle>
             <CardDescription>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mt-2">
                          <div>
                             <p className="font-bold">Order Id:</p>
                             <p>{selectedOrder?.id}</p>
                         </div>
                         <div>
                             <p className="font-bold">Order Status:</p>
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
                             <p className="font-bold">Order Type:</p>
                             <p><Badge className={`${selectedOrder.type === 'CONFIRMED' ? 'bg-green-700' : selectedOrder.type === 'NOT_CONFIRMED' ? 'bg-orange-400' : selectedOrder.type === 'CANCELED' ? 'bg-red-700' : 'bg-gray-700'} hover:bg-gray-700`}>
                             {selectedOrder.type}
                             </Badge>
                         </p>
                         </div>
                         <div>
                             <p className="font-bold">Is Order Paid:</p>
                             <p><Badge className={`${selectedOrder.isPaid ? 'bg-green-700' :  'bg-red-700'} hover:bg-gray-700`}>
                            {selectedOrder.isPaid ? "Is Paid" : "Not Paid"}
                      </Badge></p>
                         </div>
                         <div>
                             <p className="font-bold">Is client Made Order:</p>
                             <p>{selectedOrder.isClientMadeOrder ? "Yes" : "No"}</p>
                         </div>
                         <div>
                             <p className="font-bold">Is Seller Order:</p>
                             <p>{selectedOrder.isSellerOrder ? "Yes" : "No"}</p>
                         </div>
                         {selectedOrder.isSellerOrder && (
                         <div>
                             <p className="font-bold">Seller Store:</p>
                             <p>{selectedOrder.sellerStore}</p>
                         </div>
                        )}
                         <div>
                             <p className="font-bold">Client Name:</p>
                             <p>{selectedOrder.clientName}</p>
                         </div>
                         <div>
                             <p className="font-bold">Client Email:</p>
                             <p>{selectedOrder.user.email}</p>
                         </div>
                         <div>
                             <p className="font-bold">Client Phone Number:</p>
                             <p>{selectedOrder?.phoneNumber}</p>
                         </div>
                         <div>
                             <p className="font-bold">Shipping Address:</p>
                             <p>{selectedOrder.shippingAddress}</p>
                         </div>
                         <div>
                             <p className="font-bold">order Amount:</p>
                             <p>{selectedOrder.amount.toFixed(2)} TND</p>
                         </div>
                     </div>
                 </CardDescription>
 
           </div>
         </CardHeader>
         <CardContent>
            <p className="text-gray-600 font-extrabold mt-6">Order Items :</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ml-2 md:ml-10 mt-6">
              {selectedOrder.orderItems.map((item, index) => (
               <div key={index} className="relative aspect-square rounded-xl">
               <ImageSlider urls={item.capturedMockup} />
               
               {/* Fixing the position of the size badge */}
               <div className="absolute top-2 left-2 z-10">
                 <Badge className="text-white">size : {item.productSize}</Badge>
               </div>

               <div className="absolute top-2 right-2 z-10">
                 <Badge className="text-white">quantity : {item.quantity}</Badge>
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