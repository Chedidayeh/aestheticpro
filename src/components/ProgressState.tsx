'use client'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Progress } from "./ui/progress"

const ProgressState = ({ isOpen, progress }: { isOpen: boolean; progress: number }) => {

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogTrigger>
                {/* Add any trigger elements here if needed */}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader className="flex flex-col items-center">
                    <AlertDialogTitle className="text-2xl text-blue-700 font-bold text-center">
                        Loading!
                    </AlertDialogTitle>
                    <AlertDialogDescription className="flex flex-col items-center">
                        This will take a moment.
                        <Progress value={progress} className="w-full my-4" />
                        <div className="text-center text-sm text-muted-foreground">
                            {progress}%
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ProgressState
