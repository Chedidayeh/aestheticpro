'use client'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Loader } from "lucide-react"

const LoadingState = ({isOpen} : {isOpen : boolean}) =>{

    return (
        <AlertDialog open={isOpen} >
        <AlertDialogTrigger>
        </AlertDialogTrigger>
        <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
        <AlertDialogHeader className="flex flex-col items-center">
            <AlertDialogTitle className="text-xl text-blue-700 font-bold text-center">
              Loading!
            </AlertDialogTitle>
            <AlertDialogDescription className="flex flex-col items-center">
              This will take a moment.
             <Loader className="text-blue-700 h-[30%] w-[30%] animate-spin mt-3" />
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>  
    )
}

export default LoadingState