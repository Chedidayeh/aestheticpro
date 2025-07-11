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
import { useTranslations } from 'next-intl';
export default function SettingsView({store} : {store : Store}) {

    const router = useRouter();
    const { toast } = useToast()
    const t = useTranslations('SellerSettingsPage');
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
                      setPhoneNumberError(t('phone_number_length_error'));
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
                    title: t('toast_phone_update_success'),
                    variant: 'default', // You can use 'default' or customize the variant
                });
            } else {
                setOpen(false); // Hide loading state
                toast({
                    title: t('toast_phone_update_failed'),
                    description: t('toast_try_again_later'),
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Failed to update phone number:', error);
            setOpen(false); // Hide loading state
    
            // Show error toast
            toast({
                title: t('toast_phone_update_error'),
                description: t('toast_something_went_wrong'),
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
                title: t('toast_display_contact_updated'),
                description: newDisplayState ? t('toast_display_contact_enabled') : t('toast_display_contact_disabled'),
                variant: 'default',
            });
        } catch (error) {
            console.error("Error toggling display contact:", error);
            // Error toast
            toast({
                title: t('toast_something_went_wrong'),
                description: t('toast_display_contact_failed'),
                variant: 'destructive',
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
                    title: t('toast_store_name_used'),
                    description : t('toast_try_other_name'),
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
                    title: t('toast_store_name_changed'),
                    variant: 'default',
                  });
                router.refresh()
            }
            else {
                setOpen(false);
                toast({
                    title: t('toast_store_name_not_changed'),
                    variant: 'destructive',
                  });
                router.refresh()
            }
        } catch (error) {
            console.log(error)
            setOpen(false);
            toast({
                title: t('toast_error'),
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
                        title: t('toast_invalid_social_link'),
                        description: t('toast_valid_social_link_format'),
                        variant: 'destructive',
                    });
                    return; // Stop execution if any link is invalid
                }

            const res = await updateSocialLinks(store.id, { facebook: facebookLink , instagram: instagramLink });
            if(res){
                setOpen(false);
                toast({
                    title: t('toast_social_links_updated'),
                    variant: 'default',
                });
                router.refresh()
            } else {
                setOpen(false);
                toast({
                    title: t('toast_social_links_not_updated'),
                    variant: 'destructive',
                });
                router.refresh()
            }
        } catch (error) {
            console.log(error)
            setOpen(false);
            toast({
                title: t('toast_error'),
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
                    title: t('toast_store_bio_updated'),
                    variant: 'default',
                });
                router.refresh();
            } else {
                setOpen(false);
                toast({
                    title: t('toast_store_bio_not_updated'),
                    variant: 'destructive',
                });
                router.refresh();
            }
        } catch (error) {
            console.log(error);
            setOpen(false);
            toast({
                title: t('toast_error'),
                variant: 'destructive',
            });
        }
    };

     // New function to handle the store logo update
     const handleUpdateStoreLogo = async () => {
        if (!file) {
            toast({
                title: t('toast_no_file_selected'),
                description: t('toast_select_file_to_upload'),
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
                const res = await updateStoreLogo(store!.id, path); // Update the logo path in the database

                if (res) {
                    toast({
                        title: t('toast_store_logo_updated'),
                        variant: 'default',
                    });
                    router.refresh();
                } else {
                    toast({
                        title: t('toast_store_logo_update_failed'),
                        variant: 'destructive',
                    });
                }
            }
        } catch (error) {
            console.log(error);
            toast({
                title: t('toast_error'),
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
                         title: t('toast_design_upload_success'),
                          description: t('toast_design_image_uploaded'),
                          });
                          return downloadURL
                      }
                    } catch (error) {
                      console.error("Error uploading design:", error);
                      toast({
                      title: t('toast_upload_error'),
                      description: t('toast_error_uploading_image'),
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
                                title: t('toast_store_deleted'),
                                description: t('toast_store_deleted_desc'),
                                variant: 'default',
                            });
                            router.push("/api/auth/logout");
                        } else {
                            toast({
                                title: t('toast_store_delete_failed'),
                                description: t('toast_store_delete_failed_desc'),
                                variant: 'destructive',
                            });
                            setOpen(false);
                            return
                        }
                    } catch (error) {
                        console.error("Error deleting store:", error);
                        toast({
                            title: t('toast_error'),
                            description: t('toast_store_delete_error_desc'),
                            variant: 'destructive',
                        });
                    } finally {
                        setOpen(false);
                    }
                };

                
                
    return (
        <>
            <div className="flex min-h-screen w-full flex-col">
                <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
                    <div className="mx-auto grid w-full max-w-6xl gap-2">
                        <h1 className="text-3xl font-semibold">{t('settings_title')}</h1>
                    </div>
                    <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
                        <nav
                            className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0"
                        >
                            <Link href="#" className={`font-semibold ${selectedSection === "general" ? "text-primary" : ""}`} onClick={() => setSelectedSection("general")}> {t('nav_general')} </Link>
                            <Link href="#" className={`font-semibold ${selectedSection === "SocialLinks" ? "text-primary" : ""}`} onClick={() => setSelectedSection("SocialLinks")}> {t('nav_contact')} </Link>
                            <Link href="#" className={`font-semibold ${selectedSection === "deletestore" ? "text-primary" : ""}`} onClick={() => setSelectedSection("deletestore")}> {t('nav_delete_store')} </Link>
                        </nav>
                        <div className="grid gap-6">
                            {selectedSection === "general" && (
                                <>
                                <Card x-chunk="dashboard-04-chunk-1">
                                    <CardHeader className="bg-muted/50 rounded-t-lg mb-4">
                                        <CardTitle>{t('store_name_title')}</CardTitle>
                                        <CardDescription>
                                            {t('store_name_desc')}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                    <Input 
                                            placeholder={t('store_name_placeholder')} 
                                            value={newStoreName}
                                            onChange={(e) => setNewStoreName(e.target.value)}
                                        />                                    </CardContent>
                                    <CardFooter className="border-t px-6 py-4">
                                        <Button                                     
                                        className='text-white'
                                         onClick={handleChangeStoreName} disabled={newStoreName===""} >{t('change_button')}</Button>
                                    </CardFooter>
                                </Card>

                                <Card>
                                        <CardHeader className="bg-muted/50 rounded-t-lg mb-4">
                                            <CardTitle>{t('store_bio_title')}</CardTitle>
                                            <CardDescription>{t('store_bio_desc')}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Input 
                                                placeholder={t('store_bio_placeholder')} 
                                                value={storeBio || ""} 
                                                onChange={(e) => setStoreBio(e.target.value)}
                                            />
                                        </CardContent>
                                        <CardFooter className="border-t px-6 py-4">
                                            <Button                                     
                                             className='text-white'
                                             onClick={handleUpdateStoreBio} >{t('update_button')}</Button> 
                                        </CardFooter>
                                    </Card>

                                    <Card>
                                        <CardHeader className="bg-muted/50 rounded-t-lg mb-4">
                                            <CardTitle>{t('store_logo_title')}</CardTitle>
                                            <CardDescription>{t('store_logo_desc')}</CardDescription>
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
                                            <Button onClick={handleUpdateStoreLogo} disabled={!file} className='text-white'>{t('update_button')}</Button> {/* Use the new function */}
                                        </CardFooter>
                                    </Card>

                                </>
                            )}

                            {selectedSection === "SocialLinks" && (
                                <>
                                 <Card x-chunk="dashboard-04-chunk-1">
                                    <CardHeader className="bg-muted/50 rounded-t-lg mb-4">
                                        <CardTitle>{t('display_contact_title')}</CardTitle>
                                        <CardDescription>
                                            {t('display_contact_desc')}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                    <Switch
                                        defaultChecked={displayContact}
                                        onClick={handleToggle} // Handle the state change on toggle
                                    />
                                    <Label>{displayContact ? t('hide_contact') : t('display_contact')}</Label>
                                    </div>  
                                    </CardContent>
                                </Card>

                                <Card x-chunk="dashboard-04-chunk-1">
                                    <CardHeader className="bg-muted/50 rounded-t-lg mb-4">
                                        <CardTitle>{t('phone_number_title')}</CardTitle>
                                        <CardDescription>
                                            {t('phone_number_desc')}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">

                                        <Input 
                                            id="phoneNumber" 
                                            type="number" 
                                            defaultValue={phoneNumber}
                                            pattern="\d{8}"
                                            onBlur={handlePhoneNumberBlur}
                                            placeholder={t('phone_number_placeholder')} 
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
                                        <Button onClick={updatePhoneNumber} disabled={phoneNumber.length !== 8} className='text-white'>{t('change_button')}</Button>
                                    </CardFooter>
                                </Card>


                                <Card x-chunk="dashboard-04-chunk-1">
                                    <CardHeader className="bg-muted/50 rounded-t-lg mb-4">
                                        <CardTitle>{t('social_links_title')}</CardTitle>
                                        <CardDescription>
                                            {t('social_links_desc')}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Input 
                                            disabled={!displayContact}
                                            placeholder={t('facebook_link_placeholder')} 
                                            value={facebookLink || undefined}
                                            onChange={(e) => setFacebookLink(e.target.value)}
                                        />    
                                        <Input 
                                            disabled={!displayContact}
                                            placeholder={t('instagram_link_placeholder')} 
                                            value={instagramLink || undefined}
                                            onChange={(e) => setInstagramLink(e.target.value)}
                                        />  
                                    </CardContent>
                                    <CardFooter className="border-t px-6 py-4">
                                        <Button onClick={handleAddSocialLinks} className='text-white'>{t('update_button')}</Button>
                                    </CardFooter>
                                </Card>
                                </>
                            )}

                            {selectedSection === "deletestore" && (
                                <Card x-chunk="dashboard-04-chunk-1">
                                    <CardHeader className="bg-muted/50 rounded-t-lg">
                                        <CardTitle>{t('delete_store_title')}</CardTitle>
                                        <CardDescription>
                                        {t('delete_store_desc')}                                        
                                        </CardDescription>
                                    </CardHeader>
                                    <CardFooter className="border-t px-6 py-4">
                                        <Button onClick={()=>setDialogOpen(true)} className="bg-red-500 hover:bg-red-400 text-white" >{t('delete_button')}</Button>
                                    </CardFooter>
                                </Card>
                            )}
                            
                        </div>
                    </div>
                </main>
            </div>

            <LoadingState isOpen={open} />

            <AlertDialog open={isDialogOpen}>
            <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
            <AlertDialogHeader>
            <AlertDialogTitle>{t('confirm_deletion_title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('confirm_deletion_desc')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDialogOpen(false)}>{t('cancel_button')}</AlertDialogCancel>
            <AlertDialogAction className="text-white hover:bg-red-500 bg-red-500" onClick={handleStoreDelete}>{t('confirm_button')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

        </>
    )
}
