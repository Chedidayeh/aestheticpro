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


    const handleStoreSearchChange = async () => {
      try {
        setOpen(true);
        const stores = await getAllStoresWithUsersAndCounts(10, storeSearchQuery, sortBy);
        setStores(stores);
      } catch (error) {
        console.error("Error fetching stores:", error);
        toast({
          title: "Something went wrong!",
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
          title: "Something went wrong!",
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
                title: 'Store Was Successfully Deleted',
                variant: 'default',
              });
              setOpen(false)
            router.refresh()
        } catch (error) {
          setOpen(false)
            setisDeleteOpen(false)
            console.log(error)
            toast({
                title: 'Store Was Not Deleted',
                variant: 'destructive',
              });
        }


    }


    const calculateTotalIncome = () => {
      return stores.reduce((total, store) => total + store.revenue, 0).toFixed(2);
  }




    return (
      <>



  
  <p className="text-sm text-muted-foreground mb-2">AdminDashboard/Stores</p>
  <h1 className="text-2xl font-semibold">Manage Stores</h1>
 
  
  
     
  
  
        <div className="flex mt-4 flex-col gap-5 w-full">
  
      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
  
  
  
      <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
        <CardHeader className="flex flex-row items-center bg-muted/50">
          <div className="grid gap-2">
            <CardTitle>Stores</CardTitle>
            <CardDescription>Total: {stores.length}</CardDescription>
            <CardDescription>Total Income: {calculateTotalIncome()} TND</CardDescription>
          </div>
        </CardHeader>
        <CardDescription className='flex items-center justify-center'>
        <div className='mt-2 m-2 gap-4 flex flex-wrap items-center justify-center'>
        <Input
              type="search"
              className='w-full sm:w-auto'
              placeholder="Enter the Store Id, name to make a search..."
              value={storeSearchQuery}
              onChange={(e) => setStoreSearchQuery(e.target.value)}
         /> 
                <Button
                  disabled={storeSearchQuery === ""}
                  onClick={handleStoreSearchChange}
                  className="bg-blue-500 text-white rounded"
                  >
                       Search
                       <Search size={14} className="ml-1" />
                 </Button>

                             <Select onValueChange={handleSortBy}>
                               <SelectTrigger className="w-full sm:w-[180px]">
                                     <SelectValue placeholder="Sort By" />
                                   </SelectTrigger>
                                   <SelectContent>
                                     <SelectGroup>
                                       <SelectLabel>Select</SelectLabel>
                                       <SelectItem value="rejected">Total rejected elements</SelectItem>
                                       <SelectItem value="level">level</SelectItem>
                                     </SelectGroup>
                                   </SelectContent>
                                 </Select>   
         
        </div>
        </CardDescription>

        <CardContent>
        <Table>
        <ScrollArea className="w-full mt-8 h-96">
        <TableHeader>
          <TableRow>
            {/* Store Id column */}
            <TableHead >Store Id</TableHead>

            {/* Store Name column */}
            <TableHead>Store Name</TableHead>

            {/* User Name column */}
            <TableHead>User Name</TableHead>

            {/* User Phone Number column */}
            <TableHead>User Phone Number</TableHead>

            {/* User Email column */}
            <TableHead >User Email</TableHead>

            {/* Total Products column */}
            <TableHead>Total Products</TableHead>

            {/* Total Designs column */}
            <TableHead>Total Designs</TableHead>

            {/* Total Rejected Elements column */}
            <TableHead>Total Rejected Elements</TableHead>

            {/* Store Profit column */}
            <TableHead>Store Profit</TableHead>

            {/* Total Sales column */}
            <TableHead>Total Sales</TableHead>

            {/* Action column */}
            <TableHead>Action</TableHead>
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

        </CardContent>
      </Card> 



      </section>
  

  
    </div>
  
    <LoadingState isOpen={open} />
                          {/* The AlertDialog delete store component  */}
                          <AlertDialog open={isDeleteOpen}>
               <AlertDialogTrigger asChild>
                         </AlertDialogTrigger>
                            <AlertDialogContent>
                                   <AlertDialogHeader className="flex flex-col items-center">
                                       <div className="text-red-500 mb-2">
                                           <OctagonAlert className=''/>
                                               </div>
                                              <AlertDialogTitle className="text-xl font-bold text-center">
                                                 Are you absolutely sure you want to delete this store ?
                                               </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                   This action cannot be undone. 
                                                   It will permanently remove the store from our MarketPlace.<br/><br/>
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
  
  export default StoresView;