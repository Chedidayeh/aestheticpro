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
import { CircleAlert, Copy, Eye } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {  Affiliate, AffiliateClick, AffiliateLink, Commission, Platform, Product, User } from "@prisma/client";
import { ChangeEvent, useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from 'next-intl';

interface ExtraAffiliateClick extends AffiliateClick {
  user : User
}

interface ExtraAffiliateLink extends AffiliateLink {
  product : Product
  affiliate : Affiliate
  commission : Commission []
  affiliateClicks : ExtraAffiliateClick[]
}


interface ViewProps {
  Links: ExtraAffiliateLink[];
  platform : Platform
}

const ManageLinks = ({ Links , platform }: ViewProps) => {
  const t = useTranslations('AffiliateManageLinksPage');

  const { toast } = useToast()

  const [filteredLinks, setFilteredLinks] = useState<ExtraAffiliateLink[]>(Links);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Search input state
  const [sortOption, setSortOption] = useState<string>(''); // Sort option state
  // selected link
  const [selectedLink, setSelectedLink] = useState<ExtraAffiliateLink | null>(null)

  // Handle the search input change
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle the sort option change
  const handleSortChange = (value: string) => {
    setSortOption(value);
    toast({
      title: t(value === 'views' ? 'toast_sorted_by_clicks' : 'toast_sorted_by_profit'),
    });
  };

  // Filter and sort the links based on search term and sort option
  useEffect(() => {
    let filteredLinks = [...Links];

    // Filter based on search term (Product title, Affiliate Link ID, etc.)
    if (searchTerm) {
      filteredLinks = filteredLinks.filter((link) =>
        link.product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort based on the selected sort option
    if (sortOption === 'views') {
      filteredLinks.sort((a, b) => b.totalViews - a.totalViews); // Sort by total views/clicks
    } else if (sortOption === 'profit') {
      filteredLinks.sort(
        (a, b) =>
          (b.product.price * (platform.affiliateUserProfit / 100)) -
          (a.product.price * (platform.affiliateUserProfit / 100))
      ); // Sort by profit
    }

    setFilteredLinks(filteredLinks);
  }, [searchTerm, sortOption, Links, platform.affiliateUserProfit]);

  const copyToClipboard = (link : string) => {
    navigator.clipboard.writeText(link!)
      .then(() => {
        toast({
          title: t('toast_link_copied'),
          variant: "default",
        });
      })
      .catch((err) => {
        console.error('Failed to copy the text: ', err);
        toast({
          title: t('toast_copy_failed'),
          variant: "destructive",
        });
      });
  };

  return (
    <>

      <p className="text-sm  mb-2">{t('breadcrumb')}</p>
      <h1 className="text-2xl font-semibold mb-8">{t('title')}</h1>

      <div className="flex mt-2 flex-col gap-5 w-full">
  
  <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-1 xl:grid-cols-1">


      <Card>
        <CardHeader className="bg-muted/50 rounded-t-lg">
          <CardTitle>{t('links')}</CardTitle>
          <CardDescription>{t('total', {count: Links.length})}</CardDescription>
          {Links.length === 0 && (
          <CardDescription>
            <span className="text-blue-500">{t('no_special_links')}</span>
          </CardDescription>
             )}


            <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full my-2">
              <Input
                type="search"
                className="w-full sm:w-[300px]"
                placeholder={t('search_by_product_title')}
                onChange={handleSearchChange}
                value={searchTerm}
              />
              <Select onValueChange={handleSortChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder={t('sort_by')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t('sort_options')}</SelectLabel>
                    <SelectItem value="views">{t('clicks')}</SelectItem>
                    <SelectItem value="profit">{t('profit')}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

          <p className="text-muted-foreground text-sm">
        <span className="text-blue-600 font-medium">{t('note')} :</span> {t('profit_depends_on_quantity')}
          </p>
          
          <p className="text-muted-foreground text-sm">
          <span className="text-blue-600 font-medium">{t('guide')}</span> {t('use_eye_icon')}
          </p>

        </CardHeader>
        <CardContent>

          {filteredLinks.length > 0 ? (


        <Table>
        <ScrollArea
          className={`${
            filteredLinks.length < 10 ? "max-h-max" : "h-[384px]"
          } w-full border rounded-lg mt-4`}
        >                     <TableHeader>
                    <TableRow>
                        <TableHead>{t('link_id')}</TableHead>
                        <TableHead className="">{t('product_title')}</TableHead>
                        <TableHead className="">{t('product_price')}</TableHead>
                        <TableHead className="">{t('your_profit', {percent: platform.affiliateUserProfit})}</TableHead>
                        <TableHead>{t('total_clicks')}</TableHead>
                        <TableHead>{t('total_link_sales')}</TableHead>
                        <TableHead className="">{t('actions')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredLinks.map((link) => (
                        <TableRow key={link.id}>
                            <TableCell>{link.id}</TableCell>
                            <TableCell className="">{link.product.title}</TableCell>
                            <TableCell className="">{(link.product.price).toFixed(2)} TND</TableCell>
                            <TableCell className="">{(link.probableProfit.toFixed(2))} TND</TableCell>
                            <TableCell>{link.totalViews} {t('clicks')}</TableCell>
                            <TableCell>{link.totalSales} {t('sales')}</TableCell>
                            <TableCell className="">
                            <TooltipProvider>
                  <div className="flex gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                       <Copy onClick={()=>copyToClipboard(link.link)} className="hover:text-green-500 cursor-pointer"/>
                      </TooltipTrigger>
                      <TooltipContent className="bg-green-500 text-white">
                        <p>{t('copy_link')}</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                      <Eye
                        onClick={() => setSelectedLink(selectedLink === link ? null : link)}
                        className="hover:text-purple-500 cursor-pointer"
                      />
                      </TooltipTrigger>
                      <TooltipContent className="bg-purple-500 text-white">
                        <p>{t('view_clicks')}</p>
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
            <Separator className="w-full my-4"/>
            <div className="flex items-center justify-center flex-col text-muted-foreground">
            <h1 className="text-center text-3xl font-bold">
              <CircleAlert />
            </h1>
            <p className="text-center text-sm mt-2">{t('no_links_created')}</p>
            <p className="text-center text-xs mt-2">{t('new_links_appear')}</p>

          </div>

          </>
          )}

        </CardContent>
      </Card>

      </section>
      </div>

      {selectedLink && (

      <div className="flex mt-2 flex-col gap-5 w-full">
  
  <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-1 xl:grid-cols-1">


      <Card>
        <CardHeader className="bg-muted/50 rounded-t-lg">
          <CardTitle className="flex items-center gap-2">{t('clicks_on_link')} <p className="text-xs text-muted-foreground">{selectedLink.id} </p></CardTitle>
          <CardDescription className="flex items-center gap-2">{t('product')} <p className="text-xs text-muted-foreground">{selectedLink.product.title}</p></CardDescription>
          <CardDescription>{t('total', {count: selectedLink.affiliateClicks.length})}</CardDescription>
        </CardHeader>
        <CardContent>

          {selectedLink.affiliateClicks.length > 0 ? (


        <Table>
        <ScrollArea
          className={`${
            selectedLink.affiliateClicks.length < 10 ? "max-h-max" : "h-[384px]"
          } w-full border rounded-lg mt-4`}
        >                     <TableHeader>
                    <TableRow>
                        <TableHead>{t('affiliate_click_id')}</TableHead>
                        <TableHead className="">{t('user_name')}</TableHead>
                        <TableHead className="">{t('user_email')}</TableHead>
                        <TableHead className="">{t('clicked_at')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {selectedLink.affiliateClicks.map((click) => (
                        <TableRow key={click.id}>
                            <TableCell>{click.id}</TableCell>
                            <TableCell className="">{click.user.name}</TableCell>
                            <TableCell className="">{click.user.email}</TableCell>
                            <TableCell className="">{new Date(click.clickedAt).toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </ScrollArea>
            </Table>
            
          ) : (
            <>
            <Separator className="w-full my-4"/>
            <div className="flex items-center justify-center flex-col text-muted-foreground">
            <h1 className="text-center text-3xl font-bold">
              <CircleAlert />
            </h1>
            <p className="text-center text-sm mt-2">{t('no_clicks_for_link')}</p>
            <p className="text-center text-xs mt-2">{t('new_clicks_appear')}</p>

          </div>

          </>
          )}

        </CardContent>
      </Card>

      </section>
      </div>

)}

    </>
  );
};

export default ManageLinks;
