'use client'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {  PaymentRequest } from "@prisma/client";
import { useEffect, useState } from "react";
import D17 from "./D17";
import Flouci from "./Flouci";
import BankDeposit from "./BankDeposit";
import { useTranslations } from 'next-intl';
interface ViewProps {
  paymentRequests: PaymentRequest[];
}

const ViewRequests = ({ paymentRequests }: ViewProps) => {
  const t = useTranslations('SellerRequestsPage');

  

  const [filterBy, setFilterBy] = useState<string>('');
  const [filteredRequests, setfilteredRequests] = useState(paymentRequests);
  const d17Requests = filteredRequests.filter((request) => request.method === "D17")
  const flouciRequests = filteredRequests.filter((request) => request.method === "Flouci")
  const bankDepositRequest = filteredRequests.filter((request) => request.method === "BankDeposit")

  useEffect(() => {
    let updatedPaymentRequests = [...paymentRequests];


    if (filterBy) {
      updatedPaymentRequests = updatedPaymentRequests.filter(request => {
        if (filterBy === 'APPROVED') {
          return request.status === "APPROVED";
        } else if (filterBy === 'PENDING') {
          return request.status === "PENDING";
        } else if (filterBy === 'REJECTED') {
          return request.status === "REJECTED";
        }
        return true;
      });
    }

    setfilteredRequests(updatedPaymentRequests);
  }, [ filterBy, paymentRequests]);


  const getInitialTab = () => {
    const pendingRequest = paymentRequests.find(request => request.status === "PENDING");
    return pendingRequest ? pendingRequest.method as string : "D17"; // Default to "D17" if no pending requests exist
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab());
  
  const handleTabChange = (value : string) => {
    setActiveTab(value);
  };


  return (
    <>

      <p className="text-sm text-muted-foreground mb-2">{t('breadcrumb')}</p>
      <h1 className="text-2xl font-semibold mb-8">{t('title')}</h1>
      <Card>
        <CardHeader className="bg-muted/50 rounded-t-lg">
          <CardTitle>{t('requests')}</CardTitle>
          <CardDescription>{t('total', {count: paymentRequests.length})}</CardDescription>

          {paymentRequests.length === 0 ? (
          <CardDescription>
            <span className="text-blue-500">{t('no_requests')}</span>
          </CardDescription>
             ) : (
<CardDescription>
  <div><span className="text-blue-500">{t('pending')}:</span> {t('under_review')}</div>
  <div><span className="text-blue-500">{t('refresh_page')}</span> {t('view_new_requests')}</div>
</CardDescription>


             )}
        </CardHeader>
        <CardContent>
        <div className="flex justify-center items-center mt-2">
        <Tabs defaultValue={activeTab} className="w-full sm:w-[500px]" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3">
  <TabsTrigger value="D17">{t('d17')}</TabsTrigger>
  <TabsTrigger value="Flouci">{t('flouci')}</TabsTrigger>
  <TabsTrigger value="BankDeposit">{t('bank')}</TabsTrigger>
    </TabsList>
  </Tabs>
  </div>

  <div className="flex flex-col sm:flex-row justify-center items-center my-4 space-y-4 sm:space-y-0 sm:space-x-4">
            <Select onValueChange={(value) => setFilterBy(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t('filter_by')} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t('select')}</SelectLabel>
                  <SelectItem value="APPROVED">{t('approved')}</SelectItem>
                  <SelectItem value="PENDING">{t('pending')}</SelectItem>
                  <SelectItem value="REJECTED">{t('rejected')}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

    {activeTab === 'D17' && (
      <div className="mt-4">
        <D17 paymentRequests={d17Requests} />
      </div>
    )}

    {activeTab === 'Flouci' && (
      <div className="mt-4">
        <Flouci paymentRequests={flouciRequests} />
      </div>
    )}

    {activeTab === 'BankDeposit' && (
      <div className="mt-4">
        <BankDeposit paymentRequests={bankDepositRequest} />
      </div>
    )}


        </CardContent>
      </Card>

    </>
  );
};

export default ViewRequests;
