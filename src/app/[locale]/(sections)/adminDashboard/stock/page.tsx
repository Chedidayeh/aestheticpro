import ErrorState from "@/components/ErrorState";
import { getAllCategories } from "./action";
import CategoryView from "./CategoryView";


import { unstable_noStore as noStore } from "next/cache"

const Page = async () => {

  noStore()



  try {
    const data = await getAllCategories();
    return (
      <>
        <CategoryView categories={data} />
      </>
      );
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return <ErrorState/>

  }


  
}

export default Page;
