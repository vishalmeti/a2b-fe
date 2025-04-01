import { useState } from "react";
import NavBar from "@/components/NavBar";
import { useToast } from "@/hooks/use-toast";

// Import the extracted components
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileAbout from "@/components/profile/ProfileAbout";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileSettings from "@/components/profile/ProfileSettings";
import ProfileTabs from "@/components/profile/ProfileTabs";

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
        <ProfileHeader 
          userData={userData}
          editMode={editMode}
          setEditMode={setEditMode}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSaveProfile={handleSaveProfile}
          handleCancelEdit={handleCancelEdit}
        />

        <div className="container px-4 md:px-6 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - User info */}
            <div className="space-y-6">
              <ProfileAbout 
                bio={formData.bio} 
                editMode={editMode} 
                handleInputChange={handleInputChange}
              />
              <ProfileStats stats={userData.stats} />
              <ProfileSettings />
            </div>
            
            {/* Right column - Tabs */}
            <div className="md:col-span-2">
              <ProfileTabs 
                userData={userData} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
              />
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
