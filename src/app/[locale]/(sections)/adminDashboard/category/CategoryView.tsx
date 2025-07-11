'use client'

import { CircleAlert, MoreHorizontal, OctagonAlert } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Category, Color , Size } from "@prisma/client"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { apply, changePrice, changeStock, deleteCategoryAndAssociated, disableCategoryProducts, enableCategoryProducts, resetPricesByCategory } from "./actions"
import LoadingState from "@/components/LoadingState"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTranslations } from 'next-intl';

interface CatWithInfos extends Category {
    colors : Color[]
    sizes : Size[]
}

interface CatProps {
    categories : CatWithInfos[]
}

const CategoryView: React.FC<CatProps> = ({ categories }) => {
  const router = useRouter();
  const { toast } = useToast()
  const t = useTranslations('AdminCategoryPage');
  const [isEditStockOpen, setisEditStockOpen] = useState(false);
  const [isEditOpen, setisEditOpen] = useState(false);
  const [isDeleteOpen, setisDeleteOpen] = useState(false);
  const [isDiscountOpen, setisDiscountOpen] = useState(false);
  const [discountValue, setDiscountValue] = useState(0); // State for managing the discount percentage
  const [newPrice, setnewPrice] = useState(0); // State for managing the discount percentage
  const [newStock, setNewStock] = useState(0); // State for managing the discount percentage

  const [ catId , setCatId] = useState("")
  const [open, setOpen] = useState<boolean>(false);




    const editStock = async () => {

      try {
        setOpen(true)
        await changeStock(catId , newStock)
        toast({
          title: t('toast_stock_changed'),
          variant: "default",
        });
        setOpen(false)



      
    } catch (error) {
      console.log(error)
      toast({
        title: t('toast_operation_failed'),
        variant: "destructive",
      }); 
      setOpen(false)

        }

      }
    const editCat = async () => {

      try {
        setOpen(true)
        await changePrice(catId , newPrice)
        toast({
          title: t('toast_price_changed'),
          variant: "default",
        });
        setOpen(false)



      
    } catch (error) {
      console.log(error)
      toast({
        title: t('toast_operation_failed'),
        variant: "destructive",
      }); 
      setOpen(false)

        }

      }

  const deleteCat = async () => {

    try {
      setisDeleteOpen(false)
      setOpen(true)
      const res = await deleteCategoryAndAssociated(catId)

      if(res){
        toast({
          title: t('toast_category_deleted'),
          variant: "default",
        });
        setOpen(false)
  
      }
      else {
        toast({
          title: t('toast_category_not_deleted'),
          variant: "destructive",
        });
        setOpen(false)

  
      }
      
    } catch (error) {
      console.log(error)
      toast({
          title: t('toast_deleting_failed'),
          variant: "destructive",
        }); 
        setOpen(false)
    }

  }



  // fucntion : applyDiscount
  const applyDiscount = async (discount : number) => {

      try {
        setOpen(true)
        const res = await apply(catId , discount)
        if(res) {
          toast({
            title: t('toast_discount_applied'),
            variant: "default",
          });
          setOpen(false)
        }else {
          toast({
            title: t('toast_discount_failed'),
            variant: "destructive",
          }); 
          setOpen(false)
        }

      
    } catch (error) {
      console.log(error)
      toast({
        title: t('toast_discount_failed'),
        variant: "destructive",
      }); 
      setOpen(false)

        }

      }


        // fucntion : resetPrice
  const resetPrice = async (catId : string) => {

    try {
      setOpen(true)
      const res = await resetPricesByCategory(catId)
      if(res) {
        toast({
          title: t('toast_prices_reset'),
          variant: "default",
        });
        setOpen(false)
      }else {
        toast({
          title: t('toast_operation_failed'),
          variant: "destructive",
        }); 
        setOpen(false)
      }


    
  } catch (error) {
    console.log(error)
    toast({
      title: t('toast_operation_failed'),
      variant: "destructive",
    }); 
    setOpen(false)

      }

    }


// Function: disableCategory
const disableCategory = async (category: Category) => {
  try {
    setOpen(true); // Indicate the operation is in progress

    const res = await disableCategoryProducts(category); 
    if (res) {
      toast({
        title: t('toast_category_disabled', {label: category.label}),
        variant: "default",
      });
    } else {
      toast({
        title: t('toast_category_disable_failed', {label: category.label}),
        variant: "destructive",
      });
    }
  } catch (error) {
    console.error("Error disabling category:", error);
    toast({
      title: t('toast_disable_error'),
      variant: "destructive",
    });
  } finally {
    setOpen(false); // Ensure loading indicator is turned off
  }
};

// Function: enableCategory
const enableCategory = async (category: Category) => {
  try {
    setOpen(true); // Indicate the operation is in progress

    const res = await enableCategoryProducts(category);
    if (res) {
      toast({
        title: t('toast_category_enabled', {label: category.label}),
        variant: "default",
      });
    } else {
      toast({
        title: t('toast_category_enable_failed', {label: category.label}),
        variant: "destructive",
      });
    }
  } catch (error) {
    console.error("Error enabling category:", error);
    toast({
      title: t('toast_enable_error'),
      variant: "destructive",
    });
  } finally {
    setOpen(false); // Ensure loading indicator is turned off
  }
};





  return (
    <>

      <AlertDialog open={isEditOpen}>
      <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
      <AlertDialogHeader>
          <AlertDialogTitle>{t('modify_price_title')}</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">

          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="newPrice">{t('new_price_label')}</Label>
            <div className="col-span-3">
              <Input 
                id="newPrice" 
                type="number" 
                required 
                value={newPrice} // Controlled input value
                onChange={(e) => setnewPrice(parseInt(e.target.value))} // Handle input change
                min={1}
                max={100}
              />

            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={()=>setisEditOpen(false)}>{t('cancel_button')}</AlertDialogCancel>
          <AlertDialogAction 
          onClick={()=>{
            setisEditOpen(false)
            editCat(); // Pass the discount value to applyDiscount function
          }}>        
          {t('confirm_button')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <AlertDialog open={isEditStockOpen}>
      <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
      <AlertDialogHeader>
          <AlertDialogTitle>{t('modify_stock_title')}</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">

          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="newPrice">{t('new_stock_label')}</Label>
            <div className="col-span-3">
              <Input 
                id="newPrice" 
                type="number" 
                required 
                value={newStock} // Controlled input value
                onChange={(e) => setNewStock(parseInt(e.target.value))} // Handle input change
              />

            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={()=>setisEditStockOpen(false)}>{t('cancel_button')}</AlertDialogCancel>
          <AlertDialogAction 
          onClick={()=>{
            setisEditStockOpen(false)
            editStock(); // Pass the discount value to applyDiscount function
          }}>        
          {t('confirm_button')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

<AlertDialog open={isDiscountOpen}>
<AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
<AlertDialogHeader>
          <AlertDialogTitle>{t('applying_discount_title')}</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">

          <div className="grid items-center grid-cols-4 gap-4">
            <div className="col-span-3">
              <Input 
                id="discount" 
                type="number" 
                required 
                value={discountValue} // Controlled input value
                onChange={(e) => setDiscountValue(parseInt(e.target.value))} // Handle input change
                min={0}
                max={100}
                placeholder={t('discount_placeholder')}
              />

            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={()=>setisDiscountOpen(false)}>{t('cancel_button')}</AlertDialogCancel>
          <AlertDialogAction 
          onClick={()=>{
            setisDiscountOpen(false)
            applyDiscount(discountValue); // Pass the discount value to applyDiscount function
          }}>        
          {t('confirm_discount_button')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

                            {/* The AlertDialog delete design component  */}
                            <AlertDialog open={isDeleteOpen}>
                            <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
                            <AlertDialogHeader className="flex flex-col items-center">
                                       <div className="text-red-500 mb-2">
                                           <OctagonAlert className=''/>
                                               </div>
                                              <AlertDialogTitle className="text-xl font-bold text-center">
                                                 {t('delete_category_confirm_title')}
                                               </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                   {t('delete_category_confirm_desc')}
                                                   </AlertDialogDescription>
                                                   </AlertDialogHeader>
                                                  <AlertDialogFooter>
                                              <AlertDialogCancel onClick={()=>setisDeleteOpen(false)}>{t('cancel_button')}</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => deleteCat()} 
                                     className='bg-red-500 hover:bg-red-500' >{t('delete_button')}</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                     </AlertDialog>

<p className="text-sm text-muted-foreground mb-2">{t('breadcrumb')}</p>
<h1 className="text-2xl font-semibold">{t('manage_categories_title')}</h1>

<Link href="/adminDashboard/category/addCategory" className="mt-4"><Button variant={"link"}>{t('add_category_button')}</Button></Link>
<Link href="/adminDashboard/category/tryCategory" className="mt-4"><Button variant={"link"}>{t('try_category_button')}</Button></Link>


<div className="flex flex-col gap-5 w-full">

<section className="grid w-full grid-cols-1 gap-4 transition-all ">


    <Card className="mt-4">
      <CardHeader className="bg-muted/50">
        <CardTitle>{t('categories_card_title')}</CardTitle>
        <CardDescription>
          {t('categories_total_label', {count: categories.length})}
        </CardDescription>
      </CardHeader>
      <CardContent>
      {categories.length > 0 ? (
      <Table>
                <ScrollArea
          className={`${
            categories.length < 10 ? "max-h-max" : "h-[384px]"
          } w-full border rounded-lg mt-4`}
        >   
  <TableHeader>
    <TableRow>
      {/* Category Id column */}
      <TableHead>{t('table_category_id')}</TableHead>

      {/* Category Label column */}
      <TableHead>{t('table_category_label')}</TableHead>

      {/* Category Price column */}
      <TableHead>{t('table_category_price')}</TableHead>

      {/* Category Colors column */}
      <TableHead>{t('table_category_colors')}</TableHead>

      {/* Category Sizes column */}
      <TableHead>{t('table_category_sizes')}</TableHead>

      {/* Action column */}
      <TableHead>{t('table_actions')}</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {categories.map((category) => (
      <TableRow key={category.id}>
        {/* Category Id cell */}
        <TableCell>{category.id}</TableCell>

        {/* Category Label cell */}
        <TableCell>{category.label}</TableCell>

        {/* Category Price cell */}
        <TableCell>{category.price.toFixed(2)} TND</TableCell>

        {/* Category Colors cell */}
        <TableCell>
          {category.colors.map((color) => (
            <Badge key={color.id} className="mr-1 text-white">
              {color.label}
            </Badge>
          ))}
        </TableCell>

        {/* Category Sizes cell */}
        <TableCell>
          {category.sizes.map((size) => (
            <Badge key={size.id} className="mr-1 text-white">
              {size.label}
            </Badge>
          ))}
        </TableCell>

        {/* Action cell */}
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-haspopup="true"
                size="icon"
                variant="ghost"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t('table_actions')}</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => {
                setCatId(category.id);
                setisEditStockOpen(true);
              }}>{t('set_stock_button')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setCatId(category.id);
                setisEditOpen(true);
              }}>{t('edit_price_button')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setCatId(category.id);
                setisDeleteOpen(true);
              }}>{t('delete_button')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setCatId(category.id);
                setisDiscountOpen(true);
              }}>{t('apply_discount_button')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                resetPrice(category.id);
              }}>{t('reset_prices_button')}</DropdownMenuItem>
                             <DropdownMenuItem onClick={() => {
                disableCategory(category);
              }}>{t('disable_category_button')}</DropdownMenuItem>
                                         <DropdownMenuItem onClick={() => {
                enableCategory(category);
              }}>{t('enable_category_button')}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
<p className="text-center text-sm mt-2">{t('no_categories_found')}</p>
<p className="text-center text-xs mt-2">{t('new_categories_appear')}</p>

</div>

</>
)}

      </CardContent>
      <CardFooter>

      </CardFooter>
    </Card>

    </section>
    </div>

    <LoadingState isOpen={open} />


    </>
  )
}

export default CategoryView