'use client'
import Pica from 'pica';

import React, { useState } from "react";
import {
  PlusCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import LoadingState from "@/components/LoadingState";
import { saveCategoryData } from "./actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { SingleImageDropzone } from "@/components/sellerDashboard/SingleImageDropzone";
import { storage } from '@/firebase/firebaseConfig';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useTranslations } from 'next-intl';


interface CategoryData {
  mainImage: string | null;
  label: string;
  price: number;
  colors: Array<{
    label: string;
    value: string;
    tw: string;
    frontImageUrl: string;
    backImageUrl: string;
  }>;
  sizes: Array<{
    label: string;
    value: string;
  }>;
  frontBorders: Array<{
    label: string;
    value: string;
  }>;
  backBorders: Array<{
    label: string;
    value: string;
  }>;
}


const Page = () => {
  const router = useRouter();
  const { toast } = useToast()
  const t = useTranslations('AdminAddCategoryPage');



  const [label, setLabel] = useState("");
  const [price, setPrice] = useState("");

  const [files, setFiles] = useState<(File | undefined)[]>([undefined, undefined, undefined, undefined]);
  const handleFileChange = (index: number, file: File | undefined) => {
    const newFiles = [...files];
    newFiles[index] = file;
    setFiles(newFiles);
  };

  const [colors, setColors] = useState([
    { label: "", value: "", tw: "", frontImage: null as File | null, backImage: null as File | null },
  ]);

  const [mainImage, setMainImage] = useState<File>();


  const [frontBorders, setFrontBorders] = useState([
    { label: "", value: "" },
  ]);
  const [backBorders, setBackBorders] = useState([
    { label: "", value: "" },
  ]);

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const availableSizes = [
    { label: "Small", value: "small" },
    { label: "Medium", value: "medium" },
    { label: "Large", value: "large" },
    { label: "XL", value: "xl" },
    { label: "XXL", value: "xxl" },
  ];

  const handleSizeToggle = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };



  const handleAddColor = () => {
    setColors([
      ...colors,
      { label: "", value: "", tw: "", frontImage: null, backImage: null },
    ]);
  };

  const handleRemoveColor = (index: number) => {
    const newColors = colors.filter((_, i) => i !== index);
    setColors(newColors);
  };

  const handleAddFrontBorder = () => {
    setFrontBorders([...frontBorders, { label: "", value: "" }]);
  };

  const handleAddBackBorder = () => {
    setBackBorders([...backBorders, { label: "", value: "" }]);
  };

  const handleRemoveFrontBorder = (index: number) => {
    const newFrontBorders = frontBorders.filter((_, i) => i !== index);
    setFrontBorders(newFrontBorders);
  };

  const handleRemoveBackBorder = (index: number) => {
    const newBackBorders = backBorders.filter((_, i) => i !== index);
    setBackBorders(newBackBorders);
  };



  const handleSaveCategory = async () => {
    if (label === "" || price === "" || colors[0].label === "" || selectedSizes.length === 0) {
      toast({
        title: t('toast_missing_fields_title'),
        description: t('toast_missing_fields_desc'),
        variant: "destructive",
      });
      return;
    }

    try {
      setOpen(true);

      // Filter out undefined files
      const filteredFiles = files.filter(file => file !== undefined) as File[];
      const uploadPromises = filteredFiles.map(file => uploadImage(file));
      const uploadPaths = await Promise.all(uploadPromises) as string[];

      // Upload main image if it exists
      const mainImagePath = mainImage ? await uploadImage(mainImage) : null;

      // Upload front and back images for each color
      const newColors = await Promise.all(colors.map(async (color) => {
        const frontImageUrl = color.frontImage ? await uploadImage(color.frontImage) : "";
        const backImageUrl = color.backImage ? await uploadImage(color.backImage) : "";
        return {
          label: color.label,
          value: color.value,
          tw: color.tw,
          frontImageUrl: frontImageUrl || "",
          backImageUrl: backImageUrl || "",
        };
      }));

      const selectedSizesData = availableSizes.filter((size) =>
        selectedSizes.includes(size.value)
      );



      const categoryData: CategoryData = {
        mainImage: mainImagePath!,
        label,
        price: parseInt(price),
        colors: newColors,
        sizes: selectedSizesData,
        frontBorders,
        backBorders,
      };

      const res = await saveCategoryData(categoryData, uploadPaths);
      if (res) {
        toast({
          title: t('toast_category_saved'),
          variant: "default",
        });
        setOpen(false);
      } else {
        toast({
          title: t('toast_category_not_saved'),
          variant: "destructive",
        });
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: t('toast_saving_failed'),
        variant: "destructive",
      });
      setOpen(false);
    }
  };


  const uploadImage = async (file: File) => {
    const pica = new Pica(); // Correct instantiation

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
        }, 'image/png', 0.9); // Adjust quality (0.9 = 90%)
      });

      // Upload the optimized image
      const storageRef = ref(storage, `categories/${label}/${Date.now()}.png`);
      const snapshot = await uploadBytes(storageRef, optimizedBlob);
      const downloadURL = await getDownloadURL(snapshot.ref);

      if (downloadURL) {
        toast({
          title: t('toast_image_upload_success'),
          description: t('toast_image_upload_success_desc'),
        });
        return downloadURL;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: t('toast_upload_failed'),
        description: t('toast_upload_failed_desc'),
      });
      throw error; // Optionally re-throw the error if needed
    }
  };

  const [open, setOpen] = useState<boolean>(false);

  return (
    <>

      <p className="text-sm text-muted-foreground mb-2">{t('breadcrumb')}</p>
      <h1 className="text-2xl font-semibold">{t('add_category_title')}</h1>


      <div className="grid grid-cols-2 gap-4 mt-4">

        {/* category details */}
        <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
          <CardHeader>
            <CardTitle>{t('category_details_title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="label">{t('main_image_label')}</Label>
                <SingleImageDropzone
                  className="border border-blue-800"
                  width={200}
                  height={200}
                  value={mainImage}
                  onChange={(file) => {
                    setMainImage(file);
                  }}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="label">{t('label_label')}</Label>
                <Input
                  id="label"
                  type="text"
                  className="w-full"
                  placeholder={t('label_placeholder')}
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="price">{t('price_label')}</Label>
                <Input
                  id="price"
                  type="number"
                  className="w-full"
                  placeholder={t('price_placeholder')}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="grid gap-3">
                <div className="flex gap-3 flex-wrap justify-center">
                  <Label className="w-full text-center mb-4">{t('add_quality_images_label')}</Label>
                  {files.map((file, index) => (
                    <SingleImageDropzone
                      key={index}
                      className="border border-blue-800"
                      width={200}
                      height={200}
                      value={file}
                      onChange={(file) => handleFileChange(index, file)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* category colors */}
        <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
          <CardHeader>
            <CardTitle>{t('colors_title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[10%]">{t('color_label')}</TableHead>
                  <TableHead className="w-[10%]">{t('color_value')}</TableHead>
                  <TableHead className="w-[12%]">{t('color_tw')}</TableHead>
                  <TableHead>{t('front_image_url')}</TableHead>
                  <TableHead>{t('back_image_url')}</TableHead>
                  <TableHead>{t('action_label')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {colors.map((color, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-semibold">
                      <Input
                        type="text"
                        placeholder={t('color_label_placeholder')}
                        value={color.label}
                        onChange={(e) => {
                          const newColors = [...colors];
                          newColors[index].label = e.target.value;
                          setColors(newColors);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="text"
                        placeholder={t('color_value_placeholder')}
                        value={color.value}
                        onChange={(e) => {
                          const newColors = [...colors];
                          newColors[index].value = e.target.value;
                          setColors(newColors);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="text"
                        placeholder={t('color_tw_placeholder')}
                        value={color.tw}
                        onChange={(e) => {
                          const newColors = [...colors];
                          newColors[index].tw = e.target.value;
                          setColors(newColors);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <SingleImageDropzone
                        className="border border-blue-800"
                        width={200}
                        height={200}
                        value={color.frontImage!}
                        onChange={(file) => {
                          const newColors = [...colors];
                          newColors[index].frontImage = file!;
                          setColors(newColors);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <SingleImageDropzone
                        className="border border-blue-800"
                        width={200}
                        height={200}
                        value={color.backImage!}
                        onChange={(file) => {
                          const newColors = [...colors];
                          newColors[index].backImage = file!;
                          setColors(newColors);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <X
                        className="text-muted-foreground hover:text-red-500 cursor-pointer"
                        onClick={() => handleRemoveColor(index)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="justify-center border-t p-4">
            <Button size="sm" variant="ghost" className="gap-1" onClick={handleAddColor}>
              <PlusCircle className="h-3.5 w-3.5" />
              {t('add_color_button')}
            </Button>
          </CardFooter>
        </Card>

        <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
          <CardHeader>
            <CardTitle>{t('sizes_title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ToggleGroup type="multiple" variant="outline" className="flex flex-col sm:flex-row flex-wrap">
              {availableSizes.map((size) => (
                <ToggleGroupItem
                  key={size.value}
                  value={size.value}
                  onClick={() => handleSizeToggle(size.value)}
                  className={`flex-1 mb-2 sm:mb-0 sm:mr-2 ${selectedSizes.includes(size.value) ? 'bg-blue-200' : ''
                    }`}
                >
                  {size.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </CardContent>
        </Card>


        {/* front borders */}
        <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
          <CardHeader>
            <CardTitle>{t('front_borders_title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">{t('border_label')}</TableHead>
                  <TableHead className="w-[50%]">{t('border_value')}</TableHead>
                  <TableHead>{t('action_label')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {frontBorders.map((border, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-semibold">
                      <Input
                        type="text"
                        placeholder={t('border_label_placeholder')}
                        value={border.label}
                        onChange={(e) => {
                          const newFrontBorders = [...frontBorders];
                          newFrontBorders[index].label = e.target.value;
                          setFrontBorders(newFrontBorders);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="text"
                        placeholder={t('border_value_placeholder')}
                        value={border.value}
                        onChange={(e) => {
                          const newFrontBorders = [...frontBorders];
                          newFrontBorders[index].value = e.target.value;
                          setFrontBorders(newFrontBorders);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <X
                        className="text-gray-600 hover:text-red-500 cursor-pointer"
                        onClick={() => handleRemoveFrontBorder(index)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="justify-center border-t p-4">
            <Button size="sm" variant="ghost" className="gap-1" onClick={handleAddFrontBorder}>
              <PlusCircle className="h-3.5 w-3.5" />
              {t('add_front_border_button')}
            </Button>
          </CardFooter>
        </Card>

        {/* back borders */}
        <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
          <CardHeader>
            <CardTitle>{t('back_borders_title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">{t('border_label')}</TableHead>
                  <TableHead className="w-[50%]">{t('border_value')}</TableHead>
                  <TableHead>{t('action_label')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backBorders.map((border, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-semibold">
                      <Input
                        type="text"
                        placeholder={t('border_label_placeholder')}
                        value={border.label}
                        onChange={(e) => {
                          const newBackBorders = [...backBorders];
                          newBackBorders[index].label = e.target.value;
                          setBackBorders(newBackBorders);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="text"
                        placeholder={t('border_value_placeholder')}
                        value={border.value}
                        onChange={(e) => {
                          const newBackBorders = [...backBorders];
                          newBackBorders[index].value = e.target.value;
                          setBackBorders(newBackBorders);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <X
                        className="text-gray-600 hover:text-red-500 cursor-pointer"
                        onClick={() => handleRemoveBackBorder(index)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="justify-center border-t p-4">
            <Button size="sm" variant="ghost" className="gap-1" onClick={handleAddBackBorder}>
              <PlusCircle className="h-3.5 w-3.5" />
              {t('add_back_border_button')}
            </Button>
          </CardFooter>
        </Card>

        <div className="flex justify-start items-start">
          {/* Save Category Button */}
          <Button size="sm" onClick={handleSaveCategory}>
            {t('save_category_button')}
          </Button>
        </div>

      </div>

      <LoadingState isOpen={open} />

    </>
  );
};

export default Page;
