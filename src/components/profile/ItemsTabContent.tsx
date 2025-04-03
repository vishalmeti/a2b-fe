/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Pencil, Package, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import { fetchMyItems, type Item as StoreItem } from '@/store/slices/itemsSlice';

interface Item {
  id: string;
  name: string;
  image: string;
  category: string;
  status: string;
}

export const ItemsTabContent: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const { data } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const { myItemIds, itemsById } = useSelector((state: RootState) => state.items);
  
  // Transform store items to component's item format
  const items: Item[] = myItemIds.map(id => {
    const item = itemsById[id];
    return {
      id: String(item.id),
      name: item.title,
      image: typeof item.images?.[0] === 'string' ? item.images[0] : 'https://placehold.co/600x400?text=No+Image',
      category: item.category?.name || 'Uncategorized',
      status: item.availability_status === 'AVAILABLE' ? 'Available' : 'Rented'
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

  // if (loading) {
  //   return (
  //     <Card className="shadow-sm dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/60">
  //       <CardContent className="text-center py-16">
  //         <Loader2 className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4 animate-spin" />
  //         <p className="text-gray-500 dark:text-gray-400">Loading items...</p>
  //       </CardContent>
  //     </Card>
  //   );
  // }

  // if (error) {
  //   return (
  //     <Card className="shadow-sm dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/60">
  //       <CardContent className="text-center py-16">
  //         <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Error loading items</h3>
  //         <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-4">{error}</p>
  //         <Button onClick={() => dispatch(fetchMyItems())}>Try Again</Button>
  //       </CardContent>
  //     </Card>
  //   );
  // }

  return (
    <>      
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden group transition-all duration-300 hover:shadow-lg border-gray-200 dark:border-gray-700/60 dark:bg-gray-800/50 flex flex-col">
              <Link to={`/items/${item.id}`} className="block">
                <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"/>
                </div>
              </Link>
              <CardContent className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <Link to={`/items/${item.id}`}>
                      <h3 className="font-semibold text-base text-gray-800 dark:text-gray-100 group-hover:text-primary transition-colors">{item.name}</h3>
                    </Link>
                    <Badge 
                      variant={item.status === "Available" ? "outline" : "secondary"} 
                      className={`text-xs whitespace-nowrap ${item.status === "Available" ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400" : "dark:bg-gray-700 dark:text-gray-300"}`}
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.category}</p>
                </div>
                <div className="flex space-x-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/60">
                  <Button variant="ghost" size="sm" className="flex-1 h-8 text-xs text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                    <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 h-8 text-xs text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                    {item.status === "Available" ? "Set Rented" : "Set Available"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="shadow-sm dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/60">
          <CardContent className="text-center py-16">
            <Package className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">No items listed</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-6">Share your items!</p>
            <Link to="/new-listing"><Button>Add Your First Item</Button></Link>
          </CardContent>
        </Card>
      )}
    </>
  );
};
