/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
'use client'
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
import {
  CircleAlert,
    OctagonAlert,
    Search,
    Trash2,
  } from "lucide-react"
  
  import { Button } from "@/components/ui/button"
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  
  
  import React, { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Store, User } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { deleteStoreById, getAllStoresWithUsersAndCounts } from "./actions"
import { Input } from '@/components/ui/input'
import LoadingState from '@/components/LoadingState'
import { useTranslations } from 'next-intl';
  


interface ExtraStore extends Store {
    user : User
    productsCount : number
    designsCount : number
}
  
  
  
interface StoresViewProps {
  initialeStores: ExtraStore[];
  }
  
  const StoresView = ({ initialeStores }: StoresViewProps ) => { 
    // stores state
    const [stores, setStores] = useState(initialeStores)
    const router = useRouter();
    const { toast } = useToast()
    const [isDeleteOpen, setisDeleteOpen] = useState(false);
    const [ storeId , setStoreId] = useState("")
    const [storeSearchQuery, setStoreSearchQuery] = useState("");
    const [open, setOpen] = useState<boolean>(false);
    const [sortBy, setSortBy] = useState<string>("");
    const t = useTranslations('AdminStoresPage');


    const handleStoreSearchChange = async () => {
      try {
        setOpen(true);
        const stores = await getAllStoresWithUsersAndCounts(10, storeSearchQuery, sortBy);
        setStores(stores);
      } catch (error) {
        console.error("Error fetching stores:", error);
        toast({
          title: t('toast_something_wrong'),
          variant: "destructive",
        });
      } finally {
        setOpen(false);
      }
    };
    

    const handleSortBy = async (event: string) => {
      try {
        setOpen(true);
        setSortBy(event);
        const stores = await getAllStoresWithUsersAndCounts(10, storeSearchQuery, event);
        setStores(stores);
      } catch (error) {
        console.error("Error sorting stores:", error);
        toast({
          title: t('toast_something_wrong'),
          variant: "destructive",
        });
      } finally {
        setOpen(false);
      }
    };
    
    

    const handleDelete = async () =>{
        try {
          setOpen(true)
            await deleteStoreById(storeId)
            setisDeleteOpen(false)
            toast({
                title: t('toast_store_deleted'),
                variant: 'default',
              });
              setOpen(false)
            router.refresh()
        } catch (error) {
          setOpen(false)
            setisDeleteOpen(false)
            console.log(error)
            toast({
                title: t('toast_store_not_deleted'),
                variant: 'destructive',
              });
        }


    }


    const calculateTotalIncome = () => {
      return stores.reduce((total, store) => total + store.revenue, 0).toFixed(2);
  }




    return (
      <>



  
  <p className="text-sm text-muted-foreground mb-2">{t('admin_dashboard_stores')}</p>
  <h1 className="text-2xl font-semibold">{t('manage_stores')}</h1>
 
  
  
     
  
  
        <div className="flex mt-4 flex-col gap-5 w-full">
  
      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
  
  
  
      <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
      <CardHeader className="space-y-2 bg-muted/50">
      <div className="grid gap-2">
            <CardTitle>{t('stores')}</CardTitle>
            <CardDescription>{t('total')} {stores.length}</CardDescription>
            <CardDescription>{t('total_income')} {calculateTotalIncome()} TND</CardDescription>
          </div>
          <div className='grid md:flex gap-4'>
          <Select onValueChange={handleSortBy}>
                               <SelectTrigger className="w-full sm:w-[180px]">
                                     <SelectValue placeholder={t('sort_by')} />
                                   </SelectTrigger>
                                   <SelectContent>
                                     <SelectGroup>
                                       <SelectLabel>{t('select')}</SelectLabel>
                                       <SelectItem value="rejected">{t('total_rejected_elements')}</SelectItem>
                                       <SelectItem value="level">{t('level')}</SelectItem>
                                     </SelectGroup>
                                   </SelectContent>
                                 </Select>   
        <Input
              type="search"
              className='w-full sm:w-auto'
              placeholder={t('search_store_id_name')}
              value={storeSearchQuery}
              onChange={(e) => setStoreSearchQuery(e.target.value)}
         /> 
                <Button
                  disabled={storeSearchQuery === ""}
                  onClick={handleStoreSearchChange}
                  className="bg-blue-500 text-white rounded"
                  >
                       {t('search')}
                       <Search size={14} className="ml-1" />
                 </Button>


         
        </div>
        </CardHeader>
        <CardDescription className='flex items-center justify-center'>

        </CardDescription>

        <CardContent>

        {stores.length > 0 ? (


        <Table>
        <ScrollArea
          className={`${
            stores.length < 10 ? "max-h-max" : "h-[384px]"
          } w-full border rounded-lg mt-4`}
        >               <TableHeader>
          <TableRow>
            {/* Store Id column */}
            <TableHead >{t('store_id')}</TableHead>

            {/* Store Name column */}
            <TableHead>{t('store_name')}</TableHead>

            {/* User Name column */}
            <TableHead>{t('user_name')}</TableHead>

            {/* User Phone Number column */}
            <TableHead>{t('user_phone_number')}</TableHead>

            {/* User Email column */}
            <TableHead >{t('user_email')}</TableHead>

            {/* Total Products column */}
            <TableHead>{t('total_products')}</TableHead>

            {/* Total Designs column */}
            <TableHead>{t('total_designs')}</TableHead>

            {/* Total Rejected Elements column */}
            <TableHead>{t('total_rejected_elements')}</TableHead>

            {/* Store Profit column */}
            <TableHead>{t('store_profit')}</TableHead>

            {/* Total Sales column */}
            <TableHead>{t('total_sales')}</TableHead>

            {/* Action column */}
            <TableHead>{t('action')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stores.map((store, index) => (
            <TableRow
              key={store.id}
            >
              {/* Store Id cell */}
              <TableCell>{store.id}</TableCell>

              {/* Store Name cell */}
              <TableCell className="text-left">{store.storeName}</TableCell>

              {/* User Name cell */}
              <TableCell className=" text-left">{store.user.isUserBanned ?  "User Banned" : store.user.userType === "SELLER" ? store.user.name  : "No User"}</TableCell>

              {/* User Phone Number cell */}
              <TableCell className=" text-left">{store.userPhoneNumber ?? 'N/A'}</TableCell>

              {/* User Email cell */}
              <TableCell className=" text-left">{store.user.userType === "SELLER" ? store.user.email   : "No User"}</TableCell>

              {/* Total Products cell */}
              <TableCell className=" text-left">{store.productsCount}</TableCell>

              {/* Total Designs cell */}
              <TableCell className=" text-left">{store.designsCount}</TableCell>

              {/* Total Rejected Elements cell */}
              <TableCell className="text-left">{store.totalRejectedElements}</TableCell>

              {/* Store Profit cell */}
              <TableCell className=" text-left">{store.revenue.toFixed(2)} TND</TableCell>

              {/* Total Sales cell */}
              <TableCell className=" text-left">{store.totalSales}</TableCell>

              {/* Action cell */}
              <TableCell className="text-right">
                <Trash2
                  size={20}
                  className="cursor-pointer hover:text-red-500"
                  onClick={() => {
                    setisDeleteOpen(true);
                    setStoreId(store.id);
                  }}
                />
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
<p className="text-center text-sm mt-2">{t('no_records_found')}</p>
<p className="text-center text-xs mt-2">{t('new_stores_appear')}</p>

</div>

</>
)}

        </CardContent>
      </Card> 



      </section>
  

  
    </div>
  
    <LoadingState isOpen={open} />
                          {/* The AlertDialog delete store component  */}
                          <AlertDialog open={isDeleteOpen}>
               <AlertDialogTrigger asChild>
                         </AlertDialogTrigger>
                         <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
                         <AlertDialogHeader className="flex flex-col items-center">
                                       <div className="text-red-500 mb-2">
                                           <OctagonAlert className=''/>
                                               </div>
                                              <AlertDialogTitle className="text-xl font-bold text-center">
                                                 {t('are_you_sure_delete_store')}
                                               </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                   {t('action_cannot_be_undone')} 
                                                   {t('it_will_be_permanently_removed')}
                                                   <br/><br/>
                                                    </AlertDialogDescription>
                                                   </AlertDialogHeader>
                                                  <AlertDialogFooter>
                                              <AlertDialogCancel onClick={()=>setisDeleteOpen(false)}>{t('cancel')}</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete()} 
                                     className='bg-red-500 hover:bg-red-500' >{t('delete')}</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                     </AlertDialog> 

    </>
    );
  }
  
  export default StoresView;