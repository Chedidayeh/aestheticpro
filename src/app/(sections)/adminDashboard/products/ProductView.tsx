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
  
  
  import React, { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { OrderItem, Product, SellerDesign, Store } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { TooltipProvider } from "@/components/ui/tooltip"
import { deleteProduct } from "../../sellerDashboard/products/actions"
import { Separator } from '@/components/ui/separator'
import ImageSlider from '@/components/MarketPlace/ImageSlider'
import { acceptProduct, refuseProduct } from '../stores/actions'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import LoadingState from '@/components/LoadingState'
import { getAllProductsWithDesigns } from './actions'
  
  

interface ExtraProduct extends Product {
  store : Store
  frontDesign: SellerDesign | null;
  backDesign: SellerDesign | null;
  order : OrderItem[]
}
  
  
  
interface ProductViewProps {
  initialProducts: ExtraProduct[];
  }
  
  const ProductView = ({ initialProducts }: ProductViewProps ) => { 
    const [products, setProducts] = useState(initialProducts);
    
    const router = useRouter();
    const { toast } = useToast()
    const [isDeleteOpen, setisDeleteOpen] = useState(false);
    const [ productId , setProductId] = useState("")


    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filterBy, setFilterBy] = useState<string>("");
    const [sortBy, setSortBy] = useState<string>("");

    const handleSearch = async () => {
      try {
        setOpen(true);
        const products = await getAllProductsWithDesigns(6, searchTerm, filterBy, sortBy);
        setProducts(products);
      } catch (error) {
        console.error("Error searching products:", error);
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
        const products = await getAllProductsWithDesigns(6, searchTerm, event, sortBy);
        setProducts(products);
      } catch (error) {
        console.error("Error filtering products:", error);
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
        const products = await getAllProductsWithDesigns(6, searchTerm, filterBy, event);
        setProducts(products);
      } catch (error) {
        console.error("Error sorting products:", error);
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
          setisDeleteOpen(false)
          setOpen(true)
          const res = await deleteProduct(productId)
          if(res){
            toast({
              title: 'Product Was Successfully Deleted',
              variant: 'default',
            });
            setOpen(false)

            router.refresh()
          }
          else{
            toast({
              title: 'Product has associated order items and can not be deleted',
              variant: 'destructive',
            });
            setOpen(false)

            router.refresh()
          }
        } catch (error) {
            console.log(error)
            toast({
                title: 'Product Was Not Deleted',
                variant: 'destructive',
              });
              setOpen(false)

        }
    }





     // State variables
 const [isDownloadOpen, setIsDownloadOpen] = useState(false);

// Function to handle download
const downloadMockup = async (product: ExtraProduct) => {
  try {
    // Combine all image sources into a single array
    const imageUrls = [
      ...product.croppedFrontProduct,
      ...product.croppedBackProduct,
      product.frontDesign?.imageUrl,
      product.backDesign?.imageUrl,
    ].filter(Boolean); // Filter out any undefined or null values

    // Loop through each imageUrl and download
    for (let i = 0; i < imageUrls.length; i++) {
      const response = await fetch(imageUrls[i]!);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `design_image_${i + 1}.png`; // Set dynamic filename or customize as needed
      document.body.appendChild(a);
      a.click();
      a.remove();
    }

    setIsDownloadOpen(false);

  } catch (error) {
    console.error("Error downloading mockup:", error);
    toast({
      title: "Download failed",
      variant: "destructive",
    });
  }
};

const [selectedProduct, setSelectedProduct] = useState<ExtraProduct | null>(null);
const [open, setOpen] = useState<boolean>(false);
const [reasonForRejection, setReasonForRejection] = useState('');
const [isDialogOpen, setisDialogOpen] = useState<boolean>(false);

const handleAccept = async (productId : string) =>{

  try {
    setOpen(true)
    await acceptProduct(productId)
    toast({
      title: 'Product Was Successfully Accepted',
      variant: 'default',
    });
    setOpen(false)
    setSelectedProduct(null)
    router.refresh()
  } catch (error) {
    setOpen(false)
    toast({
      title: 'Error : Product Was not Accepted',
      variant: 'destructive',
    });
  }

}

const handleRefuse = async (productId : string) =>{

  try {
    setOpen(true)
    await refuseProduct(productId, reasonForRejection)
    router.refresh()
    toast({
      title: 'Product Was Successfully Refused',
      variant: 'default',
    });
    setOpen(false)
    router.refresh()
  } catch (error) {
    console.log(error)
    setOpen(false)
    toast({
      title: 'Error : Product Was not Refused',
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


// openData state
const [openData, setOpenData] = useState(false);


const [selectedDataProduct, setSelectedDataProduct] = useState<ExtraProduct>();

// viewProductData function
const viewProductData = (product : ExtraProduct) => {
  setOpenData(true)
  setSelectedDataProduct(product)
}

    



    return (
      <>



  
  
  <p className="text-sm text-muted-foreground mb-2">AdminDashboard/Products</p>
           <h1 className="text-2xl font-semibold">Manage Products</h1>
  
  
           <div className="flex items-center mt-4 space-x-2">
              <Switch id="allProductsView" defaultChecked={changeView} onClick={handleSwitchChange } />
              <Label htmlFor="front">Change View</Label>
            </div>
     
  
  {!changeView ? (

      // default view table with selectedProduct
        <div className="flex mt-4 flex-col gap-5 w-full">
  
      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4"> 
  
      <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
        <CardHeader className="flex flex-row items-center bg-muted/50">
          <div className="grid gap-2">
            <CardTitle>Products</CardTitle>
            <CardDescription>Total: {products.length}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-2">
        <Input
          type="search"
          className="w-full sm:w-[50%] "
          placeholder="Enter the product Id, title, store Name to make a search..."
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
                      <SelectItem value="views">Total Views</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>


      </div>

        <Table>
        <ScrollArea className="mt-4 w-full h-96">
  <TableHeader>
    <TableRow>
      {/* Product Id column */}
      <TableHead>Product Id</TableHead>

      {/* Product Title column */}
      <TableHead>Product Title</TableHead>

      {/* Product Category column */}
      <TableHead>Product Category</TableHead>

      {/* Product price column */}
      <TableHead >Product Price</TableHead>

      {/* Product Store column */}
      <TableHead>Product Store</TableHead>

      {/* Is Product Accepted column */}
      <TableHead className="w-[5%]">Is Product Accepted</TableHead>

      {/* Is Product Refused column */}
      <TableHead className=" w-[5%]">Is Product Refused</TableHead>

      {/* Ordered Items column */}
      <TableHead className=" w-[5%]">Ordered Items</TableHead>

      {/* Actions column */}
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {products.map((product) => (
      <TableRow key={product.id}>
        {/* Product Id cell */}
        <TableCell>{product.id}</TableCell>

        {/* Product Title cell */}
        <TableCell>{product.title}</TableCell>

        {/* Product Category cell */}
        <TableCell >{product.category}</TableCell>

        {/* Product price cell */}
        <TableCell>{product.price.toFixed(2)} TND</TableCell>

        {/* Product Store cell */}
        <TableCell >{product.store.storeName}</TableCell>

        {/* Is Product Accepted cell */}
        <TableCell>{product.isProductAccepted ? 'Yes' : 'No'}</TableCell>

        {/* Is Product Refused cell */}
        <TableCell>{product.isProductRefused ? 'Yes' : 'No'}</TableCell>

        {/* Ordered Items cell */}
        <TableCell>{product.order.length}</TableCell>

        {/* Actions cell */}
        <TableCell>
          <TooltipProvider>
            <div className="flex items-center">
              {/* View Icon */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Eye
                    onClick={() => {
                      setSelectedProduct(product)
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
                      setProductId(product.id);
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
  

      {selectedProduct && (
        <>

<Card className="col-span-full mt-4" x-chunk="dashboard-01-chunk-4">
  <CardHeader className="flex flex-col md:flex-row items-center">
    <div className="grid gap-2">
      <CardTitle className="font-bold">Product Infos :</CardTitle>
      <CardDescription>
        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mt-2">
          <div>
            <p className="font-bold">Product Title :</p>
            <p >{selectedProduct.title}</p>
          </div>

          <div>
            <p className="font-bold">Product Views :</p>
            <p >{selectedProduct.totalViews} views</p>
          </div>


          {!selectedProduct.isProductAccepted && !selectedProduct.isProductRefused && (

            <>
          <div className="col-span-2 md:col-span-1">
          <Button 
           onClick={() => handleAccept(selectedProduct.id)}
            variant="link" className="text-green-500 flex items-center">
          Accept  Product
          </Button>
          </div>

          <div className="col-span-2 md:col-span-1">
          <Button 
           onClick={() => setisDialogOpen(true)}
            variant="link" className="text-red-500 flex items-center">
          Refuse  Product
          </Button>
          </div>
          </>
          )}

           {selectedProduct.isProductAccepted &&(
              <Badge className='bg-green-500 text-white text-md' variant={`default`}>
              Accepted
              </Badge>
              )}
              {selectedProduct.isProductRefused &&(
              <Badge className='bg-red-500 text-white text-md' variant={`default`}>
              Refused
            </Badge>
        )}

        <div className="col-span-2 md:col-span-1">
          <Button 
           onClick={() => {
            setIsDownloadOpen(true);
            downloadMockup(selectedProduct);
          }}
            variant="link" className="text-purple-500 flex items-center">
          Download  Product
          </Button>
          </div>


        </div>
      </CardDescription>
    </div>
  </CardHeader>
  <Separator className="w-full" />
  <CardContent className="p-4 md:p-6 lg:p-8 max-w-full">
  <p className=" flex items-center justify-center font-bold my-4">View Product :</p>
  <div className="flex items-center justify-center w-full p-4">
    <div className="w-80 xl:w-full max-w-lg"> {/* You can adjust max-w-lg as per your desired size */}
      <ImageSlider
        urls={[
          ...(selectedProduct.croppedFrontProduct ?? []),
          ...(selectedProduct.croppedBackProduct ?? []),
        ]}
      />
    </div>
  </div>
</CardContent>

</Card>
        
        </>
     
        )}
  
    </div>
 ) : (
  // seconde view  : all products
  <div className='mt-4'>
      {/* store products view */}
      {products && (
        <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
          <CardHeader className="">
            <div className="grid gap-2">
              <CardTitle className="font-bold">All Products :</CardTitle>
              <CardDescription>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-2">
                
              <Input
                type="search"
                className="w-full sm:w-[50%] "
                placeholder="Enter the product Id, title, store Name to make a search..."
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
                      <SelectItem value="views">Total Views</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

            </div>


              </CardDescription>
              <CardContent>

              <div className='mt-4 w-full grid  
              lg:grid-cols-2 
              md:grid-cols-2
              sm:grid-cols-1
              gap-y-10
              sm:gap-x-8  
              md:gap-y-10
              lg:gap-x-4'>

  {products.map((product, index) => {
    // Combine front and back product URLs
    const combinedUrls = [
      ...product.croppedFrontProduct,
      ...product.croppedBackProduct
    ];

    return (
      <>
        {/* ImageSlider with combinedUrls */}


  {/* Product Cards */}
    <div key={index} className='flex flex-col items-center mb-4'>
    <div className='relative h-72 w-72 lg:h-80 lg:w-80'>


       <ImageSlider urls={combinedUrls} />


       <div className="absolute top-2 left-2 px-2 py-1 z-10 rounded">
          <Badge variant="default">
          <span className="text-xs text-white">{product.store.storeName}</span>
          </Badge>
      </div>

      <div className="absolute top-8 left-2 px-2 py-1 z-10 rounded">
      <Badge
        onClick={() => {
          viewProductData(product) }} 
        className='bg-green-500 hover:bg-green-300 text-white cursor-pointer'>
          View Data
        </Badge>
      </div>

      
      <div className="absolute top-2 right-2 px-2 py-1 z-10 rounded">
          <Badge variant="default">
          <span className="text-xs text-white">{product.title}</span>
          </Badge>
      </div>

      <div className="absolute top-8 right-2 px-2 py-1 z-10 rounded">
      <Badge
        onClick={() => { setIsDownloadOpen(true) 
          downloadMockup(product) }} 
        className='bg-purple-500 hover:bg-purple-300 text-white cursor-pointer'>
          Download Product
        </Badge>
      </div>


    </div>

        <div className="mt-20">
         {!product.isProductAccepted && !product.isProductRefused && (
            <>
               <Badge onClick={()=>{
                setSelectedProduct(product)
                setisDialogOpen(true)}} className='hover:text-red-500 cursor-pointer' variant={`outline`}>
                <CircleX/>
               </Badge>
                 <Badge onClick={()=>handleAccept(product.id)} className='ml-2 hover:text-green-500 cursor-pointer' variant={`outline`}>
              <CircleCheck/>
            </Badge>
               </>
            )}
             {product.isProductAccepted &&(
            <Badge className='bg-green-500 text-white' variant={`default`}>
             Accepted
             </Badge>
             )}
            {product.isProductRefused &&(
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
                                              <AlertDialog open={isDownloadOpen} >
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



                          {/* The AlertDialog delete product component  */}
                          <AlertDialog open={isDeleteOpen}>
                            <AlertDialogContent>
                                   <AlertDialogHeader className="flex flex-col items-center">
                                       <div className="text-red-500 mb-2">
                                           <OctagonAlert className=''/>
                                               </div>
                                              <AlertDialogTitle className="text-xl font-bold text-center">
                                                 Are you absolutely sure you want to delete this product ?
                                               </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                   This action cannot be undone. 
                                                   It will permanently remove the product from our MarketPlace.<br/><br/>
                                                    </AlertDialogDescription>
                                                   </AlertDialogHeader>
                                                  <AlertDialogFooter>
                                              <AlertDialogCancel onClick={()=>setisDeleteOpen(false)}>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => {setisDeleteOpen(false) 
                                      handleDelete()
                                       }}
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
                                          className="w-full bg-gray-100" />
                                      </div>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel onClick={()=>setisDialogOpen(false)}>Cancel</AlertDialogCancel>
                                        <AlertDialogAction disabled={reasonForRejection === ""} className='bg-red-500 hover:bg-red-400' onClick={()=>{
                                          setisDialogOpen(false)
                                          handleRefuse(selectedProduct!.id)
                                          }}>Refuse Product</AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>

                                  <LoadingState isOpen={open} />

{selectedDataProduct && (

                    <AlertDialog open={openData} >
      <AlertDialogContent className="p-6 rounded-md shadow-lg max-w-md mx-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold">
            Product Data
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="mt-4 space-y-2">
          <p>
            <strong>Collection:</strong> {selectedDataProduct.collectionName}
          </p>
          <p>
            <strong>Title:</strong> {selectedDataProduct.title}
          </p>
          <p>
            <strong>Description:</strong> {selectedDataProduct.description}
          </p>
          <p>
            <strong>Tags:</strong> {selectedDataProduct.tags.join(", ")}
          </p>
        </div>
        <AlertDialogFooter className="mt-6 flex justify-end">
          <AlertDialogAction
            className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
            onClick={() => setOpenData(false)}
          >
            Close
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
                          </AlertDialog>
 )}
               
    </>
    );
  }
  
  export default ProductView;