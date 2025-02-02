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
import { OctagonAlert, Trash2 } from 'lucide-react';
import { deletePaymentRequestById } from "./actions";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import LoadingState from "@/components/LoadingState";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ViewProps {
    paymentRequests: PaymentRequest[];
}

const Flouci = ({ paymentRequests }: ViewProps) => {
    
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
            title: 'Your request has been canceled !',
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
            title: 'Error !',
            description: "Please try again later !",
            variant: 'destructive',
            });
        return
        }
        }

    return (
        <>


<div className="flex mt-4 flex-col gap-5 w-full">
  
  <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-1 xl:grid-cols-1">



            <Table>
            <ScrollArea className="w-full h-96 mt-4">
                <TableHeader>
                    <TableRow>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Account Holder</TableHead>
                        <TableHead>Bank Account RIB</TableHead>
                        <TableHead>Requested Amount</TableHead>
                        <TableHead>Payment Status</TableHead>
                        <TableHead>Actions</TableHead>
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
                            <Badge
                                className={`${
                                {
                                    PENDING: 'bg-blue-700',
                                    APPROVED: 'bg-green-700',
                                    REJECTED: 'bg-red-700',
                                }[request.status]
                                } hover:bg-gray-700`}
                            >
                                {request.status}
                            </Badge>
                </TableCell >
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
                        <p>Cancel</p>
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


            </section>
            </div>

            <LoadingState isOpen={open} />
                                <AlertDialog open={isDeleteOpen}>
               <AlertDialogTrigger asChild>
                         </AlertDialogTrigger>
                            <AlertDialogContent>
                                   <AlertDialogHeader className="flex flex-col items-center">
                                       <div className="text-red-500 mb-2">
                                           <OctagonAlert className=''/>
                                               </div>
                                              <AlertDialogTitle className="text-xl font-bold text-center">
                                                 Are you absolutely sure you want to Cancel your request ?
                                               </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                   This action cannot be undone. 
                                                    </AlertDialogDescription>
                                                   </AlertDialogHeader>
                                                  <AlertDialogFooter>
                                              <AlertDialogCancel onClick={()=>setisDeleteOpen(false)}>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete()} 
                                     className='bg-red-500 hover:bg-red-500' >Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                     </AlertDialog> 
        </>
    );
}

export default Flouci;
