'use server'

import { getAllCategories } from "./actions";
import CategoryView from "./CategoryView";
import ErrorState from "@/components/ErrorState";


const Page = async () => {

  try {
    



    const categories = await getAllCategories()

     


  

  return (

    <CategoryView categories={categories} />

  );
} catch (error) {
  return <ErrorState/>

    
}
}

export default Page;
