import Steps from '@/components/Steps'
import { ReactNode } from 'react'


const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
    <div className='p-4 sm:px-16'>
      <Steps />
      {children}
    </div>
    </>
  )
}

export default Layout