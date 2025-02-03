/* eslint-disable @next/next/no-img-element */
'use client'  
import Pica from 'pica';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import NextImage from 'next/image'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { useToast } from '@/components/ui/use-toast'
import {  useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';


import { useRouter } from 'next/navigation';
import { CircleCheckBig, CircleDollarSign, FolderPen, Loader, Tags } from 'lucide-react';
import { SingleImageDropzone } from '@/components/sellerDashboard/SingleImageDropzone';
import { addDesignToDb } from './actions';
import { Platform, Store } from "@prisma/client"
import path from "path"
import { storage } from "@/firebase/firebaseConfig"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"



interface ProductViewProps {
  platform : Platform
  store : Store
}


const CreateDesignView = ({platform , store}: ProductViewProps) => {  


    const { toast } = useToast()
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB



  const [isDesignUploaded , setisDesignUploaded] = useState(false)
  const [file, setFile] = useState<File | null>();
  const [isAdding , setisAdding] =useState(false)
  const [designwidth, setdesignwidth] = React.useState<number>(0);
  const [designheight, setdesignheight] = React.useState<number>(0);
  const [designName , setName ] = React.useState<string>("");
  const [designPrice , setDesignPrice] = useState(0) 
  const  sellerProfit =  designPrice - platform.platformDesignProfit
  const [tags, setTags] = useState<string[]>([]);
  const [inputTag, setInputTag] = useState('');


  const router = useRouter();

                    // check seller profit 
                    const [sellerProfitError, setSellerProfitError] = useState('');
                    const inputClassName = sellerProfitError ? 'border-red-500' : (designPrice ? 'border-green-500' : '');
                    const handleSellerProfitBlur = () => {
                      if (designPrice > platform.maxDesignSellerProfit || designPrice < platform.platformDesignProfit + 1 ) {
                        setSellerProfitError(`Max Design Price is ${platform.maxDesignSellerProfit} TND and Min is ${platform.platformDesignProfit + 1} TND!`);
                      } else {
                        setSellerProfitError('');
                      }
                    };


        // Function to handle deign upload
      const handleFileChange = (file : File) => {
        if (file) {
          if (file.size > MAX_FILE_SIZE) {
            toast({
              title: 'File size exceeds the limit.',
              description: 'Please choose a file equal or smaller than 5MB.',
              variant: 'destructive',
            });
            setFile(null)
            return
          } else {
            setisDesignUploaded(true)            
            const reader = new FileReader();

            reader.onload = (e) => {
              if (e.target) {
                const image = new Image();
                image.onload = () => {
                  const { width, height } = image;
                  if (width >= 1000 && width <= 4000 && height >= 1000 && height <= 4000) {
                    setdesignwidth(width);
                    setdesignheight(height);
                  }
                  else {
                    setisDesignUploaded(false)            
                    setFile(null)
                    toast({
                      title: 'Invalid front design dimensions.',
                      description: 'Please upload a design with width and height between 1000px and 4000px.',
                      variant: 'destructive',
                    });
                    return

                  }
                };
                image.src = e.target.result as string;
              }
            };
      
            reader.readAsDataURL(file);
          }
        }
      };





    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(event.target.value);
        setDesignPrice(newValue);
    };

    

    const [openDialog, setOpenDialog] = useState(false);






          // tag code
            const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
              setInputTag(e.target.value);
                  };

           const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (inputTag.trim() !== '' && tags.length < 10) {
                const newTag = inputTag.trim();
                if (!tags.includes(newTag) && newTag.length <= 10) {
                  setTags([...tags, newTag]);
                }
                setInputTag('');
              }
            }
          };
          const handleTagClick = (tagToRemove:string) => {
            setTags(tags.filter((tag) => tag !== tagToRemove));
          };


          const uploadDesign = async (file: File) => {
            const pica = new Pica();

            const designNameWithoutExt = path.parse(file.name).name;
            const storageRef = ref(storage, `sellers/stores/${store.storeName}/designs/${designNameWithoutExt}-${Date.now()}.png`);
            let downloadURL

            try {

              if (file.size >= (2 * 1024 * 1024)) {

               // Create an image element
               const img = new Image();
               img.src = URL.createObjectURL(file);
               
               // Wait for the image to load
               await new Promise<void>((resolve) => {
                 img.onload = () => resolve();
               });
           
               // Create a canvas for resizing
               const canvas = document.createElement('canvas');
               const targetWidth = 1000; // Set your desired width
              //  const targetHeight = (img.height / img.width) * targetWidth; // Maintain aspect ratio
               const targetHeight = 1000
               canvas.width = targetWidth;
               canvas.height = targetHeight;
           
               // Use Pica to resize the image
               await pica.resize(img, canvas);
           
               // Convert the canvas to a Blob
               const optimizedBlob = await new Promise<Blob>((resolve, reject) => {
                 canvas.toBlob((blob) => {
                   if (blob) {
                     resolve(blob); // Resolve with the Blob
                   } else {
                     reject(new Error('Failed to convert canvas to Blob')); // Reject if null
                   }
                 }, 'image/png', 1); // Adjust quality (0.9 = 90%)
               })



              const snapshot = await uploadBytes(storageRef, optimizedBlob);
              downloadURL = await getDownloadURL(snapshot.ref);

              }else {
                const snapshot = await uploadBytes(storageRef, file);
                downloadURL = await getDownloadURL(snapshot.ref);
               }
    



              if(downloadURL) {
                  return downloadURL
              }
            } catch (error) {
              console.error("Error uploading design:", error);
              toast({
              title: 'Upload Error',
              description: 'Error uploading the image!',
              variant: 'destructive',
              });              
            }
          }

    
    
    
    
    
    
          const handleAddClick = async () => {
            if (!file) {
              console.log('No file selected.');
              toast({
                title: 'No Uploaded Design Found',
                description: 'Please try again.',
                variant: 'destructive',
            });
              return;
            }
          
            try {
              setOpenDialog(true)
              setisAdding(true)
      
              if(inputTag != "") {
                tags.push(inputTag)
              }
      
              const designPath = await uploadDesign(file)
      
              // Check if success
              if (designPath) {
                await addDesignToDb(store ,designPath , designwidth , designheight , designName , designPrice ,sellerProfit, tags  );
                toast({
                  title: 'Design Was Successfully Added',
                  description: 'Refrech the page.',
                  variant: 'default',
                });
                router.push("/sellerDashboard/designs")
              } else {
                setisAdding(false)
                setOpenDialog(false)
                toast({
                  title: 'Something went wrong',
                  description: 'There was an error on our end. Please try again.',
                  variant: 'destructive',
              });
              }
              
            } catch (e) {
              setisAdding(false)
              setOpenDialog(false)
              // Handle network errors or other exceptions
              console.error('Error during file upload:', e)
              toast({
                title: 'Something went wrong',
                description: 'There was an error on our end. Please try again.',
                variant: 'destructive',
            });
            }
          }













  return (

    <>
      <p className="text-sm text-muted-foreground mb-2">SellerDashboard/Create Design</p>
        <h1 className="text-2xl font-semibold">Create Designs</h1>


              <div className='relative mt-5 grid grid-cols-1  mb-20 pb-20'>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:grid-cols-1">


                <Card x-chunk="dashboard-05-chunk-3" className={cn(' lg:rounded-2xl shadow-lg')}>
                        <CardHeader className="px-5">
                        </CardHeader>
                        <CardContent className="items-center space-y-6 grid" >                          
                        <div className="space-y-2">
                        <h3>1-Upload a Design:</h3>
                        <p className="text-xs text-zinc-500 ml-5">PNG, JPG, JPEG max (5MB)</p>
                        <p className="text-xs text-zinc-500 ml-5">recommended (3000px*3000px)</p>

                        <div className="flex justify-center">
                          <SingleImageDropzone
                            className="border border-blue-800"
                            width={200}  
                            height={200}  
                            value={file!}  
                            onChange={(file) => {  
                              setFile(file);  
                              if (file) { 
                                handleFileChange(file);
                              }
                              else setisDesignUploaded(false);
                            }}
                          />
                        </div>
                      </div>

                              <>
                              <h3>2-Fill Design Details:</h3>
                              <div className="ml-5 mt-3 text-blue-800">

                              <div className='flex'>
                                <FolderPen className="h-4 w-4"/>
                                <Label className='ml-2'>Design Name*:</Label>
                              </div>
                              <div className="mt-4 mb-4">
                                <Input  
                                onChange={(e) => setName(e.target.value)}
                                disabled={!isDesignUploaded} 
                                required maxLength={15} 
                                className='border-blue-600 text-black bg-gray-100' 
                                placeholder='Add a unique name' 
                                type='text'/>
                              </div>

                            {/* tags */}
                            <div>
                            <div className='flex items-center'>
                              <Tags className='h-4 w-4' />
                              <Label className='ml-2'>Tags: <p className='text-xs text-zinc-500'>(optional)</p></Label>
                              <p className='text-xs text-zinc-500 ml-5'>Click enter to Add tags !</p>
                            </div>
                            <div className='mt-4 mb-4'>
                              <Input
                                disabled={!isDesignUploaded}
                                required
                                className='border-blue-600 text-black bg-gray-100'
                                placeholder='Hit enter to Add tags | max (10)'
                                type='text'
                                value={inputTag}
                                onChange={handleInputChange}
                                onKeyDown={handleInputKeyDown}
                              />
                            </div>
                            <div>
                              {tags.length > 0 && (
                            <p className='text-xs text-zinc-500 ml-5'>Click On the tag to remove it!</p>
                              )}
                              {tags.map((tag, index) => (
                                <div
                                  key={index}
                                  className='inline-block bg-gray-200 rounded-2xl px-2 mb-4 py-1 m-1 cursor-pointer'
                                  onClick={() => handleTagClick(tag)}
                                >
                                  {tag}
                                </div>
                              ))}
                            </div>
                          </div>


                              <div className='flex'>
                                <CircleDollarSign className="h-4 w-4"/>
                                <Label className='ml-2'>Design Price*:</Label>
                                {designPrice <= platform.maxDesignSellerProfit && designPrice >= platform.platformDesignProfit + 1 && (
                                  <>
                                <p className='text-xs text-zinc-500 ml-5'>Design Price: ( {designPrice.toFixed(2)} TND )</p>
                                <p className='text-xs text-zinc-500 ml-5'>Your Profit: ( {sellerProfit.toFixed(2)} TND  )</p>
                                </>
                              )}
                              </div>                              
                              <div className="mt-4 mb-4">
                                <Input 
                                onBlur={handleSellerProfitBlur}
                                onChange={handlePriceChange} 
                                disabled={!isDesignUploaded}
                                placeholder={`Max ${platform.maxDesignSellerProfit} TND | Min ${platform.platformDesignProfit + 1} TND`}
                                min={platform.platformDesignProfit + 1}
                                max={platform.maxDesignSellerProfit}
                                className={`${inputClassName}  text-black bg-gray-100 focus:ring-0 focus:border-green-500`}
                                type='number'/>
                               {sellerProfitError && (
                                  <p className="text-xs text-red-500 my-2">
                                    {sellerProfitError}
                                  </p>
                                )}
                              </div>
                              </div>

                              </>
                        </CardContent>
                        <CardFooter className="flex items-center space-x-4 justify-center">

                              {/* The AlertDialog component */}
                        <AlertDialog open={openDialog} >
                        <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
                        <AlertDialogHeader className="flex flex-col items-center">
                            <AlertDialogTitle className="text-xl text-blue-700 font-bold text-center">
                            Saving Your Design!
                              </AlertDialogTitle>
                              <AlertDialogDescription className="flex flex-col items-center">
                                This will take a moment.
                                {/* Replace Loader with your loader component */}
          <Loader className="text-blue-700 h-[30%] w-[30%] animate-spin mt-3" />
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                          </AlertDialogContent>
                        </AlertDialog>


                        <Button
                          loadingText="Adding"
                          size='default'
                          isLoading={isAdding}
                          disabled={isAdding || !isDesignUploaded || 
                            designName==="" || designPrice > platform.maxDesignSellerProfit || designPrice < platform.platformDesignProfit + 1 || !designPrice}
                          onClick={handleAddClick}>
                          Add To Store
                          <span className="ml-1"><CircleCheckBig/></span>
                        </Button>
                      </CardFooter>
                      </Card>         

                              </div>
                            </div>
                            

                            </>
  
  );
};

export  default CreateDesignView ;

