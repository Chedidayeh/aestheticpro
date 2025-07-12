/* eslint-disable react/no-unescaped-entities */
'use client'
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Level } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Check, CircleCheck, Pin, Star } from "lucide-react";
import { useTranslations } from 'next-intl';

const LevelsView = ({ levels, storeLevel }: { levels: Level[], storeLevel: Level }) => {
  const t = useTranslations('SellerStoreLevelPage');
  return (
    <>
    <p className="text-sm text-muted-foreground mb-2">{t('breadcrumb')}</p>
    <h1 className="text-2xl font-semibold">{t('store_level_title')}</h1>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {levels.map((level) => (
        <div key={level.levelNumber} className="w-full flex justify-center">
<Card
  className={`shadow-md rounded-3xl w-full max-w-sm border-2 ${
    level.levelNumber === storeLevel.levelNumber
      ? 'bg-blue-950 text-white h-[560px] flex flex-col'
      : 'h-[500px]  mt-8 bg-gray-800 text-white flex flex-col'
  }`}
>
  <CardHeader>
  <CardTitle className="font-semibold text-center">
  {level.levelNumber === storeLevel.levelNumber ? (
    <p className="text-sm flex justify-center items-center font-extrabold text-center bg-white text-blue-900 px-2 py-1 rounded-md mt-2">
      {t('your_current_level')} <span className="ml-2"><CircleCheck /></span>
    </p>
  ) : level.levelNumber > storeLevel.levelNumber ? (
    <p className="text-sm text-center flex justify-center items-center text-white bg-yellow-400 px-2 py-1 rounded-md mt-2">
      {t('level_label', {level: level.levelNumber})} <span className="ml-2"><Star size={16} /></span>
    </p>
  ) : (
    <p className="text-sm text-center  flex justify-center items-center text-white bg-gray-700 px-2 py-1 rounded-md mt-2">
      {t('level_label', {level: level.levelNumber})} <span className="ml-2"><Pin size={16}  /></span>
    </p>
  )}
</CardTitle>
  </CardHeader>
  <CardContent className="flex-grow">
    <div className="space-y-4">
      <h3 className="font-semibold mt-2">{t('benefits_title')}</h3>
      <ul className="text-sm list-disc pl-5 space-y-1">
        {level.benefits.map((benefit, index) => (
          <li key={index} className="">
            {benefit}
          </li>
        ))}
      </ul>
    </div>
  </CardContent>
  <CardFooter className="flex items-center justify-center mt-auto">
    {level.levelNumber < storeLevel.levelNumber ? (
      <Badge className="text-xs bg-gray-700 hover:bg-gray-600 font-bold text-white">
        {t('level_unlocked')}
      </Badge>
    ) : (
      level.levelNumber > storeLevel.levelNumber && (
        <div className="flex items-center justify-center">
        <p className="text-sm font-bold text-yellow-400">
          {t('achieve_to_unlock', {minSales: level.minSales})}
        </p>
        </div>
      )
    )}
  </CardFooter>
</Card>
        </div>
      ))}
      </div>
    </>
  );
};

export default LevelsView;
