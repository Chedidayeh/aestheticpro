'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import LoadingState from "@/components/LoadingState"
import {  changeNumber, deleteStore, doesStoreNameExist, toggleDisplayContact, updateSocialLinks, updateStoreBio, updateStoreLogo, updateStoreName } from "./actions"
import { getStoreByUserId, getUser } from "@/actions/actions"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { SingleImageDropzone } from "@/components/sellerDashboard/SingleImageDropzone"
import { storage } from "@/firebase/firebaseConfig"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Store } from "@prisma/client"
export default function SettingsView({store} : {store : Store}) {

    const router = useRouter();
    const { toast } = useToast()
    const [selectedSection, setSelectedSection] = useState("general");
    const [newStoreName, setNewStoreName] = useState(store.storeName);
    const [storeBio, setStoreBio] = useState(store.storeBio); 
    const [facebookLink, setFacebookLink] = useState(store.facebookLink);
    const [instagramLink, setInstagramLink] = useState(store.instagramLink);
    const [isDialogOpen, setDialogOpen] = useState(false);

                  // check phone number length
                  const [phoneNumber, setPhoneNumber] = useState(store.userPhoneNumber);
                  const [phoneNumberError, setPhoneNumberError] = useState('');
                  const inputClassName = phoneNumberError ? 'border-red-500' : (phoneNumber ? 'border-green-500' : '');
                  const handlePhoneNumberBlur = () => {
                    if (phoneNumber.length !== 8) {
                      setPhoneNumberError('Phone number must be 8 digits long.');
                    } else {
                      setPhoneNumberError('');
                    }
                  };
    
                  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                    const phoneNumberValue = event.target.value;
                      setPhoneNumber(phoneNumberValue);
                  };


    const [file, setFile] = useState<File>();
    const [storeName, setStoreName] = useState(store.storeName);
    const [open, setOpen] = useState<boolean>(false);
    const [displayContact, setDisplayContact] = useState(store.displayContact);


    const updatePhoneNumber = async () => {
        try {
            setOpen(true); // Show loading state
    
            // Call the function to update the phone number
            const res = await changeNumber(store.id, phoneNumber);
    
            // Check if the update was successful
            if (res) {
                setOpen(false); // Hide loading state
                toast({
                    title: 'Phone number successfully updated',
                    variant: 'default', // You can use 'default' or customize the variant
                });
            } else {
                setOpen(false); // Hide loading state
                toast({
                    title: 'Phone number update failed',
                    description: 'Please try again later.',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Failed to update phone number:', error);
            setOpen(false); // Hide loading state
    
            // Show error toast
            toast({
                title: 'Error updating phone number',
                description: 'Something went wrong, please try again.',
                variant: 'destructive',
            });
        }
    };
    

    const handleToggle = async () => {
        try {
            setOpen(true); // Show loading state
    
            // Toggle displayContact state
            const newDisplayState = !displayContact;
            setDisplayContact(newDisplayState);
    
            // Update displayContact in the backend
            await toggleDisplayContact(store.id, newDisplayState);
    
            // Success toast
            toast({
                title: "Display Contact Updated",
                description: `Display Contact is now ${newDisplayState ? "enabled" : "disabled"}.`,
                variant: "default",
            });
        } catch (error) {
            console.error("Error toggling display contact:", error);
            // Error toast
            toast({
                title: "Something went wrong!",
                description:"Failed to update the display contact setting.",
                variant: "destructive",
            });
        } finally {
            setOpen(false); // Hide loading state
        }
    };
    

    const handleChangeStoreName = async () => {
        try {
            setOpen(true);
            const storeNameExist = await doesStoreNameExist(newStoreName);
            if (storeNameExist) {
                toast({
                    title: 'This Store name is used',
                    description : 'try other one!',
                    variant: 'destructive',
                  });
                  setOpen(false);
                  return
            }
            setStoreName(store.storeName)
            const res = await updateStoreName(store.id , newStoreName)
            if(res){
                setOpen(false);
                toast({
                    title: 'Store name Was Successfully changed',
                    variant: 'default',
                  });
                router.refresh()
            }
            else {
                setOpen(false);
                toast({
                    title: 'Store name Was not changed',
                    variant: 'destructive',
                  });
                router.refresh()
            }
        } catch (error) {
            console.log(error)
            setOpen(false);
            toast({
                title: 'Error',
                variant: 'destructive',
                });
                console.log(error)
            
        }
    }

    const handleAddSocialLinks = async () => {
        try {
            setOpen(true);
            
                // Function to remove trailing slashes from the URL
                const removeTrailingSlash = (url: string) => url.replace(/\/$/, '');

                // Remove trailing slashes (if any) from both links
                const cleanedFacebookLink = facebookLink ? removeTrailingSlash(facebookLink) : null;
                const cleanedInstagramLink = instagramLink ? removeTrailingSlash(instagramLink) : null;

                // Only validate links if they are not null or empty
                const isValidFacebook = cleanedFacebookLink ? /^(https?:\/\/)?(www\.)?facebook\.com\/[A-Za-z0-9\.\-]+$/.test(cleanedFacebookLink) : true;
                const isValidInstagram = cleanedInstagramLink ? /^(https?:\/\/)?(www\.)?instagram\.com\/[A-Za-z0-9\.\-]+$/.test(cleanedInstagramLink) : true;

                // If any link is invalid, show a toast
                if (!isValidFacebook || !isValidInstagram) {
                    setOpen(false);
                    toast({
                        title: 'Invalid social link format',
                        description: 'Please ensure that the social links are valid URLs.',
                        variant: 'destructive',
                    });
                    return; // Stop execution if any link is invalid
                }

            const res = await updateSocialLinks(store.id, { facebook: facebookLink , instagram: instagramLink });
            if(res){
                setOpen(false);
                toast({
                    title: 'Social links were successfully updated',
                    variant: 'default',
                });
                router.refresh()
            } else {
                setOpen(false);
                toast({
                    title: 'Social links were not updated',
                    variant: 'destructive',
                });
                router.refresh()
            }
        } catch (error) {
            console.log(error)
            setOpen(false);
            toast({
                title: 'Error',
                variant: 'destructive',
            });
        }
    }


    const handleUpdateStoreBio = async () => {  // New function to handle store bio update
        try {
            setOpen(true);
            const res = await updateStoreBio(store.id, storeBio);
            if (res) {
                setOpen(false);
                toast({
                    title: 'Store bio was successfully updated',
                    variant: 'default',
                });
                router.refresh();
            } else {
                setOpen(false);
                toast({
                    title: 'Store bio was not updated',
                    variant: 'destructive',
                });
                router.refresh();
            }
        } catch (error) {
            console.log(error);
            setOpen(false);
            toast({
                title: 'Error',
                variant: 'destructive',
            });
        }
    };

     // New function to handle the store logo update
     const handleUpdateStoreLogo = async () => {
        if (!file) {
            toast({
                title: 'No file selected',
                description: 'Please select a file to upload.',
                variant: 'destructive',
            });
            return;
        }

        try {
            setOpen(true);
            const path = await uploadLogo(file);
            if (path) {
                const user = await getUser();
                const store = await getStoreByUserId(user!.id);
                const res = await updateStoreLogo(store.id, path); // Update the logo path in the database

                if (res) {
                    toast({
                        title: 'Store logo updated successfully',
                        variant: 'default',
                    });
                    router.refresh();
                } else {
                    toast({
                        title: 'Store logo update failed',
                        variant: 'destructive',
                    });
                }
            }
        } catch (error) {
            console.log(error);
            toast({
                title: 'Error',
                variant: 'destructive',
            });
        } finally {
            setOpen(false);
        }
    };

                const uploadLogo = async (file: File) => {
                    const storageRef = ref(storage, `sellers/stores/${storeName}/store image/$${Date.now()}.png`);
                  
                    try {
                      const snapshot = await uploadBytes(storageRef, file);
                      const downloadURL = await getDownloadURL(snapshot.ref);
                      if(downloadURL) {
                        toast({
                         title: 'Design Upload Success',
                          description: 'Design image uploaded successfully!',
                          });
                          return downloadURL
                      }
                    } catch (error) {
                      console.error("Error uploading design:", error);
                      toast({
                      title: 'Upload Error',
                      description: 'Error uploading the image!',
                      variant: 'destructive',
                      });              
                    }
                  }


                  const handleStoreDelete = async () => {
                    try {
                        setDialogOpen(false)
                        setOpen(true);
                                
                        const user = await getUser();
                
                        // Assuming you have a deleteStore action to handle deletion
                        const res = await deleteStore(store.id , user!.id);
                
                        if (res) {
                            toast({
                                title: "Store deleted successfully",
                                description: "Your store has been permanently deleted.",
                                variant: "default",
                            });
                            router.push("/api/auth/logout");
                        } else {
                            toast({
                                title: "Store deletion failed",
                                description: "Something went wrong while trying to delete your store.",
                                variant: "destructive",
                            });
                            setOpen(false);
                            return
                        }
                    } catch (error) {
                        console.error("Error deleting store:", error);
                        toast({
                            title: "Error",
                            description: "An error occurred while attempting to delete your store.",
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
                            <Link href="#" className={`font-semibold ${selectedSection === "general" ? "text-primary" : ""}`} onClick={() => setSelectedSection("general")}>
                                General
                            </Link>
                            <Link href="#" className={`font-semibold ${selectedSection === "SocialLinks" ? "text-primary" : ""}`} onClick={() => setSelectedSection("SocialLinks")}>
                                Contact
                            </Link>
                            <Link href="#" className={`font-semibold ${selectedSection === "deletestore" ? "text-primary" : ""}`} onClick={() => setSelectedSection("deletestore")}>
                                Delete store
                            </Link>
                        </nav>
                        <div className="grid gap-6">
                            {selectedSection === "general" && (
                                <>
                                <Card x-chunk="dashboard-04-chunk-1">
                                    <CardHeader>
                                        <CardTitle>Store Name</CardTitle>
                                        <CardDescription>
                                            Change your store name.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                    <Input 
                                            placeholder="New Store Name" 
                                            value={newStoreName}
                                            onChange={(e) => setNewStoreName(e.target.value)}
                                        />                                    </CardContent>
                                    <CardFooter className="border-t px-6 py-4">
                                        <Button                                     
                                        className='text-white'
                                         onClick={handleChangeStoreName} disabled={newStoreName===""} >Change</Button>
                                    </CardFooter>
                                </Card>

                                <Card>
                                        <CardHeader>
                                            <CardTitle>Store Bio</CardTitle>
                                            <CardDescription>Add your store bio.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Input 
                                                placeholder="Describe your store" 
                                                value={storeBio || ""} 
                                                onChange={(e) => setStoreBio(e.target.value)}
                                            />
                                        </CardContent>
                                        <CardFooter className="border-t px-6 py-4">
                                            <Button                                     
                                             className='text-white'
                                             onClick={handleUpdateStoreBio} >Update</Button> 
                                        </CardFooter>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Store Logo</CardTitle>
                                            <CardDescription>Change your store logo.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <SingleImageDropzone
                                                className="border border-blue-800"
                                                width={200}
                                                height={200}
                                                value={file}
                                                onChange={(file) => setFile(file)}
                                            />
                                        </CardContent>
                                        <CardFooter className="border-t px-6 py-4">
                                            <Button onClick={handleUpdateStoreLogo} disabled={!file} className='text-white'>Update</Button> {/* Use the new function */}
                                        </CardFooter>
                                    </Card>

                                </>
                            )}

                            {selectedSection === "SocialLinks" && (
                                <>
                                 <Card x-chunk="dashboard-04-chunk-1">
                                    <CardHeader>
                                        <CardTitle>Display / Hide your Contact</CardTitle>
                                        <CardDescription>
                                            Use the switch to manage your contact.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                    <Switch
                                        defaultChecked={displayContact}
                                        onClick={handleToggle} // Handle the state change on toggle
                                    />
                                    <Label>        {displayContact ? "Hide Contact" : "Display Contact"}
                                    </Label>
                                    </div>  
                                    </CardContent>
                                </Card>

                                <Card x-chunk="dashboard-04-chunk-1">
                                    <CardHeader>
                                        <CardTitle>Phone Number</CardTitle>
                                        <CardDescription>
                                            Update your phone number.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">

                                        <Input 
                                            id="phoneNumber" 
                                            type="number" 
                                            defaultValue={phoneNumber}
                                            pattern="\d{8}"
                                            onBlur={handlePhoneNumberBlur}
                                            placeholder="99 999 999" 
                                            onChange={handlePhoneNumberChange}
                                            className={`${inputClassName} focus:ring-0  w-full sm:w-[50%] focus:border-green-500`}
                                            required 
                                        />
                                        {phoneNumberError && (
                                            <p className="text-sm text-red-500 mt-1">
                                            {phoneNumberError}
                                            </p>
                                        )}                                    
                                    </CardContent>
                                    <CardFooter className="border-t px-6 py-4">
                                        <Button onClick={updatePhoneNumber} disabled={phoneNumber.length !== 8} className='text-white'>Change</Button>
                                    </CardFooter>
                                </Card>


                                <Card x-chunk="dashboard-04-chunk-1">
                                    <CardHeader>
                                        <CardTitle>Social Links</CardTitle>
                                        <CardDescription>
                                            Add your social media links so clients can contact you for custom designs.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Input 
                                            disabled={!displayContact}
                                            placeholder="Facebook link" 
                                            value={facebookLink || undefined}
                                            onChange={(e) => setFacebookLink(e.target.value)}
                                        />    
                                        <Input 
                                            disabled={!displayContact}
                                            placeholder="Instagram link" 
                                            value={instagramLink || undefined}
                                            onChange={(e) => setInstagramLink(e.target.value)}
                                        />  
                                    </CardContent>
                                    <CardFooter className="border-t px-6 py-4">
                                        <Button onClick={handleAddSocialLinks} className='text-white'>Update</Button>
                                    </CardFooter>
                                </Card>
                                </>
                            )}

                            {selectedSection === "deletestore" && (
                                <Card x-chunk="dashboard-04-chunk-1">
                                    <CardHeader>
                                        <CardTitle>Delete your store</CardTitle>
                                        <CardDescription>
                                        Your store will be permanently deleted, and you will no longer have access to it.                                        
                                        </CardDescription>
                                    </CardHeader>
                                    <CardFooter className="border-t px-6 py-4">
                                        <Button onClick={()=>setDialogOpen(true)} className="bg-red-500 hover:bg-red-400 text-white" >Delete</Button>
                                    </CardFooter>
                                </Card>
                            )}
                            
                        </div>
                    </div>
                </main>
            </div>

            <LoadingState isOpen={open} />

            <AlertDialog open={isDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this store? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="text-white bg-red-500" onClick={handleStoreDelete}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

        </>
    )
}
