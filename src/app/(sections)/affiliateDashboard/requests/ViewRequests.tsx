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
import {  AffiliatePaymentRequest } from "@prisma/client";
import { useEffect, useState } from "react";
import D17 from "./D17";
import Flouci from "./Flouci";
import BankDeposit from "./BankDeposit";
interface ViewProps {
  paymentRequests: AffiliatePaymentRequest[];
}

const ViewRequests = ({ paymentRequests }: ViewProps) => {

  

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

      <p className="text-sm text-muted-foreground mb-2">AffiliateDashboard/RequestedPayments</p>
      <h1 className="text-2xl font-semibold mb-8">All Requests</h1>
      <Card>
        <CardHeader>
          <CardTitle>Requests</CardTitle>
          <CardDescription>Total : {paymentRequests.length}</CardDescription>

          {paymentRequests.length === 0 ? (
          <CardDescription>
            <span className="text-blue-500">No requests made for now !</span>
          </CardDescription>
             ) : (
<CardDescription>
  <div><span className="text-blue-500">Pending:</span> Your request is under review!</div>
  <div><span className="text-blue-500">Refresh Page</span> to view new added requests!</div>
</CardDescription>


             )}
        </CardHeader>
        <CardContent>
        <div className="flex justify-center items-center">
  <Tabs defaultValue={activeTab} className="w-full sm:w-[500px]" onValueChange={handleTabChange}>
  <TabsList className="grid w-full grid-cols-3">
  <TabsTrigger value="D17">D17</TabsTrigger>
  <TabsTrigger value="Flouci">Flouci</TabsTrigger>
  <TabsTrigger value="BankDeposit">Bank</TabsTrigger>
    </TabsList>
  </Tabs>
  </div>

  <div className="flex flex-col sm:flex-row justify-center items-center my-4 space-y-4 sm:space-y-0 sm:space-x-4">
            <Select onValueChange={(value) => setFilterBy(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter By" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select</SelectLabel>
                  <SelectItem value="APPROVED">APPROVED</SelectItem>
                  <SelectItem value="PENDING">PENDING</SelectItem>
                  <SelectItem value="REJECTED">REJECTED</SelectItem>
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
