'use client';
import { ChangeEvent, useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { useToast } from '../ui/use-toast';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { CircleAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AffiliateCommission {
  commissionId: string;
  affiliateLinkId: string;
  productTitle: string;
  profit: number;
  createdAt: Date;
}


interface AffiliateStats {
  totalIncome: number;
  totalClicks: number;
  totalSales: number;
}

interface CommissionsTableProps {
  commissions: AffiliateCommission[]
  affiliateStats: AffiliateStats;
}

const CommissionsTable: React.FC<CommissionsTableProps> = ({ commissions, affiliateStats }) => {
  const { toast } = useToast();
  const t = useTranslations('AffiliateDashboardComponents');
  const [sortedCommissions, setSortedCommissions] = useState<AffiliateCommission[]>(commissions);

  const [searchTerm, setSearchTerm] = useState(''); // Search input state

  // Update search term and filter the commissions
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue); // Update the search term
  };

  // Filter the commissions by Commission Id or Affiliate Link Id
  useEffect(() => {
    let filteredCommissions = [...commissions];

    if (searchTerm) {
      filteredCommissions = filteredCommissions.filter(
        (commission) =>
          commission.commissionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          commission.affiliateLinkId.toLowerCase().includes(searchTerm.toLowerCase())||
          commission.productTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setSortedCommissions(filteredCommissions);
  }, [searchTerm, commissions]);

  const handleSortChange = (value: string) => {
    let sorted = [...commissions];

    if (value === 'high-profit') {
      sorted.sort((a, b) => b.profit - a.profit);
    } else if (value === 'low-profit') {
      sorted.sort((a, b) => a.profit - b.profit);
    }

    setSortedCommissions(sorted);
    toast({ title: t('sortedBy', {sort: value === 'high-profit' ? t('highProfit') : t('lowProfit')}) });
  };

  return (
    <>
    <div className="flex mt-4 flex-col gap-5 w-full">
  
  <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-1 xl:grid-cols-1">

      <Card x-chunk="dashboard-05-chunk-3">
        <CardHeader className="flex flex-row items-center bg-muted/50 rounded-t-lg">
          <div className="grid gap-2">
            <CardTitle>{t('commissions')}</CardTitle>
            <CardDescription>{t('totalCommissions', {count: commissions ? commissions.length : 0})}</CardDescription>
            <CardDescription>{t('totalCommissionsProfit', {profit: commissions ? (affiliateStats.totalIncome.toFixed(2)) : 0.00})} {t('tnd')}</CardDescription>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 items-center mt-2">
        <Input
              type="search"
              className='md:w-[400px] w-full'
              placeholder={t('searchByCommissionIdLinkIdOrProductTitle')}
              onChange={handleSearchChange}
              value={searchTerm}
            /> 
            
          <Select onValueChange={handleSortChange}>
            <SelectTrigger className="md:w-[180px] w-full">
              <SelectValue placeholder={t('sortBy')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t('sortOptions')}</SelectLabel>
                <SelectItem value="high-profit">{t('highProfit')}</SelectItem>
                <SelectItem value="low-profit">{t('lowProfit')}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          </div>
          </div>
        </CardHeader>
        <CardDescription className="px-4 gap-2">

        </CardDescription>
        <CardContent>
          {sortedCommissions.length > 0 ? (
              <Table>
        <ScrollArea
          className={`${
            sortedCommissions.length < 10 ? "max-h-max" : "h-[384px]"
          } w-full border rounded-lg mt-4`}
        >               
         <TableHeader>
                  <TableRow>
                    <TableHead>{t('commissionId')}</TableHead>
                    <TableHead>{t('affiliateLinkId')}</TableHead>
                    <TableHead>{t('productTitle')}</TableHead>
                    <TableHead>{t('profit')}</TableHead>
                    <TableHead>{t('createdAt')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCommissions.map((commission) => (
                    <TableRow key={commission.commissionId}>
                      <TableCell>{commission.commissionId}</TableCell>
                      <TableCell>{commission.affiliateLinkId}</TableCell>
                      <TableCell>{commission.productTitle}</TableCell>
                      <TableCell>{commission.profit.toFixed(2)} {t('tnd')}</TableCell>
                      <TableCell>
                      {new Date(commission.createdAt).toLocaleString()}
                    </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                </ScrollArea>

              </Table>
) : (
  <>
  <div className="flex items-center justify-center flex-col text-muted-foreground mt-4">
  <h1 className="text-center text-3xl font-bold">
    <CircleAlert />
  </h1>
  <p className="text-center text-sm mt-2">{t('noCommissions')}</p>
  <p className="text-center text-xs mt-2">{t('newCommissionsWillAppearHere')}</p>

</div>

</>
)}
        </CardContent>
      </Card>

      </section>
      </div>
    </>
  );
};

export default CommissionsTable;
