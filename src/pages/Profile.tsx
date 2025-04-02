/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, ChangeEvent, useCallback } from "react";
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
// Separator is removed from Account card, but might be used elsewhere
// import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Camera, Package, Calendar, Settings, Star, MessageSquare,
  MapPin, UserCircle, Edit2, Check, X, LogOut, Clock, PlusCircle, Pencil, Users, ThumbsUp
} from "lucide-react";
import { ImageUploadModal } from "@/components/modals/ImageUploadModal";
import LoadingScreen from "@/components/loader/LoadingScreen";

import type { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, updateUserData } from '@/store/slices/userSlice';
import get from 'lodash/get';
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { apiService } from "@/services/apiService";

// --- Assume dummy data and helper functions are the same as before ---
const userDummyData = {
  id: "user1",
  firstName: "Alex",
  lastName: "Smith",
  email: "alex.smith@example.com",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  coverPhoto: "https://images.unsplash.com/photo-1506102383123-c8ef1e872756?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
  bio: "DIY enthusiast sharing tools with the community. Passionate about sustainable living and collaborative consumption. Need something for a project? Just ask!",
  location: "Brighton Heights, Pittsburgh, PA",
  memberSince: "2022-01-15T10:00:00Z",
  stats: { itemsShared: 8, totalBorrows: 15, rating: 4.8, reviews: 12, },
  itemsListed: [ { id: "1", name: "Power Drill", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60", category: "Tools", status: "Available",}, { id: "2", name: "Pressure Washer", image: "https://images.unsplash.com/photo-1621274218965-5e7d37c9af86?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60", category: "Cleaning", status: "Borrowed", }, { id: "3", name: "Ladder", image: "https://images.unsplash.com/photo-1620814509429-fa2d5fb95981?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60", category: "Tools", status: "Available",},],
  borrowingHistory: [ { id: "4", name: "Stand Mixer", image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60", owner: "Maria Johnson", category: "Kitchen", date: "2023-05-15T10:00:00Z", status: "Returned", }, { id: "5", name: "Projector", image: "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60", owner: "Jennifer Lee", category: "Electronics", date: "2023-04-02T10:00:00Z", status: "Returned", },],
  reviews: [ { id: "rev1", reviewer: { name: "Sarah Johnson", avatar: "https://randomuser.me/api/portraits/women/44.jpg", }, rating: 5, date: "2023-03-15T10:00:00Z", comment: "Alex was very responsive and the drill was in perfect condition. Would definitely borrow from him again!", item: "Power Drill", }, { id: "rev2", reviewer: { name: "Mike Peterson", avatar: "https://randomuser.me/api/portraits/men/67.jpg", }, rating: 5, date: "2023-02-02T10:00:00Z", comment: "Great ladder, well maintained. Alex was very helpful and flexible with pickup times.", item: "Ladder", }, { id: "rev3", reviewer: { name: "Lisa Garcia", avatar: "https://randomuser.me/api/portraits/women/28.jpg", }, rating: 4, date: "2023-01-12T10:00:00Z", comment: "The pressure washer worked great! Only reason for 4 stars is because it was a bit dirty when I got it.", item: "Pressure Washer", },],
};

const formatMemberSince = (dateString: string): string => {
  try { return new Date(dateString).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }); }
  catch (e) { return "N/A"; }
};
const formatDate = (dateString: string): string => {
  try { return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  catch (e) { return "N/A"; }
}

const Profile = () => {
  useAuthRedirect();

  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { data: reduxUserData, loading: userLoading, error: userError } = useSelector((state: RootState) => state.user);

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [userData, setUserData] = useState(userDummyData);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("items");
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', bio: '', location: '',
  });

  // --- useEffect hooks for fetching and updating data (Same as previous version) ---
  useEffect(() => {
    if (!reduxUserData?.user && !userLoading) {
      dispatch(fetchUser());
    }
  }, [reduxUserData?.user, dispatch, userLoading]);

  useEffect(() => {
    const fetchedFirstName = get(reduxUserData, "user.first_name", userDummyData.firstName);
    const fetchedLastName = get(reduxUserData, "user.last_name", userDummyData.lastName);
    const fetchedEmail = get(reduxUserData, "user.email", userDummyData.email);
    const fetchedAvatar = get(reduxUserData, "profile_picture_url", userDummyData.avatar);
    const fetchedBio = get(reduxUserData, "profile.bio", userDummyData.bio);
    const fetchedLocation = get(reduxUserData, "profile.location", userDummyData.location);
    const fetchedMemberSince = get(reduxUserData, "user.date_joined", userDummyData.memberSince);
    const fetchedCoverPhoto = get(reduxUserData, "profile.cover_photo_url", userDummyData.coverPhoto);
    const fetchedStats = { ...userDummyData.stats, ...get(reduxUserData, "profile.stats", {})};
    const fetchedItems = get(reduxUserData, "profile.itemsListed", userDummyData.itemsListed);
    const fetchedHistory = get(reduxUserData, "profile.borrowingHistory", userDummyData.borrowingHistory);
    const fetchedReviews = get(reduxUserData, "profile.reviews", userDummyData.reviews);

    const newUserData = {
      id: get(reduxUserData, "user.id", userDummyData.id),
      firstName: fetchedFirstName, lastName: fetchedLastName, email: fetchedEmail,
      avatar: fetchedAvatar, coverPhoto: fetchedCoverPhoto, bio: fetchedBio,
      location: fetchedLocation, memberSince: fetchedMemberSince, stats: fetchedStats,
      itemsListed: fetchedItems, borrowingHistory: fetchedHistory, reviews: fetchedReviews,
    };
    setUserData(newUserData);
    if (!editMode) {
        setFormData({
            firstName: fetchedFirstName, lastName: fetchedLastName,
            bio: fetchedBio, location: fetchedLocation,
        });
    }
  }, [reduxUserData, editMode]);

  // --- Callbacks for input change, save, cancel, upload (Same as previous version) ---
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSaveProfile = async () => {
    console.log("Saving profile data:", formData);
    // ---> TODO: Implement actual API call or Redux dispatch here <---
    setUserData(prev => ({ ...prev, ...formData })); // Optimistic update
    setEditMode(false);
    toast({ variant: "success", title: "Profile Saved" });
  };

  const handleCancelEdit = useCallback(() => {
    setFormData({ // Reset form from current userData
      firstName: userData.firstName, lastName: userData.lastName,
      bio: userData.bio, location: userData.location,
    });
    setEditMode(false);
  }, [userData]);

   const onProfileUpload = async (files: any) => {
      if (files.length === 0) return;
      const file = files[0];
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);
      setIsUploadingImage(true);
      try {
        const resp = await apiService.post("/users/profile-image/", uploadFormData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        const profileImageUrl = get(resp, "data.profile_picture_url", userData.avatar);
        dispatch(updateUserData({ ...reduxUserData, profile_picture_url: profileImageUrl }));
        toast({ variant: "success", title: "Profile picture updated" });
      } catch (error) {
        console.error("Error uploading profile image:", error);
        toast({ variant: "destructive", title: "Upload failed" });
      } finally {
        setIsUploadingImage(false);
      }
    };

  // --- Loading and Error States (Same as previous version) ---
  if (userLoading && !reduxUserData?.user) { return <LoadingScreen baseMessage="Loading profile..." />; }
  if (userError) {
      return ( <div className="flex min-h-screen flex-col items-center justify-center"> <NavBar /> <p className="text-destructive mt-10">Error: {userError}</p> <Button onClick={() => dispatch(fetchUser())} className="mt-4">Retry</Button> </div> );
  }

  // --- Render Component ---
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <NavBar />
      {isUploadingImage && <LoadingScreen baseMessage="Uploading profile picture..." />}

      <main className="flex-1">
        {/* --- Hero Section --- */}
        <section className="relative bg-gradient-to-r from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-24 pt-10 md:pt-16">
           <div className="absolute inset-0 h-48 md:h-64 overflow-hidden opacity-30">
                {userData.coverPhoto ? ( <img src={userData.coverPhoto} alt="Cover" className="w-full h-full object-cover"/> ) : ( <div className="h-full w-full bg-gradient-to-r from-sky-100 to-indigo-200 dark:from-sky-900 dark:to-indigo-900"></div> )}
            </div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
              {/* Avatar & Upload */}
               <ImageUploadModal
                  maxImages={1} onImagesSelected={onProfileUpload} title="Update Profile Picture" description="Select an image."
                  trigger={
                    <div className="relative group cursor-pointer flex-shrink-0 -mb-12 md:-mb-16 order-1 md:order-none">
                      <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background dark:border-gray-800 shadow-lg ring-2 ring-white dark:ring-gray-700">
                        <AvatarImage src={userData.avatar} alt={`${userData.firstName} ${userData.lastName}`} className="object-cover" />
                        <AvatarFallback className="text-5xl bg-muted text-muted-foreground">{userData.firstName?.charAt(0)}{userData.lastName?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"><Camera className="h-8 w-8 text-white" /></div>
                    </div>
                  }
                />

              {/* User Info & Stats */}
              <div className="flex-grow text-center md:text-left mt-4 md:mt-0 order-2 md:order-none">
                {/* === NAME EDITING === */}
                {editMode ? (
                  <div className="flex flex-col sm:flex-row gap-2 mb-3 justify-center md:justify-start">
                     {/* Input styling: transparent bg, bottom border, no focus ring, matching font/padding */}
                    <Input name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name"
                           className="h-auto py-1 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white bg-transparent border-0 border-b border-gray-400 dark:border-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary px-1 max-w-xs mx-auto md:mx-0" />
                    <Input name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name"
                           className="h-auto py-1 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white bg-transparent border-0 border-b border-gray-400 dark:border-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary px-1 max-w-xs mx-auto md:mx-0" />
                  </div>
                ) : (
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1 h-auto py-1 px-1"> {/* Added matching h-auto py-1 px-1 */}
                    {userData.firstName} {userData.lastName}
                  </h1>
                )}
                 {/* === LOCATION/MEMBER SINCE EDITING === */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-center md:justify-start gap-x-5 gap-y-1 text-sm text-gray-600 dark:text-gray-400 mb-3">
                   <div className="flex items-center justify-center md:justify-start min-h-[28px]"> {/* Wrapper to stabilize height */}
                      <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
                      {editMode ? (
                        <Input name="location" value={formData.location} onChange={handleInputChange} placeholder="Your Location"
                               className="h-auto py-0.5 text-sm bg-transparent border-0 border-b border-gray-400 dark:border-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary px-1 max-w-[200px]" />
                      ) : (
                        <span className="py-0.5 px-1">{userData.location || "Location not set"}</span> // Added matching py/px
                      )}
                    </div>
                    <div className="flex items-center justify-center md:justify-start py-0.5 px-1 min-h-[28px]"> {/* Wrapper & matching py/px */}
                      <Clock className="h-4 w-4 mr-1.5 flex-shrink-0" />
                      <span>Member since {formatMemberSince(userData.memberSince)}</span>
                    </div>
                </div>

                {/* Key Stats (Only show when not editing) */}
                {!editMode && (
                    <div className="flex items-center justify-center md:justify-start space-x-4 text-sm mt-2">
                        <div className="flex items-center text-gray-700 dark:text-gray-300"><Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-400" /><span className="font-medium">{userData.stats.rating.toFixed(1)}</span><span className="text-gray-500 dark:text-gray-400 ml-1">({userData.stats.reviews} Reviews)</span></div>
                         <span className="text-gray-300 dark:text-gray-600">|</span>
                         <div className="flex items-center text-gray-700 dark:text-gray-300"><Package className="h-4 w-4 mr-1 text-blue-600" /><span className="font-medium">{userData.stats.itemsShared}</span><span className="text-gray-500 dark:text-gray-400 ml-1">Items Shared</span></div>
                          <span className="text-gray-300 dark:text-gray-600">|</span>
                         <div className="flex items-center text-gray-700 dark:text-gray-300"><ThumbsUp className="h-4 w-4 mr-1 text-green-600" /><span className="font-medium">{userData.stats.totalBorrows}</span><span className="text-gray-500 dark:text-gray-400 ml-1">Borrows</span></div>
                    </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 order-3 md:order-none self-center md:self-end">
                {editMode ? (
                  <>
                    <Button size="sm" onClick={handleSaveProfile} className="bg-green-600 hover:bg-green-700 text-white"><Check className="h-4 w-4 mr-1" /> Save</Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit}><X className="h-4 w-4 mr-1" /> Cancel</Button>
                  </>
                ) : (
                   <Button size="sm" variant="outline" onClick={() => setEditMode(true)} className="bg-white dark:bg-gray-700 dark:text-white"><Pencil className="h-4 w-4 mr-1.5" /> Edit Profile</Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* --- Main Content Area --- */}
        <section className="container px-4 md:px-6 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left Column: About & Settings */}
            <aside className="lg:col-span-4 space-y-6">
              <Card className="shadow-sm dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/60">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">About</CardTitle>
                </CardHeader>
                <CardContent>
                   {/* === BIO EDITING === */}
                   <div className="min-h-[120px]"> {/* Wrapper to prevent collapse */}
                        {editMode ? (
                            <Textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            placeholder="Tell the community about yourself..."
                            rows={6}
                            // Styling: transparent, bottom border, no focus ring, matching font/padding
                            className="w-full text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-transparent border-0 border-b border-gray-400 dark:border-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary p-0 resize-none min-h-[120px]"
                            />
                        ) : (
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed p-0"> {/* Ensure matching padding (p-0 here) */}
                            {userData.bio || "No bio available."}
                            </p>
                        )}
                   </div>
                </CardContent>
              </Card>

              {/* === Modernized Account Card === */}
              <Card className="shadow-sm dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/60">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">Account</CardTitle>
                </CardHeader>
                <CardContent className="p-2"> {/* Adjusted padding */}
                   <nav className="flex flex-col text-sm space-y-1"> {/* Added space-y */}
                        {/* Profile Settings Link */}
                        <Link to="/settings/profile"
                              className="flex items-center w-full rounded-md px-3 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150">
                            <UserCircle className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                            <span>Profile Settings</span>
                        </Link>

                        {/* Account Settings Link */}
                        <Link to="/settings/account"
                              className="flex items-center w-full rounded-md px-3 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150">
                            <Settings className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                            <span>Account Settings</span>
                        </Link>

                         {/* Notifications Link */}
                        <Link to="/settings/notifications"
                              className="flex items-center w-full rounded-md px-3 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150">
                            <MessageSquare className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                            <span>Notifications</span>
                        </Link>

                        {/* Sign Out Button */}
                        {/* TODO: Implement Sign Out Logic onClick */}
                        <button className="flex items-center w-full text-left rounded-md px-3 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-150 mt-2"> {/* Added mt-2 for slight separation */}
                            <LogOut className="h-5 w-5 mr-3" />
                            <span>Sign Out</span>
                        </button>
                  </nav>
                </CardContent>
              </Card>
            </aside>

            {/* Right Column: Tabs (Items, History, Reviews) - (No changes needed here from previous version) */}
            <div className="lg:col-span-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-200 dark:bg-gray-700/80 rounded-lg p-1">
                   <TabsTrigger value="items" className="text-gray-600 dark:text-gray-300 data-[state=active]:bg-background dark:data-[state=active]:bg-gray-900 data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md py-1.5"><Package className="h-4 w-4 mr-1.5" /> My Items ({userData.itemsListed.length})</TabsTrigger>
                   <TabsTrigger value="history" className="text-gray-600 dark:text-gray-300 data-[state=active]:bg-background dark:data-[state=active]:bg-gray-900 data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md py-1.5"><Calendar className="h-4 w-4 mr-1.5" /> History ({userData.borrowingHistory.length})</TabsTrigger>
                   <TabsTrigger value="reviews" className="text-gray-600 dark:text-gray-300 data-[state=active]:bg-background dark:data-[state=active]:bg-gray-900 data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md py-1.5"><Star className="h-4 w-4 mr-1.5" /> Reviews ({userData.reviews.length})</TabsTrigger>
                </TabsList>

                {/* My Items Tab Content (Same as previous modern version) */}
                <TabsContent value="items">
                    <div className="flex justify-end mb-4"><Link to="/new-listing"><Button size="sm" ><PlusCircle className="h-4 w-4 mr-1.5" />Add New Item</Button></Link></div>
                    {userData.itemsListed.length > 0 ? ( <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"> {userData.itemsListed.map((item) => ( <Card key={item.id} className="overflow-hidden group transition-all duration-300 hover:shadow-lg border-gray-200 dark:border-gray-700/60 dark:bg-gray-800/50 flex flex-col"><Link to={`/items/${item.id}`} className="block"><div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-700"><img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"/></div></Link><CardContent className="p-4 flex-grow flex flex-col justify-between"><div><div className="flex justify-between items-start gap-2 mb-1"><Link to={`/items/${item.id}`}><h3 className="font-semibold text-base text-gray-800 dark:text-gray-100 group-hover:text-primary transition-colors">{item.name}</h3></Link><Badge variant={item.status === "Available" ? "outline" : "secondary"} className={`text-xs whitespace-nowrap ${item.status === "Available" ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400" : "dark:bg-gray-700 dark:text-gray-300"}`}>{item.status}</Badge></div><p className="text-xs text-gray-500 dark:text-gray-400">{item.category}</p></div><div className="flex space-x-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/60"><Button variant="ghost" size="sm" className="flex-1 h-8 text-xs text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"><Pencil className="h-3.5 w-3.5 mr-1" /> Edit</Button><Button variant="ghost" size="sm" className="flex-1 h-8 text-xs text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">{item.status === "Available" ? "Set Rented" : "Set Available"}</Button></div></CardContent></Card> ))}</div>
                    ) : ( <Card className="shadow-sm dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/60"><CardContent className="text-center py-16"><Package className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4 opacity-50" /><h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">No items listed</h3><p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-6">Share your items!</p><Link to="/new-listing"><Button>Add Your First Item</Button></Link></CardContent></Card> )}
                </TabsContent>

                 {/* Borrow History Tab Content (Same as previous modern version) */}
                <TabsContent value="history">
                     {userData.borrowingHistory.length > 0 ? ( <div className="space-y-4"> {userData.borrowingHistory.map((item) => ( <Card key={item.id} className="overflow-hidden transition-shadow hover:shadow-md border-gray-200 dark:border-gray-700/60 dark:bg-gray-800/50"><div className="flex flex-col sm:flex-row items-stretch"><Link to={`/items/${item.id}`} className="block sm:w-36 h-36 sm:h-auto flex-shrink-0"><img src={item.image} alt={item.name} className="h-full w-full object-cover bg-gray-100 dark:bg-gray-700"/></Link><div className="flex-1 p-4 flex flex-col justify-between"><div><div className="flex justify-between items-start mb-1"><Link to={`/items/${item.id}`}><h3 className="font-semibold text-base text-gray-800 dark:text-gray-100 hover:text-primary">{item.name}</h3></Link><Badge variant={item.status === "Returned" ? "secondary" : "default"} className={`text-xs ${item.status !== 'Returned' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' : 'dark:bg-gray-700 dark:text-gray-300'}`}>{item.status}</Badge></div><p className="text-xs text-gray-500 dark:text-gray-400 mb-1">From: <span className="font-medium text-gray-700 dark:text-gray-300">{item.owner}</span></p><p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date: {formatDate(item.date)}</p><p className="text-xs text-gray-500 dark:text-gray-400">Category: {item.category}</p></div><div className="flex space-x-2 mt-3"><Link to={`/items/${item.id}`}><Button variant="outline" size="sm" className="h-8 text-xs dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600">View Item</Button></Link>{item.status === "Returned" && ( <Button size="sm" className="h-8 text-xs"><Star className="h-3.5 w-3.5 mr-1"/> Leave Review</Button>)}</div></div></div></Card> ))}</div>
                    ) : ( <Card className="shadow-sm dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/60"><CardContent className="text-center py-16"><Calendar className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4 opacity-50" /><h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">No borrow history</h3><p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-6">Borrow items near you!</p><Link to="/browse"><Button>Browse Items</Button></Link></CardContent></Card> )}
                </TabsContent>

                 {/* Reviews Tab Content (Same as previous modern version) */}
                <TabsContent value="reviews">
                     {userData.reviews.length > 0 ? ( <div className="space-y-6"> {userData.reviews.map((review) => ( <Card key={review.id} className="shadow-sm dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/60"><CardContent className="pt-6 pb-5"><div className="flex items-start gap-4"><Avatar className="h-10 w-10 border dark:border-gray-600"><AvatarImage src={review.reviewer.avatar} alt={review.reviewer.name} /><AvatarFallback className="bg-muted text-muted-foreground">{review.reviewer.name?.charAt(0)}</AvatarFallback></Avatar><div className="flex-1 space-y-1.5"><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-x-2 gap-y-1"><h4 className="font-semibold text-sm text-gray-800 dark:text-gray-100">{review.reviewer.name}</h4><div className="flex items-center text-xs text-gray-500 dark:text-gray-400">{Array.from({ length: 5 }).map((_, i) => ( <Star key={i} className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"}`} /> ))}<span className="mx-2 hidden sm:inline">•</span><span className="mt-1 sm:mt-0">{formatDate(review.date)}</span></div></div><p className="text-xs text-gray-500 dark:text-gray-400">Reviewed item: <span className="font-medium text-gray-600 dark:text-gray-300">{review.item}</span></p><p className="text-sm text-gray-700 dark:text-gray-300 pt-1">{review.comment}</p></div></div></CardContent></Card> ))}</div>
                    ) : ( <Card className="shadow-sm dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/60"><CardContent className="text-center py-16"><Star className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4 opacity-50" /><h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">No reviews yet</h3><p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Borrower feedback appears here.</p></CardContent></Card> )}
                </TabsContent>

              </Tabs>
            </div>

          </div>
        </section>
      </main>

      {/* --- Footer (Same as previous version) --- */}
       <footer className="w-full py-6 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700/60">
        <div className="container px-4 md:px-6"> <p className="text-xs text-gray-500 dark:text-gray-400 text-center"> © {new Date().getFullYear()} Borrow Anything. All rights reserved. </p> </div>
      </footer>
    </div>
  );
};

export default Profile;