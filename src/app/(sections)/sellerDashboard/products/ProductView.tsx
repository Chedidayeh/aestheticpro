/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
// Indicates this file is a client-side component in Next.js

"use client"
import NextImage from 'next/image'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import {  ChangeEvent, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';
import {  CircleAlert, CircleDollarSign, CreditCard, Eye, Loader, OctagonAlert, PenTool, SquarePen, Trash2 } from 'lucide-react';
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
 
import { deleteProduct, updateProduct } from './actions';
import { useRouter } from 'next/navigation';
import { Collection, Level, Product, Store } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/components/ui/use-toast";
import ImageSlider from "@/components/MarketPlace/ImageSlider";
import LoadingState from "@/components/LoadingState";
import { ScrollArea } from "@/components/ui/scroll-area";
import LoadingLink from '@/components/LoadingLink';
import { cn } from '@/lib/utils';
interface ProductViewProps {
  sellerProductsData: Product[];
  totalProductViews:number
  collections : ExtraCollection[]
  level : Level
  store : Store
  }

  interface ExtraCollection extends Collection {
    products : Product[]
  }


const ProductView = ({
  sellerProductsData,
  totalProductViews,
  collections,
  level,
  store,
  }: ProductViewProps) => {
        const router = useRouter();
        const { toast } = useToast()



        
        // serach and sort filter
        const [searchQuery, setSearchQuery] = useState('');
        const [sortOption, setSortOption] = useState('');

        const [selectedProduct, setSelectedProduct] = useState<Product>();
        const [newTitle, setnewTitle] = useState("");
        const [selectedCollection, setSelectedCollection] = useState(selectedProduct?.collectionName!);
        const [isClicked, setIsClicked] = useState(false);
        const [open, setOpen] = useState<boolean>(false);


        // Handle change of selection
        const handleSelectChange = (value: string) => {
          // Ensure the value is of type Collection
          setSelectedCollection(value);
        };




              const [isEditOpen , setIsEditOpen] = useState(false)
              const handleSave = async (productId : string) => {
                  try {
                    setOpen(true)
                      await updateProduct({productId,newTitle,selectedCollection})
                      setnewTitle("")
                      toast({
                          title: 'Product Was Successfully Updated',
                          variant: 'default',
                        });
                        setOpen(false)
                        setIsEditOpen(false)
                        router.refresh()
                  } catch (error) {
                    setIsEditOpen(false)
                    setOpen(false)
                      console.error('Error updating Product:', error);
                      toast({
                          title: 'Something went wrong',
                          description: 'There was an error on our end. Please try again.',
                          variant: 'destructive',
                      });
                  }
              };


              const [isDeleteOpen , setIsDeleteOpen] = useState(false)
              const handleDelete = async (productId : string) => {
                  try {
                    setOpen(true)

                      const res = await deleteProduct(productId)
                      if(res){
                        setOpen(false)
                        toast({
                          title: 'Product Was Successfully Deleted',
                          variant: 'default',
                        });
                        setIsDeleteOpen(false)
                        router.refresh()
                      }
                      else{
                        setOpen(false)
                        setIsDeleteOpen(false)
                        toast({
                          title: 'Product has associated order items and can not be deleted',
                          variant: 'destructive',
                        });
                        router.refresh()
                      }
                      
                  } catch (error) {
                    setIsDeleteOpen(false)
                    setOpen(false)
                      console.error('Error updating Product:', error);
                      toast({
                          title: 'Something went wrong',
                          description: 'There was an error on our end. Please try again.',
                          variant: 'destructive',
                      });
                  }
              };
        
                
                // search and sort filter
                
                const filteredProduct = sellerProductsData.filter((product) => {
                  const lowerCaseQuery = searchQuery.toLowerCase();
                  const lowerCaseName = product.title.toLowerCase();
                  const tagsMatch = product.tags && product.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery));
                  return lowerCaseName.includes(lowerCaseQuery) || (product.tags && tagsMatch);
                });
              
                if (sortOption === 'sales') {
                  filteredProduct?.sort((a, b) => b.totalSales - a.totalSales);
                } else if (sortOption === 'high') {
                  filteredProduct?.sort((a, b) => b.price - a.price);
                }else if (sortOption === 'low') {
                  filteredProduct?.sort((a, b) => a.price - b.price);
                }else if (sortOption === 'views') {
                  filteredProduct?.sort((a, b) => b.totalViews - a.totalViews);
                }

                const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
                  setSearchQuery(e.target.value);
                };

                const handleSortChange = (e: string) => {
                    setSortOption(e);
                };


                const [productImgs , setproductImgs] = useState <string[]> ([])
                const viewProduct = (product : Product) => {
                  let imgs = [] as string []
                  product.croppedFrontProduct.map((img : string) => {
                    imgs.push(img)
                  })
                  product.croppedBackProduct.map((img : string) => {
                    imgs.push(img)
                  })
                  setproductImgs(imgs)
                }
            

     // State variables
     const [isDownloadOpen, setIsDownloadOpen] = useState(false);

     // Function to handle download
     const downloadMockup = async (imageUrls: string[]) => {
       try {
         setIsDownloadOpen(true);
     
         // Loop through each imageUrl and download
         for (let i = 0; i < imageUrls.length; i++) {
           const response = await fetch(imageUrls[i]);
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
         setIsDownloadOpen(false);
         console.error("Error downloading designs:", error);
         toast({
           title: "Download failed",
           variant: "destructive",
         });
       }
     };
     


  return (

    <>

                                              {/* downloading Loader  */}
                                 {/* downloading Loader  */}
                                              <AlertDialog open={isDownloadOpen} >
                                              <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
                                              <AlertDialogHeader className="flex flex-col items-center justify-center">
                                              <AlertDialogTitle className="flex flex-col items-center justify-center">Downloading</AlertDialogTitle>
                                              <AlertDialogDescription className="flex flex-col items-center justify-center">
                                              Please wait while downloading...
                                            </AlertDialogDescription>
                                            <Loader size={20} className="text-blue-700 animate-spin mt-3" />
                                            </AlertDialogHeader>
                                                </AlertDialogContent>
                                         </AlertDialog>



  <p className="text-sm text-muted-foreground mb-2">SellerDashboard/All Products</p>
  <h1 className="text-2xl font-semibold mb-8">All Products</h1>


  <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
  <CardHeader className="px-7 space-y-4 bg-muted/50 rounded-t-lg">
  <CardDescription>Total Products: {sellerProductsData.length} | <span className="text-blue-500">your store limit : {!store.unlimitedCreation ? level.productLimit  : "unlimited"} products</span></CardDescription>
  
  <CardDescription className="text-blue-500">Total Products Views : {totalProductViews}</CardDescription>

        <LoadingLink href="/sellerDashboard/createProduct"
    className={buttonVariants({
      size: 'sm',
      className: 'items-center w-36 gap-1 text-white',
    })}
    >
      Create new product
  </LoadingLink>

        {/* Sorting select */}
        <div className="flex items-center space-x-2 mt-4">
        <Input
    type="search"
    className="md:w-[30%] w-full"
    placeholder="Search for your products..."
    value={searchQuery}
    onChange={handleSearchChange}
  />
  <Select value={sortOption} onValueChange={handleSortChange}>
    <SelectTrigger className="w-[160px]">
      <SelectValue placeholder="Sort By" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Sort By</SelectLabel>
        <SelectItem value="sales">Most Selled</SelectItem>
        <SelectItem value="high">Highest Price</SelectItem>
        <SelectItem value="low">Lowest Price</SelectItem>
        <SelectItem value="views">Views</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>


</div>

      <p className="text-muted-foreground text-sm mt-4">
        <span className="text-blue-600 font-medium">Guide :</span> Refresh Page to view newly added products!
      </p>
      <p className="text-muted-foreground text-sm">
        <span className="text-blue-600 font-medium">Guide :</span> Under review = Product status will be revealed after review!
      </p>
  </CardHeader>
  <CardContent>
    {sellerProductsData.length == 0 ? (
      <>
      <div className="flex mt-2 items-center justify-center flex-col text-muted-foreground">
        <h1 className="text-center text-3xl font-bold">
          <CircleAlert />
        </h1>
        <p className="text-center text-sm mt-2">No records of any products found for now !</p>
        <p className="text-center text-xs mt-2">Try to create new products.</p>

      </div>
      </>
    ) : (
      <>
          {filteredProduct.length === 0 ? (
      <div className="flex mt-2 items-center justify-center flex-col text-muted-foreground">
        <h1 className="text-center text-3xl font-bold">
          <CircleAlert />
        </h1>
        <p className="text-center text-sm mt-2">No products found by that title !</p>
      </div>
    ) : (
        <ScrollArea className='w-full h-[984px]'>
        <div className="relative mt-5 grid grid-cols-1">
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  gap-2">
            {/* Product Cards */}
            {filteredProduct.map((product, index) => (
                    <div key={index} className="relative aspect-square">
                      <ImageSlider
                        urls={[
                          ...(product.croppedFrontProduct ?? []),
                          ...(product.croppedBackProduct ?? []),
                        ]}
                      />

                      {/* Badges */}
                      <div className="absolute top-2 right-2 px-2 py-1 z-10 rounded">
                        {product.isProductAccepted && (
                          <Badge className="bg-green-700 text-white px-2 py-1 rounded">
                            Accepted {product.privateProduct ? "| Private" : ""}
                          </Badge>
                        )}
                        {product.isProductRefused && (
                          <Badge className="bg-red-500 text-white px-2 py-1 rounded">
                            Refused
                          </Badge>
                        )}
                        {!product.isProductAccepted && !product.isProductRefused && (
                          <Badge className="bg-gray-500 text-white px-2 py-1 rounded">
                            Under review
                          </Badge>
                        )}
                      </div>

                      <div className="absolute top-10 right-2 px-2 py-1 z-10 rounded">
                      <Badge 
                       onClick={() => {
                       setIsDownloadOpen(true);
                       viewProduct(product);
                       downloadMockup(productImgs);
                      }}
                      className="bg-purple-500 hover:bg-purple-400 cursor-pointer text-white px-2 py-1 rounded">
                            Download Product
                      </Badge>
                        </div>

                        
                      <div className="absolute top-2 left-2 px-2 py-1 z-10 rounded">
                        <Badge variant="secondary" className="bg-gray-200">
                          <CircleDollarSign className="mr-2 h-4 w-4 text-green-800 opacity-70" />
                          <span className="text-xs text-gray-600">{product.price.toFixed(2)} TND</span>
                        </Badge>
                      </div>

                      <div className="absolute top-8 left-2 px-2 py-1 z-10 rounded">
                        <Badge variant="secondary" className="bg-gray-200">
                          <Eye className="mr-2 h-4 w-4 text-blue-800 opacity-70" />
                          <span className="text-xs text-gray-600">{product.totalViews} views</span>
                        </Badge>
                      </div>

                      <div className="absolute top-14  left-2 px-2 py-1 z-10 rounded">
                        <Badge variant="secondary" className="bg-gray-200">
                          <CreditCard className="mr-2 h-4 w-4 text-red-800 opacity-70" />
                          <span className="text-xs text-gray-600">{product.totalSales} sales</span>
                         </Badge>
                      </div>

                      <div className="absolute bottom-8 left-0 right-0 z-10 text-center">
                        <Badge variant="secondary" className="bg-gray-200 text-black">
                          {product.title}
                        </Badge>
                      </div>

                      <div
                        className="z-10 cursor-pointer border rounded-lg border-gray-700 p-1
                          absolute bottom-2 left-3 mt-1 mr-1 
                          text-muted-foreground hover:text-blue-500 hover:border-blue-500  
                          transform 
                          hover:scale-110 hover:rotate-6 transition duration-200"
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsEditOpen(true);
                        }}
                      >
                        <SquarePen />
                      </div>

                      <div
                        className="z-10 cursor-pointer border rounded-lg border-gray-700 p-1
                          absolute bottom-2 right-3 mt-1 mr-1 
                          text-muted-foreground hover:text-red-500 hover:border-red-500  
                          transform 
                          hover:scale-110 hover:rotate-6 transition duration-200"
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsDeleteOpen(true);
                        }}
                      >
                        <Trash2 />
                      </div>

                      
                    </div>

            ))}
          </div>
        </div>
        </ScrollArea>
    )}
      </>
    )}




  </CardContent>
</Card>



      {selectedProduct && (

        <>
        {/* Edit product */}
        <AlertDialog open={isEditOpen}>
        <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
        <AlertDialogHeader>
              <AlertDialogTitle>Edit Your Product</AlertDialogTitle>
              <AlertDialogDescription className='flex flex-col'>
                <div>
                  Title: <span className='text-gray-700 font-semibold'>{selectedProduct.title}</span>
                </div>
                <div>
                  Collection: <span className='text-gray-700 font-semibold'>{selectedProduct.collectionName}</span>
                </div>
                <div>
                  Product Base Price: <span className='text-gray-700 font-semibold'>{selectedProduct.basePrice.toFixed(2)} TND</span>
                </div>
                <div>
                  Price: <span className='text-gray-700 font-semibold'>{selectedProduct.price.toFixed(2)} TND</span>
                </div>
                <div>
                  Your Profit: <span className='text-gray-700 font-semibold'>{selectedProduct.sellerProfit.toFixed(2)} TND</span>
                </div>
                {selectedProduct.frontDesignId && selectedProduct.backDesignId && (
                <div>
                  Extra design selected : <span className='text-gray-700 font-semibold'>+ 5 TND</span>
                </div>
                 )}

              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid gap-4 py-4">
              {/* First Row: New Title */}
              <div className="grid grid-cols-1 lg:grid-cols-4 items-center gap-4">
                <Label htmlFor="productTitle" className="text-left lg:col-span-1">
                  New Title
                </Label>
                <Input
                  id="productTitle"
                  defaultValue={selectedProduct.title}
                  onChange={(e) => setnewTitle(e.target.value)}
                  maxLength={30}
                  placeholder="Choose a new title"
                  className="col-span-1 lg:col-span-3"
                />
              </div>

              {/* Second Row: Change Collection */}
              <div className="grid grid-cols-1 lg:grid-cols-4 items-center gap-4">
                <Label htmlFor="selectedCollection" className="text-left lg:col-span-1">
                  Change Collection
                </Label>
                <Select
                  defaultValue={selectedProduct.collectionName!}
                  onValueChange={handleSelectChange}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Select a collection" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Collections</SelectLabel>
                      {collections.map((collection , index) => (
                        <SelectItem key={index} value={collection.name}>
                          {collection.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

            </div>

            <AlertDialogFooter>
              <AlertDialogCancel className='w-20' onClick={()=>{                      
              setnewTitle("")
              setSelectedCollection("")
              setIsEditOpen(false)}}>Cancel</AlertDialogCancel>
              <AlertDialogAction className='w-20'
                disabled={newTitle === "" || selectedCollection === undefined}
                onClick={() => handleSave(selectedProduct.id)}
              >
                Save
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete product */}
        <AlertDialog open={isDeleteOpen}>
        <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
        <AlertDialogHeader className="flex flex-col items-center">
              <div className="text-red-500 mb-2">
                <OctagonAlert className='' />
              </div>
              <AlertDialogTitle className="text-xl font-bold text-center">
                Are you absolutely sure you want to delete your product?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
                It will permanently remove your product from our MarketPlace.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={()=>setIsDeleteOpen(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDelete(selectedProduct.id)}
                className='bg-red-500 hover:bg-red-500'
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </>        
        )}

<LoadingState isOpen={open} />


                            </>
  
  );
};

export  default ProductView ;

