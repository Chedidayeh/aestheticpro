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
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import {
  CircleAlert,
    Eye,
    Loader,
    Search,
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
  
  
  import React, { useRef, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Order, OrderItem } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { TooltipProvider } from "@/components/ui/tooltip"
import { getAllOrders } from "./actions"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import LoadingState from "@/components/LoadingState"
  
  



interface ExtraOrders extends Order {
    orderItems : OrderItem[]
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

const handleToggle = async () => {
  setOpen(true)
  setAllOrders(!allOrders); // Toggle the state
  const orders = await getAllOrders(10, !allOrders, searchQuery , filterBy1 , filterBy2);
  setOrders(orders);
  setOpen(false)
};

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = async () => {
      try {
        setOpen(true);
        const orders = await getAllOrders(10, allOrders, searchQuery, filterBy1, filterBy2);
        setOrders(orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
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
        console.error("Error filtering orders by filter1:", error);
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
        console.error("Error filtering orders by filter2:", error);
        toast({
          title: "Something went wrong!",
          variant: "destructive",
        });
      } finally {
        setOpen(false);
      }
    };
    
  






    

  // openDialogstate
  const [openDialog, setOpenDialog] = useState(false);

    return (
      <>


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




      
  
  
  <p className="text-sm text-muted-foreground mb-2">factoryDashboard/Orders</p>
           <h1 className="text-2xl font-semibold">Manage Orders</h1>
  
  
  
     
  
  
        <div className="flex mt-4 flex-col gap-5 w-full">
  
      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-1 xl:grid-cols-1">
  
  
  
      <Card className="xl:col-span-4" x-chunk="dashboard-01-chunk-4">
      <CardHeader className=" bg-muted/50 rounded-t-lg">
      <div className="flex flex-col gap-2">
            <CardTitle>Orders</CardTitle>
            <CardDescription>Total: {orders.length}</CardDescription>
          </div>
          <div className="flex mt-4 flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 items-center">
          <Input
            type="search"
            className="w-full sm:w-[50%] "
            placeholder="Enter the order Id to make a search..."
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
                <SelectItem value="Printed">Printed</SelectItem>
                <SelectItem value="NOT_Printed">Not Printed</SelectItem>

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
        <p className="text-blue-600 text-sm mt-4">
        <span className="text-blue-600 font-medium">Guide :</span> use the Eye action to view the order details !
      </p>
        </CardHeader>
        <CardContent>




        { orders.length > 0 ? (

            <Table>
            <ScrollArea
          className={`${
            orders.length < 10 ? "max-h-max" : "h-[384px]"
          } w-full border rounded-lg mt-4`}
        >                 
        <TableHeader>
                <TableRow>
                  <TableHead >Order Id</TableHead>
                  <TableHead >Order Status</TableHead>
                  <TableHead >Order Type</TableHead>
                  <TableHead >Is Order Printed</TableHead>
                  <TableHead>Order Creation Date</TableHead>
                  <TableHead>Total Items</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {orders.map((order , index) => (
                  <TableRow
                  key={order.id}
                >
                    <TableCell >{order.id}</TableCell>
                    <TableCell>
                      <Badge className={` text-white ${{
                              'PROCESSING': 'bg-blue-700',
                              'DELIVERED': 'bg-green-700',
                              'REFUSED': 'bg-red-700',
                              'CANCELED': 'bg-red-700'
                            }[order.status]} hover:bg-gray-700`}>
                              {order.status}
                        </Badge>
                      </TableCell >
                    <TableCell >
                    <Badge className={`text-white ${order.type === 'CONFIRMED' ? 'bg-green-700' : order.type === 'NOT_CONFIRMED' ? 'bg-orange-400' : order.type === 'CANCELED' ? 'bg-red-700' : 'bg-gray-700'} hover:bg-gray-700`}>
                      {order.type}
                    </Badge>
                      </TableCell>
                    <TableCell>
                      <Badge className={` text-white ${order.printed ? 'bg-green-700' :  'bg-red-700'} hover:bg-gray-700`}>
                    {order.printed ? "Printed" : "Not Printed"}
                      </Badge>
                      </TableCell>
                    <TableCell>{order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}</TableCell>
                    <TableCell>{order.orderItems?.length || 0} items</TableCell>
                    <TableCell>
                    <TooltipProvider>
                    {/* View Icon */}
                    <div className="flex items-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Eye
                            onClick={() => {
                              setOpenDialog(true)
                              router.push(`/factoryDashboard/orderDetails/${order.id}`)
                            }}
                            className="cursor-pointer hover:text-blue-500"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View</p>
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
          <div className="flex mt-2 items-center justify-center flex-col text-muted-foreground">
          <h1 className="text-center text-3xl font-bold">
            <CircleAlert />
          </h1>
          <p className="text-center text-sm mt-2">No records of any orders made for now !</p>
            <p className="text-center text-xs mt-2">New orders will appear here.</p>
        </div>
        )}


        </CardContent>
      </Card>  
        


      </section>
  

  
    </div>
    <LoadingState isOpen={open} />

    </>
    );
  }
  
  export default OrderView;