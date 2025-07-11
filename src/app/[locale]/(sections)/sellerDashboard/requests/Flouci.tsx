'use client'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { PaymentRequest } from "@prisma/client";
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CircleAlert, OctagonAlert, Trash2 } from 'lucide-react';
import { deletePaymentRequestById } from "./actions";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import LoadingState from "@/components/LoadingState";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from 'next-intl';

interface ViewProps {
    paymentRequests: PaymentRequest[];
}

const Flouci = ({ paymentRequests }: ViewProps) => {
    const t = useTranslations('SellerRequestsPage');
    
    const { toast } = useToast()
    const router = useRouter();
    const [open, setOpen] = useState<boolean>(false);
    const [isDeleteOpen, setisDeleteOpen] = useState(false);
    const [selectedRequestId, setselectedRequestId] = useState<string>();

    useEffect(() => {
        router.refresh();
      },);

// handleDelete function 
const handleDelete = async () => {
    try {
        setOpen(true)
        await deletePaymentRequestById(selectedRequestId!)
        toast({
            title: t('toast_request_canceled'),
            variant: 'default',
          });
        setOpen(false)
        setisDeleteOpen(false)
        router.refresh();
    }
    catch (error) {
        console.error(error);
        setisDeleteOpen(false)
        setOpen(false)
        toast({
            title: t('toast_error'),
            description: t('toast_try_again'),
            variant: 'destructive',
            });
        return
        }
        }

    return (
        <div>
            <AlertDialog open={isDeleteOpen}>
                <AlertDialogTrigger asChild></AlertDialogTrigger>
                <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
                    <AlertDialogHeader className="flex flex-col items-center">
                        <div className="text-red-500 mb-2">
                            <OctagonAlert className='' />
                        </div>
                        <AlertDialogTitle className="text-xl font-bold text-center">
                            {t('cancel_request_title')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('cancel_request_desc')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setisDeleteOpen(false)}>{t('cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete()} className='bg-red-500 hover:bg-red-500'>{t('delete')}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <div className="flex mt-4 flex-col gap-5 w-full">
                <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-1 xl:grid-cols-1">
                    {paymentRequests.length > 0 ? (
                        <Table>
                            <ScrollArea className={`${paymentRequests.length < 10 ? "max-h-max" : "h-[384px]"} w-full border rounded-lg mt-4`}>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('payment_method')}</TableHead>
                                        <TableHead>{t('account_holder')}</TableHead>
                                        <TableHead>{t('bank_account_rib')}</TableHead>
                                        <TableHead>{t('requested_amount')}</TableHead>
                                        <TableHead>{t('payment_status')}</TableHead>
                                        <TableHead>{t('actions')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paymentRequests.map((request) => (
                                        <TableRow key={request.id}>
                                            <TableCell>{request.method}</TableCell>
                                            <TableCell>{request.accountHolder || 'N/A'}</TableCell>
                                            <TableCell>{request.bankAccount || 'N/A'}</TableCell>
                                            <TableCell>{request.requestedAmount.toFixed(2)} TND</TableCell>
                                            <TableCell>
                                                <Badge className={`text-white ${ {
                                                    PENDING: 'bg-blue-700',
                                                    APPROVED: 'bg-green-700',
                                                    REJECTED: 'bg-red-700',
                                                }[request.status] } hover:bg-gray-700`}>
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
                            <Separator className="w-full mb-4" />
                            <div className="flex items-center justify-center flex-col text-muted-foreground">
                                <h1 className="text-center text-3xl font-bold">
                                    <CircleAlert />
                                </h1>
                                <p className="text-center text-sm mt-2">{t('no_requests_made')}</p>
                                <p className="text-center text-xs mt-2">{t('new_flouci_requests_appear')}</p>
                            </div>
                        </>
                    )}
                </section>
            </div>
            <LoadingState isOpen={open} />
        </div>
    );
}

export default Flouci;
