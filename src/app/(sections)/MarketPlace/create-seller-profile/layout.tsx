import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'


const Layout = ({ children }: { children: ReactNode  }) => {
  return (

    <SessionProvider>

    <MaxWidthWrapper className='flex-1 flex flex-col'>
      {children}
    </MaxWidthWrapper>
    </SessionProvider>


  )
}

export default Layout