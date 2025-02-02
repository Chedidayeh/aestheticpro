/* eslint-disable react/no-unescaped-entities */
import NextImage from 'next/image'
import { getOrder } from '@/actions/actions'
import LoadingLink from '@/components/LoadingLink'
import ThankYouPage from './ThankYou'
import ErrorState from '@/components/ErrorState'

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
    
  const order = await getOrder(orderId!)
  


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