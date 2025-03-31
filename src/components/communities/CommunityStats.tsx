import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, Users, Clock, Star } from 'lucide-react';
import { Community } from "@/types/community";

interface Props {
    stats: Community['stats'];
}

export const CommunityStats = ({ stats }: Props) => (
    <Card className="mt-4">
        <CardHeader>
            <CardTitle className="text-xl">Community Statistics</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center p-4 bg-secondary/20 rounded-lg">
                    <Share2 className="h-6 w-6 text-primary mb-2" />
                    <span className="text-2xl font-bold text-primary">{stats.activeBorrows}</span>
                    <span className="text-sm text-muted-foreground text-center">Active Borrows</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-secondary/20 rounded-lg">
                    <Users className="h-6 w-6 text-primary mb-2" />
                    <span className="text-2xl font-bold text-primary">{stats.totalItemsShared}</span>
                    <span className="text-sm text-muted-foreground text-center">Items Shared</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-secondary/20 rounded-lg">
                    <Clock className="h-6 w-6 text-primary mb-2" />
                    <span className="text-2xl font-bold text-primary">{stats.successfulTransactions}</span>
                    <span className="text-sm text-muted-foreground text-center">Completed Borrows</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-secondary/20 rounded-lg">
                    <Star className="h-6 w-6 text-primary mb-2" />
                    <span className="text-2xl font-bold text-primary">{stats.averageRating}★</span>
                    <span className="text-sm text-muted-foreground text-center">Avg. Rating</span>
                </div>
            </div>
        </CardContent>
    </Card>
);
