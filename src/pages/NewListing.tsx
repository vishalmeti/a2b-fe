/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/NewListingUltraModern.tsx
"use client"; // Add if using Next.js App Router

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // Use Link instead if needed
import NavBar from "@/components/NavBar"; // Adjust path if needed
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast"; // Adjust path if needed
// import { Separator } from "@/components/ui/separator";
import {
    ArrowLeft, Camera, X, Info, Check, ArrowRight, DollarSign, AlertCircle, FileImage, Settings2, ListChecks, ImagePlus, Clock
} from "lucide-react"; // Added Clock icon
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils"; // Adjust path if needed

import { apiService } from "@/services/apiService";
import { ItemRepository } from "@/repositories/Item";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import LoadingScreen from "@/components/loader/LoadingScreen"; // Import the LoadingScreen component
import { useDispatch, useSelector } from "react-redux";
import { usersCommunities } from '@/store/slices/userSlice';
import map from "lodash/map";
import { fetchCategories } from "@/store/slices/itemsSlice";
import { RootState } from "@/store/store";

// --- Data Mappings & Constants ---
// Replace with actual data fetching/logic

// --- Types ---
type FormData = {
    title: string;
    category: string;
    description: string;
    condition: string;
    deposit_amount: string;
    borrowing_fee: string;
    pickup_details: string;
    max_borrow_duration_days: string;
    availability_notes: string;
    community_id: string; // Changed from community to community_id
};
type FormErrors = Partial<Record<keyof FormData | 'images', string>>;

// --- Stepper Configuration ---
const steps = [
    { id: 0, title: "Item Details", description: "Core info description.", icon: FileImage },
    { id: 1, title: "Borrowing Terms", description: "Fees, deposit, duration & pickup.", icon: Settings2 }, // Updated description
    { id: 2, title: "Add Photos", description: "Upload item images.", icon: Camera }
];

// --- Helper: Vertical Stepper ---
const VerticalStepper = ({ currentStep, stepsConfig }: { currentStep: number; stepsConfig: typeof steps }) => (
    <nav aria-label="Progress">
        <ol className="space-y-6">
            {stepsConfig.map((step, index) => {
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                const Icon = step.icon;
                return (
                    <li key={step.title} className="relative flex items-start gap-4">
                        {/* Line connector */}
                        {index < stepsConfig.length - 1 && (
                            <div className="absolute left-[1.125rem] top-6 -ml-px mt-1 h-full w-0.5 bg-border" aria-hidden="true" />
                        )}
                        {/* Icon/Number */}
                        <div className={cn(
                            "relative z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2",
                            isActive ? "border-primary bg-primary/10" :
                            isCompleted ? "border-green-500 bg-green-500" :
                            "border-border bg-card"
                        )}>
                            {isCompleted ? (
                                <Check className="h-5 w-5 text-white" />
                            ) : (
                                <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                            )}
                        </div>
                        {/* Text Content */}
                        <div>
                            <h3 className={cn(
                                "text-sm font-semibold",
                                isActive ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                            )}>{step.title}</h3>
                            <p className="text-xs text-muted-foreground">{step.description}</p>
                        </div>
                    </li>
                );
            })}
        </ol>
    </nav>
);

// --- Main Component ---
const NewListingUltraModern = () => {
    useAuthRedirect();
    const navigate = useNavigate();
    const { toast } = useToast();
    const dispatch = useDispatch();
    const [activeStep, setActiveStep] = useState(0);
    const [images, setImages] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]); // <-- Added state for image files
    const [formData, setFormData] = useState<FormData>({
        title: "", category: "", description: "", condition: "",
        deposit_amount: "", borrowing_fee: "", pickup_details: "",
        max_borrow_duration_days: "", // <-- Initialized field
        availability_notes: "",      // <-- Initialized field
        community_id: "",            // <-- Initialized community_id field
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [isUploading, setIsUploading] = useState(false); // Add state for tracking upload status
    
    // Get categories from Redux store
    const categoryMap = useSelector((state: RootState) => state.items.categories);
    // Fix communities mapping to properly extract data from Redux state
    const communitiesList = useSelector((state: RootState) => {
        if (!state.user.data?.communities) return [];
        return state.user.data.communities.map((community: any) => ({
            value: community.community,
            label: community?.community_details?.name || 'Unknown Community'
        }));
    });
    console.log("Communities:", communitiesList);
    const categoryList = Object.keys(categoryMap);
    const conditionList = [ { value: "NEW", label: "New" }, { value: "LIKE_NEW", label: "Like New" }, { value: "GOOD", label: "Good" }, { value: "FAIR", label: "Fair" }, { value: "POOR", label: "Poor" } ];

    useEffect(() => {
        // Fetch categories from the Redux store
        dispatch(fetchCategories() as any);
        // Fetch user's communities to check if they are a member
        dispatch(usersCommunities() as any);
    }, [dispatch]);



    // --- Input Handlers ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (formErrors[name as keyof FormData]) {
            setFormErrors(prev => ({ ...prev, [name]: undefined }));
        }
        console.log("Form Data:", formData);
    };
    const handleSelectChange = (name: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: undefined }));
        }
        console.log("Form Data:", formData);
    };
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (formErrors.images) {
             setFormErrors(prev => ({...prev, images: undefined}));
        }
        if (files && files.length > 0 && imageFiles.length + files.length <= 5) {
            const newFiles = Array.from(files);
            const newImageUrls = newFiles.map(file => URL.createObjectURL(file));
            setImages(prev => [...prev, ...newImageUrls].slice(0, 5));
            setImageFiles(prev => [...prev, ...newFiles].slice(0, 5));
            toast({ variant: "success", title: "Images added", description: `${files.length} image${files.length === 1 ? "" : "s"} ready. Max 5 photos.` });
        } else if (files && imageFiles.length + files.length > 5) {
            toast({ variant: "destructive", title: "Limit Reached", description: `You can only upload up to 5 images.` });
        }
        e.target.value = "";
    };
     const handleRemoveImage = (indexToRemove: number) => {
         URL.revokeObjectURL(images[indexToRemove]);
         setImages(prev => prev.filter((_, i) => i !== indexToRemove));
         setImageFiles(prev => prev.filter((_, i) => i !== indexToRemove));
    };

    // --- Validation Logic ---
    const validateStep = useCallback((step: number): boolean => {
        const errors: FormErrors = {};
        const currentData = formData;
        if (step === 0) {
            if (!currentData.title.trim()) errors.title = "Item title is required.";
            if (!currentData.category) errors.category = "Please select a category.";
            if (!currentData.description.trim()) errors.description = "Description is required.";
            else if (currentData.description.trim().length < 10) errors.description = "Description should be at least 10 characters.";
            if (!currentData.condition) errors.condition = "Please select the item's condition.";
            if (!currentData.community_id) errors.community_id = "Please select a community.";
        } else if (step === 1) {
            if (!currentData.pickup_details.trim()) errors.pickup_details = "Pickup/Dropoff details are required.";
            const fee = parseFloat(currentData.borrowing_fee || "0");
            const deposit = parseFloat(currentData.deposit_amount || "0");
            if (isNaN(fee) || fee < 0) errors.borrowing_fee = "Invalid fee amount (must be 0 or positive).";
            if (isNaN(deposit) || deposit < 0) errors.deposit_amount = "Invalid deposit amount (must be 0 or positive).";
            // <-- Start validation for new fields -->
            if (currentData.max_borrow_duration_days) {
                const duration = parseInt(currentData.max_borrow_duration_days, 10);
                if (isNaN(duration) || duration <= 0) {
                    errors.max_borrow_duration_days = "Max duration must be a positive number of days.";
                }
            }
            // No specific validation for availability_notes unless required
            // <-- End validation for new fields -->
        } else if (step === 2) {
            if (images.length === 0) errors.images = "Please upload at least one image.";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
     }, [formData, images.length]);

    // --- Navigation ---
    const goToNextStep = () => {
        if (validateStep(activeStep)) {
            setActiveStep(prev => prev + 1);
            window.scrollTo(0, 0);
        } else {
            toast({ variant: "destructive", title: "Validation Error", description: "Please fix the highlighted fields before proceeding." });
        }
    };
    const goToPrevStep = () => {
        setActiveStep(prev => prev - 1);
        window.scrollTo(0, 0);
    };

    // --- Final Submission ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const step1Valid = validateStep(0);
        const step2Valid = validateStep(1);
        const step3Valid = validateStep(2);
        if (!step1Valid || !step2Valid || !step3Valid) {
             toast({ variant: "destructive", title: "Validation Error", description: "Please fix all highlighted fields before submitting." });
             if(!step1Valid) setActiveStep(0);
             else if (!step2Valid) setActiveStep(1);
             else if (!step3Valid) setActiveStep(2);
            return;
        }

        setIsUploading(true); // Start loading indicator

        try {
            const categoryId = categoryMap[formData.category];
            if (!categoryId) { 
                toast({ variant: "destructive", title: "Error", description: "Invalid category selected." }); 
                setIsUploading(false);
                return; 
            }
            const depositAmountFormatted = parseFloat(formData.deposit_amount || "0").toFixed(2);
            const borrowingFeeFormatted = parseFloat(formData.borrowing_fee || "0").toFixed(2);

            // Parse new field for max duration if provided
            const maxDuration = formData.max_borrow_duration_days ? parseInt(formData.max_borrow_duration_days, 10) : null;

            // Create a new FormData instance
            const formDataToSubmit = new FormData();
            formDataToSubmit.append("title", formData.title);
            formDataToSubmit.append("description", formData.description);
            formDataToSubmit.append("category", categoryId.toString());
            formDataToSubmit.append("condition", formData.condition);
            formDataToSubmit.append("deposit_amount", depositAmountFormatted);
            formDataToSubmit.append("borrowing_fee", borrowingFeeFormatted);
            formDataToSubmit.append("pickup_details", formData.pickup_details);
            // Add community ID to the form data
            formDataToSubmit.append("community_id", formData.community_id);
            // Append new fields if available
            if (maxDuration !== null) {
                formDataToSubmit.append("max_borrow_duration_days", maxDuration.toString());
            }
            formDataToSubmit.append("availability_notes", formData.availability_notes);

            // Append each image file with key "images"
            imageFiles.forEach(file => {
                formDataToSubmit.append("images", file);
            });

            // Use formDataToSubmit with your apiService
            const resp = await apiService.post(ItemRepository.CREATE, formDataToSubmit,{
                headers: { "Content-Type": "multipart/form-data" }
            });
            console.log("Submitting FormData payload:", formDataToSubmit);

            if (resp.status !== 200 && resp.status !== 201) {
                toast({ variant: "destructive", title: "Error", description: "Failed to create item listing." });
                setIsUploading(false); // End loading on error
                return;
            }

            if (resp.status === 201 ){
                toast({ variant: "success", title: "Item listed successfully!", description: "Your item is now available." });
                navigate("/profile");
            }
        } catch (error) {
            console.error("Error uploading listing:", error);
            toast({ 
                variant: "destructive", 
                title: "Upload Error", 
                description: "There was a problem uploading your listing. Please try again." 
            });
            setIsUploading(false); // End loading on catch error
        }
    };

    // --- Constants for JSX ---
    const requiredLabel = <span className="text-destructive">*</span>;
    const stepVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -15 }
    };

    // --- Render ---
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/20">
            {/* Show LoadingScreen during upload */}
            {isUploading && <LoadingScreen baseMessage="Uploading your item" showHomePage={false} />}
            
            <NavBar />

            <main className="flex-1 container py-8">
                {/* Header Section */}
                <div className="mb-8 space-y-3">
                     <Button variant="link" size="sm" onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground p-0 h-auto -ml-1">
                         <ArrowLeft className="mr-1 h-4 w-4" /> Back
                     </Button>
                    <div>
                         <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Share a New Item</h1>
                         <p className="text-muted-foreground max-w-2xl">Contribute to the community by listing items others can borrow.</p>
                    </div>
                </div>

                {/* Main Layout: Grid */}
                <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
                    {/* Vertical Stepper (Sidebar on md+) */}
                    <div className="md:col-span-1">
                        <div className="sticky top-24"> {/* Adjust top offset if needed */}
                            <VerticalStepper currentStep={activeStep} stepsConfig={steps} />
                        </div>
                    </div>

                    {/* Form Area */}
                    <div className="md:col-span-2 lg:col-span-3">
                        <Card className="overflow-visible shadow-lg border">
                            {/* Animated Content Area based on activeStep */}
                            <AnimatePresence initial={false}>
                                <motion.div
                                    key={activeStep}
                                    variants={stepVariants}
                                    initial="hidden" animate="visible" exit="exit"
                                    transition={{ type: "tween", ease: "easeInOut", duration: 0.25 }} // Use updated seamless transition
                                >
                                    {/* --- Step 1: Item Details --- */}
                                    {activeStep === 0 && (
                                        <form onSubmit={e => { e.preventDefault(); goToNextStep(); }}>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2"><FileImage className="h-5 w-5 text-primary"/> Step 1: Item Details</CardTitle>
                                                <CardDescription>Describe the item. Required fields marked {requiredLabel}.</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-8 pt-2 pb-8">
                                                {/* Basic Info Section */}
                                                <section className="space-y-4">
                                                    <h3 className="text-sm font-medium text-muted-foreground border-b pb-2 mb-4">Basic Information</h3>
                                                    {/* Title */}
                                                    <div className="space-y-1.5">
                                                        <Label htmlFor="title">Item Title {requiredLabel}</Label>
                                                        <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g., Bosch 18V Power Drill Kit..." required className={cn("text-base", formErrors.title && "border-destructive focus-visible:ring-destructive")} />
                                                        {formErrors.title && <p className="text-xs text-destructive flex items-center pt-1"><AlertCircle className="h-3 w-3 mr-1"/>{formErrors.title}</p>}
                                                    </div>
                                                    {/* Category & Condition Grid */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                                        {/* Category Select */}
                                                        <div className="space-y-1.5">
                                                            <Label htmlFor="category">Category {requiredLabel}</Label>
                                                            <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)} name="category">
                                                                <SelectTrigger className={cn(formErrors.category && "border-destructive focus:ring-destructive")}> <SelectValue placeholder="Select a category" /> </SelectTrigger>
                                                                <SelectContent>{categoryList.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                                                            </Select>
                                                            {formErrors.category && <p className="text-xs text-destructive flex items-center pt-1"><AlertCircle className="h-3 w-3 mr-1"/>{formErrors.category}</p>}
                                                        </div>
                                                        {/* Condition Select */}
                                                        <div className="space-y-1.5">
                                                            <Label htmlFor="condition">Condition {requiredLabel}</Label>
                                                            <Select value={formData.condition} onValueChange={(value) => handleSelectChange("condition", value)} name="condition">
                                                                <SelectTrigger className={cn(formErrors.condition && "border-destructive focus:ring-destructive")}> <SelectValue placeholder="Select condition" /> </SelectTrigger>
                                                                <SelectContent>{conditionList.map((cond) => <SelectItem key={cond.value} value={cond.value}>{cond.label}</SelectItem>)}</SelectContent>
                                                            </Select>
                                                             {formErrors.condition && <p className="text-xs text-destructive flex items-center pt-1"><AlertCircle className="h-3 w-3 mr-1"/>{formErrors.condition}</p>}
                                                        </div>
                                                    </div>
                                                    {/* Community Select - Added Field */}
                                                    <div className="space-y-1.5">
                                                        <Label htmlFor="community_id">Community {requiredLabel}</Label>
                                                        <Select value={formData.community_id} onValueChange={(value) => handleSelectChange("community_id", value)} name="community_id">
                                                            <SelectTrigger className={cn(formErrors.community_id && "border-destructive focus:ring-destructive")}> 
                                                                <SelectValue placeholder="Select a community" /> 
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {communitiesList.length > 0 ? (
                                                                    communitiesList.map((community) => (
                                                                        <SelectItem key={community.value} value={community.value.toString()}>
                                                                            {community.label}
                                                                        </SelectItem>
                                                                    ))
                                                                ) : (
                                                                    <div className="p-2 text-sm text-muted-foreground">
                                                                        No communities found. Please join a community first.
                                                                    </div>
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                        {formErrors.community_id && <p className="text-xs text-destructive flex items-center pt-1"><AlertCircle className="h-3 w-3 mr-1"/>{formErrors.community_id}</p>}
                                                    </div>
                                                </section>

                                                {/* Description Section */}
                                                <section className="space-y-4 pt-4">
                                                    <h3 className="text-sm font-medium text-muted-foreground border-b pb-2 mb-4">Detailed Description</h3>
                                                    <div className="space-y-1.5">
                                                        <Label htmlFor="description">Description {requiredLabel}</Label>
                                                        <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe features, size, included items (batteries, accessories?), condition details (scratches, quirks?), why you're lending it..." rows={5} required className={cn("text-base", formErrors.description && "border-destructive focus-visible:ring-destructive")} />
                                                        {formErrors.description && <p className="text-xs text-destructive flex items-center pt-1"><AlertCircle className="h-3 w-3 mr-1"/>{formErrors.description}</p>}
                                                    </div>
                                                </section>
                                            </CardContent>
                                            <CardFooter className="flex justify-end border-t pt-6 bg-muted/20">
                                                <Button type="submit" size="lg"> Next: Borrowing Terms <ArrowRight className="ml-2 h-4 w-4" /> </Button>
                                            </CardFooter>
                                        </form>
                                    )}

                                    {/* --- Step 2: Borrowing Terms --- */}
                                    {activeStep === 1 && (
                                        <form onSubmit={e => { e.preventDefault(); goToNextStep(); }}>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2"><Settings2 className="h-5 w-5 text-primary"/> Step 2: Borrowing Terms</CardTitle>
                                                <CardDescription>Specify lending conditions. Required fields marked {requiredLabel}.</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-8 pt-2 pb-8">
                                                {/* Costs & Duration Section */}
                                                <section className="space-y-4">
                                                    <h3 className="text-sm font-medium text-muted-foreground border-b pb-2 mb-4">Costs & Duration (Optional)</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        {/* Borrowing Fee */}
                                                        <div className="space-y-1.5 relative">
                                                            <Label htmlFor="borrowing_fee">Borrowing Fee</Label>
                                                            <DollarSign className="absolute left-3 top-[2.45rem] h-4 w-4 text-muted-foreground" />
                                                            <Input id="borrowing_fee" name="borrowing_fee" value={formData.borrowing_fee} onChange={handleInputChange} type="number" min="0" step="0.01" placeholder="0.00 (Free)" className={cn("pl-9 text-base", formErrors.borrowing_fee && "border-destructive focus-visible:ring-destructive")} />
                                                            <p className="text-xs text-muted-foreground pt-1">Optional fee per borrow period.</p>
                                                            {formErrors.borrowing_fee && <p className="text-xs text-destructive flex items-center pt-1"><AlertCircle className="h-3 w-3 mr-1"/>{formErrors.borrowing_fee}</p>}
                                                        </div>
                                                        {/* Security Deposit */}
                                                        <div className="space-y-1.5 relative">
                                                            <Label htmlFor="deposit_amount">Security Deposit</Label>
                                                            <DollarSign className="absolute left-3 top-[2.45rem] h-4 w-4 text-muted-foreground" />
                                                            <Input id="deposit_amount" name="deposit_amount" value={formData.deposit_amount} onChange={handleInputChange} type="number" min="0" step="0.01" placeholder="0.00 (None)" className={cn("pl-9 text-base", formErrors.deposit_amount && "border-destructive focus-visible:ring-destructive")} />
                                                            <p className="text-xs text-muted-foreground pt-1">Optional - Returned when item is returned safely.</p>
                                                             {formErrors.deposit_amount && <p className="text-xs text-destructive flex items-center pt-1"><AlertCircle className="h-3 w-3 mr-1"/>{formErrors.deposit_amount}</p>}
                                                        </div>
                                                    </div>
                                                    {/* Max Borrow Duration - Added Below the Grid */}
                                                    <div className="space-y-1.5 pt-4">
                                                        <Label htmlFor="max_borrow_duration_days">Max Borrow Duration (Days)</Label>
                                                        <Input id="max_borrow_duration_days" name="max_borrow_duration_days" value={formData.max_borrow_duration_days} onChange={handleInputChange} type="number" min="1" step="1" placeholder="e.g., 7" className={cn("text-base", formErrors.max_borrow_duration_days && "border-destructive focus-visible:ring-destructive")} />
                                                        <p className="text-xs text-muted-foreground pt-1">Optional - The maximum number of days one person can borrow the item.</p>
                                                        {formErrors.max_borrow_duration_days && <p className="text-xs text-destructive flex items-center pt-1"><AlertCircle className="h-3 w-3 mr-1"/>{formErrors.max_borrow_duration_days}</p>}
                                                    </div>
                                                </section>

                                                {/* Logistics Section */}
                                                <section className="space-y-4 pt-4">
                                                    <h3 className="text-sm font-medium text-muted-foreground border-b pb-2 mb-4">Pickup, Return & Availability</h3>
                                                    {/* Pickup Details */}
                                                    <div className="space-y-1.5">
                                                        <Label htmlFor="pickup_details">Pickup/Dropoff Details {requiredLabel}</Label>
                                                        <Textarea id="pickup_details" name="pickup_details" value={formData.pickup_details} onChange={handleInputChange} placeholder="Describe exactly how & where the exchange will happen. Be specific about availability or location boundaries. e.g., 'Porch pickup weekdays 5-8 PM near downtown library. Please message first...'" rows={4} required className={cn("text-base", formErrors.pickup_details && "border-destructive focus-visible:ring-destructive")} />
                                                        {formErrors.pickup_details && <p className="text-xs text-destructive flex items-center pt-1"><AlertCircle className="h-3 w-3 mr-1"/>{formErrors.pickup_details}</p>}
                                                    </div>
                                                    {/* Availability Notes - Added Field */}
                                                    <div className="space-y-1.5 pt-4">
                                                        <Label htmlFor="availability_notes">Availability Notes (Optional)</Label>
                                                        <Textarea id="availability_notes" name="availability_notes" value={formData.availability_notes} onChange={handleInputChange} placeholder="Add any specific notes about availability, e.g., 'Item not available June 5-10', 'Only available weekends', 'Check calendar link: [link]'" rows={3} className={cn("text-base", formErrors.availability_notes && "border-destructive focus-visible:ring-destructive")} />
                                                        <p className="text-xs text-muted-foreground pt-1">Optional notes about when the item might be unavailable.</p>
                                                        {formErrors.availability_notes && <p className="text-xs text-destructive flex items-center pt-1"><AlertCircle className="h-3 w-3 mr-1"/>{formErrors.availability_notes}</p>}
                                                    </div>
                                                </section>

                                                {/* Tips Box */}
                                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 p-4 rounded-lg !mt-8">
                                                     <div className="flex items-start">
                                                         <Info className="h-5 w-5 mr-3 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                                         <div>
                                                             <h4 className="font-semibold mb-1 text-sm text-blue-800 dark:text-blue-300">Tips for Successful Lending</h4>
                                                             <ul className="text-xs text-blue-700 dark:text-blue-400/90 space-y-1 list-disc pl-4">
                                                                <li>Specify a max borrow duration if needed.</li> {/* Added tip */}
                                                                <li>Be very clear about pickup/return instructions & times in details/notes.</li>
                                                                <li>Agree on the borrow duration beforehand via messages.</li>
                                                                <li>Consider taking quick photos before lending as proof of condition.</li>
                                                                <li>Be responsive to borrower messages.</li>
                                                             </ul>
                                                         </div>
                                                     </div>
                                                 </div>
                                            </CardContent>
                                            <CardFooter className="flex justify-between border-t pt-6 bg-muted/20">
                                                <Button type="button" variant="outline" onClick={goToPrevStep}> <ArrowLeft className="mr-2 h-4 w-4" /> Back </Button>
                                                <Button type="submit" size="lg"> Next: Add Photos <ArrowRight className="ml-2 h-4 w-4" /> </Button>
                                            </CardFooter>
                                        </form>
                                    )}

                                    {/* --- Step 3: Add Photos --- */}
                                    {activeStep === 2 && (
                                        <form onSubmit={handleSubmit}>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2"><Camera className="h-5 w-5 text-primary"/> Step 3: Add Photos</CardTitle>
                                                <CardDescription>Upload photos of your item. Required fields marked {requiredLabel}.</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-8 pt-2 pb-8">
                                                {/* Images Section */}
                                                <section className="space-y-4">
                                                    <h3 className="text-sm font-medium text-muted-foreground border-b pb-2 mb-4">Photos {requiredLabel}</h3>
                                                    <div className={cn("border rounded-lg p-4 bg-muted/20", formErrors.images ? "border-destructive ring-1 ring-destructive" : "border-border")}>
                                                        {/* Image Grid */}
                                                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
                                                            {images.map((image, index) => (
                                                                <div key={`${image}-${index}`} className="relative aspect-square rounded-md overflow-hidden group border shadow-sm bg-muted">
                                                                    <img src={image} alt={`Upload preview ${index + 1}`} className="w-full h-full object-cover"/>
                                                                    <Button variant="destructive" size="icon" className="absolute top-1.5 right-1.5 h-7 w-7 opacity-0 group-hover:opacity-90 focus-visible:opacity-90 transition-opacity z-10 rounded-full" onClick={() => handleRemoveImage(index)} aria-label="Remove image">
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            ))}
                                                            {/* Upload Placeholder */}
                                                            {images.length < 5 && (
                                                                <label htmlFor="image-upload-input" className={cn( "relative aspect-square w-full rounded-md border-2 border-dashed border-muted-foreground/40 flex flex-col items-center justify-center", "text-center text-muted-foreground cursor-pointer bg-background hover:bg-accent hover:border-primary hover:text-accent-foreground", "transition-all duration-200 ease-in-out group", "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:border-solid focus-within:border-primary" )} aria-label={`Add photo ${images.length + 1} of 5`} >
                                                                    <ImagePlus className="h-10 w-10 mb-1 text-muted-foreground/60 transition-transform duration-200 group-hover:scale-110 group-hover:text-primary" />
                                                                    <span className="text-[0.7rem] font-medium px-1 leading-tight mt-1">Click or Drop</span>
                                                                    <span className="text-[0.65rem] opacity-80">({images.length}/5)</span>
                                                                    <input id="image-upload-input" type="file" accept="image/jpeg, image/png, image/webp" multiple className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageUpload} />
                                                                </label>
                                                            )}
                                                        </div>
                                                        {formErrors.images && (<p className="text-xs text-destructive flex items-center -mt-2 mb-2"><AlertCircle className="h-3 w-3 mr-1"/>{formErrors.images}</p>)}
                                                        <div className="flex items-start"> <Info className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" /> <p className="text-xs text-muted-foreground">Upload 1-5 clear photos (JPG, PNG, WEBP). Drag & drop should work too!</p> </div>
                                                    </div>

                                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 p-4 rounded-lg !mt-8">
                                                        <div className="flex items-start">
                                                            <Info className="h-5 w-5 mr-3 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                                            <div>
                                                                <h4 className="font-semibold mb-1 text-sm text-blue-800 dark:text-blue-300">Photo Tips</h4>
                                                                <ul className="text-xs text-blue-700 dark:text-blue-400/90 space-y-1 list-disc pl-4">
                                                                    <li>Ensure good lighting to show item details clearly</li>
                                                                    <li>Include multiple angles of the item</li>
                                                                    <li>Show any existing damage or wear</li>
                                                                    <li>Include accessories or components that come with the item</li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>
                                            </CardContent>
                                            <CardFooter className="flex justify-between border-t pt-6 bg-muted/20">
                                                <Button type="button" variant="outline" onClick={goToPrevStep}> <ArrowLeft className="mr-2 h-4 w-4" /> Back </Button>
                                                <Button type="submit" size="lg"> <Check className="mr-2 h-4 w-4"/> List Item Now </Button>
                                            </CardFooter>
                                        </form>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </Card>
                    </div>
                </div>
            </main>

            {/* <footer className="w-full py-4 border-t bg-background mt-16">
                 <div className="container text-center">
                     <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Your App Name. All rights reserved.</p>
                 </div>
            </footer> */}
        </div>
    );
};

export default NewListingUltraModern;