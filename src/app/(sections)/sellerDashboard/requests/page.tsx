
import ViewRequests from "./ViewRequests"
import { getStoreByUserId, getUser } from "@/actions/actions"
import { unstable_noStore as noStore } from "next/cache"
import { getPaymentRequestsForStore } from "./actions"
import ErrorState from "@/components/ErrorState"

export default async function Page() {
  try {
    

    noStore()
    const user = await getUser()
    const store = await getStoreByUserId(user!.id)
    const paymentRequests = await getPaymentRequestsForStore(store.id)

  return (
    <>
    <ViewRequests paymentRequests={paymentRequests} />

    </>
  )
} catch (error) {
  console.error(error)
  return <ErrorState/>
    
}
}
