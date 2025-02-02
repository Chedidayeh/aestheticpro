import { getLevelByNumber, getStore, getUser } from '@/actions/actions'
import React from 'react'
import LevelsView from './LevelsView'
import { getAllLevels } from '../../adminDashboard/settings/actions'
import ErrorState from '@/components/ErrorState'

const Page = async () => {
  try {
    

  const user = await getUser()
  const store = await getStore(user!.id)
  const storeLevel = await getLevelByNumber(store.level)
  const levels = await getAllLevels()

  return (
    <LevelsView levels={levels} storeLevel={storeLevel} />
  )
} catch (error) {
  console.error(error)
  return <ErrorState/>

    
}
}

export default Page
