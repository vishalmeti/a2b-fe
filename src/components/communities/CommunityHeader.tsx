import { Users, Check, Plus, Star, Activity } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Community } from "@/types/community";

interface Props {
    community: Community;
    isMember: boolean;
    onJoinToggle: (id: string) => void;
}

export const CommunityHeader = ({ community, isMember, onJoinToggle }: Props) => (
    <div className="flex flex-col sm:flex-row items-start gap-6 p-8 bg-gradient-to-br from-card to-card/50 border rounded-xl shadow-sm">
        <Avatar className="w-24 h-24 border-2 border-primary/20 ring-2 ring-background">
            <AvatarImage src={community.imageUrl} alt={community.name} />
            <AvatarFallback className="text-3xl">{community.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-4">
            <div>
                <CardTitle className="text-4xl font-bold tracking-tight mb-2 flex items-center gap-2">
                    {community.name}
                    {isMember && <Badge variant="secondary" className="ml-2">Member</Badge>}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
                    <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4" />
                        {community.memberCount.toLocaleString()} members
                    </div>
                    <div className="flex items-center">
                        <Activity className="mr-1 h-4 w-4" />
                        {community.stats.activeBorrows} active borrows
                    </div>
                    <div className="flex items-center">
                        <Star className="mr-1 h-4 w-4" />
                        {community.stats.averageRating} rating
                    </div>
                </div>
            </div>
            
            {community.tags && (
                <div className="flex flex-wrap gap-2">
                    {community.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="px-3 py-1">
                            {tag}
                        </Badge>
                    ))}
                </div>
            )}

            <Button
                variant={isMember ? 'outline' : 'default'}
                size="lg"
                onClick={() => onJoinToggle(community.id)}
                className="w-full sm:w-auto relative overflow-hidden group"
            >
                {isMember ? (
                    <>
                        <Check className="mr-2 h-4 w-4" />
                        Member
                        <span className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </>
                ) : (
                    <>
                        <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
                        Join Community
                    </>
                )}
            </Button>
        </div>
    </div>
);
