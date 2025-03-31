
import { useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Camera, Package, Calendar, Settings, Star, MessageSquare, 
  MapPin, UserCircle, Edit2, Check, X, LogOut, Clock
} from "lucide-react";

// Sample user data - In a real app, this would come from an API
const userData = {
  id: "user1",
  name: "Alex Smith",
  email: "alex.smith@example.com",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  coverPhoto: "https://images.unsplash.com/photo-1506102383123-c8ef1e872756?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  bio: "I'm a DIY enthusiast and love sharing my tools with the community. If you need something for a project, let me know!",
  location: "Brighton Heights, Pittsburgh, PA",
  memberSince: "January 2022",
  stats: {
    itemsShared: 8,
    totalBorrows: 15,
    rating: 4.8,
    reviews: 12,
  },
  itemsListed: [
    {
      id: "1",
      name: "Power Drill",
      image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      category: "Tools",
      status: "Available",
    },
    {
      id: "2",
      name: "Pressure Washer",
      image: "https://images.unsplash.com/photo-1621274218965-5e7d37c9af86?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      category: "Cleaning",
      status: "Borrowed",
    },
    {
      id: "3",
      name: "Ladder",
      image: "https://images.unsplash.com/photo-1620814509429-fa2d5fb95981?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      category: "Tools",
      status: "Available",
    },
  ],
  borrowingHistory: [
    {
      id: "4",
      name: "Stand Mixer",
      image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      owner: "Maria Johnson",
      category: "Kitchen",
      date: "May 15, 2023",
      status: "Returned",
    },
    {
      id: "5",
      name: "Projector",
      image: "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      owner: "Jennifer Lee",
      category: "Electronics",
      date: "April 2, 2023",
      status: "Returned",
    },
  ],
  reviews: [
    {
      id: "rev1",
      reviewer: {
        name: "Sarah Johnson",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      rating: 5,
      date: "March 15, 2023",
      comment: "Alex was very responsive and the drill was in perfect condition. Would definitely borrow from him again!",
      item: "Power Drill",
    },
    {
      id: "rev2",
      reviewer: {
        name: "Mike Peterson",
        avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      },
      rating: 5,
      date: "February 2, 2023",
      comment: "Great ladder, well maintained. Alex was very helpful and flexible with pickup times.",
      item: "Ladder",
    },
    {
      id: "rev3",
      reviewer: {
        name: "Lisa Garcia",
        avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      },
      rating: 4,
      date: "January 12, 2023",
      comment: "The pressure washer worked great! Only reason for 4 stars is because it was a bit dirty when I got it.",
      item: "Pressure Washer",
    },
  ],
};

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: userData.name,
    bio: userData.bio,
    location: userData.location,
  });
  const [activeTab, setActiveTab] = useState("items");
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = () => {
    // In a real app, this would call an API to update the user's profile
    setEditMode(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleCancelEdit = () => {
    setFormData({
      name: userData.name,
      bio: userData.bio,
      location: userData.location,
    });
    setEditMode(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      
      <main className="flex-1">
        {/* Profile Header */}
        <div className="relative">
          <div className="h-40 md:h-60 w-full overflow-hidden">
            <img
              src={userData.coverPhoto}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container px-4 md:px-6">
            <div className="relative flex flex-col md:flex-row md:items-end -mt-16 md:-mt-20 mb-6 md:mb-8">
              <Avatar className="h-32 w-32 border-4 border-background">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="mt-4 md:mt-0 md:ml-6 md:mb-4 flex-1">
                {editMode ? (
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="text-2xl font-bold mb-1 h-auto py-1"
                  />
                ) : (
                  <h1 className="text-2xl md:text-3xl font-bold">{userData.name}</h1>
                )}
                
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {editMode ? (
                      <Input
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="h-auto py-1"
                      />
                    ) : (
                      <span>{userData.location}</span>
                    )}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Member since {userData.memberSince}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 flex">
                {editMode ? (
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={handleSaveProfile}>
                      <Check className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" onClick={() => setEditMode(true)}>
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container px-4 md:px-6 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - User info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About</CardTitle>
                </CardHeader>
                <CardContent>
                  {editMode ? (
                    <Textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="min-h-[100px]"
                    />
                  ) : (
                    <p className="text-muted-foreground">{userData.bio}</p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg">
                      <Package className="h-6 w-6 mb-1 text-primary" />
                      <span className="text-2xl font-bold">{userData.stats.itemsShared}</span>
                      <span className="text-sm text-muted-foreground">Items Shared</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg">
                      <Calendar className="h-6 w-6 mb-1 text-primary" />
                      <span className="text-2xl font-bold">{userData.stats.totalBorrows}</span>
                      <span className="text-sm text-muted-foreground">Total Borrows</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg">
                      <Star className="h-6 w-6 mb-1 text-primary" />
                      <span className="text-2xl font-bold">{userData.stats.rating}</span>
                      <span className="text-sm text-muted-foreground">Rating</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg">
                      <MessageSquare className="h-6 w-6 mb-1 text-primary" />
                      <span className="text-2xl font-bold">{userData.stats.reviews}</span>
                      <span className="text-sm text-muted-foreground">Reviews</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Account Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Link to="/settings/profile">
                      <Button variant="ghost" className="w-full justify-start">
                        <UserCircle className="h-4 w-4 mr-2" />
                        Profile Settings
                      </Button>
                    </Link>
                    <Link to="/settings/account">
                      <Button variant="ghost" className="w-full justify-start">
                        <Settings className="h-4 w-4 mr-2" />
                        Account Settings
                      </Button>
                    </Link>
                    <Link to="/settings/notifications">
                      <Button variant="ghost" className="w-full justify-start">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Notification Settings
                      </Button>
                    </Link>
                    <Separator className="my-2" />
                    <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right column - Tabs */}
            <div className="md:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="items">
                    <Package className="h-4 w-4 mr-2" />
                    My Items
                  </TabsTrigger>
                  <TabsTrigger value="history">
                    <Calendar className="h-4 w-4 mr-2" />
                    Borrow History
                  </TabsTrigger>
                  <TabsTrigger value="reviews">
                    <Star className="h-4 w-4 mr-2" />
                    Reviews
                  </TabsTrigger>
                </TabsList>
                
                {/* My Items Tab */}
                <TabsContent value="items">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">My Items ({userData.itemsListed.length})</h2>
                    <Link to="/new-listing">
                      <Button size="sm">
                        Add New Item
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userData.itemsListed.map((item) => (
                      <Link to={`/items/${item.id}`} key={item.id}>
                        <Card className="overflow-hidden transition-shadow hover:shadow-md h-full">
                          <div className="aspect-video w-full overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover transition-transform hover:scale-105"
                            />
                          </div>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold">{item.name}</h3>
                              <Badge
                                variant={item.status === "Available" ? "outline" : "secondary"}
                                className={item.status === "Available" ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-100" : ""}
                              >
                                {item.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">{item.category}</div>
                          </CardContent>
                          <CardFooter className="p-4 pt-0">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" className="h-8 px-2">
                                <Edit2 className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 px-2">
                                {item.status === "Available" ? "Mark Unavailable" : "Mark Available"}
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </TabsContent>
                
                {/* Borrow History Tab */}
                <TabsContent value="history">
                  <h2 className="text-xl font-semibold mb-4">Borrow History ({userData.borrowingHistory.length})</h2>
                  
                  <div className="space-y-4">
                    {userData.borrowingHistory.map((item) => (
                      <Card key={item.id}>
                        <div className="flex flex-col sm:flex-row">
                          <div className="sm:w-48 h-48 overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-lg">{item.name}</h3>
                              <Badge
                                variant={item.status === "Active" ? "default" : "secondary"}
                              >
                                {item.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Borrowed from: {item.owner}
                            </p>
                            <p className="text-sm text-muted-foreground mb-2">
                              Date: {item.date}
                            </p>
                            <p className="text-sm text-muted-foreground mb-4">
                              Category: {item.category}
                            </p>
                            <div className="flex space-x-2">
                              <Link to={`/items/${item.id}`}>
                                <Button variant="outline" size="sm">
                                  View Item
                                </Button>
                              </Link>
                              {item.status === "Returned" && (
                                <Button variant="outline" size="sm">
                                  Leave Review
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                    
                    {userData.borrowingHistory.length === 0 && (
                      <div className="text-center py-12">
                        <div className="rounded-full bg-muted p-3 mx-auto w-12 h-12 flex items-center justify-center mb-4">
                          <Calendar className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">No borrowing history</h3>
                        <p className="text-muted-foreground max-w-md mx-auto mt-1 mb-6">
                          You haven't borrowed any items yet. Browse available items and start borrowing.
                        </p>
                        <Link to="/browse">
                          <Button>Browse Items</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                {/* Reviews Tab */}
                <TabsContent value="reviews">
                  <h2 className="text-xl font-semibold mb-4">Reviews ({userData.reviews.length})</h2>
                  
                  <div className="space-y-4">
                    {userData.reviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <Avatar>
                              <AvatarImage src={review.reviewer.avatar} alt={review.reviewer.name} />
                              <AvatarFallback>{review.reviewer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-y-1 sm:gap-x-2">
                                <h4 className="font-semibold">{review.reviewer.name}</h4>
                                <div className="flex items-center text-muted-foreground">
                                  <span className="hidden sm:inline mx-2">•</span>
                                  <span className="text-sm">{review.date}</span>
                                  <span className="mx-2">•</span>
                                  <span className="text-sm">Item: {review.item}</span>
                                </div>
                              </div>
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <span key={i} className={i < review.rating ? "text-yellow-500" : "text-muted"}>
                                    ★
                                  </span>
                                ))}
                              </div>
                              <p className="text-muted-foreground">{review.comment}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {userData.reviews.length === 0 && (
                      <div className="text-center py-12">
                        <div className="rounded-full bg-muted p-3 mx-auto w-12 h-12 flex items-center justify-center mb-4">
                          <Star className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">No reviews yet</h3>
                        <p className="text-muted-foreground max-w-md mx-auto mt-1">
                          You haven't received any reviews yet. As people borrow your items, they'll be able to leave reviews.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
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

export default Profile;
