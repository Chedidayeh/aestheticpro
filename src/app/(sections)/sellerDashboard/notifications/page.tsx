
import ViewNotification from "./ViewNotification"
import { getStoreByUserId, getUser } from "@/actions/actions"
import { getNotificationsForStore } from "./actions"
import { unstable_noStore as noStore } from "next/cache"
import ErrorState from "@/components/ErrorState"

export default async function Page() {

  try {
    

    noStore()
    const user = await getUser()
    const store = await getStoreByUserId(user!.id)
    const notifications = await getNotificationsForStore(store.id)

  return (
    <>
    <ViewNotification notifications={notifications} />

    </>
  )
} catch (error) {
  console.error(error)
  return <ErrorState/>

    
}
}
