'use client'

import React from 'react'
import { Button } from './ui/button'
import { useDispatch } from 'react-redux';
import { saveRedirectUrl } from '@/store/actions/action';
import { useRouter } from 'next/navigation';

const RedirectToCreateSellerProfile = () => {

    const dispatch = useDispatch();
    const router = useRouter()

      // redirectToCreateSellerProfile function
  const redirectToCreateSellerProfile = () => {
    dispatch(saveRedirectUrl("/MarketPlace/create-seller-profile"));
    router.push("/MarketPlace/create-seller-profile")
  }

  return (
    <Button onClick={redirectToCreateSellerProfile} className="px-4 py-3 text-sm font-semibold bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition">
    Get Started &rarr;
    </Button>
  )
}

export default RedirectToCreateSellerProfile
