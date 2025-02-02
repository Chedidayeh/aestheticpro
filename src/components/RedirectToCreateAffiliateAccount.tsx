'use client'

import React from 'react'
import { Button } from './ui/button'
import { useDispatch } from 'react-redux';
import { saveRedirectUrl } from '@/store/actions/action';
import { useRouter } from 'next/navigation';

const RedirectToCreateAffiliateAccount = () => {

    const dispatch = useDispatch();
    const router = useRouter()

      // redirectToCreateSellerProfile function
  const redirectToCreateSellerProfile = () => {
    dispatch(saveRedirectUrl("/createAffiliateAccount"));
    router.push("/createAffiliateAccount")
  }

  return (
    <Button onClick={redirectToCreateSellerProfile} className="px-4 py-3 text-sm font-semibold bg-purple-600 text-white rounded-md shadow-md hover:bg-purple-700 transition">
    Join Now &rarr;
    </Button>
  )
}

export default RedirectToCreateAffiliateAccount
