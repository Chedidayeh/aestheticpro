'use client';

import { Loader, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ChangeEvent, KeyboardEvent, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import MaxWidthWrapper from "../MaxWidthWrapper";
import { searchProducts } from "@/actions/actions";
import { useTranslations } from 'next-intl';

const SearchBar = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('MarketPlaceComponents');

  const handleSearch = () => {
    setIsPending(true);
    router.push(`/MarketPlace/searchQuery/${searchQuery}`);
    setTimeout(() => {
      setIsPending(false);
    }, 7000); // 5-second delay
  };

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setIsSearching(true);
    const value = event.target.value;
    setSearchQuery(value);
    if (value === '') {
      setData([]);
      setIsSearching(false);
      return;
    }
    try {
      const searchData = await searchProducts(value);
      setData(searchData);
      setIsSearching(false);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleOptionSelect = (option: string) => {
    setIsPending(true);
    setData([]);
    setSearchQuery("");
    router.push(`/MarketPlace/searchQuery/${option}`);
    setTimeout(() => {
      setIsPending(false);
    }, 7000); // 5-second delay
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (searchQuery === "") {
        return;
      }
      setData([]);
      setSearchQuery("");
      handleSearch();
    }
  };


useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setData([]); // Clear dropdown
    }
  };

  if (data.length > 0 && searchQuery !== "") {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [data, searchQuery]);


  return (
    <nav className='h-14 inset-x-0 z-[40] top-0 w-full  backdrop-blur-lg transition-all'>
      <MaxWidthWrapper>
        <>
          <AlertDialog open={isPending}>
            <AlertDialogTrigger asChild />
            <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
            <AlertDialogHeader className="flex  justify-center items-center">
              <AlertDialogTitle className="text-xl text-blue-700 font-bold text-center">
                {t('searchingForProducts')}
              </AlertDialogTitle>
              <AlertDialogDescription className="flex flex-col items-center">
                {t('thisWillTakeAMoment')}
              </AlertDialogDescription>
              <div className="text-blue-700 mb-2 text-center">
                        <Loader className="animate-spin" />
                      </div>  
              </AlertDialogHeader>
                    
          </AlertDialogContent>
          </AlertDialog>

          <div className='flex gap-1 items-center justify-center mt-2'>
            <Input
              type="search"
              className="w-[500px] rounded-xl border"
              placeholder={t('searchForProducts')}
              value={searchQuery}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
            />
            <Button disabled={searchQuery === ""} onClick={handleSearch} className="bg-blue-600 md:flex hidden text-white px-3 py-2 rounded-xl">
              {/* {t('search')} */}
              <Search size={18} className='' />
            </Button>
          </div>

          {isSearching && searchQuery !== '' && data.length === 0 && (
            <div className="flex items-center justify-center">
              <ul className="bg-gray-50 text-gray-800 border w-[100%] md:w-[80%] lg:w-[58%] xl:w-[55%] h-[10%] border-gray-300 mt-2 rounded-md shadow-lg">
                <li className="px-4 py-2 justify-center items-center flex text-blue-500">
                  <Loader className="animate-spin" />
                  <span className="ml-2">{t('searching')}...</span>
                </li>
              </ul>
            </div>
          )}

          {searchQuery !== '' && data.length > 0 && (
            <div ref={dropdownRef} className="flex items-center justify-center">
            <ul className="bg-gray-50 border text-gray-800 w-[100%] md:w-[80%] lg:w-[58%] xl:w-[55%] border-gray-300 mt-2 rounded-xl shadow-lg">
                {data.map((option, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-blue-600 hover:text-white cursor-pointer rounded-2xl"
                    onClick={() => handleOptionSelect(option)}
                  >
                    {option.toLowerCase()}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      </MaxWidthWrapper>
    </nav>
  );
};

export default SearchBar;
