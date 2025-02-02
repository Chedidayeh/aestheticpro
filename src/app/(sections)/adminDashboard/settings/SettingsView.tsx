'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import React ,{  } from "react";
import Link from "next/link"
import { MoreHorizontal } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
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
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { addNewCollection, addTopBarContent, createLevel, deleteLevel, deleteTopBarCollection, deleteTopBarContent, updateCreation, updatePlatformData, updateStoreCreation } from "./actions"
import { Collection, Level, Platform, Product } from '@prisma/client';
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ExtraCollection extends Collection {
  products : Product[]
}
interface ViewProps {
    platform : Platform
    collections : ExtraCollection[]
    levels : Level[]
}


const SettingsView = ({ platform , collections , levels }: ViewProps ) => { 



    const router = useRouter();
    const { toast } = useToast()
    const [selectedSection, setSelectedSection] = useState("general");
    const [open, setOpen] = useState<boolean>(false);
    const [newContent, setNewContent] = useState("");
    const [newCollection, setNewCollection] = useState("");

    const [isStoreCreationEnabled, setIsStoreCreationEnabled] = useState(!platform.closeStoreCreation);

    const [isCreationEnabled, setIsCreationEnabled] = useState(!platform.closeCreation);

    

    const [updatedPlatformData, setUpdatedPlatformData] = useState({
        maxProductSellerProfit: platform.maxProductSellerProfit,
        ExtraDesignForProductPrice:platform.ExtraDesignForProductPrice,
        maxDesignSellerProfit: platform.maxDesignSellerProfit,
        platformDesignProfit: platform.platformDesignProfit,
        clientDesignPrice:platform.clientDesignPrice,
        shippingFee: platform.shippingFee,
        maxProductQuantity: platform.maxProductQuantity,
        affiliateUserProfit : platform.affiliateUserProfit,
        freeShippingFeeLimit : platform.freeShippingFeeLimit,
        productsLimitPerPage : platform.productsLimitPerPage
      });

      const [isCreateOpen, setIsCreateOpen] = useState(false)
      const [newLevel, setNewLevel] = useState({
        levelNumber: 0,
        minSales: 0,
        productLimit: 0,
        designLimit: 0,
        benefits : [""],
        newBenefit: "",
      });

      const handleAddBenefit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const trimmedBenefit = newLevel.newBenefit.trim(); // Trim the input to remove leading/trailing spaces
      
        if (e.key === "Enter" && trimmedBenefit !== "") {
          setNewLevel({
            ...newLevel,
            benefits: [...newLevel.benefits, trimmedBenefit], // Add the trimmed benefit to the list
            newBenefit: "", // Clear the input after adding the benefit
          });
        }
      };
      

      
  
      const handleAddLevel = async () => {
        try {
          setOpen(true);
          setIsCreateOpen(false)
          await createLevel(newLevel); // Assuming createLevel is defined elsewhere in your code
      
          // Success toast notification
          toast({
            title: 'Level Added Successfully',
            variant: 'default',
          });
          setOpen(false)
          router.refresh()
        } catch (error) {
          console.error('Error adding level:', error);
          setOpen(false)
          // Error toast notification
          toast({
            title: 'Failed to Add Level',
            description: error instanceof Error ? error.message : 'Unknown error occurred',
            variant: 'destructive',
          });
        }
      };

    
      const handleDeleteLevel = async (levelId: number) => {
        try {
          setOpen(true);  // Assuming this controls the modal or loading indicator

            await deleteLevel(levelId);

            // Success toast notification
            toast({
              title: 'Level Deleted Successfully',
              variant: 'default',
            });
            router.refresh()
        } catch (error) {
          console.error('Error deleting level:', error);
      
          // Error toast notification
          toast({
            title: 'Failed to Delete Level',
            description: error instanceof Error ? error.message : 'Unknown error occurred',
            variant: 'destructive',
          });
        } finally {
          setOpen(false);  // Close the modal or loading indicator
        }
      };



      const handleAddCollection = async () => {
        try {
            setOpen(true);
            // Call the function to add new content
            const res = await addNewCollection(newCollection);
            if (res.success) {
                setOpen(false);
                toast({
                    title: 'Collection Added Successfully',
                    variant: 'default',
                });
                router.refresh();
            } else {
                setOpen(false);
                toast({
                    title: 'Failed to Add Collection',
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

    const handleAddContent = async () => {
        try {
            setOpen(true);
            // Call the function to add new content
            const res = await addTopBarContent(platform.id, newContent);
            if (res) {
                setOpen(false);
                toast({
                    title: 'Content Added Successfully',
                    variant: 'default',
                });
                router.refresh();
            } else {
                setOpen(false);
                toast({
                    title: 'Failed to Add Content',
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

    const handleDeleteCollection = async (collection: ExtraCollection) => {
      try {
          setOpen(true);
          const res = await deleteTopBarCollection(collection.id);
          if (res.success) {
              setOpen(false);
              toast({
                  title: 'collection Deleted Successfully',
                  variant: 'default',
              });
              router.refresh();
          } else {
              setOpen(false);
              toast({
                  title: 'Failed to Delete collection',
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


    const handleDeleteContent = async (content: string) => {
        try {
            setOpen(true);
            const res = await deleteTopBarContent(platform.id, content);
            if (res) {
                setOpen(false);
                toast({
                    title: 'Content Deleted Successfully',
                    variant: 'default',
                });
                router.refresh();
            } else {
                setOpen(false);
                toast({
                    title: 'Failed to Delete Content',
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


    const handleToggleStoreCreation = async () => {
        try {
            setOpen(true);
            const res = await updateStoreCreation(platform.id, isStoreCreationEnabled);
            if (res) {
                setIsStoreCreationEnabled(!isStoreCreationEnabled);
                setOpen(false);
                toast({ title: 'Store Creation Updated Successfully', variant: 'default' });
                router.refresh();
            } else {
                setOpen(false);
                toast({ title: 'Failed to Update Store Creation', variant: 'destructive' });
                router.refresh();
            }
        } catch (error) {
            console.log(error);
            setOpen(false);
            toast({ title: 'Error', variant: 'destructive' });
        }
    };

    const handleToggleCreation = async () => {
      try {
          setOpen(true);
          const res = await updateCreation(platform.id, isCreationEnabled);
          if (res) {
              setIsCreationEnabled(!isCreationEnabled);
              setOpen(false);
              toast({ title: 'Creation Updated Successfully', variant: 'default' });
              router.refresh();
          } else {
              setOpen(false);
              toast({ title: 'Failed to Update Creation', variant: 'destructive' });
              router.refresh();
          }
      } catch (error) {
          console.log(error);
          setOpen(false);
          toast({ title: 'Error', variant: 'destructive' });
      }
  };


    const handleUpdatePlatformData = async () => {
        try {
          setOpen(true);
          const res = await updatePlatformData(platform.id, updatedPlatformData);
          if (res) {
            setOpen(false);
            toast({ title: "Platform Data Updated Successfully", variant: "default" });
            router.refresh();
          } else {
            setOpen(false);
            toast({ title: "Failed to Update Platform Data", variant: "destructive" });
            router.refresh();
          }
        } catch (error) {
          console.log(error);
          setOpen(false);
          toast({ title: "Error", variant: "destructive" });
        }
      };

  return (
    <>


    <div className="flex min-h-screen w-full flex-col">
        <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 rounded-2xl bg-muted/40 p-4 md:gap-8 md:p-10">
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
                    <Link href="#" className={`font-semibold ${selectedSection === "StoreCreation" ? "text-primary" : ""}`} onClick={() => setSelectedSection("StoreCreation")}>
                        Store Creation
                    </Link>
                    <Link href="#" className={`font-semibold ${selectedSection === "Creation" ? "text-primary" : ""}`} onClick={() => setSelectedSection("Creation")}>
                        Creation
                    </Link>
                    <Link href="#" className={`font-semibold ${selectedSection === "data" ? "text-primary" : ""}`} onClick={() => setSelectedSection("data")}>
                        Platform Data
                    </Link>
                    <Link href="#" className={`font-semibold ${selectedSection === "level" ? "text-primary" : ""}`} onClick={() => setSelectedSection("level")}>
                        Levels
                    </Link>
                </nav>
                <div className="grid gap-6">
                    {selectedSection === "general" && (
                                <Card>
                                <CardHeader>
                                    <CardTitle>Top Bar</CardTitle>
                                    <CardDescription>Add content.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Input 
                                        placeholder="Add a line" 
                                        value={newContent}
                                        onChange={(e) => setNewContent(e.target.value)}
                                    />
                                </CardContent>
                                <CardFooter className="border-t px-6 py-4">
                                    <Button onClick={handleAddContent}>Add</Button>
                                </CardFooter>
                            </Card>
                    )}

                    {selectedSection === "general" && (
                            <Card x-chunk="dashboard-04-chunk-1">
                            <CardHeader>
                                <CardTitle>Top Bar</CardTitle>
                                <CardDescription>
                                    contents: 
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Phrase</TableHead>
                                  <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                                {platform.topBarContent.map((phrase, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{phrase}</TableCell>
                                                        <TableCell className="text-right">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button
                                                                        aria-haspopup="true"
                                                                        size="icon"
                                                                        variant="ghost"
                                                                    >
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                        <span className="sr-only">Toggle menu</span>
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleDeleteContent(phrase)}
                                                                    >
                                                                        Delete
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                            </Table>     
                           </CardContent>

                        </Card>

                    )}

                    {selectedSection === "general" && (
                                <Card>
                                <CardHeader>
                                    <CardTitle>Collections</CardTitle>
                                    <CardDescription>Add collection</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Input 
                                        placeholder="Add a collection" 
                                        value={newCollection}
                                        onChange={(e) => setNewCollection(e.target.value)}
                                    />
                                </CardContent>
                                <CardFooter className="border-t px-6 py-4">
                                    <Button onClick={handleAddCollection}>Add</Button>
                                </CardFooter>
                            </Card>
                    )}

                    {selectedSection === "general" && (
                            <Card x-chunk="dashboard-04-chunk-1">
                            <CardHeader>
                                <CardTitle>Collection</CardTitle>
                                <CardDescription>
                                    contents: 
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Collection</TableHead>
                                  <TableHead>Products</TableHead>
                                  <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                                {collections.map((collection, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{collection.name}</TableCell>
                                                        <TableCell>{collection.products.length}</TableCell>
                                                        <TableCell className="text-right">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button
                                                                        aria-haspopup="true"
                                                                        size="icon"
                                                                        variant="ghost"
                                                                    >
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                        <span className="sr-only">Toggle menu</span>
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleDeleteCollection(collection)}
                                                                    >
                                                                        Delete
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                            </Table>     
                           </CardContent>

                        </Card>

                    )}

                        {selectedSection === "StoreCreation" && (
                            <Card x-chunk="dashboard-04-chunk-1">
                            <CardHeader>
                                <CardTitle>Store Creation</CardTitle>
                                <CardDescription>
                                    Configure Store Creation: 
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                            <div className="flex items-center space-x-2">
                                            <Switch
                                                id="store-creation-switch"
                                                checked={isStoreCreationEnabled}
                                                onCheckedChange={handleToggleStoreCreation}
                                            />
                                            <Label htmlFor="store-creation-switch">{!platform.closeStoreCreation ? "Disable Store Creation" : "Enable Store Creation"}</Label>
                                        </div>    
                           </CardContent>

                        </Card>

                    )}

                    {selectedSection === "Creation" && (
                            <Card x-chunk="dashboard-04-chunk-1">
                            <CardHeader>
                                <CardTitle>Creation</CardTitle>
                                <CardDescription>
                                    Configure Creation: 
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                            <div className="flex items-center space-x-2">
                                            <Switch
                                                id="creation-switch"
                                                checked={isCreationEnabled}
                                                onCheckedChange={handleToggleCreation}
                                            />
                                            <Label htmlFor="creation-switch">{!platform.closeCreation ? "Disable Creation" : "Enable Creation"}</Label>
                                        </div>    
                           </CardContent>

                        </Card>

                    )}

                    {selectedSection === "data" && (
                            <Card x-chunk="dashboard-04-chunk-1">
                            <CardHeader>
                                <CardTitle>Platform Data</CardTitle>
                                <CardDescription>
                                    Configure Platform Data : 
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label>Max Product Seller Profit</Label>
                        <Input
                          type="number"
                          value={updatedPlatformData.maxProductSellerProfit}
                          onChange={(e) =>
                            setUpdatedPlatformData({
                              ...updatedPlatformData,
                              maxProductSellerProfit: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Extra Design For Product Price</Label>
                        <Input
                          type="number"
                          value={updatedPlatformData.ExtraDesignForProductPrice}
                          onChange={(e) =>
                            setUpdatedPlatformData({
                              ...updatedPlatformData,
                              ExtraDesignForProductPrice: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Max Design Seller Profit</Label>
                        <Input
                          type="number"
                          value={updatedPlatformData.maxDesignSellerProfit}
                          onChange={(e) =>
                            setUpdatedPlatformData({
                              ...updatedPlatformData,
                              maxDesignSellerProfit: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Platform Design Profit</Label>
                        <Input
                          type="number"
                          value={updatedPlatformData.platformDesignProfit}
                          onChange={(e) =>
                            setUpdatedPlatformData({
                              ...updatedPlatformData,
                              platformDesignProfit: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>client Design Price</Label>
                        <Input
                          type="number"
                          value={updatedPlatformData.clientDesignPrice}
                          onChange={(e) =>
                            setUpdatedPlatformData({
                              ...updatedPlatformData,
                              clientDesignPrice: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Shipping Fee</Label>
                        <Input
                          type="number"
                          value={updatedPlatformData.shippingFee}
                          onChange={(e) =>
                            setUpdatedPlatformData({
                              ...updatedPlatformData,
                              shippingFee: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Max Product Quantity</Label>
                        <Input
                          type="number"
                          value={updatedPlatformData.maxProductQuantity}
                          onChange={(e) =>
                            setUpdatedPlatformData({
                              ...updatedPlatformData,
                              maxProductQuantity: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>affiliate User Profit</Label>
                        <Input
                          type="number"
                          value={updatedPlatformData.affiliateUserProfit}
                          onChange={(e) =>
                            setUpdatedPlatformData({
                              ...updatedPlatformData,
                              affiliateUserProfit: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label>Free Shipping Fee Limit</Label>
                        <Input
                          type="number"
                          value={updatedPlatformData.freeShippingFeeLimit}
                          onChange={(e) =>
                            setUpdatedPlatformData({
                              ...updatedPlatformData,
                              freeShippingFeeLimit: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label>Products Limit Per Page</Label>
                        <Input
                          type="number"
                          value={updatedPlatformData.productsLimitPerPage}
                          onChange={(e) =>
                            setUpdatedPlatformData({
                              ...updatedPlatformData,
                              productsLimitPerPage: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>

                    </div>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4">
                    <Button onClick={handleUpdatePlatformData}>Update</Button>
                  </CardFooter>
                        </Card>

                    )}

                    {selectedSection === "level" && (
                      <>
                            <Card x-chunk="dashboard-04-chunk-1">
                            <CardHeader>
                                <CardTitle>Level Data</CardTitle>
                                <CardDescription>
                                    Configure Level Data : 
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                            <Table>
  <TableHeader>
    <TableRow>
      <TableHead>Level Number</TableHead>
      <TableHead>Min Sales</TableHead>
      <TableHead>Product Limit</TableHead>
      <TableHead>Design Limit</TableHead>
      <TableHead>Benefits</TableHead> {/* New column for Benefits */}
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {levels.map((level, index) => (
      <TableRow key={index}>
        <TableCell>{level.levelNumber}</TableCell>
        <TableCell>{level.minSales}</TableCell>
        <TableCell>{level.productLimit}</TableCell>
        <TableCell>{level.designLimit}</TableCell>
        <TableCell>
          {/* Display benefits as a comma-separated list */}
          {level.benefits && level.benefits.length > 0 ? (
            <ul>
              {level.benefits.map((benefit, i) => (
                <li key={i} className="list-disc pl-5">{benefit}</li>
              ))}
            </ul>
          ) : (
            <span>No benefits added</span>
          )}
        </TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleDeleteLevel(level.id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>


                  </CardContent>
                  <CardFooter className="border-t px-6 py-4">
                  <Button onClick={()=> {
                  setIsCreateOpen(true)
                  }} size={"sm"}>Add New Level</Button>
                  </CardFooter>
                        </Card>

                        <AlertDialog open={isCreateOpen}>
  <AlertDialogContent>
    <AlertDialogHeader className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Add New Level</h2>
    </AlertDialogHeader>
    <ScrollArea className=" w-full h-72 p-2">

    <div className="grid gap-4">
      <div className="flex flex-col">
        <label htmlFor="levelNumber" className="mb-1 text-sm font-medium text-gray-700">
          Level Number
        </label>
        <Input
          id="levelNumber"
          type="number"
          placeholder="Enter level number"
          value={newLevel.levelNumber}
          onChange={(e) =>
            setNewLevel({ ...newLevel, levelNumber: parseInt(e.target.value) })
          }
          required
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="minSales" className="mb-1 text-sm font-medium text-gray-700">
          Minimum Sales
        </label>
        <Input
          id="minSales"
          type="number"
          placeholder="Enter minimum sales"
          value={newLevel.minSales}
          onChange={(e) =>
            setNewLevel({ ...newLevel, minSales: parseInt(e.target.value) })
          }
          required
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="productLimit" className="mb-1 text-sm font-medium text-gray-700">
          Product Limit
        </label>
        <Input
          id="productLimit"
          type="number"
          placeholder="Enter product limit"
          value={newLevel.productLimit}
          onChange={(e) =>
            setNewLevel({ ...newLevel, productLimit: parseInt(e.target.value) })
          }
          required
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="designLimit" className="mb-1 text-sm font-medium text-gray-700">
          Design Limit
        </label>
        <Input
          id="designLimit"
          type="number"
          placeholder="Enter design limit"
          value={newLevel.designLimit}
          onChange={(e) =>
            setNewLevel({ ...newLevel, designLimit: parseInt(e.target.value) })
          }
          required
        />
      </div>

      {/* Benefit Input */}
      <div className="flex flex-col">
              <label htmlFor="benefitInput" className="mb-1 text-sm font-medium text-gray-700">
                Add Benefit
              </label>
              <Input
                id="benefitInput"
                placeholder="Enter benefit and press Enter"
                value={newLevel.newBenefit}
                onChange={(e) =>
                  setNewLevel({ ...newLevel, newBenefit: e.target.value })
                }
                onKeyDown={handleAddBenefit}
              />
            </div>

            {/* Display Benefits */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Benefits:</h3>
              <ul className="list-disc pl-5">
                {newLevel.benefits.map((benefit, index) => (
                  <li key={index} className="text-sm text-gray-700">{benefit}</li>
                ))}
              </ul>
            </div>



    </div>

    </ScrollArea>



    <div className="mt-6 flex justify-end space-x-3">
      <Button
        onClick={() => setIsCreateOpen(false)}
        size="sm"
        variant="secondary"
      >
        Cancel
      </Button>
      <Button
        onClick={handleAddLevel}
        size="sm"
      >
        Add New Level
      </Button>
    </div>
  </AlertDialogContent>
</AlertDialog>


</>
                    )}
                    
                </div>
                
            </div>
        </main>
    </div>


    <LoadingState isOpen={open} />

</>
  )
}

export default SettingsView
