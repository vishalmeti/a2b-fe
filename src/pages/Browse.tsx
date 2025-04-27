/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { apiService } from "@/services/apiService";
import { ItemRepository } from "@/repositories/Item";
import { Link } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
   Search, Filter, Grid3X3, List
} from "lucide-react";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import type { RootState } from '@/store/store';
import SkeletonLoader from "@/components/items/SkeletonLoader";
import ItemCard from "@/components/items/ItemCard";

import { fetchAllItems, Item } from "@/store/slices/itemsSlice";

interface Category {
  id: number;
  name: string;
  icon: string | null;
}

// Helper function to transform API item to UI item format
const transformItemForUI = (item: any) => {
  // Handle images - might be an array of strings or an array of objects
  let mainImage = "https://placehold.co/600x400?text=No+Image";
  
  if (item.images && item.images.length > 0) {
    if (typeof item.images[0] === 'string') {
      mainImage = item.images[0];
    } else if (item.images[0].image_url) {
      mainImage = item.images[0].image_url;
    }
  }
  
  // Handle owner information
  const ownerName = item.owner?.user?.first_name && item.owner?.user?.last_name 
    ? `${item.owner.user.first_name} ${item.owner.user.last_name}` 
    : item.owner?.user?.username || item.owner_username || "Unknown";
  
  const ownerAvatar = item.owner?.profile_picture_url || 
    `https://ui-avatars.com/api/?name=${ownerName.replace(/\s+/g, "+")}&background=random`;
  
  const rating = item.owner?.average_lender_rating || item.average_item_rating || 4.5;
  console.log(item)
  return {
    id: item.id,
    name: item.title,
    description: item.description || `${item.title} in ${item.condition?.toLowerCase().replace('_', ' ') || 'good'} condition`,
    image: mainImage,
    owner: {
      name: ownerName,
      avatar: ownerAvatar,
      rating: rating,
    },
    category: item.category?.name || "Uncategorized",
    condition: item.condition?.replace('_', ' ').toLowerCase() || "good condition",
    price: parseFloat(item.borrowing_fee) > 0 ? 
      `$${parseFloat(item.borrowing_fee).toFixed(2)}/day` : 
      "Free",
    deposit: parseFloat(item.deposit_amount) > 0 ? 
      `$${parseFloat(item.deposit_amount).toFixed(2)}` : 
      "No deposit",
    maxDuration: item.max_borrow_duration_days || 7,
    community: item.community_name || "Local Community",
    created_at: item.created_at,
  };
};

const Browse = () => {
  useAuthRedirect();
  const dispatch = useDispatch();
  const { itemsById, allIds, loading, error } = useSelector((state: RootState) => state.items);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest"); // Add state for sorting
  const [selectedCommunity, setSelectedCommunity] = useState("All Communities"); // Add state for community filter
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
    // Dispatch action to fetch all items
    dispatch(fetchAllItems() as any);
  }, [dispatch]);

  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      setCategoryError(null);
      const response = await apiService.get(ItemRepository.GET_CATEGORIES);
      if (response.status < 200 || response.status >= 300) {
        throw new Error('Failed to fetch categories');
      }
      const data = response.data;
      setCategories([
        { id: 0, name: "All Categories", icon: null },
        ...data
      ]);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategoryError(error instanceof Error ? error.message : 'Failed to load categories');
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Transform items from the store to the UI format
  const storeItems = allIds.map(id => transformItemForUI(itemsById[id]));

  // Derive unique communities from items
  const communities = ["All Communities", ...new Set(storeItems.map(item => item.community).filter(Boolean))];

  // Filter items based on search query and category
  const filteredItems = storeItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || item.category === selectedCategory;
    const matchesCommunity = selectedCommunity === "All Communities" || item.community === selectedCommunity; // Add community filter logic

    return matchesSearch && matchesCategory && matchesCommunity; // Include community match
  });

  // Sort items based on the selected criteria
  if (sortBy === "newest") {
    filteredItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } else if (sortBy === "rating") {
    // Assuming owner.rating is a number. Add logic if it's not always available or needs parsing.
    filteredItems.sort((a, b) => (b.owner.rating || 0) - (a.owner.rating || 0));
  }
  // 'relevance' is the default order from the API/filtering, so no explicit sort needed unless defined otherwise.

  const GridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredItems.map((item) => (
        <ItemCard
          key={item.id}
          id={item.id}
          name={item.name}
          description={item.description}
          image={item.image}
          category={item.category}
          owner={item.owner}       />
      ))}
    </div>
  );

  const ListView = () => (
    <div className="space-y-4">
      {filteredItems.map((item) => (
        <Link to={`/items/${item.id}`} key={item.id}>
          <Card className="overflow-hidden transition-shadow hover:shadow-md">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-48 h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <div className="flex-1 p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="bg-brand-neutral-lightest dark:bg-slate-800">
                    {item.category}
                  </Badge>
                </div>
                <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {item.description}
                </p>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={item.owner.avatar} alt={item.owner.name} />
                    <AvatarFallback>{item.owner.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">{item.owner.name}</p>
                    <div className="flex items-center">
                      <span className="text-yellow-500 dark:text-yellow-400">★</span>
                      <span className="ml-1">{item.owner.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return <SkeletonLoader listView={viewMode === "list"} />;
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-destructive/10 dark:bg-destructive/20 p-6 mb-4">
            <Search className="h-10 w-10 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Error loading items</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            {error}
          </p>
          <Button onClick={() => dispatch(fetchAllItems() as any)}>
            Try Again
          </Button>
        </div>
      );
    }

    if (filteredItems.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <Search className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No items found</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            We couldn't find any items matching your search criteria. Try adjusting your filters or search terms.
          </p>
          <Button onClick={() => {
            setSearchQuery("");
            setSelectedCategory("All Categories");
            setSelectedCommunity("All Communities"); // Reset community filter
          }}>
            Reset Filters
          </Button>
        </div>
      );
    }

    return viewMode === "grid" ? <GridView /> : <ListView />;
  };

  return (
    <div className="flex min-h-screen flex-col bg-background dark:bg-gray-900">
      <NavBar />
      
      <main className="flex-1 container py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold">Browse Items</h1>
            <p className="text-muted-foreground">
              Find items available to borrow in your community
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            {/* Search and Filter */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="relative flex items-center">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search items..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select 
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                disabled={isLoadingCategories}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingCategories ? "Loading..." : "Category"} />
                </SelectTrigger>
                <SelectContent>
                  {categoryError ? (
                    <SelectItem value="error" disabled>
                      Error loading categories
                    </SelectItem>
                  ) : (
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Button variant="outline" className="flex-1" onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All Categories");
                  setSelectedCommunity("All Communities"); // Reset community filter
                }}>
                  Reset
                </Button>
                <div className="border rounded-md flex overflow-hidden">
                  <Button 
                    variant={viewMode === "grid" ? "default" : "ghost"} 
                    size="sm" 
                    className="rounded-none"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={viewMode === "list" ? "default" : "ghost"} 
                    size="sm" 
                    className="rounded-none"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="pt-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {!loading && `Showing ${filteredItems.length} item${filteredItems.length !== 1 ? 's' : ''}`}
                </p>
                <div className="flex items-center space-x-2"> {/* Container for filters */}
                  <Select
                    value={selectedCommunity}
                    onValueChange={setSelectedCommunity}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Community" />
                    </SelectTrigger>
                    <SelectContent>
                      {communities.map((community) => (
                        <SelectItem key={community} value={community}>
                          {community}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Sort by: Relevance</SelectItem>
                      <SelectItem value="newest">Sort by: Newest</SelectItem>
                      <SelectItem value="rating">Sort by: Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="h-[calc(100vh-350px)] overflow-y-auto px-4 rounded-md">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Browse;
