/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Calendar, Star } from "lucide-react";
import { ItemsTabContent } from "./ItemsTabContent";
import { HistoryTabContent } from "./HistoryTabContent";
import { ReviewsTabContent } from "./ReviewsTabContent";

interface ProfileTabsProps {
  userData: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  formatDate: (date: string) => string;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({
  userData,
  activeTab,
  setActiveTab,
  formatDate,
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-200 dark:bg-gray-700/80 rounded-lg p-1">
        <TabsTrigger value="items" className="text-gray-600 dark:text-gray-300 data-[state=active]:bg-background dark:data-[state=active]:bg-gray-900 data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md py-1.5">
          <Package className="h-4 w-4 mr-1.5" /> My Items ({userData.itemsListed.length})
        </TabsTrigger>
        <TabsTrigger value="history" className="text-gray-600 dark:text-gray-300 data-[state=active]:bg-background dark:data-[state=active]:bg-gray-900 data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md py-1.5">
          <Calendar className="h-4 w-4 mr-1.5" /> History ({userData.borrowingHistory.length})
        </TabsTrigger>
        <TabsTrigger value="reviews" className="text-gray-600 dark:text-gray-300 data-[state=active]:bg-background dark:data-[state=active]:bg-gray-900 data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md py-1.5">
          <Star className="h-4 w-4 mr-1.5" /> Reviews ({userData.reviews.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="items">
        <ItemsTabContent items={userData.itemsListed} />
      </TabsContent>

      <TabsContent value="history">
        <HistoryTabContent history={userData.borrowingHistory} formatDate={formatDate} />
      </TabsContent>

      <TabsContent value="reviews">
        <ReviewsTabContent reviews={userData.reviews} formatDate={formatDate} />
      </TabsContent>
    </Tabs>
  );
};
