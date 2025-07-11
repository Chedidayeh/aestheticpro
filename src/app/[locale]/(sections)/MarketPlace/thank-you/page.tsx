/* eslint-disable react/no-unescaped-entities */
import NextImage from 'next/image'
import {getUser } from '@/actions/actions'
import ThankYouPage from './ThankYou'
import ErrorState from '@/components/ErrorState'
import { getOrder } from './actions'

interface PageProps {
  searchParams: {
    [key: string]: string  | undefined
  }
}

const Page = async ({
  searchParams,
}: PageProps) => {

  try {
    

  const {orderId} = searchParams
  const user = await getUser()
    
  const order = await getOrder(orderId! , user ? user.id : "")
  


  return (

    <>
    <ThankYouPage order={order} />
    </>
  )

} catch (error) {
  return <ErrorState/>
}
}

export default Page