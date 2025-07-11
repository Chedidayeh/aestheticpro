'use client'

import { CircleAlert, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AffiliateNotification } from "@prisma/client";
import { useState } from "react";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
import { deleteNotificationById, markAllNotificationsAsViewed, markNotificationAsViewed } from "./actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import LoadingState from "@/components/LoadingState";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from 'next-intl';
interface NotiViewProps {
  notifications: AffiliateNotification[];
}

const ViewNotification = ({ notifications }: NotiViewProps) => {
  const t = useTranslations('AffiliateNotificationsPage');
  const [open, setOpen] = useState<boolean>(false);
  const [selectedNotification, setSelectedNotification] = useState<AffiliateNotification | null>(null);
  const router = useRouter();
  const { toast } = useToast()
  const Delete = async (Id : string) =>{

    try {
        setOpen(true)
        const res = await deleteNotificationById(Id)
        if(res){
          toast({
            title: t('toast_deleted'),
            variant: "default",
          });
          setOpen(false)
          router.refresh()
        }else{
          setOpen(false)
          toast({
            title: t('toast_something_wrong'),
            variant: "destructive",
          });
        }
        
      } catch (error) {
        setOpen(false)
        console.log(error)
        toast({
            title: t('toast_not_deleted'),
          variant: "destructive",
        });
      }

  }


  const updateNotification = async (id :string) =>{
    if(!id) return
    await markNotificationAsViewed(id)
  }

  // SetAllNotificationsRead function 
  const SetAllNotificationsRead = async () =>{
    setOpen(true)
    await markAllNotificationsAsViewed()
    setOpen(false)
    toast({
      title: t('toast_done'),
      variant: "default",
    });
    router.refresh()
  }



  return (
    <>

      <p className="text-sm text-muted-foreground mb-2">{t('breadcrumb')}</p>
      <h1 className="text-2xl font-semibold mb-8">{t('title')}</h1>
      <Card>
        <CardHeader className="bg-muted/50 rounded-t-lg mb-2" >
          <CardTitle>{t('notifications')}</CardTitle>
          <CardDescription>{t('total', {count: notifications.length})}</CardDescription>
          {notifications.length > 0 && (
          <>
          <CardDescription>{t('view_your_notifications')}</CardDescription>
          <CardDescription>{t('unread_marked_blue')}</CardDescription>
          <CardDescription><Button onClick={SetAllNotificationsRead} variant={"link"}>{t('mark_all_as_read')}</Button></CardDescription>
          </>
        )}
        </CardHeader>
        <CardContent>

        {notifications.length > 0 ? (

          
          <Table>
        <ScrollArea
          className={`${
            notifications.length < 10 ? "max-h-max" : "h-[384px]"
          } w-full border rounded-lg mt-4`}
        >                
        <TableHeader>
              <TableRow>
                <TableHead>{t('sender')}</TableHead>
                <TableHead>{t('received_at')}</TableHead>
                <TableHead>{t('content')}</TableHead>
                <TableHead>{t('action')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow
                  key={notification.id}
                  className={notification.isViewed ? "" : "border-l-4 border-blue-500"}
                >                  
                <TableCell className={notification.isViewed ? "" : " text-blue-500"}>{notification.sender}</TableCell>
                  <TableCell className={notification.isViewed ? "" : " text-blue-500"}>{new Date(notification.createdAt).toLocaleString()}</TableCell>
                  <TableCell className={notification.isViewed ? "" : " text-blue-500"}>{notification.content}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal size={16}  />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => {
                            setSelectedNotification(notification)
                            updateNotification(notification.id)
                          }}
                            className={notification.isViewed ? "" : " text-blue-500"}>
                          {t('view')}
                        </DropdownMenuItem>
                        <DropdownMenuItem className={!notification.isViewed ? "" : " text-red-500"} onClick={() => Delete(notification.id)}>{t('delete')}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
          <p className="text-center text-sm mt-2">{t('no_notifications_found')}</p>
          <p className="text-center text-xs mt-2">{t('new_notifications_appear')}</p>
  
        </div>

        </>
        )}
        </CardContent>
      </Card>

      {selectedNotification && (
        <AlertDialog open={selectedNotification !== null} onOpenChange={() => setSelectedNotification(null)}>
      <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
      <AlertDialogHeader>
              <AlertDialogTitle>{t('notification_content')}</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="">{selectedNotification.content}</div>
            <AlertDialogCancel onClick={()=>router.refresh()} className="w-20">{t('cancel')}</AlertDialogCancel>
          </AlertDialogContent>
        </AlertDialog>
      )}

<LoadingState isOpen={open} />

    </>
  );
};

export default ViewNotification;
