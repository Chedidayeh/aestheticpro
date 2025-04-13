import { getPlatformForTheWebsite } from '@/actions/actions'
import { Platform } from '@prisma/client'
import Marquee from 'react-fast-marquee'

const TopBar = ({platform} : {platform : Platform}) => {
  

  return (
    <nav className='sticky h-8 inset-x-0 top-0 w-full border-b border-gray-200 dark:border-muted-foreground backdrop-blur-lg transition-all flex items-center justify-between px-4'>
      <Marquee>
        <div className='flex items-center text-blue-700 dark:text-blue-500 text-sm'>
          {platform?.topBarContent.map((content, index) => (
            <div key={index} className='flex items-center'>
              <span>{content}</span>
              {index < platform!.topBarContent.length - 1 && (
                <div className='mx-2 border-l dark:text-blue-500 border-blue-700 h-4'></div>
              )}
            </div>
          ))}
        </div>
      </Marquee>
    </nav>
  )
}

export default TopBar
