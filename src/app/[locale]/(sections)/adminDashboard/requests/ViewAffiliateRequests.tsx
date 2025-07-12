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
import {  Affiliate, AffiliatePaymentRequest, User } from "@prisma/client";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import LoadingState from "@/components/LoadingState";
import { Input } from "@/components/ui/input";
import AffiliateD17 from "./AffiliateD17";
import AffiliateFlouci from "./AffiliateFlouci";
import AffiliateBankDeposit from "./AffiliateBankDeposit";
import { useTranslations } from 'next-intl';


interface ExtraAffiliate extends Affiliate {
  user : User
}

interface ExtraAffiliatePaymentRequest extends AffiliatePaymentRequest {
  affiliate : ExtraAffiliate
}


interface ViewProps {
  affiliatePaymentRequests : ExtraAffiliatePaymentRequest[]
}

const ViewAffiliateRequests = ({  affiliatePaymentRequests }: ViewProps) => {
  const t = useTranslations('AdminRequestsPage');
  
  
  const [filterBy, setFilterBy] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRequests, setfilteredRequests] = useState(affiliatePaymentRequests);

  const d17Requests = filteredRequests.filter((request) => request.method === "D17")
  const flouciRequests = filteredRequests.filter((request) => request.method === "Flouci")
  const bankDepositRequest = filteredRequests.filter((request) => request.method === "BankDeposit")

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    let updatedPaymentRequests = [...affiliatePaymentRequests];

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      updatedPaymentRequests = updatedPaymentRequests.filter(request =>
        request.affiliate.user.name!.toLowerCase().includes(lowercasedQuery)
      );
    }

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
  }, [searchQuery, filterBy, affiliatePaymentRequests]);

  const getInitialTab = () => {
    const pendingRequest = affiliatePaymentRequests.find(request => request.status === "PENDING");
    return pendingRequest ? pendingRequest.method as string : "D17"; // Default to "D17" if no pending requests exist
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());
  const handleTabChange = (value : string) => {
    setActiveTab(value);
  };


  return (
    <>

      <Card className="mt-4">
      <CardHeader className="bg-muted/50 rounded-t-lg">
      <CardTitle>{t('affiliate_users_requests')}</CardTitle>
          <CardDescription>{t('total')} {affiliatePaymentRequests.length}</CardDescription>
        </CardHeader>
        <CardContent>
        <div className="flex justify-center items-center mt-2">
        <Tabs defaultValue={activeTab} className="w-full sm:w-[500px]" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="D17">{t('d17')}</TabsTrigger>
          <TabsTrigger value="Flouci">{t('flouci')}</TabsTrigger>
          <TabsTrigger value="Bank">{t('bank_deposit')}</TabsTrigger>
            </TabsList>
          </Tabs>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center my-4 space-y-4 sm:space-y-0 sm:space-x-4">
            <Input
              type="search"
              className="w-full sm:w-[50%]"
              placeholder={t('search_by_user')}
              value={searchQuery}
              onChange={handleSearchChange}
            />
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
        <AffiliateD17 paymentRequests={d17Requests} />
      </div>
    )}

    {activeTab === 'Flouci' && (
      <div className="mt-4">
        <AffiliateFlouci paymentRequests={flouciRequests} />
      </div>
    )}

    {activeTab === 'Bank' && (
      <div className="mt-4">
        <AffiliateBankDeposit paymentRequests={bankDepositRequest} />
      </div>
    )}


        </CardContent>
      </Card>

    </>
  );
};

export default ViewAffiliateRequests;
