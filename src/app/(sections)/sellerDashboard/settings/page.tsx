import { getStoreByUserId, getUser } from '@/actions/actions';
import React from 'react'
import SettingsView from './SettingsView';
import ErrorState from '@/components/ErrorState';

const Page = async () => {

  try {
    


                const user = await getUser(); // Fetch user
                if (!user) throw new Error("User not found");
        
                const store = await getStoreByUserId(user.id); // Fetch store by user ID
                if (!store) throw new Error("Store not found");

                
  return (
    <SettingsView store={store} />
  )

} catch (error) {
  console.error(error);
  return <ErrorState/>

    
}
}

export default Page
