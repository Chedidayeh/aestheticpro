'use client'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Affiliate, AffiliateLink, Commission, User, UserType } from "@prisma/client";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Ban, CircleAlert, CircleX, Search } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import LoadingState from '@/components/LoadingState';
import { banUser, deleteUserById, getAllAffiliatesWithDetails, getUsersByType, updateUserRole } from './actions';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

interface ExtraLink extends AffiliateLink {
  commission : Commission[]
}

interface ExtraAffiliate extends Affiliate {
  user: User;
  links : ExtraLink[]
}

const UsersView = ({initialUsers , limit , initialAffiliates }:{initialUsers : User[] , limit : number , initialAffiliates : ExtraAffiliate[]}) => {
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations('AdminUsersPage');
  const [open, setOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [affiliates, setAffiliates] = useState<ExtraAffiliate[]>(initialAffiliates);
  const [searchQuery, setSearchQuery] = useState("");
  const [affiliatesSearchQuery, setAffiliateSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filter, setFilter] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openBanDialog, setOpenBanDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState(false)
  const [allAffiliates, setAllAffiliates] = useState(false)

  const handleSearch = async () => {
    try {
      setOpen(true);
      const users = await getUsersByType(limit, allUsers, filter, searchQuery);
      setUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: t('toast_something_wrong'),
        variant: "destructive",
      });
    } finally {
      setOpen(false);
    }
  };
  

  const handleFilterChange = async (value: string) => {
    try {
      setOpen(true);
      setFilter(value);
      const users = await getUsersByType(limit, allUsers, value, searchQuery);
      setUsers(users);
    } catch (error) {
      console.error("Error applying filter:", error);
      toast({
        title: t('toast_something_wrong'),
        variant: "destructive",
      });
    } finally {
      setOpen(false);
    }
  };
  


  const handleToggle = async () => {
    try {
      setOpen(true);
      setAllUsers(!allUsers); // Toggle the state
      const users = await getUsersByType(limit, !allUsers, filter, searchQuery);
      setUsers(users);
    } catch (error) {
      console.error("Error toggling user view:", error);
      toast({
        title: t('toast_something_wrong'),
        variant: "destructive",
      });
    } finally {
      setOpen(false);
    }
  };
  



  const handleAffiliateSearch = async () => {
    try {
      setOpen(true);
      const affiliates = await getAllAffiliatesWithDetails(limit, allAffiliates, sortBy, affiliatesSearchQuery);
      setAffiliates(affiliates);
    } catch (error) {
      console.error("Error fetching affiliates:", error);
      toast({
        title: t('toast_something_wrong'),
        variant: "destructive",
      });
    } finally {
      setOpen(false);
    }
  };
  
  
  const handleSortChange = async (value: string) => {
    try {
      setOpen(true);
      setSortBy(value);
      const affiliates = await getAllAffiliatesWithDetails(limit, allAffiliates, value, affiliatesSearchQuery);
      setAffiliates(affiliates);
    } catch (error) {
      console.error("Error changing sort order:", error);
      toast({
        title: t('toast_something_wrong'),
        variant: "destructive",
      });
    } finally {
      setOpen(false);
    }
  };
  
  
  
  const handleAffiliateToggle = async () => {
    try {
      setOpen(true);
      setAllAffiliates(!allAffiliates); // Toggle the state
      const affiliates = await getAllAffiliatesWithDetails(limit, !allAffiliates, sortBy, affiliatesSearchQuery);
      setAffiliates(affiliates);
    } catch (error) {
      console.error("Error toggling affiliates view:", error);
      toast({
        title: t('toast_something_wrong'),
        variant: "destructive",
      });
    } finally {
      setOpen(false);
    }
  };
  


  const handleDelete = async () => {
    try {
      setOpenDeleteDialog(false);
      setOpen(true);
      if (selectedUserId) {
        await deleteUserById(selectedUserId);
        toast({
          title: t('toast_user_deleted'),
          variant: 'default',
        });
        setOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.log(error);
      setOpen(false);
      toast({
        title: t('toast_user_not_deleted'),
        variant: 'destructive',
      });
    }
  };

  const handleBan = async () => {
    try {
      setOpenDeleteDialog(false);
      setOpen(true);
      if (selectedUserId) {
        await banUser(selectedUserId);
        toast({
          title: t('toast_user_banned'),
          variant: "default",
        });
        setOpen(false);
        router.refresh();
      }
    } catch (error) {
      setOpen(false);
      toast({
        title: t('toast_failed_to_ban_user'),
        variant: "destructive",
      });
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      setOpen(true);
      const userTypeEnum = newRole.toUpperCase() as UserType;
      await updateUserRole(userId, userTypeEnum);
      toast({
        title: t('toast_user_role_updated'),
        variant: 'default',
      });
      setOpen(false);
      router.refresh();
    } catch (error) {
      setOpen(false);
      toast({
        title: t('toast_failed_to_update_user_role'),
        variant: 'destructive',
      });
    }
  };

  return (
    <>

<p className="text-sm text-muted-foreground mb-2">{t('admin_dashboard_users')}</p>
  <h1 className="text-2xl font-semibold">{t('manage_users')}</h1>
 
  <div className="flex mt-4 flex-col gap-5 w-full">
  
  <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">


      <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
        <CardHeader className="space-y-2 bg-muted/50">
          <div className="grid gap-2">
            <CardTitle>{t('users_card_title')}</CardTitle>
            <CardDescription>{t('users_card_total', {count: users.length})}</CardDescription>
          </div>

          <div className='grid md:flex gap-4'>
          <Select onValueChange={handleFilterChange}>
            <SelectTrigger className="w-full md:w-[180px] ">
              <SelectValue placeholder={t('users_filter_by')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t('users_select')}</SelectLabel>
                <SelectItem value="user">{t('users_user')}</SelectItem>
                <SelectItem value="seller">{t('users_seller')}</SelectItem>
                <SelectItem value="admin">{t('users_admin')}</SelectItem>
                <SelectItem value="factory">{t('users_factory')}</SelectItem>
                <SelectItem value="affiliate">{t('users_is_affiliate')}</SelectItem>
                <SelectItem value="nonAffiliate">{t('users_not_affiliate')}</SelectItem> 
              </SelectGroup>
            </SelectContent>
          </Select>
        <Input
            type="search"
            className="w-full md:w-[40%]"
            placeholder={t('users_search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
        disabled={searchQuery === ""}
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
        >
        {t('users_search')}
        <Search size={14} className="ml-1" />
        </Button>  


            <div className="flex items-center space-x-2">
            <Switch
                defaultChecked={allUsers}
                onClick={handleToggle} // Handle the state change on toggle
            />
            <Label>{t('users_all_users')}</Label>
            </div>
          </div>
        </CardHeader>
        <CardDescription className="flex flex-col sm:flex-row items-center justify-center gap-2 p-2">

      
        </CardDescription>
        <CardContent>


        {users.length > 0 ? (
   
   <Table>
        <ScrollArea
          className={`${
            users.length < 10 ? "max-h-max" : "h-[384px]"
          } w-full border rounded-lg mt-4`}
        >                 
         <TableHeader>
                  <TableRow>
                    <TableHead>{t('users_table_id')}</TableHead>
                    <TableHead>{t('users_table_name')}</TableHead>
                    <TableHead>{t('users_table_email')}</TableHead>
                    <TableHead>{t('users_table_email_verified')}</TableHead>
                    <TableHead>{t('users_table_banned')}</TableHead>
                    <TableHead>{t('users_table_affiliate')}</TableHead>
                    <TableHead>{t('users_table_type')}</TableHead>
                    <TableHead>{t('users_table_created')}</TableHead>
                    <TableHead>{t('users_table_action')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.emailVerified ? t('users_yes') : t('users_no')}</TableCell>
                      <TableCell>{user.isUserBanned ? t('users_yes') : t('users_no')}</TableCell>
                      <TableCell>{user.isAffiliate ? t('users_yes') : t('users_no')}</TableCell>
                      <TableCell>
                        <Select
                          defaultValue={user.userType.toLowerCase()}
                          onValueChange={(newValue) => handleRoleChange(user.id, newValue as UserType)}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={t('users_select_user_type')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>{t('users_user_type')}</SelectLabel>
                              {Object.values(UserType).map((role) => (
                                <SelectItem key={role.toLowerCase()} value={role.toLowerCase()}>
                                  {role.toUpperCase()}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <CircleX
                            onClick={() => {
                              setSelectedUserId(user.id);
                              setOpenDeleteDialog(true);
                            }}
                            className="hover:text-red-500 cursor-pointer"
                          />
                          {!user.isUserBanned && (
                            <Ban
                              onClick={() => {
                                setSelectedUserId(user.id);
                                setOpenBanDialog(true);
                              }}
                              className="hover:text-purple-500 cursor-pointer"
                            />
                          )}
                        </div>
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
                    <p className="text-center text-sm mt-2">{t('users_no_records')}</p>
                    <p className="text-center text-xs mt-2">{t('users_new_will_appear')}</p>
            
                  </div>
          
                  </>
                  )}
        </CardContent>

      </Card>

      </section>

      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">


<Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
<CardHeader className="space-y-2 bg-muted/50">
<div className="grid gap-2">
      <CardTitle>{t('affiliates_card_title')}</CardTitle>
      <CardDescription>{t('affiliates_card_total', {count: affiliates.length})}</CardDescription>
    </div>
    <div className='grid md:flex gap-4'>
    <Select onValueChange={handleSortChange}>
      <SelectTrigger className="w-full md:w-[180px] ">
        <SelectValue placeholder={t('affiliates_sort_by')} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{t('affiliates_select')}</SelectLabel>
          <SelectItem value="revenue">{t('affiliates_revenue')}</SelectItem>
          <SelectItem value="links">{t('affiliates_total_links')}</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    <Input
      type="search"
      className="w-full md:w-[40%]"
      placeholder={t('affiliates_search_placeholder')}
      value={affiliatesSearchQuery}
      onChange={(e) => setAffiliateSearchQuery(e.target.value)}
  />
  <Button
  disabled={affiliatesSearchQuery === ""}
  onClick={handleAffiliateSearch}
  className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
  >
  {t('affiliates_search')}
  <Search size={14} className="ml-1" />
  </Button>  


      <div className="flex items-center space-x-2">
      <Switch
          defaultChecked={allAffiliates}
          onClick={handleAffiliateToggle} // Handle the state change on toggle
      />
      <Label>{t('affiliates_all_affiliates')}</Label>
      </div>
    </div>
  </CardHeader>
  <CardDescription className="flex flex-col sm:flex-row items-center justify-center gap-2 p-2">


  </CardDescription>
  <CardContent>
  {affiliates.length > 0 ? (
        <Table>
        <ScrollArea
          className={`${
            affiliates.length < 10 ? "max-h-max" : "h-[384px]"
          } w-full border rounded-lg mt-4`}
        >  
          <TableHeader>
            <TableRow>
              <TableHead>{t('affiliates_table_name')}</TableHead>
              <TableHead>{t('affiliates_table_email')}</TableHead>
              <TableHead>{t('affiliates_table_phone')}</TableHead>
              <TableHead>{t('affiliates_table_revenue')}</TableHead>
              <TableHead>{t('affiliates_table_total_links')}</TableHead>
              <TableHead>{t('affiliates_table_created')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {affiliates.map((affiliate) => (
              <TableRow key={affiliate.id}>
                <TableCell>{affiliate.user.name}</TableCell>
                <TableCell>{affiliate.user.email}</TableCell>
                <TableCell>{affiliate.phoneNumber}</TableCell>
                <TableCell>{affiliate.totalIncome.toFixed(2)} TND</TableCell>
                <TableCell>{affiliate.links.length}</TableCell>
                <TableCell>{new Date(affiliate.createdAt).toLocaleString()}</TableCell>
                <TableCell>
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
    <p className="text-center text-sm mt-2">{t('affiliates_no_records')}</p>
    <p className="text-center text-xs mt-2">{t('affiliates_new_will_appear')}</p>

  </div>

  </>
  )}  </CardContent>
</Card>

</section>
  

  
  </div>

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
      <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
      <AlertDialogHeader>
            <AlertDialogTitle>{t('delete_dialog_title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('delete_dialog_desc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpenDeleteDialog(false)}>{t('delete_dialog_cancel')}</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            className="bg-red-500 hover:bg-red-500 text-white"
          >
            {t('delete_dialog_action')}
          </AlertDialogAction>
        </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={openBanDialog} onOpenChange={setOpenBanDialog}>
      <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
      <AlertDialogHeader>
            <AlertDialogTitle>{t('ban_dialog_title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('ban_dialog_desc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpenBanDialog(false)}>{t('ban_dialog_cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={handleBan} className="bg-purple-500 hover:bg-purple-500 text-white">{t('ban_dialog_action')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <LoadingState isOpen={open} />

    </>
  );
};

export default UsersView;
