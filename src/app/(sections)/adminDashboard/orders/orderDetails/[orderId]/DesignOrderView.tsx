/* eslint-disable @next/next/no-img-element */
'use client'
  import {
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
  import { ClientDesign, Order, OrderItem, OrderStatus, OrderType, Product, SellerDesign, User } from "@prisma/client"
  import { useRouter } from "next/navigation"
  import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { changeStatus, changeType, updateRevenueAndSalesForDesigns } from "./actions"
import ImageSlider from "@/components/MarketPlace/ImageSlider"
import LoadingState from "@/components/LoadingState"

interface ExtraOrderItem extends OrderItem {
    frontsellerDesign : SellerDesign | null
    backsellerDesign : SellerDesign | null
    frontclientDesign : ClientDesign | null
    backclientDesign: ClientDesign | null
}

interface ExtraOrder extends Order {
    orderItems : ExtraOrderItem[]
    user : User
}

interface itemProfit {
  store : string | null
  designId : string
  designName:string
  designType: string;
  productQuantity : number
  totalProfit : number
}

interface Profit {
  orderId : string
  orderItemProfits : itemProfit[] ;
  totalOrderProfit : number
}
  
  
interface OrderViewProps {
    order: ExtraOrder | null
    profit : Profit
}
  
  const DesignOrderView = ({ order , profit }: OrderViewProps ) => { 

    const router = useRouter();
    const { toast } = useToast()

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
                title: 'Status Was Successfully Changed',
                variant: 'default',
              });
              setOpen(false)

            router.refresh()
            
        } catch (error) {
          setOpen(false)

            toast({
                title: 'Status Was Not Changed',
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
                title: 'Type Was Successfully Changed',
                variant: 'default',
              });
              setOpen(false)

            router.refresh()
            
        } catch (error) {
          setOpen(false)

            toast({
                title: 'Type Was Not Changed',
                variant: 'destructive',
              });
            console.log(error)
            
        }
      }



       // Function to handle download
 const downloadDesign = async (imageUrl: string) => {
  if(imageUrl === '') {
    toast({
      title: "No design found !",
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
      title: "Download failed",
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
      title: "Download failed",
      variant: "destructive",
    });
  }
};



const handleUpdate = async (orderId : string , platformProfit : number) =>{
  try {
    setOpen(true)
    await updateRevenueAndSalesForDesigns(orderId , platformProfit , order!.amount)
    toast({
      title: "Profit Updated",
      variant: "default",
    });
    setOpen(false)
    router.refresh()
  } catch (error) {
    setOpen(false)
    console.log(error)
    toast({
      title: "Profit Updateding failed",
      variant: "destructive",
    });
  }
}

    return(

        <>

        {order && (
            <>

<p className="text-sm text-muted-foreground mb-2">AdminDashboard/OrderDetails</p>
           <h1 className="text-2xl font-semibold">Order Details</h1>
     
  
  
        <div className="flex mt-4 flex-col gap-5 w-full">
  
      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
  
  
  
      <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
      <CardHeader className="flex flex-col md:flex-row items-center">
        <div className="grid gap-2">
            <CardTitle className="font-extrabold">Order Infos :</CardTitle>
            <CardDescription>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mt-2">
                      <div>
                            <p className="font-bold">Order Id:</p>
                            <p className="text-xs">{order?.id}</p>
                        </div>

                        <div>
                            <p className="font-bold">Order Status:</p>
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
                            <p className="font-bold">Order Type:</p>
                            <p><Badge className={`text-white ${order.type === 'CONFIRMED' ? 'bg-green-700' : order.type === 'NOT_CONFIRMED' ? 'bg-orange-400' : order.type === 'CANCELED' ? 'bg-red-700' : 'bg-gray-700'} hover:bg-gray-700`}>
                            {order.type}
                            </Badge>
                        </p>
                        </div>
                        <div>
                            <p className="font-bold">Is Order Paid:</p>
                            <p><Badge className={`text-white ${order.isPaid ? 'bg-green-700' :  'bg-red-700'} hover:bg-gray-700`}>
                            {order.isPaid ? "Is Paid" : "Not Paid"}
                           </Badge>
                          </p>
                        </div>
                        <div>
                            <p className="font-bold">Is Order Printed:</p>
                            <p><Badge className={`text-white ${order.printed ? 'bg-green-700' :  'bg-red-700'} hover:bg-gray-700`}>
                              {order.printed ? "Printed" : "Not Printed"}
                              </Badge>
                              </p>
                        </div>
                        <div>
                            <p className="font-bold">Client Name:</p>
                            <p>{order.clientName}</p>
                        </div>
                        <div>
                            <p className="font-bold">Client Phone Number:</p>
                            <p>{order?.phoneNumber}</p>
                        </div>
                        <div>
                            <p className="font-bold">Shipping Address:</p>
                            <p>{order.shippingAddress}</p>
                        </div>
                        <div>
                            <p className="font-bold">order Amount:</p>
                            <p>{(order.amount).toFixed(2)} TND</p>
                        </div>
                        <div>
                        <Button onClick={handleChange} variant={"link"}>Change Status <DatabaseBackup className="ml-1"/></Button>
                        </div>
                        <div>
                        <Button onClick={handleType} variant={"link"}>Change Type <FileType className="ml-1"/></Button>
                        </div>
                    </div>
                </CardDescription>

          </div>
        </CardHeader>
        <Separator className="w-full"/>
        <CardContent>
            <p className="text-gray-600 font-extrabold mt-6">Order Items :</p>
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


        {/* designs profit */}
      <Card className="xl:col-span-4" x-chunk="dashboard-01-chunk-4">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle className="font-extrabold">Order Profit : <span className="text-sm text-gray-600">Designs</span></CardTitle>
                <CardDescription>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-8 mt-2">
                        <div>
                            <p className="font-bold">Order Amount:</p>
                            <p>{(order.amount).toFixed(2)} </p>
                        </div>
                        <div>
                            <p className="font-bold">Total Seller Profit:</p>
                            <p>{(profit.totalOrderProfit).toFixed(2)} TND</p>
                        </div>
                        <div>
                            <p className="font-bold">Total Platform Profit:</p>
                            <p>{(order.amount - profit.totalOrderProfit).toFixed(2)} TND</p>
                        </div>

                        <div>
                            <p className="font-bold">Profit Updated: </p>
                            <p><Badge className={`${order.updated ? 'bg-green-700' :  'bg-red-700'} hover:bg-gray-700`}>
                              {order.updated ? "yes" : "No"}
                              </Badge></p>
                        </div>

                        {order.isPaid && order.status === 'DELIVERED' && !order.updated && (
                          <Button
                            onClick={() => handleUpdate(order.id, order.amount - profit.totalOrderProfit)}
                            variant="link"
                          >
                            Update profit after Sale
                          </Button>
                          )}
                            
                        </div>
                    </CardDescription>

              </div>
            </CardHeader>
            <Separator className="w-full"/>
            <CardContent>
              <div className="mt-2">

              <Table>
                  <TableHeader>
                    <TableRow>
                    <TableHead>Design Id</TableHead>
                      <TableHead>Design Name</TableHead>
                      <TableHead>Item Quantiy</TableHead>
                      <TableHead>Seller Profit</TableHead>
                      <TableHead>Design Type</TableHead>
                      <TableHead>Design Store</TableHead>

                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {profit.orderItemProfits.map((item) => (
                      <TableRow key={order.id}>
                        <TableCell>{item.designId}</TableCell>
                        <TableCell>{item.designName}</TableCell>
                        <TableCell>{item.productQuantity}</TableCell>
                        <TableCell>{(item.totalProfit).toFixed(2)} TND</TableCell>
                        <TableCell>{item.designType}</TableCell>
                        <TableCell>{item.store}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

              </div>        
            </CardContent>

          </Card>




              {/* client products */}
              {selectedItem && selectedItem.productTitle === 'Client Product' && (
      <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle className="font-extrabold">Order Item Infos :</CardTitle>
            <CardDescription>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-8 mt-2">
                         <div>
                            <p className="font-bold">Product Category:</p>
                            <p>{selectedItem.productCategory}</p>
                        </div>
                        <div>
                            <p className="font-bold">Product Title:</p>
                            <p>{selectedItem.productTitle}</p>
                        </div>
                        <div>
                            <p className="font-bold">Product Quantity:</p>
                            <p>{selectedItem.quantity}</p>
                        </div>
                        <div>
                            <p className="font-bold">Product Size:</p>
                            <p>{selectedItem.productSize}</p>
                        </div>
                        <div>
                            <p className="font-bold">Product Color:</p>
                            <p>{selectedItem.productColor}</p>
                        </div>
                        <div>
                            <p className="font-bold">Product Price:</p>
                            <p>{(selectedItem.productPrice).toFixed(2)} TND</p>
                        </div>
                    </div>
                </CardDescription>

          </div>
        </CardHeader>
        <Separator className="w-full"/>
        <CardContent>
        <div className="mt-6 space-y-4">
        <Button onClick={()=>{downloadMockup(selectedItem.capturedMockup)}} variant={"link"}>Download Product Mockup</Button>

            {/* client product */}
          {selectedItem.productTitle === "Client Product" && (
            <>
          <div className="text-sm">
          <div className="flex flex-col md:flex-row md:space-x-10 space-y-2 md:space-y-0">
          <div className="font-bold text-xs">Front Design Id : <span className="text-gray-600 font-semibold">
                {selectedItem.frontclientDesignId ?? selectedItem.frontsellerDesignId ?? "N/A"}
              </span>
            </div>
            <div className="font-bold">Front Design Name : <span className="text-gray-600 font-semibold">
                {selectedItem.frontclientDesign?.name ?? selectedItem.frontsellerDesign?.name ?? "N/A"}
              </span>
            </div>
          </div>

          <Button onClick={()=>{
            const imageUrl = selectedItem.frontclientDesign?.imageUrl ?? selectedItem.frontsellerDesign?.imageUrl;
            downloadDesign(imageUrl ?? '')}} variant={"link"}>Download Front Design</Button>
          </div>



          <div className="text-sm">
          <div className="flex flex-col md:flex-row md:space-x-10 space-y-2 md:space-y-0">
          <div className="font-bold text-xs">Back Design Id : <span className="text-gray-600 font-semibold">
                {selectedItem.backclientDesignId ?? selectedItem.backsellerDesignId ?? "N/A"}
              </span>
            </div>
            <div className="font-bold">Back Design Name : <span className="text-gray-600 font-semibold">
                {selectedItem.backclientDesign?.name ?? selectedItem.backsellerDesign?.name ?? "N/A"}
              </span>
            </div>
          </div>

              <Button onClick={()=>{
            const imageUrl = selectedItem.backclientDesign?.imageUrl ?? selectedItem.backsellerDesign?.imageUrl;
            downloadDesign(imageUrl ?? '')}} variant={"link"}>Download Back Design</Button>
          </div>



            
            </>
          )}


          </div>
          

            
        </CardContent>

      </Card> 
        
    )}

  

      </section>
  
    </div>

            </>
        )}

<LoadingState isOpen={open} />

        </>
        
    )

  }

  export default DesignOrderView