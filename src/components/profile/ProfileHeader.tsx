/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUploadModal } from "@/components/modals/ImageUploadModal";
import { Camera, MapPin, Clock, Star, Package, ThumbsUp, Pencil, Check, X, PlusCircle, ImageIcon } from "lucide-react";
import { ChangeEvent } from "react";
import { Link } from "react-router-dom";

interface ProfileHeaderProps {
  userData: any;
  editMode: boolean;
  formData: {
    firstName: string;
    lastName: string;
    location: string;
    bio: string;
  };
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSaveProfile: () => void;
  handleCancelEdit: () => void;
  setEditMode: (edit: boolean) => void;
  onProfileUpload: (files: any) => void;
  onCoverUpload: (files: any) => void; // New prop for cover photo uploads
  formatMemberSince: (date: string) => string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userData,
  editMode,
  formData,
  handleInputChange,
  handleSaveProfile,
  handleCancelEdit,
  setEditMode,
  onProfileUpload,
  onCoverUpload,
  formatMemberSince,
}) => {
  return (
    <section className="relative bg-gradient-to-r from-purple-100 via-white to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-20 pt-10 md:pt-16">
      <div className="absolute inset-0 h-48 md:h-64 overflow-hidden opacity-30 group">
        {userData.coverPhoto ? (
          <img src={userData.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-sky-100 to-indigo-200 dark:from-sky-900 dark:to-indigo-900"></div>
        )}

        {/* Cover Photo Edit Button */}
        <div className={`absolute right-4 bottom-4 transition-opacity duration-300 ${editMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <ImageUploadModal
            maxImages={1}
            onImagesSelected={onCoverUpload}
            title="Update Cover Photo"
            description="Select an image for your profile cover."
            trigger={
              <Button size="sm" variant="secondary" className="bg-black/70 hover:bg-black/80 text-white shadow-md">
                <ImageIcon className="h-4 w-4 mr-1.5" /> {userData.coverPhoto ? "Change Cover" : "Add Cover Photo"}
              </Button>
            }
          />
        </div>
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
          {/* Avatar & Upload - This already has its own group class */}
          <ImageUploadModal
            maxImages={1}
            onImagesSelected={onProfileUpload}
            title="Update Profile Picture"
            description="Select an image."
            trigger={
              <div className="relative group cursor-pointer flex-shrink-0 -mb-12 md:-mb-16 order-1 md:order-none">
                <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background dark:border-gray-800 shadow-lg ring-2 ring-white dark:ring-gray-700">
                  <AvatarImage src={userData.avatar} alt={`${userData.firstName} ${userData.lastName}`} className="object-cover" />
                  <AvatarFallback className="text-5xl bg-muted text-muted-foreground">
                    {userData.firstName?.charAt(0)}
                    {userData.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </div>
            }
          />

          {/* User Info & Stats */}
          <div className="flex-grow text-center md:text-left mt-4 md:mt-0 order-2 md:order-none">
            {/* Name Editing */}
            {editMode ? (
              <div className="flex flex-col sm:flex-row gap-2 mb-3 justify-center md:justify-start">
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="h-auto py-1 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white bg-transparent border-0 border-b border-gray-400 dark:border-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary px-1 max-w-xs mx-auto md:mx-0"
                />
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="h-auto py-1 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white bg-transparent border-0 border-b border-gray-400 dark:border-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary px-1 max-w-xs mx-auto md:mx-0"
                />
              </div>
            ) : (
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1 h-auto py-1 px-1">
                {userData.firstName} {userData.lastName}
              </h1>
            )}

            {/* Location/Member Since */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-center md:justify-start gap-x-5 gap-y-1 text-sm text-gray-600 dark:text-gray-400 mb-3">
              <div className="flex items-center justify-center md:justify-start min-h-[28px]">
                <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
                {editMode ? (
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Your Location"
                    className="h-auto py-0.5 text-sm bg-transparent border-0 border-b border-gray-400 dark:border-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary px-1 max-w-[200px]"
                  />
                ) : (
                  <span className="py-0.5 px-1">{userData.location || "Location not set"}</span>
                )}
              </div>
              <div className="flex items-center justify-center md:justify-start py-0.5 px-1 min-h-[28px]">
                <Clock className="h-4 w-4 mr-1.5 flex-shrink-0" />
                <span>Member since {formatMemberSince(userData.memberSince)}</span>
              </div>
            </div>

            {/* Key Stats */}
            {!editMode && (
              <div className="flex items-center justify-center md:justify-start space-x-4 text-sm mt-2">
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-400" />
                  <span className="font-medium">{userData.stats.rating.toFixed(1)}</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">({userData.stats.reviews} Reviews)</span>
                </div>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <Package className="h-4 w-4 mr-1 text-blue-600" />
                  <span className="font-medium">{userData.stats.itemsShared}</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">Items Shared</span>
                </div>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <ThumbsUp className="h-4 w-4 mr-1 text-green-600" />
                  <span className="font-medium">{userData.stats.totalBorrows}</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">Borrows</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 order-3 md:order-none self-center md:self-end">
            {editMode ? (
              <div className="flex flex-col space-y-2">
                <Button size="sm" onClick={handleSaveProfile} className="bg-green-600 hover:bg-green-700 text-white">
                  <Check className="h-4 w-4 mr-1" /> Save
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                  <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
              </div>
            ) : (
              <>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-end">
                    <Link to="/new-listing">
                      <Button size="sm"><PlusCircle className="h-4 w-4 mr-1.5" />Add New Item</Button>
                    </Link>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setEditMode(true)} className="bg-white dark:bg-gray-700 dark:text-white">
                    <Pencil className="h-4 w-4 mr-1.5" /> Edit Profile
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
