/* eslint-disable react/no-unescaped-entities */
import {
  CreditCard,
  DollarSign,
  HandCoins,
  Receipt,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"



import React from "react"
import Payment from "./Payment"
import { getUser } from "@/actions/actions"
import { getStoreByUserId } from "./actions"
import { Store } from "@prisma/client"
import ErrorState from "@/components/ErrorState"





interface ExtraStore extends Store {
  paymentRequest : PaymentRequest
}


const Page =  async () => {

  try {
    


  const user = await getUser()
  if(!user) return
  const store = await getStoreByUserId(user!.id!)
  const pendingRequest = store.paymentRequest.find(request => request.status === 'PENDING');

  return (
    <>


  
<p className="text-sm text-muted-foreground mb-2">SellerDashboard/wallet</p>
<h1 className="text-2xl font-semibold mb-8">Your Wallet</h1>



      <div className="flex flex-col gap-5 w-full">

    <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">



          <Card x-chunk="dashboard-01-chunk-0" className="bg-muted/50" >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{store.revenue.toFixed(2)} TND</div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-1" className="bg-muted/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Requested Amount
              </CardTitle>
              <HandCoins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div>
              {pendingRequest ? (
                <div className="text-2xl font-bold">
                  {pendingRequest.requestedAmount.toFixed(2)} TND
                </div>
              ) : (
                <div className="text-2xl font-bold">0.00 TND</div>
              )}
            </div>            
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-3" className="bg-muted/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
              Total Unreceived Payments                
              </CardTitle>
              <CreditCard className="h-4 w-6µ4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{(store.revenue - store.receivedPayments).toFixed(2)} TND</div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-4" className="bg-muted/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
              Total Received Payments                
              </CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{store.receivedPayments.toFixed(2)} TND</div>
            </CardContent>
          </Card>

           </section>



    <section>
    <Payment store={store} />
    </section>

  </div>

  </>
  );
} catch (error) {
  console.error(error);
  return <ErrorState/>

    
}
}

export default Page;