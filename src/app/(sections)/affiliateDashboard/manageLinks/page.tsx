
import { getPlatformForTheWebsite, getUser } from "@/actions/actions"
import { unstable_noStore as noStore } from "next/cache"
import ManageLinks from "./ManageLinks"
import { getAffiliateLinksForUser } from "./actions"
import ErrorState from "@/components/ErrorState"

export default async function Page() {
  try {
    
    noStore()
    const user = await getUser()
    const Links = await getAffiliateLinksForUser(user ? user.id : "")
    const platform = await getPlatformForTheWebsite()

  return (
    <>
    <ManageLinks Links={Links} platform={platform!} />

    </>
  )
} catch (error) {
  console.error(error)
  return <ErrorState/>
    
}
}
