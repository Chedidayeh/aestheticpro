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
  
  

interface ExtraDesign extends SellerDesign {
  store : Store;
  frontOrders :  OrderItem[]
  backOrders : OrderItem[]
}
  
  
  
interface DesignViewProps {
  initialDesigns: ExtraDesign[];
  }
  
  const DesignView = ({ initialDesigns }: DesignViewProps ) => { 
   
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
          title: "Something went wrong!",
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
        const designs = await getAllDesignsWithProducts(10, searchTerm, filterBy, event);
        setDesigns(designs);
      } catch (error) {
        console.error("Error sorting designs:", error);
        toast({
          title: "Something went wrong!",
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
          title: 'Design Was Successfully Deleted',
          variant: 'default',
        });
        setOpen(false)
        router.refresh()
      }
      else{
        toast({
          title: 'Design has associated order items and can not be deleted',
          variant: 'destructive',
        });
        setOpen(false)
        router.refresh()
      }
    } catch (error) {
        console.log(error)
        toast({
            title: 'design Was Not Deleted',
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
      title: "No design found !",
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
      title: "Download failed",
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
      title: 'Design Was Successfully Accepted',
      variant: 'default',
    });
    setOpen(false)
    setSelectedDesign(null)
    router.refresh()
  } catch (error) {
    setOpen(false)
    toast({
      title: 'Error : Design Was not Accepted',
      variant: 'destructive',
    });
  }

}

const handleRefuse = async (designId : string) =>{

  try {
    setOpen(true)
    await refuseDesign(designId , reasonForRejection)
    toast({
      title: 'Design Was Successfully Refused',
      variant: 'default',
    });
    setOpen(false)
    router.refresh()
  } catch (error) {
    setOpen(false)
    toast({
      title: 'Error : Design Was not Refused',
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



  
  
  <p className="text-sm text-muted-foreground mb-2">AdminDashboard/Designs</p>
           <h1 className="text-2xl font-semibold">Manage Designs</h1>
  
  
           <div className="flex items-center mt-4 space-x-2">
              <Switch id="allDesignView" defaultChecked={changeView} onClick={handleSwitchChange } />
              <Label htmlFor="front">Change View</Label>
            </div>
     
  
  {!changeView ? (

      // default view table with selected design
        <div className="flex mt-4 flex-col gap-5 w-full">
  
      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4"> 
  
      <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
        <CardHeader className="flex flex-row items-center bg-muted/50">
          <div className="grid gap-2">
            <CardTitle>Designs</CardTitle>
            <CardDescription>Total: {designs.length}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>

        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 mt-2">
        <Input
          type="search"
          className="w-full sm:w-[50%] "
          placeholder="Enter the design Id, name, store Name to make a search..."
          onChange={(e) => setSearchTerm(e.target.value)}

        />
                <Button
                          disabled={searchTerm === ""}
                          onClick={handleSearch}
                          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                      >
                      Search
                      <Search size={14} className="ml-1" />
                </Button>  

            <Select onValueChange={handleFilterBy}>
                <SelectTrigger className="w-full sm:w-[180px] ">
            <SelectValue placeholder="Filter By" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select</SelectLabel>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="refused">Refused</SelectItem>
              <SelectItem value="action">Awaiting action</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

                    <Select onValueChange={handleSortBy}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Sort By" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Select</SelectLabel>
                              <SelectItem value="sales">Total Sales</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>

            </div>

      <Table>
      <ScrollArea className="mt-4 w-full h-96">
        <TableHeader>
          <TableRow>
            {/* Design Id column */}
            <TableHead>Design Id</TableHead>

            {/* Design Name column */}
            <TableHead>Design Name</TableHead>

            {/* Design price column */}
            <TableHead>Design Price</TableHead>

            {/* Design Store column */}
            <TableHead>Design Store</TableHead>

            {/* Is Design Accepted column */}
            <TableHead>Is Design Accepted</TableHead>

            {/* Is Design Refused column */}
            <TableHead>Is Design Refused</TableHead>

            {/* Ordered Items column */}
            <TableHead>Ordered Items</TableHead>

            {/* Actions column */}
            <TableHead>Actions</TableHead>
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
                        <p>View</p>
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
                        <p>Delete</p>
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
        </CardContent>
      </Card>  
        
      </section>
  

      {selectedDesign && (
        <>

<Card className="col-span-full mt-4" x-chunk="dashboard-01-chunk-4">
  <CardHeader className="flex flex-col md:flex-row items-center">
    <div className="grid gap-2">
      <CardTitle className="font-bold">Design Infos :</CardTitle>
      <CardDescription>
        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mt-2">
          <div>
            <p className="font-bold">Design Title :</p>
            <p >{selectedDesign.name}</p>
          </div>

          {!selectedDesign.isDesignAccepted && !selectedDesign.isDesignRefused && (

            <>
          <div className="col-span-2 md:col-span-1">
          <Button 
           onClick={() => handleAccept(selectedDesign.id)}
            variant="link" className="text-green-500 flex items-center">
          Accept Design
          </Button>
          </div>

          <div className="col-span-2 md:col-span-1">
          <Button 
           onClick={() => setisDialogOpen(true)}
            variant="link" className="text-red-500 flex items-center">
          Refuse Design
          </Button>
          </div>
          </>
          )}

           {selectedDesign.isDesignAccepted &&(
              <Badge className='bg-green-500 text-white text-md' variant={`default`}>
              Accepted
              </Badge>
              )}
              {selectedDesign.isDesignRefused &&(
              <Badge className='bg-red-500 text-white text-md' variant={`default`}>
              Refused
            </Badge>
        )}

        <div className="col-span-2 md:col-span-1">
          <Button 
           onClick={() => {
            downloadDesign(selectedDesign.imageUrl);
          }}
            variant="link" className="text-purple-500 flex items-center">
          Download Design
          </Button>
          </div>


        </div>
      </CardDescription>
    </div>
  </CardHeader>
  <Separator className="w-full" />
  <CardContent className="p-4 md:p-6 lg:p-8 max-w-full">
  <p className=" flex items-center justify-center font-bold my-4">View Design :</p>
  <div className='flex items-center justify-center mt-4'>
            <Button variant="default" size="sm" className="w-full sm:w-[30%]" onClick={handleToggleMode}>
              Toggle Mode
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
          <CardHeader className="">
            <div className="grid gap-2">
              <CardTitle className="font-bold">All Designs :</CardTitle>
              <CardDescription>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-2">
              <Input
                type="search"
                className="w-full sm:w-[50%] "
                placeholder="Enter the design Id, name, store Name to make a search..."
                onChange={(e) => setSearchTerm(e.target.value)}

              />  
                            <Button
                                disabled={searchTerm === ""}
                                onClick={handleSearch}
                                className="bg-blue-500 text-white px-4 py-2 ml-2 rounded flex items-center"
                            >
                            Search
                            <Search size={14} className="ml-1" />
                            </Button>   

            <Select onValueChange={handleFilterBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select</SelectLabel>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="refused">Refused</SelectItem>
                      <SelectItem value="action">Awaiting action</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                          <Select onValueChange={handleSortBy}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                  <SelectValue placeholder="Sort By" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Select</SelectLabel>
                                    <SelectItem value="sales">Total Sales</SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>

            </div>
            <div className='flex items-center justify-center mt-4'>
            <Button variant="default" size="sm" className="w-full sm:w-[30%]" onClick={handleToggleMode}>
              Toggle Mode
            </Button>
              </div>

              </CardDescription>
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
          Download Design
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
             Accepted
             </Badge>
             )}
            {design.isDesignRefused &&(
            <Badge className='bg-red-500 text-white' variant={`default`}>
             Refused
          </Badge>
       )}
      </div>
    </div>



      </>
    );
  })}


  </div>
              </CardContent>
            </div>
          </CardHeader>
        </Card>
      )}
  </div>
 )}

                                              {/* downloading Loader  */}
                                              <AlertDialog open={open} >
                                          <AlertDialogContent className=" flex flex-col items-center justify-center">
                                              <AlertDialogHeader className="flex flex-col items-center justify-center">
                                              <Loader className="text-blue-700 h-[30%] w-[30%] animate-spin mt-3" />
                                              <AlertDialogTitle className="flex flex-col items-center justify-center">Loading</AlertDialogTitle>
                                            </AlertDialogHeader>
                                            <AlertDialogDescription className="flex flex-col items-center justify-center">
                                              Please wait while downloading...
                                            </AlertDialogDescription>
                                                    <AlertDialogFooter>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                         </AlertDialog>



                          <AlertDialog open={isDeleteOpen}>
                            <AlertDialogContent>
                                   <AlertDialogHeader className="flex flex-col items-center">
                                       <div className="text-red-500 mb-2">
                                           <OctagonAlert className=''/>
                                               </div>
                                              <AlertDialogTitle className="text-xl font-bold text-center">
                                                 Are you absolutely sure you want to delete this design ?
                                               </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                   This action cannot be undone. 
                                                   It will permanently remove the design from our MarketPlace.<br/><br/>
                                                    </AlertDialogDescription>
                                                   </AlertDialogHeader>
                                                  <AlertDialogFooter>
                                              <AlertDialogCancel onClick={()=>setisDeleteOpen(false)}>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => {setisDeleteOpen(false)
                                        handleDelete()}} 
                                     className='bg-red-500 hover:bg-red-500' >Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                     </AlertDialog> 

                                  <AlertDialog open={isDialogOpen}>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Reason for rejecting</AlertDialogTitle>
                                      </AlertDialogHeader>
                                      <div className="grid gap-4 py-4">
                                          <Input value={reasonForRejection}
                                          onChange={(e) => setReasonForRejection(e.target.value)} 
                                          type="text" 
                                          placeholder='Type the reason' 
                                          className="w-full" />
                                      </div>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel onClick={()=>setisDialogOpen(false)}>Cancel</AlertDialogCancel>
                                        <AlertDialogAction disabled={reasonForRejection === ""} className='bg-red-500 hover:bg-red-400' onClick={()=>{
                                          setisDialogOpen(false)
                                          handleRefuse(selectedDesign!.id)
                                          }}>Refuse Design</AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>

                                  <LoadingState isOpen={open} />

  
    </>
    );
  }
  
  export default DesignView;