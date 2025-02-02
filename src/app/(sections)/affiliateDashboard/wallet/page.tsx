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
import { getAffiliatePaymentRequest, getUser } from "@/actions/actions"
import { Store } from "@prisma/client"
import ErrorState from "@/components/ErrorState"



const Page =  async () => {

  try {
    



  const user = await getUser()
  if(!user) return
  const affiliate = await getAffiliatePaymentRequest(user!.id)
  const pendingRequest = affiliate?.affiliatePaymentRequest.find(request => request.status === 'PENDING');

  return (
    <>


  
<p className="text-sm text-muted-foreground mb-2">AffiliateDashboard/wallet</p>
<h1 className="text-2xl font-semibold mb-8">Your Wallet</h1>



      <div className="flex flex-col gap-5 w-full">

    <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">



          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{affiliate?.totalIncome.toFixed(2)} TND</div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Requested Amount
              </CardTitle>
              <HandCoins className="h-6 w-6 text-muted-foreground" />
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
          <Card x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
              Total Unreceived Payments                
              </CardTitle>
              <CreditCard className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{(affiliate!.totalIncome - affiliate!.receivedPayments).toFixed(2)} TND</div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
              Total Received Payments                
              </CardTitle>
              <Receipt className="h-6 w-66 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{affiliate!.receivedPayments.toFixed(2)} TND</div>
            </CardContent>
          </Card>

           </section>



    <section>
    <Payment affiliate={affiliate!} />
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