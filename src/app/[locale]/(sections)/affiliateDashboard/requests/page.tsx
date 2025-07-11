
import ViewRequests from "./ViewRequests"
import { getAffiliatePaymentRequest, getUser } from "@/actions/actions"
import ErrorState from "@/components/ErrorState"
import { unstable_noStore as noStore } from "next/cache"

export default async function Page() {

  try {
    
    noStore()
    const user = await getUser()
    const affiliate = await getAffiliatePaymentRequest(user!.id)

  return (
    <>
    <ViewRequests paymentRequests={affiliate!.affiliatePaymentRequest} />
    </>
  )
} catch (error) {
  console.error(error)
  return <ErrorState/>

    
}
}
