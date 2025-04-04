import { Link } from "react-router-dom";
import { PhoneCall, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface OwnerCardProps {
  owner: {
    user: {
      id: string;
      first_name: string;
      last_name: string;
    };
    profile_picture_url?: string;
    average_lender_rating?: number;
    phone_number?: string;
  };
  communityName: string;
}

export const OwnerCard = ({ owner, communityName }: OwnerCardProps) => {
  const ownerName = `${owner.user.first_name} ${owner.user.last_name}`;
  const ownerInitial = owner.user.first_name.charAt(0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Owner</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={owner.profile_picture_url} alt={ownerName} className="object-cover" />
            <AvatarFallback>{ownerInitial}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{ownerName}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              {owner.average_lender_rating && (
                <>
                  <span className="text-yellow-500 mr-1">★</span>
                  <span>{owner.average_lender_rating}</span>
                  <span className="mx-1">•</span>
                </>
              )}
              <span>{communityName}</span>
            </div>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          {owner.phone_number && (
            <div className="flex items-start">
              <PhoneCall className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
              <div>
                <span className="font-medium">Phone: </span>
                <span className="text-muted-foreground">{owner.phone_number}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/profile/${owner.user.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            <User className="mr-2 h-4 w-4" />
            View Profile
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default OwnerCard;
