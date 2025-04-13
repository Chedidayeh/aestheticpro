'use server'

import { getUser } from "@/actions/actions";
import { getAllCategories, getUserPreOrders } from "./actions";
import CategoryView from "./CategoryView";
import ErrorState from "@/components/ErrorState";


const Page = async () => {

  try {
    const user = await getUser()
    

    const preOrders = await getUserPreOrders(user?.id!);


    const categories = await getAllCategories()

     

    
  

  return (

    <CategoryView categories={categories}  preOrders={preOrders}/>

  );
} catch (error) {
  return <ErrorState/>

    
}
}

export default Page;
