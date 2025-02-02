import ErrorState from "@/components/ErrorState"
import CategoryView from "./CategoryView"
import { getAllCategoriesWithDetails } from "./actions"
import { unstable_noStore as noStore } from "next/cache"


const Page = async () =>{

    try {
        


    noStore()


    const categories = await getAllCategoriesWithDetails()

    return (
        <CategoryView categories={categories} />
    )

} catch (error) {
    console.error(error)
    return <ErrorState/>

        
}

}

export default Page