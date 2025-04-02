/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, ChangeEvent, useCallback } from "react";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import LoadingScreen from "@/components/loader/LoadingScreen";

import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { AboutCard } from "@/components/profile/AboutCard";
import { AccountCard } from "@/components/profile/AccountCard";
import { ProfileTabs } from "@/components/profile/ProfileTabs";

import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import { fetchUser, updateUserData } from '@/store/slices/userSlice';
import get from 'lodash/get';
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { apiService } from "@/services/apiService";

// --- Dummy data for fallback/development ---
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
  itemsListed: [{ id: "1", name: "Power Drill", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60", category: "Tools", status: "Available", },{ id: "1", name: "Power Drill", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60", category: "Tools", status: "Available", },{ id: "1", name: "Power Drill", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60", category: "Tools", status: "Available", },{ id: "1", name: "Power Drill", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60", category: "Tools", status: "Available", },{ id: "1", name: "Power Drill", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60", category: "Tools", status: "Available", }, { id: "2", name: "Pressure Washer", image: "https://images.unsplash.com/photo-1621274218965-5e7d37c9af86?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60", category: "Cleaning", status: "Borrowed", }, { id: "3", name: "Ladder", image: "https://images.unsplash.com/photo-1620814509429-fa2d5fb95981?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60", category: "Tools", status: "Available", },],
  borrowingHistory: [{ id: "4", name: "Stand Mixer", image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60", owner: "Maria Johnson", category: "Kitchen", date: "2023-05-15T10:00:00Z", status: "Returned", }, { id: "5", name: "Projector", image: "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60", owner: "Jennifer Lee", category: "Electronics", date: "2023-04-02T10:00:00Z", status: "Returned", },],
  reviews: [{ id: "rev1", reviewer: { name: "Sarah Johnson", avatar: "https://randomuser.me/api/portraits/women/44.jpg", }, rating: 5, date: "2023-03-15T10:00:00Z", comment: "Alex was very responsive and the drill was in perfect condition. Would definitely borrow from him again!", item: "Power Drill", }, { id: "rev2", reviewer: { name: "Mike Peterson", avatar: "https://randomuser.me/api/portraits/men/67.jpg", }, rating: 5, date: "2023-02-02T10:00:00Z", comment: "Great ladder, well maintained. Alex was very helpful and flexible with pickup times.", item: "Ladder", }, { id: "rev3", reviewer: { name: "Lisa Garcia", avatar: "https://randomuser.me/api/portraits/women/28.jpg", }, rating: 4, date: "2023-01-12T10:00:00Z", comment: "The pressure washer worked great! Only reason for 4 stars is because it was a bit dirty when I got it.", item: "Pressure Washer", },],
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

  // Fetch user data on mount
  useEffect(() => {
    if (!reduxUserData?.user && !userLoading) {
      dispatch(fetchUser());
    }
  }, [reduxUserData?.user, dispatch, userLoading]);

  // Update local state when Redux data changes
  useEffect(() => {
    const fetchedFirstName = get(reduxUserData, "user.first_name", userDummyData.firstName);
    const fetchedLastName = get(reduxUserData, "user.last_name", userDummyData.lastName);
    const fetchedEmail = get(reduxUserData, "user.email", userDummyData.email);
    const fetchedAvatar = get(reduxUserData, "profile_picture_url", userDummyData.avatar);
    const fetchedBio = get(reduxUserData, "profile.bio", userDummyData.bio);
    const fetchedLocation = get(reduxUserData, "profile.location", userDummyData.location);
    const fetchedMemberSince = get(reduxUserData, "user.date_joined", userDummyData.memberSince);
    const fetchedCoverPhoto = get(reduxUserData, "profile.cover_photo_url", userDummyData.coverPhoto);
    const fetchedStats = { ...userDummyData.stats, ...get(reduxUserData, "profile.stats", {}) };
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
        firstName: fetchedFirstName,
        lastName: fetchedLastName,
        bio: fetchedBio,
        location: fetchedLocation,
      });
    }
  }, [reduxUserData, editMode]);

  // Event handlers
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSaveProfile = async () => {
    console.log("Saving profile data:", formData);
    setUserData(prev => ({ ...prev, ...formData }));
    setEditMode(false);
    toast({ variant: "success", title: "Profile Saved" });
  };

  const handleCancelEdit = useCallback(() => {
    setFormData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      bio: userData.bio,
      location: userData.location,
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

  // Loading and error states
  if (userLoading && !reduxUserData?.user) {
    return <LoadingScreen baseMessage="Loading profile..." />;
  }

  if (userError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <NavBar />
        <p className="text-destructive mt-10">Error: {userError}</p>
        <Button onClick={() => dispatch(fetchUser())} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <NavBar />
      {isUploadingImage && <LoadingScreen baseMessage="Uploading profile picture..." />}

      <main className="flex-1">
        {/* Hero Section with Profile Header */}
        <ProfileHeader
          userData={userData}
          editMode={editMode}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSaveProfile={handleSaveProfile}
          handleCancelEdit={handleCancelEdit}
          setEditMode={setEditMode}
          onProfileUpload={onProfileUpload}
          formatMemberSince={formatMemberSince}
        />

        {/* Main Content Area */}
        <section className="container px-4 md:px-6 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left Column: About & Settings */}
            <aside className="lg:col-span-4 space-y-6">
              <AboutCard
                bio={userData.bio}
                editMode={editMode}
                formData={formData}
                handleInputChange={handleInputChange}
              />
              <AccountCard />
            </aside>

            {/* Right Column: Tabs (Items, History, Reviews) */}
            <div className="lg:col-span-8">
              <ProfileTabs
                userData={userData}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                formatDate={formatDate}
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700/60">
        <div className="container px-4 md:px-6">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            © {new Date().getFullYear()} Borrow Anything. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Profile;