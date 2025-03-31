
import { useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
  Slider
} from "@/components/ui/slider";
import { 
  MapPin, Search, Filter, Grid3X3, List 
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Sample data
const categories = [
  "All Categories",
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

const items = [
  {
    id: 1,
    name: "Power Drill",
    description: "Cordless power drill, perfect for small home projects",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    owner: {
      name: "Alex Smith",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4.8,
    },
    distance: "0.5 miles",
    category: "Tools",
  },
  {
    id: 2,
    name: "Stand Mixer",
    description: "Professional stand mixer, great for baking",
    image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    owner: {
      name: "Maria Johnson",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4.9,
    },
    distance: "0.7 miles",
    category: "Kitchen",
  },
  {
    id: 3,
    name: "Camping Tent",
    description: "4-person tent, waterproof and easy to set up",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    owner: {
      name: "David Brown",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
      rating: 4.7,
    },
    distance: "1.2 miles",
    category: "Outdoors",
  },
  {
    id: 4,
    name: "Air Fryer",
    description: "Large capacity air fryer with digital controls",
    image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    owner: {
      name: "Sarah Wilson",
      avatar: "https://randomuser.me/api/portraits/women/63.jpg",
      rating: 4.6,
    },
    distance: "0.9 miles",
    category: "Kitchen",
  },
  {
    id: 5,
    name: "Monitor",
    description: "Gaming monitor in excellent condition",
    image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=2957&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    owner: {
      name: "Michael Roberts",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg",
      rating: 4.5,
    },
    distance: "1.8 miles",
    category: "Gaming",
  },
  {
    id: 6,
    name: "Projector",
    description: "HD projector with HDMI and USB connections",
    image: "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    owner: {
      name: "Jennifer Lee",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg",
      rating: 4.9,
    },
    distance: "1.3 miles",
    category: "Electronics",
  },
  {
    id: 7,
    name: "Folding Table",
    description: "6-foot folding table, perfect for parties",
    image: "https://plus.unsplash.com/premium_vector-1722152242334-bb43bb038e36?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    owner: {
      name: "Robert Thomas",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      rating: 4.6,
    },
    distance: "0.6 miles",
    category: "Party & Events",
  },
  {
    id: 8,
    name: "Pressure Washer",
    description: "Electric pressure washer, great for cleaning patios and decks",
    image: "https://plus.unsplash.com/premium_vector-1722152242334-bb43bb038e36?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    owner: {
      name: "Lisa Garcia",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      rating: 4.7,
    },
    distance: "1.1 miles",
    category: "Cleaning",
  },
];

const Browse = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [distance, setDistance] = useState([5]);
  const [viewMode, setViewMode] = useState("grid");

  // Filter items based on search query, category, and distance
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || item.category === selectedCategory;
    const matchesDistance = parseFloat(item.distance) <= distance[0];
    
    return matchesSearch && matchesCategory && matchesDistance;
  });

  const GridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredItems.map((item) => (
        <Link to={`/items/${item.id}`} key={item.id}>
          <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-brand-neutral-lightest">
                  {item.category}
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-1 h-3 w-3" />
                  {item.distance}
                </div>
              </div>
              <CardTitle className="text-lg">{item.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {item.description}
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={item.owner.avatar} alt={item.owner.name} />
                  <AvatarFallback>{item.owner.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">{item.owner.name}</p>
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1">{item.owner.rating}</span>
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </Link>
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
                  <Badge variant="outline" className="bg-brand-neutral-lightest">
                    {item.category}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1 h-3 w-3" />
                    {item.distance}
                  </div>
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
                      <span className="text-yellow-500">★</span>
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

  return (
    <div className="flex min-h-screen flex-col">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">
                  Max Distance: {distance[0]} mile{distance[0] > 1 ? 's' : ''}
                </label>
                <Slider
                  defaultValue={[5]}
                  max={10}
                  step={0.5}
                  value={distance}
                  onValueChange={setDistance}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" className="flex-1" onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All Categories");
                  setDistance([5]);
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
                  Showing {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
                </p>
                <Select defaultValue="relevance">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Sort by: Relevance</SelectItem>
                    <SelectItem value="distance">Sort by: Distance</SelectItem>
                    <SelectItem value="newest">Sort by: Newest</SelectItem>
                    <SelectItem value="rating">Sort by: Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filteredItems.length > 0 ? (
                viewMode === "grid" ? <GridView /> : <ListView />
              ) : (
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
                    setDistance([5]);
                  }}>
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
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

export default Browse;
