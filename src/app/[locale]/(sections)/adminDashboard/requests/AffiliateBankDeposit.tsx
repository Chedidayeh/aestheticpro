'use client'
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
import React, { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Affiliate, AffiliatePaymentRequest, User } from "@prisma/client";
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CircleAlert, OctagonAlert, Trash2 } from 'lucide-react';
import { approveAffiliateRequest, deleteAffiliatePaymentRequestById, rejectAffiliateRequest } from "./actions";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import LoadingState from "@/components/LoadingState";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslations } from 'next-intl';

interface ExtraAffiliate extends Affiliate {
  user : User
}

interface ExtraAffiliatePaymentRequest extends AffiliatePaymentRequest {
  affiliate : ExtraAffiliate
}

  
  interface ViewProps {
    paymentRequests: ExtraAffiliatePaymentRequest[];
  }

const AffiliateBankDeposit = ({ paymentRequests }: ViewProps) => {
    
    const { toast } = useToast()
    const router = useRouter();
    const t = useTranslations('AdminRequestsPage');
    const [open, setOpen] = useState<boolean>(false);
    const [isDeleteOpen, setisDeleteOpen] = useState(false);
    const [selectedRequestId, setselectedRequestId] = useState<string>();



// handleDelete function 
const handleDelete = async () => {
    try {
        setOpen(true)
        await deleteAffiliatePaymentRequestById(selectedRequestId!)
        toast({
            title: t('toast_request_deleted'),
            variant: 'default',
          });
        setOpen(false)
        setisDeleteOpen(false)
        router.push("")
        return
    }
    catch (error) {
        console.error(error);
        setisDeleteOpen(false)
        setOpen(false)
        toast({
            title: t('toast_error'),
            description: t('toast_try_again_later'),
            variant: 'destructive',
            });
        return
        }
        }





        const [selectedRequest, setselectedRequest] = useState<ExtraAffiliatePaymentRequest | null>(null);
        const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    
        const handleRowClick = (request: ExtraAffiliatePaymentRequest, index: number) => {
          if (selectedIndex === index) {
            setselectedRequest(null);
            setSelectedIndex(null);
          } else {
            setselectedRequest(request);
            setSelectedIndex(index);
          }
        };


        // handleChange function
        const approveRequest = async () => {
            try {
              setOpen(true)
                await approveAffiliateRequest(selectedRequest!)
                toast({
                  title: t('toast_request_approved'),
                  variant: 'default',
                  });
                  router.refresh()
                  setselectedRequest(null)
                  setOpen(false)
            } catch (error) {
              console.error(error);
              setOpen(false)
              toast({
                title: t('toast_error'),
                description: t('toast_try_again_later'),
                variant: 'destructive',
                });
                
            }
        }

        const rejectRequest = async () => {
          try {
            setOpen(true)
              await rejectAffiliateRequest(selectedRequest!)
              toast({
                title: t('toast_request_rejected'),
                variant: 'default',
                });
                router.refresh()
                setselectedRequest(null)
                setOpen(false)
          } catch (error) {
            console.error(error);
            setOpen(false)
            toast({
              title: t('toast_error'),
              description: t('toast_try_again_later'),
              variant: 'destructive',
              });
              
          }
      }

    return (
        <div>


<div className="flex mt-4 flex-col gap-5 w-full">
  
  <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-1 xl:grid-cols-1">

  {paymentRequests.length > 0 ? (

      <Table>
      <ScrollArea
          className={`${
            paymentRequests.length < 10 ? "max-h-max" : "h-[384px]"
          } w-full border rounded-lg mt-4`}
        >          <TableHeader>
          <TableRow>
            <TableHead>{t('bank_name')}</TableHead>
            <TableHead>{t('account_holder')}</TableHead>
            <TableHead>{t('bank_account_rib')}</TableHead>
            <TableHead>{t('requested_amount')}</TableHead>
            <TableHead>{t('user_email')}</TableHead>
            <TableHead>{t('payment_status')}</TableHead>
            <TableHead>{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paymentRequests.map((request , index) => (
            <TableRow 
            key={request.id} 
            className={` cursor-pointer ${selectedIndex === index ? 'border-2 border-blue-500' : ''}`}
            onClick={() => handleRowClick(request, index)}
        
            >
              <TableCell> {request.bankName || t('na')}</TableCell>
              <TableCell>{request.accountHolder || t('na')}</TableCell>
              <TableCell>{request.bankAccount || t('na')}</TableCell>
              <TableCell>{request.requestedAmount.toFixed(2)} TND</TableCell>
              <TableCell>{request.affiliate.user.email}</TableCell>
              <TableCell>
                <Badge
                  className={` text-white ${
                    {
                      PENDING: 'bg-blue-700',
                      APPROVED: 'bg-green-700',
                      REJECTED: 'bg-red-700',
                    }[request.status]
                  } hover:bg-gray-700`}
                >
                  {t(request.status.toLowerCase())}
                </Badge>
              </TableCell>
              <TableCell>
                <TooltipProvider>
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Trash2
                          onClick={() => {
                            setisDeleteOpen(true);
                            setselectedRequestId(request.id);
                          }}
                          className="cursor-pointer hover:text-red-500 ml-2"
                        />
                      </TooltipTrigger>
                      <TooltipContent className="bg-red-500">
                        <p>{t('cancel')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        </ScrollArea>
      </Table>

) : (
  <>
<div className="flex items-center justify-center flex-col text-muted-foreground mt-3">
<h1 className="text-center text-3xl font-bold">
  <CircleAlert />
</h1>
<p className="text-center text-sm mt-2">{t('no_requests_found')}</p>
<p className="text-center text-xs mt-2">{t('new_bank_requests_appear')}</p>

</div>

</>
)}
      
      </section>
                     </div>


      {selectedRequest && (
      <Card className="col-span-full my-4" x-chunk="dashboard-01-chunk-4">
          <CardHeader className="flex flex-col md:flex-row items-center">
                 <div className="grid gap-2">
             <CardTitle className="font-extrabold">{t('request_infos')}</CardTitle>
             <CardDescription>
             <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-10 mt-2">
             <div>
                             <p className="font-bold">{t('request_id')}</p>
                             <p>{selectedRequest.id}</p>
                         </div>

                         <div>
                             <p className="font-bold">{t('request_date')}</p>
                             <p className="text-xs">{new Date(selectedRequest.createdAt).toLocaleString()}</p>
                         </div>

                         <div>
                            <p className="font-bold">{t('request_status')}</p>
                            <p>
                                <Badge 
                                className={`text-white ${
                                    {
                                    "PENDING": 'bg-blue-700',
                                    'APPROVED': 'bg-green-700',
                                    'REJECTED': 'bg-red-700',  // Ensure this matches your status key
                                    }[selectedRequest.status]
                                } hover:bg-gray-700`}
                                >
                                {selectedRequest.status}
                                </Badge>
                            </p>
                            </div>

                         <div>
                             <p className="font-bold">{t('requested_amount')}</p>
                             <p>{selectedRequest.requestedAmount.toFixed(2)} TND</p>
                         </div>
                         <div>
                             <p className="font-bold">{t('affiliate_email')}</p>
                             <p>{selectedRequest.affiliate.user.email}</p>
                         </div>
      
                         <div>
                             <p className="font-bold">{t('affiliate_revenue')}</p>
                             <p>{selectedRequest.affiliate.totalIncome.toFixed(2)} TND</p>
                         </div>
                         <div>
                             <p className="font-bold">{t('affiliate_received_payments')}</p>
                             <p>{selectedRequest.affiliate.receivedPayments.toFixed(2)} TND</p>
                         </div>
                         <div>
                             <p className="font-bold">{t('affiliate_unreceived_payments')}</p>
                             <p>{(selectedRequest.affiliate.totalIncome - selectedRequest.affiliate.receivedPayments).toFixed(2)} TND</p>
                         </div>
                         {selectedRequest.status != "APPROVED" &&  selectedRequest.status != "REJECTED" &&(
                         <div className="col-span-2 md:col-span-1">
                         <Button onClick={approveRequest} variant="link" className="block mb-2 md:mb-0">{t('approve_request')}</Button>
                         </div>
                           )}
                        {selectedRequest.status != "APPROVED" && selectedRequest.status != "REJECTED" && (
                         <div className="col-span-2 md:col-span-1">
                         <Button onClick={rejectRequest} variant="link" className="block text-red-500 mb-2 md:mb-0">{t('reject_request')}</Button>
                         </div>
                           )}
                     </div>
                 </CardDescription>
 
           </div>
         </CardHeader>
       </Card>
      )}


                                <AlertDialog open={isDeleteOpen}>
                                <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
                                <AlertDialogHeader className="flex flex-col items-center">
                                       <div className="text-red-500 mb-2">
                                           <OctagonAlert className=''/>
                                               </div>
                                              <AlertDialogTitle className="text-xl font-bold text-center">
                                                 {t('delete_dialog_title')}
                                               </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                   {t('delete_dialog_desc')}
                                                    </AlertDialogDescription>
                                                   </AlertDialogHeader>
                                                  <AlertDialogFooter>
                                              <AlertDialogCancel onClick={()=>setisDeleteOpen(false)}>{t('delete_dialog_cancel')}</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete()} 
                                     className='bg-red-500 hover:bg-red-500' >{t('delete_dialog_action')}</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                     </AlertDialog> 
            <LoadingState isOpen={open} />

        </div>
    );
}

export default AffiliateBankDeposit;
