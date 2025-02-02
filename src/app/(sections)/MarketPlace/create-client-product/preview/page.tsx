
import { getUserPreOrder } from './actions';
import OrderPreview from './OrderPreview';
import { getPlatformForTheWebsite, getUser } from '@/actions/actions';
import ErrorState from '@/components/ErrorState';
interface PageProps {
    params: {
      preOrderId: string
    }
  }
const Page = async ({ params }: PageProps) => {

  try {
    


    const { preOrderId } = params

    const user = await getUser()

    

    const preOrder = await getUserPreOrder(preOrderId , user?.id!);

    const platform  = await getPlatformForTheWebsite()



    return  <OrderPreview preOrder={preOrder!} user={user!} platform={platform!} />

  } catch (error) {
    console.error(error)
    return <ErrorState/>

    
  }

};

export default Page;
