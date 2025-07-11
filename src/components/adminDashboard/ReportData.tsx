'use client'
import Papa from 'papaparse';
import React from 'react'
import { Button } from '../ui/button'
import LoadingState from '../LoadingState'
import { getReportData } from '@/actions/actions'
import { useTranslations } from 'next-intl';

const ReportData = () => {
  // open state
  const [open, setOpen] = React.useState(false)
  const t = useTranslations('AdminDashboardComponents');


  const downloadReport = async () => {
    try {
      setOpen(true);
  
      // Fetch the report data
      const data = await getReportData();
  
      // Prepare data for CSV format (without the header)
      const reportRows = data.reportData.map((item) => ({
        UserName: item.userName,
        UserEmail: item.userEmail,
        UserPhone: item.userPhone,
        StoreName: item.storeName,
        StoreProfit: item.storeProfit,
        AffiliateId: item.affiliateId,
        AffiliateProfit: item.affiliateProfit,
      }));
  
      // Add platform profit row to the CSV data
      const csvData = Papa.unparse([
        {
          UserName: 'User Name',
          UserEmail: 'User Email',
          UserPhone: 'User Phone',
          StoreName: 'Store Name',
          StoreProfit: 'Store Profit',
          AffiliateId: 'Affiliate Id',
          AffiliateProfit: 'Affiliate Profit',
        },
        ...reportRows,
        { StoreName: 'Platform', StoreProfit: data.platformProfit, AffiliateProfit: 'N/A' }, // Platform profit
      ]);
  
      // Create a Blob from the CSV data
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  
      // Create an anchor element to trigger the download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'report.csv'; // The name of the downloaded file
  
      // Trigger the download by simulating a click event
      link.click();
  
      setOpen(false); // Optionally, hide loading state after download is triggered
  
    } catch (error) {
      console.error('Error downloading report:', error);
      setOpen(false); // Hide loading state in case of error
    }
  };
  
  
  return (
    <>
    <div className="flex items-end justify-end">
      <Button onClick={downloadReport} size={"sm"} className="text-white" variant={"default"}>
      {t('downloadReport')}
      </Button>
    </div>
    <LoadingState isOpen={open}  />
    </>
  )
}

export default ReportData
