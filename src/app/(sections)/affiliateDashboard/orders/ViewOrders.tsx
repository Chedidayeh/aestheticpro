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

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {  Commission, Order, OrderItem } from "@prisma/client";
import { ChangeEvent, useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

interface ExtraOrderItem extends OrderItem {
  order : Order
  commission : Commission | null
}


interface OrderItemsWithCommission {
  orderItem : ExtraOrderItem | null
  commissionProfit : number
}


interface ViewProps {
  orderItems: OrderItemsWithCommission[];
}

const ViewOrders = ({ orderItems }: ViewProps) => {

  const { toast } = useToast()

    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredOrders, setFilteredOrders] = useState(orderItems);
    const [searchTerm, setSearchTerm] = useState(""); // For searching by commission ID

    useEffect(() => {
      let updatedOrders = [...orderItems];
  
      // Filter orders based on filter criteria
      if (filterCriteria) {
        updatedOrders = updatedOrders.filter((orderWithCommission) => {
          const { orderItem } = orderWithCommission;
          if (!orderItem) return false;
  
          switch (filterCriteria) {
            case "CONFIRMED":
              return orderItem.order.type === "CONFIRMED";
            case "NOT_CONFIRMED":
              return orderItem.order.type === "NOT_CONFIRMED";
            case "CANCELED":
              return orderItem.order.type === "CANCELED";
            case "DELIVERED":
              return orderItem.order.status === "DELIVERED";
            case "Paid":
              return orderItem.order.isPaid === true;
            case "NOT_Paid":
              return orderItem.order.isPaid === false;
            case "Printed":
              return orderItem.order.printed === true;
            case "NOT_Printed":
              return orderItem.order.printed === false;
            default:
              return true;
          }
        });
      }
  
      // Filter orders based on search term (Commission ID)
      if (searchTerm) {
        updatedOrders = updatedOrders.filter(
          (orderWithCommission) =>
            orderWithCommission.orderItem?.commission?.id
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) // Match Commission ID
        );
      }
  
      setFilteredOrders(updatedOrders);
    }, [filterCriteria, searchTerm, orderItems]);
    
    // Handle search term input
    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value); // Update the search term state
    };
  
    const handleFilterChange = (value: string) => {
      setFilterCriteria(value);
    };

  return (
    <>

<p className="text-sm text-muted-foreground mb-2">AffiliateDashboard/Orders</p>
           <h1 className="text-2xl font-semibold">All Orders Items</h1>
  
  
  
     
  
  
        <div className="flex mt-4 flex-col gap-5 w-full">
  
      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-1 xl:grid-cols-1">
  
  
  
      <Card className="xl:col-span-4" x-chunk="dashboard-01-chunk-4">
        <CardHeader className="flex flex-row items-center bg-muted/50">
          <div className="grid gap-2">
            <CardTitle>Orders Items</CardTitle>
            <CardDescription>Total: {orderItems.length}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>

        <div className="flex flex-row  space-x-2 items-center my-2">

        <Input
              type="search"
              className="md:w-[30%] w-full"
              placeholder="Search by Commission Id..."
              value={searchTerm}
              onChange={handleSearchChange}
            /> 

  <Select onValueChange={handleFilterChange}>
    <SelectTrigger className="w-[200px] ">
      <SelectValue placeholder="Filter By" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Select</SelectLabel>
        <SelectItem value="CONFIRMED">Confirmed</SelectItem>
        <SelectItem value="NOT_CONFIRMED">Not Confirmed</SelectItem>
        <SelectItem value="CANCELED">Canceled</SelectItem>
        <SelectItem value="DELIVERED">Delivered</SelectItem>
        <SelectItem value="Paid">Paid</SelectItem>
        <SelectItem value="NOT_Paid">Not Paid</SelectItem>
        <SelectItem value="Printed">Printed</SelectItem>
        <SelectItem value="NOT_Printed">Not Printed</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</div>


        <Table>
        <ScrollArea className="mt-4 w-full h-96">
          <TableHeader>
            <TableRow>
              {/* Order Status column */}
              <TableHead className="">Order Status</TableHead>

              {/* Order Type column */}
              <TableHead className="">Order Type</TableHead>

              <TableHead>Creation Date</TableHead>

              {/* Is Order Printed column */}
              <TableHead>Is Order Printed</TableHead>

              {/* Is Order Paid column */}
              <TableHead>Is Order Paid</TableHead>

              <TableHead className="">Commission Id</TableHead>

              <TableHead>Your Profit</TableHead>


            </TableRow>
          </TableHeader>
          <TableBody>
          {filteredOrders.map((orderWithCommission, index) => {
            const { orderItem, commissionProfit } = orderWithCommission;
            if (!orderItem) return null; // Skip rendering if order is null

            return (
              <TableRow key={orderItem.id}>
                <TableCell className="">
                  <Badge className={{
                    'PROCESSING': 'bg-blue-700 text-white',
                    'DELIVERED': 'bg-green-700 text-white',
                    'REFUSED': 'bg-red-700 text-white',
                    'CANCELED': 'bg-red-700 text-white'
                  }[orderItem.order.status] || 'bg-gray-700 text-white'}>
                    {orderItem.order.status}
                  </Badge>
                </TableCell>

                <TableCell className="">
                  <Badge className={orderItem.order.type === 'CONFIRMED' ? 'bg-green-700 text-white' : orderItem.order.type === 'NOT_CONFIRMED' ? 'bg-orange-400 text-white' : orderItem.order.type === 'CANCELED' ? 'bg-red-700 text-white' : 'bg-gray-700 text-white'}>
                    {orderItem.order.type}
                  </Badge>
                </TableCell>

                <TableCell>{new Date(orderItem.createdAt).toLocaleString()}</TableCell>

                <TableCell>
                  <Badge className={orderItem.order.printed ? 'bg-green-700 text-white' : 'text-white bg-red-700'}>
                    {orderItem.order.printed ? "Printed" : "Not Printed"}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge className={orderItem.order.isPaid ? 'bg-green-700 text-white' : 'bg-red-700 text-white'}>
                    {orderItem.order.isPaid ? "Is Paid" : "Not Paid"}
                  </Badge>
                </TableCell>

                <TableCell className="text-xs">
                  {orderItem.commission!.id}
                </TableCell>

                <TableCell>
                  {commissionProfit.toFixed(2)} TND
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        </ScrollArea>
        </Table>
        </CardContent>
      </Card>  

        


      </section>
  

  
    </div>

    </>
  );
};

export default ViewOrders;
