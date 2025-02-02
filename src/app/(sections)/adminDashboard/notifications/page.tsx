'use client'

import { ChangeEvent, useState } from 'react';
import { CornerDownLeft, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { createNotification, createNotificationForAllStores } from './action';

export default function Page() {
  const [currentView, setCurrentView] = useState('specificSeller');
  const [storeId, setStoreId] = useState('');
  const [message, setMessage] = useState('');
  const [isPending, setisPending] = useState(false);
  const router = useRouter();
  const { toast } = useToast()

  
  const handleStoreIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStoreId(event.target.value);
  };

  const handleMessageChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const SentToStore = async () => {
    try {
      setisPending(true)
      const res = await createNotification(storeId,message,"Admin")
      if(res){
        setisPending(false)
        toast({
          title: "Notification was send!",
          variant: "default",
        });
        router.refresh()
      }else{
        setisPending(false)
        toast({
          title: "No Store with that Id!",
          variant: "destructive",
        });
      }
      
    } catch (error) {
      setisPending(false)
      console.log(error)
      toast({
        title: "Notification was not send!",
        variant: "destructive",
      });
    }

  };

  
  const SendToAllStores = async () => {

    try {
      setisPending(true)
      const res = await createNotificationForAllStores(message,"Admin")
      if(res){
        setisPending(false)
        toast({
          title: "Notifications was send!",
          variant: "default",
        });
        router.refresh()
      }else{
        setisPending(false)
        toast({
          title: "Something went wrong!",
          variant: "destructive",
        });
      }
      
    } catch (error) {
      setisPending(false)
      console.log(error)
      toast({
        title: "Notifications was not send!",
        variant: "destructive",
      });
    }

  };


  
  return (

    <>
    
    <AlertDialog open={isPending}>
    <AlertDialogContent className="flex flex-col items-center">
      <AlertDialogHeader className="flex flex-col items-center">
      <AlertDialogTitle className="text-xl text-blue-700 font-bold text-center">
          Sending !
        </AlertDialogTitle>
        <AlertDialogDescription className="flex flex-col items-center">
          This can take a while.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <div className="text-blue-700 mb-2">
                        <Loader className="animate-spin" />
                      </div>          </AlertDialogContent>
  </AlertDialog>
  
  

    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Notifications Manager</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav className="grid gap-4 text-sm text-muted-foreground">
            <a
              href="#"
              className={`font-semibold ${currentView === 'specificSeller' ? 'text-primary' : ''}`}
              onClick={() => setCurrentView('specificSeller')}
            >
              Send to a specific seller
            </a>
            <a
              href="#"
              className={`font-semibold ${currentView === 'sendToAll' ? 'text-primary' : ''}`}
              onClick={() => setCurrentView('sendToAll')}
            >
              Send To All Sellers
            </a>
          </nav>
          <div className="grid gap-6">
            {currentView === 'specificSeller' && (
              <Card>
                <CardHeader>
                  <CardTitle>Send to a specific seller</CardTitle>
                  <CardDescription>
                    Specify the store Id and the message content.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                    <Input
                      placeholder="Store Id"
                      value={storeId}
                      onChange={handleStoreIdChange}
                    />
                      <Textarea
                        placeholder="Type your message here..."
                        value={message}
                        onChange={handleMessageChange}
                        className="min-h-40 mt-2 relative overflow-hidden rounded-lg border bg-background   resize-none p-3 shadow-none "
                      />
                    <CardFooter className="border-t px-6 py-4">
                      <Button disabled={storeId==='' || message === ''} onClick={SentToStore} size="sm" className="ml-auto gap-1.5">
                        Send Message
                        <CornerDownLeft className="size-3.5" />
                      </Button>
                    </CardFooter>
                </CardContent>
              </Card>
            )}
            {currentView === 'sendToAll' && (
              <Card>
                <CardHeader>
                  <CardTitle>Send To All Sellers</CardTitle>
                  <CardDescription>
                    Send a notification to all sellers.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                    <Label htmlFor="messageToAll" className="sr-only">
                      Message
                    </Label>
                    <Textarea
                        placeholder="Type your message here..."
                        value={message}
                        onChange={handleMessageChange}
                        className="min-h-40 mt-2 relative overflow-hidden rounded-lg border bg-background   resize-none p-3 shadow-none "
                      />
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                      <Button disabled={message === ''} onClick={SendToAllStores} size="sm" className="ml-auto gap-1.5">
                        Send Message
                        <CornerDownLeft className="size-3.5" />
                      </Button>
                    </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>


    </>
  );
}
