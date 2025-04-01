import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Calendar, Star, MessageSquare } from "lucide-react";

interface ProfileStatsProps {
  stats: {
    itemsShared: number;
    totalBorrows: number;
    rating: number;
    reviews: number;
  };
}

const ProfileStats = ({ stats }: ProfileStatsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg">
            <Package className="h-6 w-6 mb-1 text-primary" />
            <span className="text-2xl font-bold">{stats.itemsShared}</span>
            <span className="text-sm text-muted-foreground">Items Shared</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg">
            <Calendar className="h-6 w-6 mb-1 text-primary" />
            <span className="text-2xl font-bold">{stats.totalBorrows}</span>
            <span className="text-sm text-muted-foreground">Total Borrows</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg">
            <Star className="h-6 w-6 mb-1 text-primary" />
            <span className="text-2xl font-bold">{stats.rating}</span>
            <span className="text-sm text-muted-foreground">Rating</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg">
            <MessageSquare className="h-6 w-6 mb-1 text-primary" />
            <span className="text-2xl font-bold">{stats.reviews}</span>
            <span className="text-sm text-muted-foreground">Reviews</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileStats;
