import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Star } from 'lucide-react';
import { Community } from "@/types/community";

interface Props {
    community: Community;
    isJoined: boolean;
    onClick: () => void;
}

export const CommunityCard = ({ community, isJoined, onClick }: Props) => (
    <Card
        className={`group h-full flex flex-col cursor-pointer relative overflow-hidden transition-all duration-300 ${
            isJoined ? 'shadow-lg border-primary' : 'hover:shadow-lg hover:border-primary'
        }`}
        onClick={onClick}
    >
        <div className={`absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent transition-opacity ${
            isJoined ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`} />
        
        {isJoined && (
            <Badge variant="secondary" className="absolute top-3 right-3 bg-primary/10 text-primary">
                Joined
            </Badge>
        )}
        
        <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className={`w-12 h-12 border transition-transform ${
                isJoined ? 'scale-105' : 'group-hover:scale-105'
            }`}>
                <AvatarImage src={community.imageUrl} alt={community.name} />
                <AvatarFallback>{community.name.substring(0, 1)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <CardTitle className={`text-xl font-semibold leading-tight mb-1 transition-colors ${
                    isJoined ? 'text-primary' : 'group-hover:text-primary'
                }`}>
                    {community.name}
                </CardTitle>
                <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-1 h-3 w-3" />
                    {community.memberCount.toLocaleString()} members
                </div>
            </div>
        </CardHeader>

        <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground mb-4">{community.description}</p>
            <div className="flex flex-wrap gap-2">
                {community.tags?.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                    </Badge>
                ))}
            </div>
        </CardContent>

        <CardFooter className="grid grid-cols-3 gap-2 pt-4 border-t">
            <div className="text-center">
                <div className="text-sm font-medium">{community.stats.activeBorrows}</div>
                <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div className="text-center">
                <div className="text-sm font-medium">{community.stats.totalItemsShared}</div>
                <div className="text-xs text-muted-foreground">Items</div>
            </div>
            <div className="text-center">
                <div className="text-sm font-medium">{community.stats.averageRating}★</div>
                <div className="text-xs text-muted-foreground">Rating</div>
            </div>
        </CardFooter>
    </Card>
);