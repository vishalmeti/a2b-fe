/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Item, fetchCategories, updateItemData } from '@/store/slices/itemsSlice';
import { X, Loader2, Upload, Camera } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item;
}

export const EditItemModal: React.FC<EditItemModalProps> = ({ isOpen, onClose, item }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const categories = useSelector((state: RootState) => state.items.categories);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<{
    is_active: any;
    title: string;
    description: string;
    category: string;
    price: string;
    availability_status: string;
    images: string[];
    condition: string;
    location: string;
    deposit_amount: string;
    borrowing_fee: string;
    pickup_details: string;
    max_borrow_duration_days: string;
    availability_notes: string;
  } | null>(null);

  useEffect(() => {
    console.log('Modal open state changed or item changed:', { isOpen, itemId: item?.id });
    
    if (isOpen && item) {
      console.log('Full item data:', JSON.stringify(item, null, 2));
      
      const imageUrls = Array.isArray(item.images) 
        ? item.images.map(img => typeof img === 'string' ? img : img.url || '')
        : [];
      
      const newFormData = {
        title: item.title || '',
        description: item.description || '',
        category: item.category?.id ? String(item.category.id) : '',
        price: item.price?.toString() || '',
        availability_status: item.availability_status || 'AVAILABLE',
        images: imageUrls,
        condition: item.condition || '',
        location: item.location || '',
        deposit_amount: item.deposit_amount?.toString() || '',
        borrowing_fee: item.borrowing_fee?.toString() || '',
        pickup_details: item.pickup_details || '',
        max_borrow_duration_days: item.max_borrow_duration_days?.toString() || '',
        availability_notes: item.availability_notes || '',
        is_active: item.is_active,
      };
      
      console.log('Setting form data to:', newFormData);
      setFormData(newFormData);
    }
  }, [isOpen, item]);

  useEffect(() => {
    if (formData === null && item && Object.keys(item).length > 0) {
      console.log('Initializing form data from item as fallback');
      
      const imageUrls = Array.isArray(item.images) 
        ? item.images.map(img => typeof img === 'string' ? img : img.url || '')
        : [];
      
      setFormData({
        title: item.title || '',
        description: item.description || '',
        category: item.category?.id ? String(item.category.id) : '',
        price: item.price?.toString() || '',
        availability_status: item.availability_status || 'AVAILABLE',
        images: imageUrls,
        condition: item.condition || '',
        location: item.location || '',
        deposit_amount: item.deposit_amount?.toString() || '',
        borrowing_fee: item.borrowing_fee?.toString() || '',
        pickup_details: item.pickup_details || '',
        max_borrow_duration_days: item.max_borrow_duration_days?.toString() || '',
        availability_notes: item.availability_notes || '',
        is_active: item.is_active,
      });
    }
  }, [formData, item]);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchCategories());
    }
  }, [isOpen, dispatch]);

  const safeFormData = formData || {
    title: '',
    description: '',
    category: '',
    price: '',
    availability_status: 'AVAILABLE',
    images: [],
    condition: '',
    location: '',
    deposit_amount: '',
    borrowing_fee: '',
    pickup_details: '',
    max_borrow_duration_days: '',
    availability_notes: '',
    is_active: false,
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSelectChange = (name: string, value: string) => {
    // Skip updating if the value is our loading placeholder
    if (value === "loading") return;
    
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => prev ? {
      ...prev,
      is_active: checked,
    } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare the updated item data matching the Item interface
      const updatedItem: any = {
        id: item.id,
        title: safeFormData.title,
        description: safeFormData.description,
        category_id: safeFormData.category,
        condition: safeFormData.condition,
        availability_notes: safeFormData.availability_notes,
        deposit_amount: safeFormData.deposit_amount,
        borrowing_fee: safeFormData.borrowing_fee,
        max_borrow_duration_days: Number(safeFormData.max_borrow_duration_days),
        pickup_details: safeFormData.pickup_details,
        is_active: formData.is_active,
      };

      // Dispatch the update action
      await dispatch(updateItemData(updatedItem)).unwrap();
      
      // Show success toast
      toast({
        title: "Success",
        description: "Item updated successfully",
        variant: "success",
      });
      
      console.log('Item updated successfully');
      onClose();
    } catch (error) {
      console.error('Failed to update item:', error);
      
      // Show error toast
      toast({
        title: "Error",
        description: "Failed to update item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageRemove = (index: number) => {
    setFormData(prev => prev ? {
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    } : null);
  };

  const handleAddImage = (url: string) => {
    if (url) {
      setFormData(prev => prev && !prev.images.includes(url) ? {
        ...prev,
        images: [...prev.images, url],
      } : prev);
    }
  };

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Only process image files
      if (!file.type.startsWith('image/')) continue;

      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => prev ? {
        ...prev,
        images: [...prev.images, imageUrl],
      } : null);
    }

    // Reset the input so the same file can be selected again if needed
    e.target.value = '';
  };

  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Item
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="general" className="flex-1">General Info</TabsTrigger>
              <TabsTrigger value="photos" className="flex-1">Photos</TabsTrigger>
              <TabsTrigger value="details" className="flex-1">Additional Details</TabsTrigger>
              <TabsTrigger value="pricing" className="flex-1">Pricing & Terms</TabsTrigger>
            </TabsList>
            
            <div className="h-[400px] overflow-y-auto">
              <TabsContent value="general" className="space-y-4 h-full">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={safeFormData.title} 
                    onChange={handleInputChange} 
                    placeholder="Item name" 
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={safeFormData.description} 
                    onChange={handleInputChange} 
                    placeholder="Describe your item..."
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={safeFormData.category} 
                      onValueChange={(value) => handleSelectChange('category', value)}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(categories).map(([name, id]) => (
                          <SelectItem key={id} value={String(id)}>
                            {name}
                          </SelectItem>
                        ))}
                        {Object.keys(categories).length === 0 && (
                          <SelectItem value="loading" disabled>
                            Loading categories...
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select 
                      value={safeFormData.condition} 
                      onValueChange={(value) => handleSelectChange('condition', value)}
                    >
                      <SelectTrigger id="condition">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NEW">New</SelectItem>
                        <SelectItem value="LIKE_NEW">Like new</SelectItem>
                        <SelectItem value="GOOD">Good</SelectItem>
                        <SelectItem value="FAIR">Fair</SelectItem>
                        <SelectItem value="POOR">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Switch 
                    id="availability" 
                    checked={safeFormData.is_active}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="availability" className="cursor-pointer">
                    Available for rent
                  </Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="availability_notes">Availability Notes</Label>
                  <Textarea 
                    id="availability_notes" 
                    name="availability_notes" 
                    value={safeFormData.availability_notes} 
                    onChange={handleInputChange} 
                    placeholder="Any additional notes on item availability..."
                    rows={2}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="photos" className="space-y-4 h-full">
                <div className="grid grid-cols-2 gap-4">
                  {safeFormData.images.map((img, index) => (
                    <div key={index} className="relative group rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                      <img 
                        src={img} 
                        alt={`Item ${index}`} 
                        className="w-full h-32 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleImageRemove(index)}
                        className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelection}
                  className="hidden"
                  accept="image/*"
                  multiple
                />
                
                <div 
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg mt-4 cursor-pointer"
                  onClick={openFileSelector}
                >
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                    Drag and drop your images here, or click to upload
                  </p>
                  <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the parent div's click handler
                    openFileSelector();
                  }}>
                    <Camera className="h-4 w-4 mr-2" /> Upload Photos
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="space-y-4 h-full">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    name="location" 
                    value={safeFormData.location} 
                    onChange={handleInputChange} 
                    placeholder="Where is the item located?" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pickup_details">Pickup Details</Label>
                  <Textarea 
                    id="pickup_details" 
                    name="pickup_details" 
                    value={safeFormData.pickup_details} 
                    onChange={handleInputChange} 
                    placeholder="Instructions for item pickup and return..."
                    rows={3}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="pricing" className="space-y-4 h-full">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="borrowing_fee">Borrowing Fee (per day)</Label>
                    <Input 
                      id="borrowing_fee" 
                      name="borrowing_fee" 
                      type="number" 
                      value={safeFormData.borrowing_fee} 
                      onChange={handleInputChange} 
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="deposit_amount">Security Deposit</Label>
                    <Input 
                      id="deposit_amount" 
                      name="deposit_amount" 
                      type="number" 
                      value={safeFormData.deposit_amount} 
                      onChange={handleInputChange} 
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max_borrow_duration_days">Maximum Borrowing Duration (days)</Label>
                  <Input 
                    id="max_borrow_duration_days" 
                    name="max_borrow_duration_days" 
                    type="number" 
                    value={safeFormData.max_borrow_duration_days} 
                    onChange={handleInputChange} 
                    placeholder="Enter maximum days for borrowing"
                    min="1"
                    step="1"
                  />
                </div>
              </TabsContent>
            </div>
          </Tabs>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || formData === null}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
