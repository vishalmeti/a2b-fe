import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Clock, Edit2, Check, X } from "lucide-react";

interface ProfileHeaderProps {
  userData: {
    name: string;
    avatar: string;
    coverPhoto: string;
    location: string;
    memberSince: string;
  };
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  formData: {
    name: string;
    location: string;
    bio: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSaveProfile: () => void;
  handleCancelEdit: () => void;
}

const ProfileHeader = ({
  userData,
  editMode,
  setEditMode,
  formData,
  handleInputChange,
  handleSaveProfile,
  handleCancelEdit
}: ProfileHeaderProps) => {
  return (
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
  );
};

export default ProfileHeader;
