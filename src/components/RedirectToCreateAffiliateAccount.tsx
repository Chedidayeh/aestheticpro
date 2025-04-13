'use client'

import React from 'react'
import { Button } from './ui/button'
import { useDispatch } from 'react-redux';
import { saveRedirectUrl } from '@/store/actions/action';
import { useRouter } from 'next/navigation';
interface RedirectProps {
  className?: string
  href: string
  children?: React.ReactNode
}

const RedirectToCreateAffiliateAccount: React.FC<RedirectProps> = ({ className, children , href }) => {

    const dispatch = useDispatch();
    const router = useRouter()

      // redirectToCreateSellerProfile function
  const redirectToCreateAffiliateAccount = () => {
    dispatch(saveRedirectUrl("/createAffiliateAccount"))
    router.push(href)
  }

  return (
        <Button
          size={"sm"}
          onClick={redirectToCreateAffiliateAccount}
          className={`${className}`}
        >
          {children}
        </Button>
  )
}

export default RedirectToCreateAffiliateAccount
