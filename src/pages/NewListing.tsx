
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, Camera, Upload, X, Info, Check, ArrowRight, Pencil, 
} from "lucide-react";

// Sample categories for the dropdown - In a real app, these might come from an API
const categories = [
  "Tools",
  "Kitchen",
  "Outdoors",
  "Electronics",
  "Party & Events",
  "Sports",
  "Gardening",
  "Cleaning",
  "Books",
  "Kids & Toys",
  "Vehicles",
  "Other"
];

// Sample conditions for the dropdown
const conditions = [
  "Like New",
  "Very Good",
  "Good",
  "Fair",
  "Worn"
];

// Sample return periods for the dropdown
const returnPeriods = [
  "1-2 days",
  "3-7 days",
  "1-2 weeks",
  "2-4 weeks",
  "Flexible"
];

const meetupOptions = [
  "In-person meetup",
  "Porch pickup",
  "Public place",
  "Delivery (within area)",
  "Other"
];

const NewListing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");
  const [images, setImages] = useState<string[]>([]);
  
  // Form state for the item details
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    condition: "",
    brand: "",
    estimatedValue: "",
    ageOfItem: "",
    returnPeriod: "",
    securityDeposit: "",
    meetupPreference: "",
    additionalNotes: "",
    tags: "",
  });
  
  // Function to handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Function to handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Function to handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // In a real app, you'd upload these to a server
      // For this example, we'll just use local URLs
      const newImageUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImageUrls]);
      
      toast({
        title: "Images uploaded",
        description: `${files.length} image${files.length === 1 ? "" : "s"} uploaded successfully.`,
      });
    }
  };
  
  // Function to remove an image
  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };
  
  // Function to navigate between tabs
  const goToTab = (tab: string) => {
    setActiveTab(tab);
  };
  
  // Function to submit the form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.category || !formData.description || images.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields and upload at least one image.",
      });
      return;
    }
    
    // In a real app, this would call an API to create the listing
    toast({
      title: "Item listed successfully",
      description: "Your item has been added and is now available for borrowing.",
    });
    
    // Redirect to the item page
    setTimeout(() => {
      navigate("/profile");
    }, 1500);
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      
      <main className="flex-1 container py-8">
        <div className="mb-6">
          <Link to="/profile" className="text-muted-foreground hover:text-foreground inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to profile
          </Link>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col space-y-2 mb-6">
            <h1 className="text-3xl font-bold">Add a New Item</h1>
            <p className="text-muted-foreground">
              Share your item with your community. The more details you provide, the more likely someone will borrow it.
            </p>
          </div>
          
          <Card>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="details">
                  1. Item Details
                </TabsTrigger>
                <TabsTrigger value="terms">
                  2. Borrowing Terms
                </TabsTrigger>
              </TabsList>
              
              {/* Item Details Tab */}
              <TabsContent value="details">
                <CardHeader>
                  <CardTitle>Item Details</CardTitle>
                  <CardDescription>
                    Provide basic information about your item
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Item Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g., Power Drill, Stand Mixer, Camping Tent"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">
                        Category <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleSelectChange("category", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">
                        Description <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe your item in detail. Include features, specifications, and any important information borrowers should know."
                        rows={4}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="images">
                        Images <span className="text-destructive">*</span>
                      </Label>
                      <div className="border rounded-md p-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                          {images.map((image, index) => (
                            <div key={index} className="relative aspect-square bg-muted rounded-md overflow-hidden">
                              <img
                                src={image}
                                alt={`Item upload ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6"
                                onClick={() => handleRemoveImage(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                          
                          {images.length < 5 && (
                            <label htmlFor="image-upload" className="cursor-pointer">
                              <div className="flex flex-col items-center justify-center border border-dashed rounded-md aspect-square bg-muted/50 hover:bg-muted transition-colors">
                                <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                                <span className="text-sm text-muted-foreground">Add Photo</span>
                              </div>
                              <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handleImageUpload}
                              />
                            </label>
                          )}
                        </div>
                        
                        <div className="flex items-start">
                          <Info className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">
                            Upload up to 5 clear photos of your item. Include images from different angles.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="condition">Condition</Label>
                        <Select
                          value={formData.condition}
                          onValueChange={(value) => handleSelectChange("condition", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            {conditions.map((condition) => (
                              <SelectItem key={condition} value={condition}>
                                {condition}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="brand">Brand/Make</Label>
                        <Input
                          id="brand"
                          name="brand"
                          value={formData.brand}
                          onChange={handleInputChange}
                          placeholder="e.g., DeWalt, KitchenAid, Coleman"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="estimatedValue">Estimated Value ($)</Label>
                        <Input
                          id="estimatedValue"
                          name="estimatedValue"
                          value={formData.estimatedValue}
                          onChange={handleInputChange}
                          type="number"
                          min="0"
                          placeholder="e.g., 150"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="ageOfItem">Age of Item</Label>
                        <Input
                          id="ageOfItem"
                          name="ageOfItem"
                          value={formData.ageOfItem}
                          onChange={handleInputChange}
                          placeholder="e.g., 2 years, 6 months"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input
                        id="tags"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        placeholder="e.g., power tools, DIY, home improvement"
                      />
                      <p className="text-xs text-muted-foreground">
                        Add relevant tags to help users find your item
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Link to="/profile">
                    <Button variant="outline">Cancel</Button>
                  </Link>
                  <Button onClick={() => goToTab("terms")}>
                    Continue
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </CardFooter>
              </TabsContent>
              
              {/* Borrowing Terms Tab */}
              <TabsContent value="terms">
                <CardHeader>
                  <CardTitle>Borrowing Terms</CardTitle>
                  <CardDescription>
                    Specify conditions for borrowing your item
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="returnPeriod">
                        Borrow Period <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.returnPeriod}
                        onValueChange={(value) => handleSelectChange("returnPeriod", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a borrow period" />
                        </SelectTrigger>
                        <SelectContent>
                          {returnPeriods.map((period) => (
                            <SelectItem key={period} value={period}>
                              {period}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        How long can borrowers keep the item?
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="securityDeposit">Security Deposit ($)</Label>
                      <Input
                        id="securityDeposit"
                        name="securityDeposit"
                        value={formData.securityDeposit}
                        onChange={handleInputChange}
                        type="number"
                        min="0"
                        placeholder="e.g., 50"
                      />
                      <p className="text-xs text-muted-foreground">
                        Optional - Amount to request as security, to be returned when the item is returned in good condition
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="meetupPreference">
                        Pickup/Dropoff Preference <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.meetupPreference}
                        onValueChange={(value) => handleSelectChange("meetupPreference", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select meetup preference" />
                        </SelectTrigger>
                        <SelectContent>
                          {meetupOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="additionalNotes">Additional Notes</Label>
                      <Textarea
                        id="additionalNotes"
                        name="additionalNotes"
                        value={formData.additionalNotes}
                        onChange={handleInputChange}
                        placeholder="Any other details about borrowing this item? Special instructions for use? Specific return condition requirements?"
                        rows={3}
                      />
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium mb-1">Tips for successful lending</h4>
                          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                            <li>Be clear about your borrowing terms</li>
                            <li>Take photos of the item before lending</li>
                            <li>Verify borrower's identity before handover</li>
                            <li>Include any accessories or special instructions</li>
                            <li>Be responsive to messages from potential borrowers</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => goToTab("details")}>
                    <ArrowLeft className="mr-1.5 h-4 w-4" />
                    Back
                  </Button>
                  <Button onClick={handleSubmit}>
                    <Check className="mr-1.5 h-4 w-4" />
                    List Item
                  </Button>
                </CardFooter>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>

      <footer className="w-full py-6 bg-muted">
        <div className="container px-4 md:px-6">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Borrow Anything. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default NewListing;
