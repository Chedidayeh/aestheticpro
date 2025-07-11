
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
import { getOrderedProductsByStoreId, getStoreByUserId, getUser } from "@/actions/actions";
import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import { CircleAlert } from "lucide-react";
import { getTranslations } from 'next-intl/server';


const OrderedProducts = async () => {
  const t = await getTranslations('SellerDashboardComponents');
  const user = await getUser();
  if (!user) throw new Error("User not found");
  const store = await getStoreByUserId(user.id);
  const storeOrdersForProducts = await getOrderedProductsByStoreId(store!.id);

  return (

    <div className="flex mt-4 flex-col gap-5 w-full">

      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-1 xl:grid-cols-1">

        <Card>
          <CardHeader className="flex flex-row items-center bg-muted/50 rounded-t-lg">
            <div className="grid gap-2">
              <CardTitle>{t('orderedProducts')}</CardTitle>
              <CardDescription>{t('total', {count: storeOrdersForProducts.length})}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>

            {storeOrdersForProducts.length > 0 ? (


              <Table>
                <ScrollArea
                  className={`${storeOrdersForProducts.length < 10 ? "max-h-max" : "h-[384px]"
                    } w-full border rounded-lg mt-4`}
                >
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('productTitle')}</TableHead>
                      <TableHead>{t('productCategory')}</TableHead>
                      <TableHead className="text-center">{t('productPrice')}</TableHead>
                      <TableHead className="text-center">{t('sellerProfit')}</TableHead>
                      <TableHead className="text-center">{t('orderCount')}</TableHead>
                      <TableHead className="text-center">{t('totalProductQuantity')}</TableHead>
                      <TableHead className="text-center">{t('totalSales')}</TableHead>
                      <TableHead className="text-center">{t('revenue')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {storeOrdersForProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.title}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="text-center">{(product.price).toFixed(2)} {t('tnd')}</TableCell>
                        <TableCell className="text-center">{(product.sellerProfit).toFixed(2)} {t('tnd')}</TableCell>
                        <TableCell className="text-center">{product.orderCount}</TableCell>
                        <TableCell className="text-center">{product.totalOrderedQuantity}</TableCell>
                        <TableCell className="text-center">{product.totalSales}</TableCell>
                        <TableCell className="text-center">
                          {(product.revenue).toFixed(2)} {t('tnd')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </ScrollArea>
              </Table>

            ) : (
              <>
                <div className="flex mt-2 items-center justify-center flex-col text-muted-foreground">
                  <h1 className="text-center text-3xl font-bold">
                    <CircleAlert />
                  </h1>
                  <p className="text-center text-sm mt-2">{t('noOrders')}</p>
                  <p className="text-center text-xs mt-2">{t('newOrdersWillAppearHere')}</p>

                </div>

              </>
            )}
          </CardContent>
        </Card>

      </section>
    </div>

  );
};

export default OrderedProducts;
