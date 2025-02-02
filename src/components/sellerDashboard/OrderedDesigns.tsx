import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getOrderedDesignsByStoreId, getStoreByUserId, getUser } from "@/actions/actions";
import React from "react";


const DesignsOrder = async () => {
  const user = await getUser();
  if (!user) throw new Error("User not found");
  const store = await getStoreByUserId(user.id);
  const storeOrdersForDesigns = await getOrderedDesignsByStoreId(store!.id);

  return (

    <div className="flex mt-4 flex-col gap-5 w-full">
  
    <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-1 xl:grid-cols-1">
  
    <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Ordered Designs</CardTitle>
          <CardDescription>Total: {storeOrdersForDesigns.length}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Design Id</TableHead>
              <TableHead>Design Name</TableHead>
              <TableHead className="text-center">Design Price</TableHead>
              <TableHead className="text-center">Seller Profit</TableHead>
              <TableHead className="text-center">Order Count</TableHead>
              <TableHead className="text-center">Total Product Quantity</TableHead>
              <TableHead className="text-center">Total Sales</TableHead>
              <TableHead className="text-center">
                Revenue
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {storeOrdersForDesigns.map((design) => (
              <TableRow key={design.id}>
                <TableCell>{design.id}</TableCell>
                <TableCell>{design.name}</TableCell>
                <TableCell className="text-center">{(design.price).toFixed(2)} TND</TableCell>
                <TableCell className="text-center">{(design.sellerProfit).toFixed(2)} TND</TableCell>
                <TableCell className="text-center">{design.orderCount}</TableCell>
                <TableCell className="text-center">{design.totalOrderedQuantity}</TableCell>
                <TableCell className="text-center">{design.totalSales}</TableCell>
                <TableCell className="text-center">
                  {(design.revenue).toFixed(2)} TND
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    </section>
    </div>
  );
};

export default DesignsOrder;
