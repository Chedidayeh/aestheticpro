'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useState } from "react"
import LoadingState from "@/components/LoadingState"
import {  deleteAccount, getAffiliateAccountByUserId } from "./actions"
import { getUser } from "@/actions/actions"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
export default function Page() {

    const router = useRouter();
    const { toast } = useToast()
    const [selectedSection, setSelectedSection] = useState("delete");
    const [open, setOpen] = useState<boolean>(false);






                  const handleAffiliateAccountDelete = async () => {
                    try {
                        setOpen(true);
                                
                        const user = await getUser();
                        const account = await getAffiliateAccountByUserId(user!.id);
                
                        // Assuming you have a deleteStore action to handle deletion
                        const res = await deleteAccount(account!.id , user!.id);
                
                        if (res) {
                            toast({
                                title: "Account deleted successfully",
                                description: "Your account has been permanently deleted.",
                                variant: "default",
                            });
                            router.push("/api/auth/logout");
                        } else {
                            toast({
                                title: "Account deletion failed",
                                description: "Something went wrong while trying to delete your account.",
                                variant: "destructive",
                            });
                            setOpen(false);
                            return
                        }
                    } catch (error) {
                        console.error("Error deleting Account:", error);
                        toast({
                            title: "Error",
                            description: "An error occurred while attempting to delete your Account.",
                            variant: "destructive",
                        });
                    } finally {
                        setOpen(false);
                    }
                };

                
                
    return (
        <>
            <div className="flex min-h-screen w-full flex-col">
                <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
                    <div className="mx-auto grid w-full max-w-6xl gap-2">
                        <h1 className="text-3xl font-semibold">Settings</h1>
                    </div>
                    <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
                        <nav
                            className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0"
                        >
                            <Link href="#" className={`font-semibold ${selectedSection === "delete" ? "text-primary" : ""}`} onClick={() => setSelectedSection("delete")}>
                                Delete Account
                            </Link>
                        </nav>
                        <div className="grid gap-6">
                            {selectedSection === "delete" && (
                                <Card x-chunk="dashboard-04-chunk-1">
                                    <CardHeader>
                                        <CardTitle>Delete your account</CardTitle>
                                        <CardDescription>
                                        Your account will be permanently deleted, and you will no longer have access to it.                                        
                                        </CardDescription>
                                    </CardHeader>
                                    <CardFooter className="border-t px-6 py-4">
                                        <Button onClick={handleAffiliateAccountDelete} className="bg-red-500 hover:bg-red-400" >Delete</Button>
                                    </CardFooter>
                                </Card>
                            )}
                            
                        </div>
                    </div>
                </main>
            </div>

            <LoadingState isOpen={open} />

        </>
    )
}
