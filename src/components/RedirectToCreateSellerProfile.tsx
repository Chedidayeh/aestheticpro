'use client'

import React from 'react'
import { Button } from './ui/button'
import { useDispatch } from 'react-redux'
import { saveRedirectUrl } from '@/store/actions/action'
import { useRouter } from 'next/navigation'

interface RedirectProps {
  className?: string
  href: string
  children?: React.ReactNode
}

const RedirectToCreateSellerProfile: React.FC<RedirectProps> = ({ className, children , href }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const handleRedirect = () => {
    const targetUrl = href
    dispatch(saveRedirectUrl("/MarketPlace/create-seller-profile"))
    router.push(targetUrl)
  }

  return (
    <Button
      size={"sm"}
      onClick={handleRedirect}
      className={`${className}`}
    >
      {children}
    </Button>
  )
}

export default RedirectToCreateSellerProfile
