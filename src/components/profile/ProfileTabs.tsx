/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Calendar, Star } from "lucide-react";
import ProfileItems from "./ProfileItems";
import BorrowHistory from "./BorrowHistory";
import ReviewsList from "./ReviewsList";

interface ProfileTabsProps {
  userData: {
    itemsListed: any[];
    borrowingHistory: any[];
    reviews: any[];
  };
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const ProfileTabs = ({ userData, activeTab, setActiveTab }: ProfileTabsProps) => {
  return (
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
      
      <TabsContent value="items">
        <ProfileItems items={userData.itemsListed} />
      </TabsContent>
      
      <TabsContent value="history">
        <BorrowHistory items={userData.borrowingHistory} />
      </TabsContent>
      
      <TabsContent value="reviews">
        <ReviewsList reviews={userData.reviews} />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
