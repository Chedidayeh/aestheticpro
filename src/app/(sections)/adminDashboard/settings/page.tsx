'use server'

import {  getPlatformForTheWebsite } from "@/actions/actions"
import SettingsView from "./SettingsView"
import { unstable_noStore as noStore } from "next/cache"
import { getAllCollections, getAllLevels } from "./actions"
import ErrorState from "@/components/ErrorState"

export default async function Page() {
    try {
        

    noStore()
    const platform = await getPlatformForTheWebsite()
    const collections = await getAllCollections()
    const levels = await getAllLevels()

    return (

        <SettingsView platform={platform!} collections={collections} levels={levels} />

    )

} catch (error) {
    return <ErrorState/>

        
}
}
