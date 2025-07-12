/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
'use client'
import NextImage from 'next/image'
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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
import {
  CircleAlert,
    CircleCheck,
    CircleX,
    Eye,
    Loader,
    OctagonAlert,
    Search,
    Trash2,
  } from "lucide-react"
  
  import { Badge } from "@/components/ui/badge"
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
  
  
  import { cn } from "@/lib/utils";
  import React, { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { OrderItem, SellerDesign, Store } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Separator } from '@/components/ui/separator'
import { acceptDesign, refuseDesign,  } from '../stores/actions'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { deleteDesign } from '../../sellerDashboard/designs/actions'
import LoadingState from '@/components/LoadingState'
import { getAllDesignsWithProducts } from './actions'
import { useTranslations } from 'next-intl';
  
  

interface ExtraDesign extends SellerDesign {
  store : Store;
  frontOrders :  OrderItem[]
  backOrders : OrderItem[]
}
  
  
  
interface DesignViewProps {
  initialDesigns: ExtraDesign[];
  }
  
  const DesignView = ({ initialDesigns }: DesignViewProps ) => { 
    const t = useTranslations('AdminDesignsPage');
    const [designs, setDesigns] = useState(initialDesigns)
    const router = useRouter();
    const { toast } = useToast()
    const [isDeleteOpen, setisDeleteOpen] = useState(false);
    const [ designId , setDesignId] = useState("")


    const [searchTerm, setSearchTerm] = useState("");
    const [filterBy, setFilterBy] = useState<string>("");
    const [sortBy, setSortBy] = useState<string>("");


    

    const handleSearch = async () => {
      try {
        setOpen(true);
        const designs = await getAllDesignsWithProducts(10, searchTerm, filterBy, sortBy);
        setDesigns(designs);
      } catch (error) {
        console.error("Error searching designs:", error);
        toast({
          title: t('toast_something_wrong'),
          variant: "destructive",
        });
      } finally {
        setOpen(false);
      }
    };

    const handleFilterBy = async (event: string) => {
      try {
        setOpen(true);
        setFilterBy(event);
        const designs = await getAllDesignsWithProducts(10, searchTerm, event, sortBy);
        setDesigns(designs);
      } catch (error) {
        console.error("Error filtering designs:", error);
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
        const designs = await getAllDesignsWithProducts(10, searchTerm, filterBy, event);
        setDesigns(designs);
      } catch (error) {
        console.error("Error sorting designs:", error);
        toast({
          title: t('toast_something_wrong'),
          variant: "destructive",
        });
      } finally {
        setOpen(false);
      }
    };
    
    


  const handleDelete = async () =>{
    setisDeleteOpen(false)
    setOpen(true)
    try {
      const res = await deleteDesign(designId)
      if(res){
        toast({
          title: t('toast_design_deleted'),
          variant: 'default',
        });
        setOpen(false)
        router.refresh()
      }
      else{
        toast({
          title: t('toast_design_has_orders'),
          variant: 'destructive',
        });
        setOpen(false)
        router.refresh()
      }
    } catch (error) {
        console.log(error)
        toast({
            title: t('toast_design_not_deleted'),
            variant: 'destructive',
          });
          setOpen(false)
    }
}


const [darkMode, setDarkMode] = useState(true);
const toggleDarkMode = () => {
  setDarkMode(!darkMode);
}


     // State variables
 const [isDownloadOpen, setIsDownloadOpen] = useState(false);

// Function to handle download
const downloadDesign = async (imageUrl: string) => {

  if(imageUrl === '') {
    toast({
      title: t('toast_no_design_found'),
      variant: "destructive",
    });
    return;
  }
  setIsDownloadOpen(true)
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "design_image.png"; // You can set the filename here
    document.body.appendChild(a);
    a.click();
    a.remove();
    setIsDownloadOpen(false)

  } catch (error) {
    console.error("Error downloading design:", error);
    toast({
      title: t('toast_download_failed'),
      variant: "destructive",
    });
    setIsDownloadOpen(false)

  }
};

const [selectedDesign, setSelectedDesign] = useState<ExtraDesign | null>(null);
const [open, setOpen] = useState<boolean>(false);
const [reasonForRejection, setReasonForRejection] = useState('');
const [isDialogOpen, setisDialogOpen] = useState<boolean>(false);

const handleAccept = async (designId : string) =>{

  try {
    setOpen(true)
    await acceptDesign(designId)
    toast({
      title: t('toast_design_accepted'),
      variant: 'default',
    });
    setOpen(false)
    setSelectedDesign(null)
    router.refresh()
  } catch (error) {
    setOpen(false)
    toast({
      title: t('toast_design_not_accepted'),
      variant: 'destructive',
    });
  }

}

const handleRefuse = async (designId : string) =>{

  try {
    setOpen(true)
    await refuseDesign(designId , reasonForRejection)
    toast({
      title: t('toast_design_refused'),
      variant: 'default',
    });
    setOpen(false)
    router.refresh()
  } catch (error) {
    setOpen(false)
    toast({
      title: t('toast_design_not_refused'),
      variant: 'destructive',
    });
  }

}


// setchangeView state use state
const [changeView, setChangeView] = useState(false);
// handleSwitchChange functino : 
const handleSwitchChange = () => {
  setChangeView(!changeView)
}


    // toggle Mode
    const [isDarkMode, setIsDarkMode] = useState(true);
    const handleToggleMode = () => {
      setIsDarkMode((prevMode) => !prevMode);
    };
    



    return (
      <>



  
  
  <p className="text-sm text-muted-foreground mb-2">{t('admin_dashboard_designs')}</p>
           <h1 className="text-2xl font-semibold">{t('manage_designs')}</h1>
  
  
           <div className="flex items-center mt-4 space-x-2">
              <Switch id="allDesignView" defaultChecked={changeView} onClick={handleSwitchChange } />
              <Label htmlFor="front">{t('change_view')}</Label>
            </div>
     
  
  {!changeView ? (

      // default view table with selected design
        <div className="flex mt-4 flex-col gap-5 w-full">
  
      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4"> 
  
      <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
      <CardHeader className="bg-muted/50 space-y-2">
      <div className="grid gap-2">
            <CardTitle>{t('designs')}</CardTitle>
            <CardDescription>{t('total_designs')} {designs.length}</CardDescription>
          </div>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 mt-2">
        <Input
          type="search"
          className="w-full sm:w-[50%] "
          placeholder={t('search_design_id_name_store_name')}
          onChange={(e) => setSearchTerm(e.target.value)}

        />
                <Button
                          disabled={searchTerm === ""}
                          onClick={handleSearch}
                          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                      >
                      {t('search')}
                      <Search size={14} className="ml-1" />
                </Button>  

            <Select onValueChange={handleFilterBy}>
                <SelectTrigger className="w-full sm:w-[180px] ">
            <SelectValue placeholder={t('filter_by')} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{t('select')}</SelectLabel>
              <SelectItem value="all">{t('all')}</SelectItem>
              <SelectItem value="accepted">{t('accepted')}</SelectItem>
              <SelectItem value="refused">{t('refused')}</SelectItem>
              <SelectItem value="action">{t('under_review')}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

                    <Select onValueChange={handleSortBy}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder={t('sort_by')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>{t('select')}</SelectLabel>
                              <SelectItem value="sales">{t('total_sales')}</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>

            </div>
        </CardHeader>
        <CardContent>

        {designs.length > 0 ? (


      <Table>
        <ScrollArea
          className={`${
            designs.length < 10 ? "max-h-max" : "h-[384px]"
          } w-full border rounded-lg mt-4`}
        >   
                <TableHeader>
          <TableRow>
            {/* Design Id column */}
            <TableHead>{t('design_id')}</TableHead>

            {/* Design Name column */}
            <TableHead>{t('design_name')}</TableHead>

            {/* Design price column */}
            <TableHead>{t('design_price')}</TableHead>

            {/* Design Store column */}
            <TableHead>{t('design_store')}</TableHead>

            {/* Is Design Accepted column */}
            <TableHead>{t('is_design_accepted')}</TableHead>

            {/* Is Design Refused column */}
            <TableHead>{t('is_design_refused')}</TableHead>

            {/* Ordered Items column */}
            <TableHead>{t('ordered_items')}</TableHead>

            {/* Actions column */}
            <TableHead>{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {designs.map((design) => (
            <TableRow key={design.id}>
              {/* Design Id cell */}
              <TableCell >{design.id}</TableCell>

              {/* Design Name cell */}
              <TableCell>{design.name}</TableCell>

              {/* Design price cell */}
              <TableCell>{(design.price).toFixed(2)} TND</TableCell>

              {/* Design Store cell */}
              <TableCell>{design.store.storeName}</TableCell>

              {/* Is Design Accepted cell */}
              <TableCell>{design.isDesignAccepted ? 'Yes' : 'No'}</TableCell>

              {/* Is Design Refused cell */}
              <TableCell >{design.isDesignRefused ? 'Yes' : 'No'}</TableCell>

              {/* Ordered Items cell */}
              <TableCell className="text-center">{design.frontOrders.length + design.backOrders.length}</TableCell>

              {/* Actions cell */}
              <TableCell>
                <TooltipProvider>
                  <div className="flex items-center">
                    {/* View Icon */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Eye
                          onClick={() => {
                          setSelectedDesign(design)
                          }}
                          className="cursor-pointer hover:text-blue-500"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('view')}</p>
                      </TooltipContent>
                    </Tooltip>

                    {/* Delete Icon */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Trash2
                          onClick={() => {
                            setisDeleteOpen(true);
                            setDesignId(design.id);
                          }}
                          className="cursor-pointer hover:text-red-500 ml-2"
                        />
                      </TooltipTrigger>
                      <TooltipContent className="bg-red-500">
                        <p>{t('delete')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
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
<p className="text-center text-sm mt-2">{t('no_designs_found')}</p>
<p className="text-center text-xs mt-2">{t('new_designs_will_appear')}</p>

</div>

</>
)}

        </CardContent>
      </Card>  
        
      </section>
  

      {selectedDesign && (
        <>

<Card className="col-span-full mt-4" x-chunk="dashboard-01-chunk-4">
  <CardHeader className="flex flex-col bg-muted/50 md:flex-row items-center">
    <div className="grid gap-2">
      <CardTitle className="font-bold">{t('design_infos')}</CardTitle>
      <CardDescription>
        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mt-2">
          <div>
            <p className="font-bold">{t('design_title')}</p>
            <p >{selectedDesign.name}</p>
          </div>

          {!selectedDesign.isDesignAccepted && !selectedDesign.isDesignRefused && (

            <>
          <div className="col-span-2 md:col-span-1">
          <Button 
           onClick={() => handleAccept(selectedDesign.id)}
            variant="link" className="text-green-500 flex items-center">
          {t('accept_design')}
          </Button>
          </div>

          <div className="col-span-2 md:col-span-1">
          <Button 
           onClick={() => setisDialogOpen(true)}
            variant="link" className="text-red-500 flex items-center">
          {t('refuse_design')}
          </Button>
          </div>
          </>
          )}

           {selectedDesign.isDesignAccepted &&(
              <Badge className='bg-green-500 text-white text-md' variant={`default`}>
              {t('accepted')}
              </Badge>
              )}
              {selectedDesign.isDesignRefused &&(
              <Badge className='bg-red-500 text-white text-md' variant={`default`}>
              {t('refused')}
            </Badge>
        )}

        <div className="col-span-2 md:col-span-1">
          <Button 
           onClick={() => {
            downloadDesign(selectedDesign.imageUrl);
          }}
            variant="link" className="text-purple-500 flex items-center">
          {t('download_design')}
          </Button>
          </div>


        </div>
      </CardDescription>
    </div>
  </CardHeader>
  <Separator className="w-full" />
  <CardContent className="p-4 md:p-6 lg:p-8 max-w-full">
  <p className=" flex items-center justify-center font-bold my-4">{t('view_design')}</p>
  <div className='flex items-center justify-center mt-4'>
            <Button variant="default" size="sm" className="w-full sm:w-[30%] text-white" onClick={handleToggleMode}>
              {t('toggle_mode')}
            </Button>
    </div>
  <div className="flex items-center justify-center w-full p-4">
    <div
       className={cn(
        'w-full max-w-lg border-2 rounded-lg',
        isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
        )}> 
    <NextImage
        onContextMenu={(e) => e.preventDefault()}
        src={selectedDesign.imageUrl}
        alt={selectedDesign.name}
        loading="eager"
        blurDataURL="/Loading.png"
        placeholder="blur"
        className="aspect-square w-full rounded-md object-contain"
        height={1000}
        width={1000}
        />
    </div>
  </div>
</CardContent>

</Card>
        
        </>
     
        )}
  
    </div>
 ) : (
  // seconde view  : all designs
  <div className='mt-4'>
      {designs && (
        <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
          <CardHeader className="bg-muted/50">
          <div className="grid gap-2">
              <CardTitle className="font-bold">{t('all_designs')}</CardTitle>
              <CardDescription>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-2">
              <Input
                type="search"
                className="w-full sm:w-[50%] "
                placeholder={t('search_design_id_name_store_name')}
                onChange={(e) => setSearchTerm(e.target.value)}

              />  
                            <Button
                                disabled={searchTerm === ""}
                                onClick={handleSearch}
                                className="bg-blue-500 text-white px-4 py-2 ml-2 rounded flex items-center"
                            >
                            {t('search')}
                            <Search size={14} className="ml-1" />
                            </Button>   

            <Select onValueChange={handleFilterBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder={t('filter_by')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t('select')}</SelectLabel>
                      <SelectItem value="all">{t('all')}</SelectItem>
                      <SelectItem value="accepted">{t('accepted')}</SelectItem>
                      <SelectItem value="refused">{t('refused')}</SelectItem>
                      <SelectItem value="action">{t('under_review')}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                          <Select onValueChange={handleSortBy}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                  <SelectValue placeholder={t('sort_by')} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>{t('select')}</SelectLabel>
                                    <SelectItem value="sales">{t('total_sales')}</SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>

            </div>
            <div className='flex items-center justify-center mt-4'>
            <Button variant="default" size="sm" className="w-full sm:w-[30%] text-white" onClick={handleToggleMode}>
              {t('toggle_mode')}
            </Button>
              </div>

              </CardDescription>

            </div>
          </CardHeader>
          <CardContent>

<div className='mt-4 w-full grid 
xl:grid-cols-3 
lg:grid-cols-2 
md:grid-cols-1 
sm:grid-cols-1
gap-y-10
sm:gap-x-8  
md:gap-y-10
lg:gap-x-4'>

{designs.map((design, index) => {
return (
<>

<div key={index} className='flex flex-col items-center mb-4'>
<div
className={cn(
'relative h-52 border-2 rounded-lg w-52 sm:h-52 sm:w-52 lg:h-80 lg:w-80 lg:rounded-2xl flex justify-center flex-col items-center',
isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
)}>

<div className='p-8'>

    <NextImage
       onContextMenu={(e) => e.preventDefault()}
       src={design.imageUrl}
       alt={design.name}
       loading="eager"
       blurDataURL="/Loading.png"
       placeholder="blur"
       className="aspect-square w-full rounded-md object-contain"
       height={1000}
       width={1000}
      />

</div>

<div className="absolute top-2 left-2 px-2 py-1 z-10 rounded">
<Badge variant="default">
<span className="text-xs text-white">{design.store.storeName}</span>
</Badge>
</div>


<div className="absolute top-2 right-2 px-2 py-1 z-10 rounded">
<Badge variant="default">
<span className="text-xs text-white">{design.name}</span>
</Badge>
</div>

<div className="absolute bottom-2 right-2 px-2 py-1 z-10 rounded">
<Badge
onClick={() => { 
downloadDesign(design.imageUrl) }} 
className='bg-purple-500 hover:bg-purple-300 text-white cursor-pointer'>
{t('download_design')}
</Badge>
</div>


</div>

<div className="mt-4">
{!design.isDesignAccepted && !design.isDesignRefused && (
<>
 <Badge onClick={()=>{
  setSelectedDesign(design)
  setisDialogOpen(true)}} className='hover:text-red-500 cursor-pointer' variant={`outline`}>
  <CircleX/>
 </Badge>
   <Badge onClick={()=>handleAccept(design.id)} className='ml-2 hover:text-green-500 cursor-pointer' variant={`outline`}>
<CircleCheck/>
</Badge>
 </>
)}
{design.isDesignAccepted &&(
<Badge className='bg-green-500 text-white' variant={`default`}>
{t('accepted')}
</Badge>
)}
{design.isDesignRefused &&(
<Badge className='bg-red-500 text-white' variant={`default`}>
{t('refused')}
</Badge>
)}
</div>
</div>



</>
);
})}


</div>
</CardContent>
        </Card>
      )}
  </div>
 )}

                                              {/* downloading Loader  */}
                                              <AlertDialog open={open} >
                                              <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
                                              <AlertDialogHeader className="flex flex-col items-center justify-center">
                                              <AlertDialogTitle className="flex flex-col items-center justify-center">{t('downloading')}</AlertDialogTitle>
                                              <AlertDialogDescription className="flex flex-col items-center justify-center">
                                              {t('please_wait_while_downloading')}
                                            </AlertDialogDescription>
                                            <Loader size={20} className="text-blue-700 animate-spin mt-3" />
                                            </AlertDialogHeader>
                                                </AlertDialogContent>
                                         </AlertDialog>



                          <AlertDialog open={isDeleteOpen}>
                          <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
                          <AlertDialogHeader className="flex flex-col items-center">
                                       <div className="text-red-500 mb-2">
                                           <OctagonAlert className=''/>
                                               </div>
                                              <AlertDialogTitle className="text-xl font-bold text-center">{t('are_you_absolutely_sure_you_want_to_delete_this_design')}</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                   {t('this_action_cannot_be_undone')} 
                                                   {t('it_will_permanently_remove_the_design_from_our_marketplace')}.<br/><br/>
                                                    </AlertDialogDescription>
                                                   </AlertDialogHeader>
                                                  <AlertDialogFooter>
                                              <AlertDialogCancel onClick={()=>setisDeleteOpen(false)}>{t('cancel')}</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => {setisDeleteOpen(false)
                                        handleDelete()}} 
                                     className='bg-red-500 hover:bg-red-500' >{t('delete')}</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                     </AlertDialog> 

                                  <AlertDialog open={isDialogOpen}>
                                  <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
                                  <AlertDialogHeader>
                                        <AlertDialogTitle>{t('reason_for_rejecting')}</AlertDialogTitle>
                                      </AlertDialogHeader>
                                      <div className="grid gap-4 py-4">
                                          <Input value={reasonForRejection}
                                          onChange={(e) => setReasonForRejection(e.target.value)} 
                                          type="text" 
                                          placeholder={t('type_the_reason')} 
                                          className="w-full" />
                                      </div>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel onClick={()=>setisDialogOpen(false)}>{t('cancel')}</AlertDialogCancel>
                                        <AlertDialogAction disabled={reasonForRejection === ""} className='bg-red-500 hover:bg-red-400' onClick={()=>{
                                          setisDialogOpen(false)
                                          handleRefuse(selectedDesign!.id)
                                          }}>{t('refuse_design')}</AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>

                                  <LoadingState isOpen={open} />

  
    </>
    );
  }
  
  export default DesignView;