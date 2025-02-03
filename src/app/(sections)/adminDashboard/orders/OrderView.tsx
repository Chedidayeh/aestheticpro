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
  
  



interface ExtraOrders extends Order {
    orderItems : OrderItem[]
    user : User
}
  
  
interface OrderViewProps {
  initialeOrders: ExtraOrders[]
  }
  
  const OrderView = ({ initialeOrders }: OrderViewProps ) => { 
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
          title: "Something went wrong!",
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
          title: "Something went wrong!",
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
          title: "Something went wrong!",
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
          title: "Something went wrong!",
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



    // setOpen state
    const [openDialog, setOpenDialog] = useState(false);


    return (
      <>



  
  
  <p className="text-sm text-muted-foreground mb-2">AdminDashboard/Orders</p>
           <h1 className="text-2xl font-semibold">Manage Orders</h1>
  
  
  
     
  
  
        <div className="flex mt-4 flex-col gap-5 w-full">
  
      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-1 xl:grid-cols-1">
  
  
  
      <Card className="xl:col-span-4" x-chunk="dashboard-01-chunk-4">
        <CardHeader className="flex flex-row items-center bg-muted/50">
          <div className="grid gap-2">
            <CardTitle>Orders</CardTitle>
            <CardDescription>Total: {orders.length}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 items-center mt-2">
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
  <Select onValueChange={handleFilterBy1}>
    <SelectTrigger className="w-full sm:w-[180px] ">
      <SelectValue placeholder="Filter By" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Select</SelectLabel>
        <SelectItem value="CONFIRMED">Confirmed</SelectItem>
        <SelectItem value="NOT_CONFIRMED">Not Confirmed</SelectItem>
        <SelectItem value="CANCELED">Canceled</SelectItem>
        <SelectItem value="DELIVERED">Delivered</SelectItem>
        <SelectItem value="PROCESSING	">Processing</SelectItem>
        
      </SelectGroup>
    </SelectContent>
  </Select>
  <Select onValueChange={handleFilterBy2}>
    <SelectTrigger className="w-full sm:w-[180px] ">
      <SelectValue placeholder="Filter By" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Select</SelectLabel>
        <SelectItem value="Paid">Paid</SelectItem>
        <SelectItem value="NOT_Paid">Not Paid</SelectItem>
        <SelectItem value="Printed">Printed</SelectItem>
        <SelectItem value="NOT_Printed">Not Printed</SelectItem>
        <SelectItem value="Sellerorder">Seller Order</SelectItem>
        <SelectItem value="Clientorder">Client Made Order</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>

    <div className="flex items-center space-x-2">
      <Switch
        id="orders"
        defaultChecked={allOrders}
        onClick={handleToggle} // Handle the state change on toggle
      />
      <Label htmlFor="orders">All Orders</Label>
    </div>

</div>


        <Table>
        <ScrollArea className="mt-4 w-full h-96">
  <TableHeader>
    <TableRow>
      {/* Order Id column */}
      <TableHead>Order Id</TableHead>

      {/* Order Status column */}
      <TableHead>Order Status</TableHead>

      {/* Order Type column */}
      <TableHead>Order Type</TableHead>

      <TableHead>Creation Date</TableHead>

      {/* Is Order Printed column */}
      <TableHead>Is Order Printed</TableHead>

      {/* Is Client Made Order column */}
      <TableHead >Is Client Made Order</TableHead>

      {/* Is Seller Order column */}
      <TableHead >Is Seller Order</TableHead>

      {/* Is Order Paid column */}
      <TableHead>Is Order Paid</TableHead>

      {/* Total Items column */}
      <TableHead>Total Items</TableHead>

      {/* Order Amount column */}
      <TableHead>Order Amount</TableHead>

      {/* Actions column */}
      <TableHead>Actions</TableHead>
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
            {order.status}
          </Badge>
        </TableCell>

        {/* Order Type cell */}
        <TableCell >
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
            {order.isPaid ? "Yes" : "No"}
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
                  <p>View</p>
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
      <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
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
                             <p><Badge className={` text-white ${{
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
                             <p><Badge className={` text-white ${selectedOrder.type === 'CONFIRMED' ? 'bg-green-700' : selectedOrder.type === 'NOT_CONFIRMED' ? 'bg-orange-400' : selectedOrder.type === 'CANCELED' ? 'bg-red-700' : 'bg-gray-700'} hover:bg-gray-700`}>
                             {selectedOrder.type}
                             </Badge>
                         </p>
                         </div>
                         <div>
                             <p className="font-bold">Is Order Paid:</p>
                             <p><Badge className={` text-white ${selectedOrder.isPaid ? 'bg-green-700' :  'bg-red-700'} hover:bg-gray-700`}>
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
                              Loading the order items!
                              </AlertDialogTitle>
                              <AlertDialogDescription className="flex flex-col items-center">
                                This will take a moment.
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

  
    </>
    );
  }
  
  export default OrderView;