/* eslint-disable react/no-unescaped-entities */
'use client' 
 

import NextImage from 'next/image'
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { useToast } from '@/components/ui/use-toast'
import {   useState } from 'react';
import { Rnd } from 'react-rnd';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';

import { Switch } from '@/components/ui/switch';
import { SingleImageDropzone } from '@/components/sellerDashboard/SingleImageDropzone';
import { useTranslations } from 'next-intl';






const CategoryConfigurator = () => {
  const t = useTranslations('AdminTryCategoryPage');


  const { toast } = useToast()


  const [isBorderHidden, setIsBorderHidden] = useState(true);
  const [isBackBorderHidden, setisBackBorderHidden] = useState(true);

      // isClicked state

  const MAX_FILE_SIZE = 5 * 1024 * 1024;


  // design  width and height
  const [Frontwidth, setFrontwidth] = React.useState<number>(3000);
  const [Frontheight, setFrontheight] = React.useState<number>(3000);
  const [Backwidth, setBackwidth] = React.useState<number>(3000);
  const [Backheight, setBackheight] = React.useState<number>(3000);

  const [selectedFrontDesign, setselectedFrontDesign] = useState<string>("");
  const [selectedBackDesign, setselectedBackDesign] = useState<string>("");


  

  // switch
  const [addFrontDesign, setAddFrontDesign] = useState(true);
  const [addBackDesign, setAddBackDesign] = useState(false);





  const [FrontDesignFile, setFrontDesignFile] = useState<File>();
  const [BackDesignFile, setBackDesignFile] = useState<File>();





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
        title: t('toast_file_size_exceeds_title'),
        description: t('toast_file_size_exceeds_desc'),
        variant: 'destructive',
      });

    } else {

      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target) { 

          const dataUrl = e.target.result as string;
          const image = new Image();

          image.onload = () => {
            const { width, height } = image;
            setFrontwidth(width);
            setFrontheight(height);
            setIsBorderHidden(false);
            setselectedFrontDesign(dataUrl);

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
          title: t('toast_file_size_exceeds_title'),
          description: t('toast_file_size_exceeds_desc_15mb'),
          variant: 'destructive',
        });
  
      } else {
  
        const reader = new FileReader();
  
        reader.onload = (e) => {
          if (e.target) { 
  
            const dataUrl = e.target.result as string;
            const image = new Image();
  
            image.onload = () => {
              const { width, height } = image;
              setBackwidth(width);
              setBackheight(height);
              setisBackBorderHidden(false);
              setselectedBackDesign(dataUrl);
            };
  
            image.src = dataUrl;
          }
        };
        reader.readAsDataURL(file);
  
        
  
      }
    }
  };




      //switch 
    const handleFrontSwitchChange = () => {
      setAddFrontDesign(!addFrontDesign);
      setselectedFrontDesign("")
      setIsBorderHidden(true);
    };

    const handleBackSwitchChange = () => {
      setAddBackDesign(!addBackDesign);
      setselectedBackDesign("")
      setisBackBorderHidden(true);

    };


  // Function to handle Front file upload
  const handleCategoryFileChange = (file : File) => {
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target) { 
  
            const dataUrl = e.target.result as string;
            const image = new Image();
  
              setFrontImage(dataUrl);
  
            image.src = dataUrl;
          }
        };
        reader.readAsDataURL(file);
  
        
  
      
    }
    
  };

    // Function to handle Front file upload
    const handleBackCategoryFileChange = (file : File) => {
      if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target) { 
    
              const dataUrl = e.target.result as string;
              const image = new Image();
    
              setBackImage(dataUrl);
    
              image.src = dataUrl;
            }
          };
          reader.readAsDataURL(file);
        
      }
      
    };
  


// frontImage state
const [frontImage, setFrontImage] = useState("/Loading.png"); // Default front image path
// backImage state
const [backImage, setBackImage] = useState("/Loading.png"); // Default back image path


  // dahsed border dimentions:
  // front :
  const [frontBorderTop , setfrontborderTop] = useState("23%")
  const [frontBorderBottom , setfrontBorderBottom] = useState("23%")
  const [frontBorderRight , setfrontBorderRight] = useState("23%")
  const [frontBorderLeft , setfrontBorderLeft] = useState("23%")
  // Back :
  const [backBorderTop , setbackborderTop] = useState("23%")
  const [backBorderBottom , setbackBorderBottom] = useState("23%")
  const [backBorderRight , setbackBorderRight] = useState("23%")
  const [backBorderLeft , setbackBorderLeft] = useState("23%")



  return (

    <>

<p className="text-sm text-muted-foreground mb-2">{t('breadcrumb')}</p>
<h1 className="text-2xl font-semibold">{t('try_category_title')}</h1>

              <div className='relative mt-5 grid grid-cols-1  mb-20 pb-20'>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:grid-cols-2">

                          {/* first card */}
                     <Card x-chunk="dashboard-05-chunk-3" className={cn(' lg:rounded-2xl shadow-lg')}>
                        <CardHeader className="py-2">
                        </CardHeader>
                        <CardContent className="items-center space-y-6 grid" >                          

                                 {/* Switch component front */}
                                  <div className="flex items-center mt-4 space-x-2">
                                <Switch id="front" defaultChecked={addFrontDesign} onClick={handleFrontSwitchChange } />
                                <Label htmlFor="front">{t('add_front_design_label')}</Label>
                               </div>

                                {/* Switch component back */}
                              <div className="flex items-center mt-4 space-x-2">
                                <Switch  id="back" defaultChecked={addBackDesign} onClick={handleBackSwitchChange } />
                                <Label htmlFor="back">{t('add_back_design_label')}</Label>
                               </div>

                               {(addFrontDesign || addBackDesign)  && (

                                <>

                              <div className='space-y-2'>
                                <h3>{t('upload_category_title')}</h3>
                              <div className="flex flex-col lg:flex-row justify-center lg:space-x-4 space-y-4 lg:space-y-0">
                              {/* Front Input */}
                              {addFrontDesign && (
                                <div>
                                  <Input 
                                    type="file" 
                                    accept="image/*" // Accepts only image files
                                    onChange={(e) => {
                                      const file = e.target.files?.[0]; // Get the selected file
                                      if (file) {
                                        handleCategoryFileChange(file); // Call your file handling function
                                      }
                                    }} 
                                  />
                                </div>
                              )}

                              {/* Back Input */}
                              {addBackDesign && (
                                <div>
                                  <Input 
                                    type="file" 
                                    accept="image/*" // Accepts only image files
                                    onChange={(e) => {
                                      const file = e.target.files?.[0]; // Get the selected file
                                      if (file) {
                                        handleBackCategoryFileChange(file); // Call your file handling function
                                      }
                                    }} 
                                  />
                                </div>
                              )}

                              </div>

                              </div>

                              <div className='space-y-2'>
                                <h3>{t('upload_design_title')}</h3>
                              <div className="flex flex-col lg:flex-row justify-center lg:space-x-4 space-y-4 lg:space-y-0">
                                {/* front design input */}
                                {addFrontDesign && (
                                  <div>
                                    <SingleImageDropzone
                                      className="border border-blue-800"
                                      width={200}
                                      height={200}
                                      value={FrontDesignFile}
                                      onChange={(file) => {
                                        setFrontDesignFile(file);
                                        if (!file) {
                                          setIsBorderHidden(true);
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
                                  <div>
                                    <SingleImageDropzone
                                      className="border border-blue-800"
                                      width={200}
                                      height={200}
                                      value={BackDesignFile}
                                      onChange={(file) => {
                                        setBackDesignFile(file);
                                        if (!file) {
                                          setisBackBorderHidden(true);
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

                              {addFrontDesign && (

                              <div className='space-y-2'>
                                <h3>{t('manage_front_borders_title')}</h3>
                              <div className="flex flex-col lg:flex-row justify-center lg:space-x-4 space-y-4 lg:space-y-0">
                                
                                <div className=''>
                                <Label className='my-1'>{t('top_label')}</Label>
                                <Input
                                  type="text"
                                  defaultValue={"23%"}
                                  onChange={(e) => {
                                    setfrontborderTop(e.target.value);
                                  }}
                                />
                                </div>

                                <div className='my-2'>
                                <Label className='my-1'>{t('bottom_label')}</Label>
                                <Input
                                  type="text"
                                  defaultValue={"23%"}
                                  onChange={(e) => {
                                    setfrontBorderBottom(e.target.value);
                                  }}
                                />
                                </div>

                                <div className='my-2'>
                                <Label className='my-1'>{t('right_label')}</Label>
                                <Input
                                  type="text"
                                  defaultValue={"23%"}
                                  onChange={(e) => {
                                    setfrontBorderRight(e.target.value);
                                  }}
                                />
                                </div>

                                <div className='my-2'>
                                <Label className='my-1'>{t('left_label')}</Label>
                                <Input
                                  type="text"
                                  defaultValue={"23%"}
                                  onChange={(e) => {
                                    setfrontBorderLeft(e.target.value);
                                  }}
                                />
                                </div>
        
                              </div>

                              </div>
                               )}


                                {addBackDesign && (

                                <div className='space-y-2'>
                                  <h3>{t('manage_back_borders_title')}</h3>
                                  <div className="flex flex-col lg:flex-row justify-center lg:space-x-4 space-y-4 lg:space-y-0">
                                
                                <div className=''>
                                <Label className='my-1'>{t('top_label')}</Label>
                                <Input
                                  type="text"
                                  defaultValue={"23%"}
                                  onChange={(e) => {
                                    setbackborderTop(e.target.value);
                                  }}
                                />
                                </div>

                                <div className='my-2'>
                                <Label className='my-1'>{t('bottom_label')}</Label>
                                <Input
                                  type="text"
                                  defaultValue={"23%"}
                                  onChange={(e) => {
                                    setbackBorderBottom(e.target.value);
                                  }}
                                />
                                </div>

                                <div className='my-2'>
                                <Label className='my-1'>{t('right_label')}</Label>
                                <Input
                                  type="text"
                                  defaultValue={"23%"}
                                  onChange={(e) => {
                                    setbackBorderRight(e.target.value);
                                  }}
                                />
                                </div>

                                <div className='my-2'>
                                <Label className='my-1'>{t('left_label')}</Label>
                                <Input
                                  type="text"
                                  defaultValue={"23%"}
                                  onChange={(e) => {
                                    setbackBorderLeft(e.target.value);
                                  }}
                                />
                                </div>
        
                              </div>

                                </div>
                                )}


                              </>
                              )}




                        </CardContent>
                      </Card>



     


                    {(addFrontDesign || addBackDesign) && (

                    <Card x-chunk="dashboard-05-chunk-3" className={cn(' lg:rounded-2xl shadow-lg')}>
                    <CardHeader className="px-7 flex flex-col items-center justify-center">


                          </CardHeader>
                      <CardContent >

                      { addFrontDesign  &&(

                        <>
                      <div className="text-center">
                        <h1 className='text-3xl font-extrabold'>Front Design</h1>
                      </div>
                      <div className='w-full h-px bg-zinc-200 my-5' />

                      <div className="relative">
                            <NextImage
                              src={frontImage}
                              alt="Product"
                              width={3000}
                              height={3000}
                              className="rounded-2xl front-product"
                            />
                            <div className="absolute inset-0 rounded-2xl border-2">
                            <div 
                            style={{ top: frontBorderTop , bottom : frontBorderBottom , right : frontBorderRight , left: frontBorderLeft }} 
                            className={cn(`absolute  overflow-hidden ${!isBorderHidden ? 'rounded-md border-2 border-dashed border-gray-400' : ''}`)}>
                            <Rnd
                            default={{
                              x: 5,
                              y: 40,
                              height: Frontwidth /15,
                              width: Frontheight / 15,
                            }}
                            lockAspectRatio       
                          >
                            <div className='relative w-full h-full'>
                              {selectedFrontDesign && (
                                <NextImage
                                  src={selectedFrontDesign}
                                  fill
                                  alt='your image'
                                  className='pointer-events-none object-contain front-design cursor-grab'
                                />
                              )}
                            </div>
                          </Rnd>
                            </div>
                            </div>

                          </div>

                                <div className="text-center">
                                <Button
                            className='mt-4'
                            onClick={toggleFrontBorder}
                          >
                            {isBorderHidden ? "Show Border" : "Hide Border"}
                          </Button>
                                </div>

                    <div className='w-full h-px bg-zinc-200 my-5' />
                    </>
                      )}


                      { addBackDesign  &&(

                        <>
                            <div className="text-center">
                              <h1 className='text-3xl font-extrabold'>Back Design</h1>
                              </div>
                            <div className='w-full h-px bg-zinc-200 my-5' />

                      <div className="relative">
                                <NextImage
                                  src={backImage}
                                  alt="Product"
                                  width={3000}
                                  height={3000}
                                  className="rounded-2xl back-product "
                                />
                                <div className="absolute inset-0 rounded-2xl border-2">
                                <div 
                                style={{ top: backBorderTop , bottom : backBorderBottom , right : backBorderRight , left: backBorderLeft }} 
                                className={cn(`absolute  overflow-hidden ${!isBackBorderHidden ? 'rounded-md border-2 border-dashed border-gray-400' : ''}`)}>
                                <Rnd
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
                                      className='pointer-events-none object-contain cursor-grab back-design'
                                    /> 
                                  )}
                                </div>
                              </Rnd>
                                </div>
                                </div>

                          </div>

                                <div className="text-center">
                                <Button
                            className='mt-4'
                            onClick={toggleBackBorder}
                          >
                            {isBackBorderHidden ? "Show Border" : "Hide Border"}
                            </Button>
                                    </div>
                          </>
                      )}

                    </CardContent>
                    </Card>


                    )}
                              </div>
                            </div>
                            

                            </>
  
  );
};

export  default CategoryConfigurator ;

