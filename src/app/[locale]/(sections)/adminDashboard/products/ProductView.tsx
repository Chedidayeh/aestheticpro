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
import { useTranslations } from 'next-intl';
  
  

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
    const t = useTranslations('AdminProductsPage');
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
        const products = await getAllProductsWithDesigns(6, searchTerm, event, sortBy);
        setProducts(products);
      } catch (error) {
        console.error("Error filtering products:", error);
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
        const products = await getAllProductsWithDesigns(6, searchTerm, filterBy, event);
        setProducts(products);
      } catch (error) {
        console.error("Error sorting products:", error);
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
          setisDeleteOpen(false)
          setOpen(true)
          const res = await deleteProduct(productId)
          if(res){
            toast({
              title: t('toast_product_deleted'),
              variant: 'default',
            });
            setOpen(false)

            router.refresh()
          }
          else{
            toast({
              title: t('toast_product_has_orders'),
              variant: 'destructive',
            });
            setOpen(false)

            router.refresh()
          }
        } catch (error) {
            console.log(error)
            toast({
                title: t('toast_product_not_deleted'),
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
      title: t('toast_download_failed'),
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
      title: t('toast_product_accepted'),
      variant: 'default',
    });
    setOpen(false)
    setSelectedProduct(null)
    router.refresh()
  } catch (error) {
    setOpen(false)
    toast({
      title: t('toast_product_not_accepted'),
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
      title: t('toast_product_refused'),
      variant: 'default',
    });
    setOpen(false)
    router.refresh()
  } catch (error) {
    console.log(error)
    setOpen(false)
    toast({
      title: t('toast_product_not_refused'),
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



  
  
  <p className="text-sm text-muted-foreground mb-2">{t('admin_dashboard_products')}</p>
           <h1 className="text-2xl font-semibold">{t('manage_products')}</h1>
  
  
           <div className="flex items-center mt-4 space-x-2">
              <Switch id="allProductsView" defaultChecked={changeView} onClick={handleSwitchChange } />
              <Label htmlFor="front">{t('change_view')}</Label>
            </div>
     
  
  {!changeView ? (

      // default view table with selectedProduct
        <div className="flex mt-4 flex-col gap-5 w-full">
  
      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4"> 
  
      <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
        <CardHeader className="bg-muted/50 space-y-2">
          <div className="grid gap-2">
            <CardTitle>{t('products')}</CardTitle>
            <CardDescription>{t('total_products')} {products.length}</CardDescription>
            
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-2">
        <Input
          type="search"
          className="w-full sm:w-[50%] "
          placeholder={t('search_product_id_title_store_name')}
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
                      <SelectItem value="views">{t('total_views')}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>


      </div>
        </CardHeader>
        <CardContent>


        {products.length > 0 ? (

        <Table>
        <ScrollArea
          className={`${
            products.length < 10 ? "max-h-max" : "h-[384px]"
          } w-full border rounded-lg mt-4`}
        >      
        <TableHeader>
    <TableRow>
      {/* Product Id column */}
      <TableHead>{t('product_id')}</TableHead>

      {/* Product Title column */}
      <TableHead>{t('product_title')}</TableHead>

      {/* Product Category column */}
      <TableHead>{t('product_category')}</TableHead>

      {/* Product price column */}
      <TableHead >{t('product_price')}</TableHead>

      {/* Product Store column */}
      <TableHead>{t('product_store')}</TableHead>

      {/* Is Product Accepted column */}
      <TableHead className="w-[5%]">{t('is_product_accepted')}</TableHead>

      {/* Is Product Refused column */}
      <TableHead className=" w-[5%]">{t('is_product_refused')}</TableHead>

      {/* Ordered Items column */}
      <TableHead className=" w-[5%]">{t('ordered_items')}</TableHead>

      {/* Actions column */}
      <TableHead>{t('actions')}</TableHead>
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
                  <p>{t('view')}</p>
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
<p className="text-center text-sm mt-2">{t('no_products_found')}</p>
<p className="text-center text-xs mt-2">{t('new_products_will_appear')}</p>

</div>

</>
)}

        </CardContent>
      </Card>  
        
      </section>
  

      {selectedProduct && (
        <>

<Card className="col-span-full mt-4" x-chunk="dashboard-01-chunk-4">
  <CardHeader className="flex flex-col md:flex-row bg-muted/50 items-center ">
    <div className="grid gap-2">
      <CardTitle className="font-bold">{t('product_infos')}</CardTitle>
      <CardDescription>
        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-2">
          <div>
            <p className="font-bold">{t('product_title')}</p>
            <p >{selectedProduct.title}</p>
          </div>

          <div>
            <p className="font-bold">{t('product_views')}</p>
            <p >{selectedProduct.totalViews} {t('views')}</p>
          </div>


          {!selectedProduct.isProductAccepted && !selectedProduct.isProductRefused && (

            <>
          <div className="col-span-2 md:col-span-1">
          <Button 
           onClick={() => handleAccept(selectedProduct.id)}
            variant="link" className="text-green-500 flex items-center">
          {t('accept_product')}
          </Button>
          </div>

          <div className="col-span-2 md:col-span-1">
          <Button 
           onClick={() => setisDialogOpen(true)}
            variant="link" className="text-red-500 flex items-center">
          {t('refuse_product')}
          </Button>
          </div>
          </>
          )}

           {selectedProduct.isProductAccepted &&(
              <Badge className='bg-green-500 text-white text-md' variant={`default`}>
              {t('accepted')}
              </Badge>
              )}
              {selectedProduct.isProductRefused &&(
              <Badge className='bg-red-500 text-white text-md' variant={`default`}>
              {t('refused')}
            </Badge>
        )}

        <div className="col-span-2 md:col-span-1">
          <Button 
           onClick={() => {
            setIsDownloadOpen(true);
            downloadMockup(selectedProduct);
          }}
            variant="link" className="text-purple-500 flex items-center">
          {t('download_product')}
          </Button>
          </div>

          <div className="col-span-2 md:col-span-1">
          <Button
          onClick={() => {
          viewProductData(selectedProduct) }} 
          variant="link" className="text-blue-500 flex items-center">
          {t('view_data')}
          </Button>
          </div>


        </div>
      </CardDescription>
    </div>
  </CardHeader>
  <Separator className="w-full" />
  <CardContent className="p-4 md:p-6 lg:p-8 max-w-full">
  <p className=" flex items-center justify-center font-bold my-4">{t('view_product')}</p>
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
          <CardHeader className="bg-muted/50">
            <div className="grid gap-2">
              <CardTitle className="font-bold">{t('all_products')}</CardTitle>
              <CardDescription>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-2">
                
              <Input
                type="search"
                className="w-full sm:w-[50%] "
                placeholder={t('search_product_id_title_store_name')}
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
                      <SelectItem value="views">{t('total_views')}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

            </div>


              </CardDescription>

            </div>
          </CardHeader>
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
{t('view_data')}
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
{t('download_product')}
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
{t('accepted')}
</Badge>
)}
{product.isProductRefused &&(
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
                                              <AlertDialog open={isDownloadOpen} >
                                              <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
                                              <AlertDialogHeader className="flex flex-col items-center justify-center">
                                              <AlertDialogTitle className="flex flex-col items-center justify-center">{t('downloading')}</AlertDialogTitle>
                                              <AlertDialogDescription className="flex flex-col items-center justify-center">
                                              {t('please_wait_downloading')}
                                            </AlertDialogDescription>
                                            <Loader size={20} className="text-blue-700 animate-spin mt-3" />
                                            </AlertDialogHeader>
                                                </AlertDialogContent>
                                         </AlertDialog>



                          {/* The AlertDialog delete product component  */}
                          <AlertDialog open={isDeleteOpen}>
                          <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
                          <AlertDialogHeader className="flex flex-col items-center">
                                       <div className="text-red-500 mb-2">
                                           <OctagonAlert className=''/>
                                               </div>
                                              <AlertDialogTitle className="text-xl font-bold text-center">{t('are_you_sure_delete_product')}</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                   {t('this_action_cannot_be_undone')} 
                                                   {t('it_will_permanently_remove_product_from_marketplace')}.<br/><br/>
                                                    </AlertDialogDescription>
                                                   </AlertDialogHeader>
                                                  <AlertDialogFooter>
                                              <AlertDialogCancel onClick={()=>setisDeleteOpen(false)}>{t('cancel')}</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => {setisDeleteOpen(false) 
                                      handleDelete()
                                       }}
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
                                          placeholder={t('type_reason')} 
                                          className="w-full " />
                                      </div>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel onClick={()=>setisDialogOpen(false)}>{t('cancel')}</AlertDialogCancel>
                                        <AlertDialogAction disabled={reasonForRejection === ""} className='bg-red-500 hover:bg-red-400' onClick={()=>{
                                          setisDialogOpen(false)
                                          handleRefuse(selectedProduct!.id)
                                          }}>{t('refuse_product')}</AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>

                                  <LoadingState isOpen={open} />

{selectedDataProduct && (

                    <AlertDialog open={openData} >
      <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
      <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold">{t('product_data')}</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="mt-4 space-y-2">
          <p>
            <strong className="text-blue-600">{t('collection')}</strong> {selectedDataProduct.collectionName}
          </p>
          <p>
            <strong className="text-blue-600">{t('title')}</strong> {selectedDataProduct.title}
          </p>
          <p>
            <strong className="text-blue-600">{t('description')}</strong> {selectedDataProduct.description}
          </p>
          <p>
            <strong className="text-blue-600">{t('tags')}</strong> {selectedDataProduct.tags.join(", ")}
          </p>
        </div>
        <AlertDialogFooter className="mt-6 flex justify-end">
          <AlertDialogAction
            className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
            onClick={() => setOpenData(false)}
          >
            {t('close')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
                          </AlertDialog>
 )}
               
    </>
    );
  }
  
  export default ProductView;