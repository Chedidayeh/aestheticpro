'use client'
import React, { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Store, PaymentRequest } from '@prisma/client'
import D17 from './D17'
import Flouci from './Flouci'
import BankDeposit from './BankDeposit'
import { useTranslations } from 'next-intl';

interface ExtraStore extends Store {
  paymentRequest : PaymentRequest[]
}

interface Props {
    store : ExtraStore
  }
const Payment = ({ store } : Props) => {
  const t = useTranslations('SellerWalletPage');


    const [activeTab, setActiveTab] = useState('D17');
    const handleTabChange = (value : string) => {
      setActiveTab(value);
    };


    
  return (
    <>


<div className="flex justify-center items-center">
  <Tabs defaultValue="D17" className="w-full sm:w-[500px]" onValueChange={handleTabChange}>
  <TabsList className="grid w-full grid-cols-3">
  <TabsTrigger value="D17">{t('tab_d17')}</TabsTrigger>
  <TabsTrigger value="Flouci">{t('tab_flouci')}</TabsTrigger>
  <TabsTrigger value="Bank">{t('tab_bank_deposit')}</TabsTrigger>
    </TabsList>
  </Tabs>
  </div>


  {activeTab === "D17" && (
    <D17 store={store} />
  )}

  {activeTab === "Flouci" && (
      <Flouci store={store} />
  )}

  {activeTab === "Bank" && (
    <BankDeposit store={store} />
  )}




   
        




  
  </>
  )
}

export default Payment
