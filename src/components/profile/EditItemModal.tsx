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
import { usersCommunities } from '@/store/slices/userSlice';

import { Loader2 } from 'lucide-react';
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
  const [formData, setFormData] = useState<{
    is_active: any;
    title: string;
    description: string;
    category: string;
    price: string;
    availability_status: string;
    condition: string;
    location: string;
    deposit_amount: string;
    borrowing_fee: string;
    pickup_details: string;
    max_borrow_duration_days: string;
    availability_notes: string;
    community_id: string;
  } | null>(null);

  const communitiesList = useSelector((state: RootState) => {
    if (!state.user.data?.communities) return [];
    return state.user.data.communities.map((community: any) => ({
      value: community.community,
      label: community?.community_details?.name || 'Unknown Community'
    }));
  });

  useEffect(() => {
    console.log('Modal open state changed or item changed:', { isOpen, itemId: item?.id });
    
    if (isOpen && item) {
      console.log('Full item data:', JSON.stringify(item, null, 2));
      
      const newFormData = {
        title: item.title || '',
        description: item.description || '',
        category: item.category?.id ? String(item.category.id) : '',
        price: item.price?.toString() || '',
        availability_status: item.availability_status || 'AVAILABLE',
        condition: item.condition || '',
        location: item.location || '',
        deposit_amount: item.deposit_amount?.toString() || '',
        borrowing_fee: item.borrowing_fee?.toString() || '',
        pickup_details: item.pickup_details || '',
        max_borrow_duration_days: item.max_borrow_duration_days?.toString() || '',
        availability_notes: item.availability_notes || '',
        is_active: item.is_active,
        community_id: item.community || '',
      };
      
      console.log('Setting form data to:', newFormData);
      setFormData(newFormData);
    }
  }, [isOpen, item]);

  useEffect(() => {
    if (formData === null && item && Object.keys(item).length > 0) {
      console.log('Initializing form data from item as fallback');
      
      setFormData({
        title: item.title || '',
        description: item.description || '',
        category: item.category?.id ? String(item.category.id) : '',
        price: item.price?.toString() || '',
        availability_status: item.availability_status || 'AVAILABLE',
        condition: item.condition || '',
        location: item.location || '',
        deposit_amount: item.deposit_amount?.toString() || '',
        borrowing_fee: item.borrowing_fee?.toString() || '',
        pickup_details: item.pickup_details || '',
        max_borrow_duration_days: item.max_borrow_duration_days?.toString() || '',
        availability_notes: item.availability_notes || '',
        is_active: item.is_active,
        community_id: JSON.stringify(item.community) || '',
      });
    }
  }, [formData, item]);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchCategories());
      dispatch(usersCommunities());
    }
  }, [isOpen, dispatch]);

  const safeFormData = formData || {
    title: '',
    description: '',
    category: '',
    price: '',
    availability_status: 'AVAILABLE',
    condition: '',
    location: '',
    deposit_amount: '',
    borrowing_fee: '',
    pickup_details: '',
    max_borrow_duration_days: '',
    availability_notes: '',
    is_active: false,
    community_id: '',
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSelectChange = (name: string, value: string) => {
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
      const updatedItem: any = {
        id: item.id,
        title: safeFormData.title,
        description: safeFormData.description,
        category: JSON.parse(safeFormData.category),
        condition: safeFormData.condition,
        availability_notes: safeFormData.availability_notes,
        deposit_amount: safeFormData.deposit_amount,
        borrowing_fee: safeFormData.borrowing_fee,
        max_borrow_duration_days: Number(safeFormData.max_borrow_duration_days),
        pickup_details: safeFormData.pickup_details,
        is_active: formData.is_active,
        community_id: JSON.parse(safeFormData.community_id)
      };

      await dispatch(updateItemData(updatedItem));
      
      toast({
        title: "Success",
        description: "Item updated successfully",
        variant: "success",
      });
      
      console.log('Item updated successfully');
      onClose();
    } catch (error) {
      console.error('Failed to update item:', error);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update item",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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

                <div className="space-y-2">
                  <Label htmlFor="community_id">Community</Label>
                  <Select 
                    value={safeFormData.community_id} 
                    onValueChange={(value) => handleSelectChange('community_id', value)}
                  >
                    <SelectTrigger id="community_id">
                      <SelectValue placeholder="Select community" />
                    </SelectTrigger>
                    <SelectContent>
                      {communitiesList.length > 0 ? (
                        communitiesList.map((community) => (
                          <SelectItem key={community.value} value={community.value.toString()}>
                            {community.label}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="loading" disabled>
                          No communities found. Please join a community first.
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
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
