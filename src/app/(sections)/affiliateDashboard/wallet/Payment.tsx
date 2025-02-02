'use client'
import React, { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AffiliatePaymentRequest, Affiliate } from '@prisma/client'
import D17 from './D17'
import Flouci from './Flouci'
import BankDeposit from './BankDeposit'

interface ExtraAffiliate extends Affiliate {
  affiliatePaymentRequest : AffiliatePaymentRequest[]
}

interface Props {
  affiliate : ExtraAffiliate 
  }
const Payment = ({ affiliate } : Props) => {


    const [activeTab, setActiveTab] = useState('D17');
    const handleTabChange = (value : string) => {
      setActiveTab(value);
    };


    
  return (
    <>


<div className="flex justify-center items-center">
  <Tabs defaultValue="D17" className="w-full sm:w-[500px]" onValueChange={handleTabChange}>
  <TabsList className="grid w-full grid-cols-3">
  <TabsTrigger value="D17">D17</TabsTrigger>
  <TabsTrigger value="Flouci">Flouci</TabsTrigger>
  <TabsTrigger value="Bank">Bank Deposit</TabsTrigger>
    </TabsList>
  </Tabs>
  </div>


  {activeTab === "D17" && (
    <D17 affiliate={affiliate} />
  )}

  {activeTab === "Flouci" && (
      <Flouci affiliate={affiliate} />
  )}

  {activeTab === "Bank" && (
    <BankDeposit affiliate={affiliate} />
  )}




   
        




  
  </>
  )
}

export default Payment
