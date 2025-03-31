import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Community } from "@/types/community";

interface Props {
    community: Community;
}

export const CommunityDetails = ({ community }: Props) => (
    <Card className='flex-1'>
        <CardHeader>
            <CardTitle className="text-xl">About this community</CardTitle>
        </CardHeader>
        <CardContent className="text-base text-muted-foreground leading-relaxed">
            {community.longDescription}
        </CardContent>
    </Card>
);
