/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
'use client'  // Indicates this file is a client-side component in Next.js
import Pica from 'pica';

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
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
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
import { Rnd } from 'react-rnd';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup } from '@headlessui/react';
import { Input } from '@/components/ui/input';
import React from 'react';
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"


import { useRouter } from 'next/navigation';
import { Check, CircleCheckBig, CircleDollarSign, FileText, FolderPen, Link, Loader, Tags } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toPng } from 'html-to-image';
import { SingleImageDropzone } from '@/components/sellerDashboard/SingleImageDropzone';
import { addProductToDb, addProductToDbB, addProductToDbF } from './actions';
import { Category, Color, Size, FrontBorder, BackBorder, Collection, Platform, Store, Product } from "@prisma/client"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage } from "@/firebase/firebaseConfig"
import path from "path"
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Slider } from "@/components/ui/slider";
import LoadingLink from '@/components/LoadingLink';


type SelectedColorsState = {
  [colorLabel: string]: boolean; // Use string index signature to represent color labels as keys with boolean values
};

interface fetchedCat extends Category {
  colors : Color[]
  sizes : Size[]
  frontBorders : FrontBorder[]
  backBorders : BackBorder[]
}

interface ExtraCollection extends Collection {
  products : Product[]
}


interface ProductViewProps {
    categories : fetchedCat[]
    platform : Platform
    store :Store
    collections : ExtraCollection[]

}

const CreateProductView = ({categories , platform , store ,  collections}: ProductViewProps) => {  

  const { toast } = useToast()
  const router = useRouter();


  const [selectedCollection, setSelectedCollection] = useState(collections[0]);

  // Handle change of selection
  const handleSelectChange = (value: string) => {
    // Find the collection matching the value string
    const matchingCollection = collections.find(
      (collection) => collection.name === value
    );

    // If a matching collection is found, set it as the selected collection
    if (matchingCollection) {
      setSelectedCollection(matchingCollection);
    } else {
      toast({
        title: "Collection not found",
        description: `No collection matches the name "${value}".`,
        variant : "destructive"
      });
    }
  };


  const [selectedP, setSelectedProduct] = useState(categories[0])
  const [selectedCat, setSelectedCat] = React.useState<number | null>(null);
  const [CatColors, setCatColors] = React.useState<Color[]>([]);

  // to capture the mockups
  const FrontcontainerRef= useRef<HTMLDivElement>(null)
  const BackcontainerRef= useRef<HTMLDivElement>(null)


  const [isBorderHidden, setIsBorderHidden] = useState(true);
  const [isBackBorderHidden, setisBackBorderHidden] = useState(true);


  const [selectedCatColors, setselectedCatColors] = useState<Color>(); // to change the category colors
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  // design  width and height
  const [Frontwidth, setFrontwidth] = React.useState<number>(3000);
  const [Frontheight, setFrontheight] = React.useState<number>(3000);
  const [Backwidth, setBackwidth] = React.useState<number>(3000);
  const [Backheight, setBackheight] = React.useState<number>(3000);

  
    // slider : setSliderValue
    const [frontSliderValue, setFrontSliderValue] = useState(50)
    const handleFrontSliderChange = (value: number[]) => {
      setFrontSliderValue(value[0]);
    };
  
      // slider : setSliderValue
      const [backSliderValue, setBackSliderValue] = useState(50)
      const handleBackSliderChange = (value: number[]) => {
        setBackSliderValue(value[0]);
      };

  const [selectedFrontDesign, setselectedFrontDesign] = useState<string>("");
  const [selectedBackDesign, setselectedBackDesign] = useState<string>("");



  
  const [isDesignUploaded , setisDesignUploaded] = useState(false)
  const [isBackDesignUploaded , setisBackDesignUploaded] = useState(false)

  // switch
  const [addFrontDesign, setAddFrontDesign] = useState(true);
  const [addBackDesign, setAddBackDesign] = useState(false);
  const [privateProduct, setPrivateProduct] = useState(false);

  // Product Data
  const [productTitle , setTitle ] = React.useState<string>("");
  const [productDescription , setDes ] = React.useState<string>("");
  const [selectedColors, setSelectedColors] = React.useState<SelectedColorsState>({});
  const [sellerProfit , setSellerProfit] = useState(0) 
  const [BasePrice , setBasePrice] = useState(0) 
  const [tags, setTags] = useState<string[]>([]);
  const productPrice = BasePrice + sellerProfit + (addFrontDesign && addBackDesign ? platform.ExtraDesignForProductPrice : 0);
  const checkedColors = getSelectedColors(selectedColors);
  const filteredColors = CatColors.filter(color => checkedColors.includes(color.label));
  // to save tags
  const [inputTag, setInputTag] = useState('');


  const [FrontDesignFile, setFrontDesignFile] = useState<File>();
  const [BackDesignFile, setBackDesignFile] = useState<File>();

  // for the add design button
  const [isAdding , setisAdding] =useState(false)
  const isAnyColorSelected = hasAnyTrue(selectedColors);



  // dahsed border dimentions:
  // front :
  const [frontBorderTop , setfrontborderTop] = useState("")
  const [frontBorderBottom , setfrontBorderBottom] = useState("")
  const [frontBorderRight , setfrontBorderRight] = useState("")
  const [frontBorderLeft , setfrontBorderLeft] = useState("")
  // Back :
  const [backBorderTop , setbackborderTop] = useState("")
  const [backBorderBottom , setbackBorderBottom] = useState("")
  const [backBorderRight , setbackBorderRight] = useState("")
  const [backBorderLeft , setbackBorderLeft] = useState("")




                      
  const [openDialog, setOpenDialog] = useState(false);






  // function to detect if the user select at least one color for his product
  function hasAnyTrue(flags: SelectedColorsState): boolean {
    return Object.values(flags).some(value => value === true);
  }

  // function to get the checked colors 
  function getSelectedColors(flags: SelectedColorsState): string[] {
    const selectedColors: string[] = [];
    Object.entries(flags).forEach(([color, isSelected]) => {
      if (isSelected) {
        selectedColors.push(color);
      }
    });
    return selectedColors;
  }





  const handleCatClick = (index: number, category: fetchedCat) => {
    if (category.disableCategory) {
      toast({
        title: "This category is unavailable for now !",
        variant: "destructive",
      });
      return; // Prevent further execution
    }
  
    // Border for front design
    setfrontborderTop(category.frontBorders[0].value);
    setfrontBorderBottom(category.frontBorders[1].value);
    setfrontBorderRight(category.frontBorders[2].value);
    setfrontBorderLeft(category.frontBorders[3].value);
  
    // Border for back design
    setbackborderTop(category.backBorders[0].value);
    setbackBorderBottom(category.backBorders[1].value);
    setbackBorderRight(category.backBorders[2].value);
    setbackBorderLeft(category.backBorders[3].value);
  
    setCatColors(category.colors);
    setBasePrice(category.price);
    setSelectedColors({});
    setSelectedProduct(category);
    setselectedCatColors(category.colors[0]);
    setSelectedCat((prevState) => (prevState === index ? null : index));
  };
  



    function toggleFrontBorder() {
      setIsBorderHidden((prev) => !prev);
    }

    function toggleBackBorder() {
      setisBackBorderHidden((prev) => !prev);
    }



  // Function to handle Front file upload
const handleFileChange = (file : File) => {
  if (file) {
    if (file.size > MAX_FILE_SIZE) {
      setFrontDesignFile(undefined)
      toast({
        title: 'File size exceeds the limit.',
        description: 'Please choose a file equal or smaller than 5MB.',
        variant: 'destructive',
      });

    } else {
      setisDesignUploaded(true)

      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target) { 

          const dataUrl = e.target.result as string;
          const image = new Image();

          image.onload = () => {
            const { width, height } = image;
            if (width >= 1000 && width <= 4000 && height >= 1000 && height <= 4000) {
              setFrontwidth(width);
              setFrontheight(height);
              setIsBorderHidden(false);
              setselectedFrontDesign(dataUrl);
            }else {
              setisDesignUploaded(false)
              setIsBorderHidden(true);
              setselectedFrontDesign("");
              setFrontDesignFile(undefined)
              toast({
                title: 'Invalid front design dimensions.',
                description: 'Please upload a design with width and height between 1000px and 4000px.',
                variant: 'destructive',
              });
              return

            }

          };

          image.src = dataUrl;
        }
      };
      reader.readAsDataURL(file);

      

    }
  }
  
};

  // Function to handle Back file upload
  const handleBackFileChange = (file : File) => {
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setBackDesignFile(undefined)
        toast({
          title: 'File size exceeds the limit.',
          description: 'Please choose a file equal or smaller than 5MB.',
          variant: 'destructive',
        });
  
      } else {
        setisBackDesignUploaded(true)
  
        const reader = new FileReader();
  
        reader.onload = (e) => {
          if (e.target) { 
  
            const dataUrl = e.target.result as string;
            const image = new Image();
  
            image.onload = () => {
              const { width, height } = image;

            // Check if width and height are within the valid range
            if (width >= 1000 && width <= 4000 && height >= 1000 && height <= 4000) {
              setBackwidth(width);
              setBackheight(height);
              setisBackBorderHidden(false);
              setselectedBackDesign(dataUrl);
            } else {
              setisBackDesignUploaded(false)
              setisBackBorderHidden(true);
              setselectedBackDesign("");
              setBackDesignFile(undefined);
              toast({
                title: 'Invalid back design dimensions.',
                description: 'Please upload a design with width and height between 1000px and 4000px.',
                variant: 'destructive',
              });
              return
            }
            };
  
            image.src = dataUrl;
          }
        };
        reader.readAsDataURL(file);
  
        
  
      }
    }
  };



    // Define the types for the options state
    const [options, setOptions] = useState<{
      color: typeof selectedP.colors[number];
      size: typeof selectedP.sizes[number];
    }>({
      color: selectedP.colors[0],
      size: selectedP.sizes[0],
    });
    

    const handleColorChange = (color :any ) => {
      setselectedCatColors(color);
    };

    
    // Define state to store checked colors
    const handleColorCheckboxChange = (colorLabel : string) => {
      setSelectedColors((prevSelectedColors) => ({
        ...prevSelectedColors,
        [colorLabel]: !prevSelectedColors[colorLabel], // Toggle the checkbox state
      }));
    };



      //switch 
    const handleFrontSwitchChange = () => {
      setAddFrontDesign(!addFrontDesign);
    };

    const handleBackSwitchChange = () => {
      setAddBackDesign(!addBackDesign);
    };

    const handlePrivateProductChange = () => {
      setPrivateProduct(!privateProduct);
    };






    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(event.target.value);
        setSellerProfit(newValue);
    };


    //tags :
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

  const removeExtension = (name : string) => {
    return name.replace(/\.png$/, '');
  }


                  const generateAllFrontProductFiles = async () => {
                    setIsBorderHidden(true);
                    const files = [] as File[]; 
                    const colors = [] as string[]

                    for (const color of filteredColors) {
                      const img = document.querySelector(".front-product") as HTMLImageElement;
                      if (img) {
                        img.src = color.frontImageUrl;
                      }
                      // get the url of the captured product with front design
                      const pixelRatio = 10; 
                      const dataUrl = await toPng(FrontcontainerRef.current!, { cacheBust: false, pixelRatio });
                      // get the file type from the url
                      const base64Data = dataUrl.split(',')[1]
                      const blob = base64ToBlob(base64Data, 'image/png')
                      const file = new File([blob], `${productTitle}.png`, { type: 'image/png' });
                      files.push(file)
                      colors.push(color.label)

                    }
                    return {files , colors}
                  }

                  const generateAllBackProductFiles = async () => {
                    setisBackBorderHidden(true)
                    const files = [] as File[]; 
                    const colors = [] as string[]

                    for (const color of filteredColors) {
                      const img = document.querySelector(".back-product") as HTMLImageElement;
                      if (img) {
                        img.src = color.backImageUrl;
                      }
                      // get the url of the captured product with front design
                      const pixelRatio = 10; 
                      const dataUrl = await toPng(BackcontainerRef.current!, { cacheBust: false, pixelRatio });
                      // get the file type from the url
                      const base64Data = dataUrl.split(',')[1]
                      const blob = base64ToBlob(base64Data, 'image/png')
                      const file = new File([blob], `${productTitle}.png`, { type: 'image/png' });
                      files.push(file)
                      colors.push(color.label)

                    }
                    return {files , colors}
                  }








              const uploadCapturedMockup = async (file: File) => {
                const pica = new Pica(); 
              
                try {
                  // Create an image element
                  const img = new Image();
                  img.src = URL.createObjectURL(file);
                  
                  // Wait for the image to load
                  await new Promise<void>((resolve) => {
                    img.onload = () => resolve();
                  });
              
                  // Create a canvas for resizing
                  const canvas = document.createElement('canvas');
                  const targetWidth = 800; // Set your desired width
                  const targetHeight = (img.height / img.width) * targetWidth; // Maintain aspect ratio
              
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
              
                  // Upload the optimized image
                  const storageRef = ref(storage, `sellers/stores/${store.storeName}/products/${productTitle}-${Date.now()}.png`);
                  const snapshot = await uploadBytes(storageRef, optimizedBlob);
                  const downloadURL = await getDownloadURL(snapshot.ref);
                  
                  if (downloadURL) {
                    return downloadURL;
                  }
                } catch (error) {
                  console.error('Error uploading image:', error);
                  toast({
                    title: 'Upload Failed',
                    description: 'There was an error uploading the product image. Please try again.',
                  });
                  throw error; // Optionally re-throw the error if needed
                }
              };

              
              const uploadAllCapForFront = async () => {
                setIsBorderHidden(true);
                const paths = [] as string[]; // Array to store all the captured product paths
                const colors = [] as string[]
                for (const color of filteredColors) {
                  // Set the image source to the current color's front image URL
                  const img = document.querySelector(".front-product") as HTMLImageElement;
                    if (img) {
                      img.src = color.frontImageUrl;
                    }
                  // get the url of the captured product with front design
                  const pixelRatio = 10; 
                  const dataUrl = await toPng(FrontcontainerRef.current!, { cacheBust: false, pixelRatio });
    
                  // get the file type from the url
                  const base64Data = dataUrl.split(',')[1]
                  const blob = base64ToBlob(base64Data, 'image/png')
                  const file = new File([blob], `${productTitle}.png`, { type: 'image/png' });
                  // upload the captured product in the uploads folder and get the path 
                  const CapturedProductPath = await uploadCapturedMockup(file)
                  paths.push(CapturedProductPath ?? ""); // Store the path in the array
                  colors.push(color.label)
                };
                return { frontPaths: paths.filter(path => path !== ""), colors: colors };
              };   
              
               // Function to map over filteredColors and upload each cat color and return the list of paths
               const uploadAllCapForBack = async () => {
                setIsBorderHidden(true);
                const paths = [] as string[]; // Array to store all the captured product paths
                const colors = [] as string[]
                for (const color of filteredColors) {
                  // Set the image source to the current color's front image URL
                  const img = document.querySelector(".back-product") as HTMLImageElement;
                    if (img) {
                      img.src = color.backImageUrl;
                    }
                  // get the url of the captured product with front design
                  const pixelRatio = 10; 
                  const dataUrl = await toPng(BackcontainerRef.current!, { cacheBust: false, pixelRatio });
    
                  // get the file type from the url
                  const base64Data = dataUrl.split(',')[1]
                  const blob = base64ToBlob(base64Data, 'image/png')
                  const file = new File([blob], `${productTitle}.png`, { type: 'image/png' });
                  // upload the captured product in the uploads folder and get the path 
                  const CapturedProductPath = await uploadCapturedMockup(file)
                  paths.push(CapturedProductPath ?? ""); // Store the path in the array
                  colors.push(color.label)
    
                };
                return {backPaths : paths.filter(path => path !== "") , colors : colors}
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
        

                //save Product with Both Design:
                const SaveBothDesign = async () =>{
                  if (!FrontDesignFile || !BackDesignFile) {
                    toast({
                      title: 'No uploaded designs found',
                      description: 'please make sure to upload both front and back desing.',
                      variant: 'destructive',
                    });
                    return
                  }

                  try {
                    
                    setOpenDialog(true)
                    setisAdding(true)
                    setIsBorderHidden(true)
                    setisBackBorderHidden(true)

                    if(inputTag != "") {
                      tags.push(inputTag)
                    }

                    // upload the front design in the uploads folder and get the path
                    const frontdesignPath = await uploadDesign(FrontDesignFile)
                    const frontDesignName = removeExtension(FrontDesignFile.name)

                    // upload the back design in the uploads folder and get the path
                    const backdesignPath = await uploadDesign(BackDesignFile)
                    const backDesignName = removeExtension(BackDesignFile.name)

                    
                    // upload the captured product with its colors variant in the uploads folder 
                    // and get the path for each color variant 
                    const res = await uploadAllCapForFront();
                    const {backPaths} = await uploadAllCapForBack();

                    // Check if frontPaths and colors are non-empty arrays and contain non-empty strings
                    const hasValidFrontPaths = Array.isArray(res.frontPaths) && res.frontPaths.every(path => path.trim() !== '');
                    const hasValidbackPaths = Array.isArray(backPaths) && backPaths.every(path => path.trim() !== '');
                    const hasValidColors = Array.isArray(res.colors) && res.colors.every(color => color.trim() !== '');
                   
                    if (!hasValidbackPaths || !hasValidFrontPaths || !hasValidColors || !frontdesignPath || !backdesignPath) {
                      setOpenDialog(false)
                      setisAdding(false)
                    toast({
                    title: 'Error',
                    description: 'Failed to add your product. Please try again later.',
                    variant: 'destructive',
                    });
                    return
                    }

                    const result = await addProductToDb(store.id,selectedP.label,res.colors,
                    res.frontPaths,backPaths,
                    productTitle,productDescription,tags,productPrice,BasePrice,sellerProfit,
                    frontDesignName,Frontwidth,Frontheight,frontdesignPath!,
                    backDesignName,Backwidth,Backheight,backdesignPath! , selectedCollection , privateProduct)
  
                    if(result.success){
                      toast({
                        title: 'Great!',
                        description: 'Product added successfully.',
                        variant: 'default',
                      }); 
                      //push to product page
                      router.push("/sellerDashboard/products")
                      return                 
                    }
                    if(result.error){
                      setOpenDialog(false)
                      toast({
                        title: 'Error',
                        description: 'Failed to add product. Please try again later.',
                        variant: 'destructive',
                      });
                      setisAdding(false)
                      return
                    }
                    
                  } catch (error) {
                    setisAdding(false)
                    setOpenDialog(false)
                    console.log(error)
                    toast({
                      title: 'Error',
                      description: 'Failed to add product. Please try again later.',
                      variant: 'destructive',
                    });
                    return
                  } 

                }

                //save Product with Front Design:
                const SaveFrontDesign = async () =>{
                  if (!FrontDesignFile) return;

                try {
                  setOpenDialog(true)
                  setIsBorderHidden(true)
                  setisAdding(true)

                  if(inputTag != "") {
                    tags.push(inputTag)
                  }

                  // upload the front design in the uploads folder and get the path
                  const frontdesignPath = await uploadDesign(FrontDesignFile)
                  const frontDesignName = removeExtension(FrontDesignFile.name)

                  
                  // upload the captured product with its colors variant in the uploads folder 
                  // and get the path for each color variant 
                  const res = await uploadAllCapForFront();

                    // Check if frontPaths and colors are non-empty arrays and contain non-empty strings
                    const hasValidFrontPaths = Array.isArray(res.frontPaths) && res.frontPaths.every(path => path.trim() !== '');
                    const hasValidColors = Array.isArray(res.colors) && res.colors.every(color => color.trim() !== '');

                    if (!hasValidFrontPaths || !hasValidColors || !frontdesignPath) {
                      setOpenDialog(false)
                    setisAdding(false)
                    toast({
                      title: 'Error',
                      description: 'Failed to add your product. Please try again later.',
                      variant: 'destructive',
                    });
                    return
                    }

                  const result = await addProductToDbF(store.id,selectedP.label,res.colors,res.frontPaths,
                  productTitle,productDescription,tags,productPrice,BasePrice,sellerProfit,
                  frontDesignName,Frontwidth,Frontheight,
                  frontdesignPath! , selectedCollection , privateProduct)

                  if(result.success) {
                    toast({
                      title: 'Great!',
                      description: 'Product added successfully.',
                      variant: 'default',
                    }); 
                    //push to product page
                    router.push("/sellerDashboard/products")
                    return                 
                  }
                  if(result.error){
                    setOpenDialog(false)
                    setisAdding(false)
                    toast({
                      title: 'Error',
                      description: 'Failed to add your product. Please try again later.',
                      variant: 'destructive',
                    });
                    console.log(result.error)
                    return
                  }
                  
                } catch (error) {
                  console.log(error)
                  setOpenDialog(false)
                  setisAdding(false)
                  toast({
                    title: 'Error',
                    description: 'Failed to add product. Please try again later.',
                    variant: 'destructive',
                  });
                  return
                }
                }

                //save Product with Back Design:
                const SaveBackDesign = async () =>{
                  if (!BackDesignFile) return;

                  try {
                    setOpenDialog(true)
                    setisBackBorderHidden(true)
                    setisAdding(true)

                    if(inputTag != "") {
                      tags.push(inputTag)
                    }

                    // upload the front design in the uploads folder and get the path
                    const backdesignPath = await uploadDesign(BackDesignFile)
                    const backDesignName = removeExtension(BackDesignFile.name)

                    // upload the captured product with its colors variant in the uploads folder 
                    // and get the path for each color variant 
                    const res = await uploadAllCapForBack();


                    // Check if frontPaths and colors are non-empty arrays and contain non-empty strings
                    const hasValidbackPaths = Array.isArray(res.backPaths) && res.backPaths.every(path => path.trim() !== '');
                    const hasValidColors = Array.isArray(res.colors) && res.colors.every(color => color.trim() !== '');
                   
                    if (!hasValidbackPaths || !hasValidColors || !backdesignPath) {
                      setOpenDialog(false)
                    setisAdding(false)
                    toast({
                    title: 'Error',
                    description: 'Failed to add your product. Please try again later.',
                    variant: 'destructive',
                    });
                    return
                    }

                    const result = await addProductToDbB(store.id,selectedP.label,res.colors,res.backPaths,
                    productTitle,productDescription,tags,productPrice,BasePrice,sellerProfit,
                    backDesignName,Backwidth,Backheight,
                    backdesignPath! , selectedCollection , privateProduct)
  
                    if(result.success){
                      toast({
                        title: 'Great!',
                        description: 'Product added successfully.',
                        variant: 'default',
                      }); 
                      //push to product page
                      router.push("/sellerDashboard/products")
                      return                 
                    }
                    if(result.error){
                      setOpenDialog(false)
                      setisAdding(false)
                      toast({
                        title: 'Error',
                        description: 'Failed to add product. Please try again later.',
                        variant: 'destructive',
                      });
                      return
                    }
                    
                  } catch (error) {
                    setOpenDialog(false)
                    setisAdding(false)
                    console.log(error)
                    toast({
                      title: 'Error',
                      description: 'Failed to add product. Please try again later.',
                      variant: 'destructive',
                    });
                    return
                  }

                }


              // function to transform base64 To Blob to get the file from blob
              function base64ToBlob(base64: string, mimeType: string) {
                const byteCharacters = atob(base64)
                const byteNumbers = new Array(byteCharacters.length)
                for (let i = 0; i < byteCharacters.length; i++) {
                  byteNumbers[i] = byteCharacters.charCodeAt(i)
                }
                const byteArray = new Uint8Array(byteNumbers)
                return new Blob([byteArray], { type: mimeType })
              }



     

                  // check seller profit 
                  const [sellerProfitError, setSellerProfitError] = useState('');
                  const inputClassName = sellerProfitError ? 'border-red-500' : (sellerProfit ? 'border-green-500' : '');
                  const handleSellerProfitBlur = () => {
                    if (sellerProfit > platform.maxProductSellerProfit || sellerProfit < 1 ) {
                      setSellerProfitError(`Max seller profit is ${platform.maxProductSellerProfit} TND and Min is 1 TND!`);
                    } else {
                      setSellerProfitError('');
                    }
                  };



  return (

    <>


                      {/* The AlertDialog component */}
                      <AlertDialog  open={openDialog}>
                      <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
                      <AlertDialogHeader className="flex flex-col items-center">
                              <div></div>
                              <AlertDialogTitle className="text-xl text-blue-700 font-bold text-center">
                                Saving Your Product!
                              </AlertDialogTitle>
                              <AlertDialogDescription className="flex flex-col items-center">
                                This will take a moment.
                                {/* Replace Loader with your loader component */}
          <Loader className="text-blue-700 h-[30%] w-[30%] animate-spin mt-3" />
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                          </AlertDialogContent>
                        </AlertDialog>




                        <p className="text-sm text-muted-foreground mb-2">SellerDashboard/Create Product</p>
                        <h1 className="text-2xl font-semibold">Create Product</h1>


              <div className='relative mt-5 grid grid-cols-1  mb-20 pb-20'>
                <div className="grid grid-cols-1  lg:grid-cols-2 gap-6 md:grid-cols-1">

                          {/* first card */}
                     <Card x-chunk="dashboard-05-chunk-3" className={cn(' lg:rounded-2xl shadow-lg')}>
                        <CardHeader className="py-2">
                        </CardHeader>
                        <CardContent className="items-center space-y-6 grid" >                          
                            <h3>1-Choose your Category:</h3>

                            {/* category selection */}
                             <div className="ml-5">
                             <Sheet>
                            <SheetTrigger asChild>
                              <Button variant="secondary">Select</Button>
                            </SheetTrigger>
                            <SheetContent side="bottom">
                              <SheetHeader>
                                <SheetTitle>Select Category</SheetTitle>
                                <SheetDescription>
                                </SheetDescription>
                              </SheetHeader>
                              <ScrollArea className="w-full h-96">
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1 bg-gray-900/5">
                                {categories.map((category, index) => (
                                  <Card onClick={() => handleCatClick(index, category)} 
                                    key={index} className={cn("border w-full", selectedCat === index && "border-primary")}>
                                    <CardContent className="flex flex-col items-center justify-center p-2">
                                      <NextImage
                                        width={900} 
                                        height={900}
                                        src={category.value!} 
                                        alt={category.label} 
                                        className="mb-2 w-full h-auto object-cover" 
                                      />
                                      <div className="flex flex-wrap justify-center gap-2">
                                        <Badge variant="secondary">{category.label}</Badge>
                                        <Badge variant="secondary">{category.price.toFixed(2)} TND</Badge>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                              </ScrollArea>
                              <SheetFooter>
                                <SheetClose asChild>
                                </SheetClose>
                              </SheetFooter>
                            </SheetContent>
                          </Sheet>

                              </div>


                              {selectedCat !== null && (
                              <>

                                 {/* Switch component front */}
                                  <div className="flex items-center mt-4 space-x-2">
                                <Switch disabled={isAdding} id="front" defaultChecked={addFrontDesign} onClick={handleFrontSwitchChange } />
                                <Label htmlFor="front">Add Front Design</Label>
                               </div>

                                {/* Switch component back */}
                              <div className="flex items-center mt-4 space-x-2">
                                <Switch disabled={isAdding} id="back" defaultChecked={addBackDesign} onClick={handleBackSwitchChange } />
                                <Label htmlFor="back">Add Back Design</Label>
                               </div>

                               {(addFrontDesign || addBackDesign)  && (
                                <>
                              <div className="space-y-2">
                                <h3>2-Upload a Design:</h3>
                                <p className="text-xs text-zinc-500 ml-5">PNG, JPG, JPEG max (5MB)</p>
                                <p className="text-xs text-zinc-500 ml-5">Recommended (3000px*3000px)</p>
                                <p className="text-xs text-zinc-500 ml-5">Acceptable range (1000px - 4000px)</p>
                                <div className="flex flex-wrap justify-center space-x-0 md:space-x-4 space-y-4 md:space-y-0">

                                  {/* front design input */}
                                  {addFrontDesign && (
                                    <div className="w-full sm:w-auto">
                                      <SingleImageDropzone
                                        disabled={isAdding}
                                        className="border border-blue-800 mx-auto"
                                        width={200}
                                        height={200}
                                        value={FrontDesignFile}
                                        onChange={(file) => {
                                          setFrontDesignFile(file);
                                          if (!file) {
                                            setIsBorderHidden(true);
                                            setisDesignUploaded(false);
                                            setselectedFrontDesign("");
                                          }
                                          if (file) {
                                            handleFileChange(file);
                                          }
                                        }}
                                      />
                                    </div>
                                  )}

                                  {/* back design input */}
                                  {addBackDesign && (
                                    <div className="w-full sm:w-auto">
                                      <SingleImageDropzone
                                        disabled={isAdding}
                                        className="border border-blue-800 mx-auto"
                                        width={200}
                                        height={200}
                                        value={BackDesignFile}
                                        onChange={(file) => {
                                          setBackDesignFile(file);
                                          if (!file) {
                                            setisBackBorderHidden(true);
                                            setisBackDesignUploaded(false);
                                            setselectedBackDesign("");
                                          }
                                          if (file) {
                                            handleBackFileChange(file);
                                          }
                                        }}
                                      />
                                    </div>
                                  )}

                                </div>
                              </div>



                              <h3>3-Select Your design Collection:</h3>

                              <Select value={selectedCollection.name} onValueChange={handleSelectChange}>
                                <SelectTrigger className="w-[180px]">
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






                                {/* select colors */}
                                <div className="space-y-2">
                        <h3>4-Select Your Product Colors:</h3>



                        <div className="w-full"> {/* Set full width to make the grid responsive */}
                          <ToggleGroup
                            type="multiple" // Allows selecting multiple colors
                            value={Object.keys(selectedColors).filter((label) => selectedColors[label])} // Set initial selected values
                            onValueChange={(value) => {
                              const updatedColors = value.reduce<Record<string, boolean>>((acc, label) => {
                                acc[label] = true;
                                return acc;
                              }, {});
                              setSelectedColors(updatedColors);
                            }}
                            className="grid grid-cols-2 sm:grid-cols-3 gap-2" // Responsive grid classes
                          >
                            {selectedP.colors.map((color: Color, index) => (
                              <ToggleGroupItem
                                key={color.label}
                                value={color.label} // Set the value for each item
                                className={`px-4 py-2 flex border-2 items-center space-x-2 rounded bg-gray-300 hover:bg-gray-200 text-black dark:text-white dark:bg-gray-800`}
                                onClick={() => handleColorCheckboxChange(color.label)} // Toggle color selection
                              >
                                {color.label}
                                {selectedColors[color.label] && (
                                  <Check
                                    className="w-4 h-4 ml-1"
                                    aria-hidden="true"
                                  />
                                )}
                              </ToggleGroupItem>
                            ))}
                          </ToggleGroup>
                        </div>
                      </div>


                                {/* Product details */}
                              <h3>5-Fill Product Details:</h3>
                              <div className="ml-5 mt-3 text-blue-800">

                              <div className='flex'>
                                <FolderPen className="h-4 w-4"/>
                                <Label className='ml-2'>Product Title*:</Label>
                              </div>
                              <div className="mt-4 mb-4">
                                <Input                 
                                onChange={(e) => setTitle(e.target.value)}              
                                disabled={(!isDesignUploaded && !isBackDesignUploaded)} 
                                maxLength={20}
                                className='border-blue-600 text-black bg-gray-100' 
                                placeholder='Add a unique name | max (20 characters)' 
                                type='text'/>
                              </div>
                              <div className='flex'>
                                <FileText className="h-4 w-4"/>
                                <Label className='ml-2'>Product Description*:</Label>
                              </div>                              
                              <div className="mt-4 mb-4">
                                <Input 
                                onChange={(e) => setDes(e.target.value)}
                                disabled={(!isDesignUploaded && !isBackDesignUploaded)} 
                                maxLength={62}
                                className='border-blue-600  text-black bg-gray-100' 
                                placeholder='Describe your design | max (62 characters)' 
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
                                disabled={(!isDesignUploaded && !isBackDesignUploaded)}
                                required
                                maxLength={10}
                                className='border-blue-600 text-black bg-gray-100'
                                placeholder='Hit enter to add | max (10) | min (1Tag)'
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
                                <Label className='ml-2'>Your Profit*:</Label>
                                <p className='text-xs text-zinc-500 ml-5'>Product Base Price: ( {BasePrice.toFixed(2)} TND )</p>
                              </div>                              
                              <div className="mt-4 mb-4">
                                <Input 
                                onChange={handlePriceChange} 
                                disabled={(!isDesignUploaded && !isBackDesignUploaded)}
                                placeholder={`Max ${platform.maxProductSellerProfit} TND | Min 1 TND`}
                                onBlur={handleSellerProfitBlur}
                                min={1}
                                max={platform.maxProductSellerProfit}
                                className={`${inputClassName}  text-black bg-gray-100 focus:ring-0 focus:border-green-500`}
                                type='number'/>
                                 {sellerProfitError && (
                                  <p className="text-xs text-red-500 my-2">
                                    {sellerProfitError}
                                  </p>
                                )}
                              </div>
                              {sellerProfitError === "" && sellerProfit <= platform.maxProductSellerProfit && sellerProfit >= 1 && (
                              <div className='flex'>
                                <Label className='ml-2 font-bold'>Product Final Price: ( {productPrice.toFixed(2)} TND )</Label>
                                <p className='text-xs text-zinc-500 ml-5'>Your Profit: ( {sellerProfit.toFixed(2)} TND )</p>
                              </div>
                                 )}


                                 {/* line */}
                                 <div className="border-t text-zinc-500 mt-8"/>
                                <div className="flex items-center mt-4 space-x-2">
                                <Switch disabled={isAdding} id="front" defaultChecked={privateProduct} onClick={handlePrivateProductChange } />
                                <Label htmlFor="front">Private Product : {privateProduct ? "Yes" : "No"}</Label>
                               </div>
                               <p className="text-zinc-500 text-sm my-4">Private Products means 
                                that your products won't be available in the platform marketplace. 
                                Only you can create orders for this type of products!</p>
                              </div>
                              </>
                              )}

                              </>
                              )}

                        </CardContent>
                        <CardFooter className="flex items-center justify-center">


  



                          {/* add product with both front and back design button */}
                          {addFrontDesign === true && addBackDesign === true && selectedCat != null && (
                            <>
                              <div className="flex items-center flex-col justify-center">
                                <div className="mb-2">   
                                  <Button
                                    loadingText="Adding"
                                    className='text-white'
                                    size='default'
                                    isLoading={isAdding}
                                    disabled={
                                      productTitle.length === 0 || productTitle.length > 20 ||
                                      productDescription.length === 0 || 
                                      !isAnyColorSelected || FrontDesignFile===undefined 
                                      || BackDesignFile===undefined || 
                                      sellerProfit > platform.maxProductSellerProfit || sellerProfit < 1 || sellerProfit === 0 || !sellerProfit 
                                    }
                                    onClick={SaveBothDesign}
                                  >
                                    Add Product To Store
                                    <span className="ml-1"><CircleCheckBig /></span>
                                  </Button>
                                </div>
                                <div>
                                  <p className='text-xs text-zinc-500'>
                                    Both Designs Selected ! + extra {platform.ExtraDesignForProductPrice.toFixed(2)} TND
                                  </p>
                                </div>
                              </div>
                            </>
                          )}



                          {/* add product with front design button */}
                        {addFrontDesign === true && addBackDesign ===false && selectedCat!=null  && (
                        <>
                        <div className="flex items-center flex-col justify-center">
                          <div className="mb-2">
                            <Button
                              size='default'
                              className='text-white'

                              disabled={
                                productTitle.length === 0 || productTitle.length > 20 ||
                                productDescription.length === 0 || 
                                !isAnyColorSelected || FrontDesignFile===undefined || 
                                sellerProfit > platform.maxProductSellerProfit || sellerProfit < 1 || sellerProfit === 0  || !sellerProfit 
                              }
                              onClick={SaveFrontDesign}                         >
                                    Add Product To Store
                                    <span className="ml-1"><CircleCheckBig /></span>
                            </Button>
                          </div>
                          <div>
                            <p className='text-xs text-zinc-500'>
                              Front Design Selected !
                            </p>
                          </div>
                        </div>
                      </>

                        )}

                           {/* add product with back design button */}
                           {addFrontDesign === false && addBackDesign === true && selectedCat!=null  && (
                        <>
                        <div className="flex items-center flex-col justify-center">
                          <div className="mb-2">
                            <Button
                              loadingText="Adding"
                              className='text-white'
                              size='default'
                              isLoading={isAdding}
                              disabled={
                                productTitle.length === 0 || productTitle.length > 20 ||
                                productDescription.length === 0 || 
                                !isAnyColorSelected || BackDesignFile===undefined || 
                                sellerProfit > platform.maxProductSellerProfit || sellerProfit < 1  || sellerProfit === 0 || !sellerProfit 
                              }
                              onClick={SaveBackDesign}                          >
                              Add Product To Store
                              <span className="ml-1"><CircleCheckBig /></span>
                            </Button>
                          </div>
                          <div>
                            <p className='text-xs text-zinc-500'>
                              Back Design Selected !
                            </p>
                          </div>
                        </div>
                      </>

                        )}


                      </CardFooter>
                      </Card>



                        {/* Front Category Card */}
                      {addFrontDesign && selectedCat!=null  &&(
                      <Card x-chunk="dashboard-05-chunk-3" className={cn(' lg:rounded-2xl shadow-lg')}>
                  <CardHeader className="px-7 flex flex-col items-center justify-center">
                              <div className="text-center">
                              <h1 className='text-3xl font-extrabold'>Front Design</h1>
                              </div>

                              <div className='w-full h-px bg-zinc-200' />


                              <RadioGroup
                                    value={options.color}
                                    onChange={(val) => {
                                      setOptions((prev) => ({
                                        ...prev,
                                        color: val,
                                      }));
                                      handleColorChange(val); // Call handleColorChange to update the selected color
                                    }}
                                  >
                                    <Label>Color: {options.color.label}</Label>
                                    <div className='mt-3 flex flex-wrap gap-2'>
                                      {selectedP.colors.map((color: Color) => ( // Use selectedProduct.colors instead of colors
                                        <RadioGroup.Option
                                          key={color.label}
                                          value={color}
                                          className={({ active, checked }) =>
                                            cn(
                                              'relative flex cursor-pointer items-center justify-center rounded-full p-1 active:ring-0 focus:ring-0 active:outline-none focus:outline-none border-2 border-transparent',
                                              {
                                                [`border-${color.tw}`]: active || checked,
                                              }
                                            )
                                          }
                                        >
                                          <span
                                            className={cn(
                                              `bg-${color.tw}`,
                                              color.label === 'White' ? 'dark:bg-white' : `dark:bg-${color.tw}`,
                                              'h-8 w-8 rounded-full border border-black border-opacity-10'
                                            )}
                                          />
                                        </RadioGroup.Option>
                                      ))}
                                    </div>
                                  </RadioGroup>

                          <div>
                          <Button
                            className='mt-4 text-white'
                            onClick={toggleFrontBorder}
                            disabled={!isDesignUploaded}
                          >
                            {isBorderHidden ? "Show Border" : "Hide Border"}
                          </Button>
                              </div>
        
                        </CardHeader>
                    <CardContent >

                              
                    <div ref={FrontcontainerRef}  className="relative">
                          <NextImage
                            src={selectedCatColors?.frontImageUrl || "" }
                            alt="Product"
                            width={3000}
                            height={3000}
                            className="rounded-2xl front-product"
                          />
                          <div className="absolute border-gray-400 inset-0 rounded-2xl border-2">
                          <div 
                          style={{ top: frontBorderTop , bottom : frontBorderBottom , right : frontBorderRight , left: frontBorderLeft }} 
                          className={cn(`absolute  overflow-hidden ${!isBorderHidden ? 'rounded-md border-2 border-dashed border-gray-400' : ''}`)}>
                          <Rnd
                            size={{
                            width: Frontwidth * (frontSliderValue / 1000),
                            height: Frontheight * (frontSliderValue / 1000),
                           }}
                          default={{
                            x: 50,
                            y: 40,
                            height: Frontwidth /15,
                            width: Frontheight / 15,
                          }}
                          lockAspectRatio       
                        >
                          <div className='relative w-full h-full'>
                            {selectedFrontDesign && (
                              <NextImage
                                src={selectedFrontDesign || "/Loading.png"}
                                fill
                                alt='your image'
                                className='pointer-events-none object-contain cursor-grab'
                              />
                            )}
                          </div>
                        </Rnd>
                          </div>
                          </div>

                        </div>

                                          {selectedFrontDesign && (
                                                  <div className="">
                                                  <div className="flex items-center justify-center text-xs mt-4">
                                                    Use the slider to control the design size
                                                  </div>
                        
                                                  <div className="flex items-center justify-center mt-2">
                                                    <Slider
                                                      defaultValue={[50]}
                                                      max={200}
                                                      min={10}
                                                      step={1}
                                                      className={cn("w-[60%]")}
                                                      onValueChange={handleFrontSliderChange}
                                                      />
                                                  </div>
                                                </div>
                                          )}

              </CardContent>
              <CardFooter className='relative flex flex-col items-center justify-center'>
                              <div className="text-center text-2xl">
                                  <Label className='text-sm'>
                                    <span className="text-blue-600 ">Guide</span>: Hold Desgin to drag !
                                  </Label>
                              </div>
                  </CardFooter>
                  </Card>
                        )}

                        {/* Back Category Card */}
                      {addBackDesign !== false && selectedCat !== null  && ( 

                          <Card x-chunk="dashboard-05-chunk-3" className={cn(' lg:rounded-2xl shadow-lg')}>
                        <CardHeader className="px-7 flex flex-col items-center justify-center">
                              {selectedCat !== null && (
                                <>
                                  <div className="text-center">
                                  <h1 className='text-3xl font-extrabold'>Back Design</h1>
                                  </div>

                                  <div className='w-full h-px bg-zinc-200' />
                                  <>
                              <RadioGroup
                                value={options.color}
                                onChange={(val) => {
                                  setOptions((prev) => ({
                                    ...prev,
                                    color: val,
                                  }));
                                  handleColorChange(val); // Call handleColorChange to update the selected color
                                }}
                              >
                                  <div className="flex items-center justify-center mt-3">
                                <Label className=''>Color: {options.color.label}</Label>
                                </div>
                                <div className='mt-3 flex items-center space-x-3'>
                                  {selectedP.colors.map((color: Color) => (
                                    <RadioGroup.Option
                                      key={color.label}
                                      value={color}
                                      className={({ active, checked }) =>
                                        cn(
                                          'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 active:ring-0 focus:ring-0 active:outline-none focus:outline-none border-2 border-transparent',
                                          {
                                            [`border-${color.tw}`]: active || checked,
                                          }
                                        )
                                      }
                                    >
                                  <span
                                  className={cn(
                                    `bg-${color.tw}`,
                                    color.label === 'White' ? 'dark:bg-white' : `dark:bg-${color.tw}`,
                                    'h-8 w-8 rounded-full border border-black border-opacity-10'
                                  )}
                                />
                                    </RadioGroup.Option>
                                  ))}
                                </div>
                              </RadioGroup>
                              <div>
                              <Button
                            className='mt-4 text-white'
                            onClick={toggleBackBorder}
                            disabled={!isBackDesignUploaded}
                          >
                            {isBackBorderHidden ? "Show Border" : "Hide Border"}
                            </Button>
                                  </div>
            
                                  </>
                                </>
                              )}
                            </CardHeader>

                            <CardContent>

                            <div ref={BackcontainerRef} className="relative">
                              <NextImage
                                src={selectedCatColors?.backImageUrl || ""}
                                alt="Product"
                                width={3000}
                                height={3000}
                                className="rounded-2xl back-product "
                              />
                              <div className="absolute border-gray-400 inset-0  rounded-2xl border-2">
                              <div 
                              style={{ top: backBorderTop , bottom : backBorderBottom , right : backBorderRight , left: backBorderLeft }} 
                              className={cn(`absolute  overflow-hidden ${!isBackBorderHidden ? 'rounded-md border-2 border-dashed border-gray-400' : ''}`)}>
                              <Rnd
                               size={{
                               width: Backwidth * (backSliderValue / 1000),                                  height: Backheight * (backSliderValue / 1000),
                                }}
                              default={{
                                x: 5,
                                y: 40,
                                height: Backwidth /15,
                                width: Backheight / 15,
                              }}
                              lockAspectRatio       
                                >
                              <div className='relative w-full h-full'>
                                {selectedBackDesign && (
                                  <NextImage
                                    src={selectedBackDesign}
                                    fill
                                    alt='your image'
                                    className='pointer-events-none object-contain cursor-grab'
                                  />
                                )}
                              </div>
                            </Rnd>
                              </div>
                              </div>

                            </div>

                            {selectedBackDesign && (
                                                      <div className="">
                                                      <div className="flex items-center justify-center text-xs mt-4">
                                                        Use the slider to control the design size
                                                      </div>
                            
                                                      <div className="flex items-center justify-center mt-2">
                                                        <Slider
                                                          defaultValue={[50]}
                                                          max={200}
                                                          min={10}
                                                          step={1}
                                                          className={cn("w-[60%]")}
                                                          onValueChange={handleBackSliderChange}
                                                          />
                                                      </div>
                                                    </div>
                                              )}

                  </CardContent>

                  <CardFooter className=' flex flex-col items-center justify-center'>
                                  <div className="text-center text-2xl">
                                  <Label className='text-sm'>
                                    <span className="text-blue-600 ">Guide</span>: Hold Desgin to drag !
                                  </Label>
                                  </div>
                      </CardFooter>
                          </Card>

                      )}




    

                              </div>
                            </div>
                            

                            </>
  
  );
};

export  default CreateProductView ;

