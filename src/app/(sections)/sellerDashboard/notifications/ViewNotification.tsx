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
import { Notification } from "@prisma/client";
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
interface NotiViewProps {
  notifications: Notification[];
}

const ViewNotification = ({ notifications }: NotiViewProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const router = useRouter();
  const { toast } = useToast()
  const Delete = async (Id : string) =>{

    try {
        setOpen(true)
        const res = await deleteNotificationById(Id)
        if(res){
          toast({
            title: "Notifications was deleted!",
            variant: "default",
          });
          setOpen(false)
          router.refresh()
        }else{
          setOpen(false)
          toast({
            title: "Something went wrong!",
            variant: "destructive",
          });
        }
        
      } catch (error) {
        setOpen(false)
        console.log(error)
        toast({
            title: "Notifications was not deleted!",
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
      title: "Done!",
      variant: "default",
    });
    router.refresh()
  }



  return (
    <>

      <p className="text-sm text-muted-foreground mb-2">SellerDashboard/Notifications</p>
      <h1 className="text-2xl font-semibold mb-8">All Notifications</h1>
      <Card>
        <CardHeader className="bg-muted/50 rounded-t-lg">
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Total : {notifications.length}</CardDescription>
          {notifications.length > 0 && (
          <>
          <CardDescription>View your Notifications.</CardDescription>
          <CardDescription>Unread notifications is marked with <span className="text-blue-500">blue color</span></CardDescription>
          <CardDescription><Button onClick={SetAllNotificationsRead} variant={"link"}>Mark All Notifications As Read</Button></CardDescription>
          </>
        )}
        </CardHeader>
        <CardContent className="mt-2">

          {notifications.length > 0 ? (

       
          <Table>
        <ScrollArea
          className={`${
            notifications.length < 10 ? "max-h-max" : "h-[384px]"
          } w-full border rounded-lg mt-4`}
        >            
        <TableHeader>
              <TableRow>
                <TableHead>Sender</TableHead>
                <TableHead>Received At</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Action</TableHead>
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
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => {
                            setSelectedNotification(notification)
                            updateNotification(notification.id)
                          }}
                            className={notification.isViewed ? "" : " text-blue-500"}>
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem className={!notification.isViewed ? "" : " text-red-500"} onClick={() => Delete(notification.id)}>Delete</DropdownMenuItem>
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
          <p className="text-center text-sm mt-2">No records of any notifications found for now !</p>
          <p className="text-center text-xs mt-2">New notifications will appear here.</p>
  
        </div>

          </>
   )}
        </CardContent>
      </Card>

      {selectedNotification && (
        <AlertDialog open={selectedNotification !== null} onOpenChange={() => setSelectedNotification(null)}>
      <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
      <AlertDialogHeader>
              <AlertDialogTitle>Notification Content</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="text-gray-600">{selectedNotification.content}</div>
            <AlertDialogCancel onClick={()=>router.refresh()} className="w-20">Cancel</AlertDialogCancel>
          </AlertDialogContent>
        </AlertDialog>
      )}

<LoadingState isOpen={open} />

    </>
  );
};

export default ViewNotification;
