/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Pencil, Package, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import { fetchMyItems, deleteItem, type Item as StoreItem } from '@/store/slices/itemsSlice';
import { EditItemModal } from "./EditItemModal";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { useToast } from "@/hooks/use-toast";

interface Item {
  id: string;
  name: string;
  image: string;
  category: string;
  status: string;
}

export const ItemsTabContent: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { data, loading } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const { myItemIds, itemsById } = useSelector((state: RootState) => state.items);
  
  const StatusMapper = {
    AVAILABLE: 'Available',
    RENTED: 'Rented',
    BOOKED: 'Booked',
    UNAVAILABLE: 'Unavailable'
  };

  // Status style mapping for different status types
  const statusStyles = {
    Available: {
      variant: "outline" as const,
      className: "border-green-500 bg-green-50 text-green-700 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400"
    },
    Booked: {
      variant: "outline" as const,
      className: "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-400"
    },
    Rented: {
      variant: "outline" as const,
      className: "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-400"
    },
    Unavailable: {
      variant: "outline" as const,
      className: "border-gray-500 bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:border-gray-700 dark:text-gray-400"
    }
  };

  // Transform store items to component's item format
  const items: Item[] = myItemIds.map(id => {
    const item = itemsById[id];
    return {
      id: String(item.id),
      name: item.title,
      image: typeof item.images?.[0] === 'string' ? item.images[0] : 'https://placehold.co/600x400?text=No+Image',
      category: item.category?.name || 'Uncategorized',
      status: item.availability_status ? StatusMapper[item.availability_status] : 'Unknown'
    };
  });

  useEffect(() => {
    // Fetch my items from the store
    dispatch(fetchMyItems())
      .unwrap()
      .catch(err => {
        setError(err.message || 'An error occurred while fetching your items');
        console.error('Error fetching items:', err);
      });
  }, [dispatch]);

  const handleEditClick = (itemId: string) => {
    const originalItem = itemsById[itemId];
    setSelectedItem(originalItem);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (itemId: string) => {
    setItemToDelete(itemId);
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      setIsDeleting(true);
      try {
        await dispatch(deleteItem(parseInt(itemToDelete))).unwrap();
        toast({
          title: "Item deleted",
          description: "Your item has been successfully removed",
          variant: "success",
        });
        setIsConfirmDeleteOpen(false);
        setItemToDelete(null);
      } catch (err) {
        toast({
          title: "Failed to delete item",
          description: "Please try again later",
          variant: "destructive",
        });
        console.error('Error deleting item:', err);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleCloseDeleteModal = () => {
    setIsConfirmDeleteOpen(false);
    setItemToDelete(null);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedItem(null);
  };

  if (error) {
    return (
      <Card className="shadow-sm dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/60">
        <CardContent className="text-center py-16">
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Error loading items</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-4">{error}</p>
          <Button onClick={() => dispatch(fetchMyItems())}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>      
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {items.map((item) => (
            <Card 
              key={item.id} 
              className="overflow-hidden group transition-all duration-300 hover:shadow-lg border border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800 rounded-xl flex flex-col"
            >
              {/* Image with status badge */}
              <div className="relative">
                <Link to={`/items/${item.id}`} className="block">
                  <div className="aspect-[3/2] w-full overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </Link>

                {/* Status badge - modernized */}
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium shadow-sm backdrop-blur-sm
                  ${item.status === 'Available' ? 'bg-emerald-100/90 text-emerald-700 dark:bg-emerald-900/70 dark:text-emerald-300' : 
                    item.status === 'Booked' ? 'bg-amber-100/90 text-amber-700 dark:bg-amber-900/70 dark:text-amber-300' : 
                    item.status === 'Rented' ? 'bg-blue-100/90 text-blue-700 dark:bg-blue-900/70 dark:text-blue-300' : 
                    'bg-gray-100/90 text-gray-700 dark:bg-gray-800/90 dark:text-gray-300'}`}
                >
                  <span className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full inline-block ${
                      item.status === 'Available' ? 'bg-emerald-500 dark:bg-emerald-400' : 
                      item.status === 'Booked' ? 'bg-amber-500 dark:bg-amber-400' : 
                      item.status === 'Rented' ? 'bg-blue-500 dark:bg-blue-400' : 
                      'bg-gray-500 dark:bg-gray-400'
                    }`}></span>
                    {item.status}
                  </span>
                </div>
              </div>

              {/* Simplified card content */}
              <CardContent className="p-4 flex-grow flex flex-col">
                <div className="flex-grow">
                  <Link 
                    to={`/items/${item.id}`}
                    className="block"
                  >
                    <h3 className="font-medium text-base text-gray-800 dark:text-gray-100 group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {item.category}
                  </p>
                </div>
                
                {/* Improved action buttons */}
                <div className="flex justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-9 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-all"
                    onClick={() => handleEditClick(item.id)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    <span>Edit</span>
                  </Button>
                  
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="h-9 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-all"
                    onClick={() => handleDeleteClick(item.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    <span>Delete</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800 rounded-lg">
          <CardContent className="text-center py-16">
            <Package className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">No items listed yet</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-6">Start sharing your items with others</p>
            <Link to="/new-listing">
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" /> Add Your First Item
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Edit modal */}
      {selectedItem && (
        <EditItemModal 
          isOpen={isEditModalOpen} 
          onClose={handleCloseModal} 
          item={selectedItem} 
        />
      )}

      {/* Delete confirmation modal */}
      <ConfirmationModal
        isOpen={isConfirmDeleteOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        variant="destructive"
        disabled={isDeleting}
      />
    </>
  );
};
