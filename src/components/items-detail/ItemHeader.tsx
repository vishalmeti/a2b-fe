import { MapPin, Share2, Heart, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface ItemHeaderProps {
  title: string;
  category: string;
  communityName: string;
}

export const ItemHeader = ({ title, category, communityName }: ItemHeaderProps) => {
  const { toast } = useToast();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Check out this ${title} on Borrow Anything!`,
        url: window.location.href,
      });
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied to clipboard",
        description: "You can now share this item with others.",
      });
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <Badge variant="outline" className="bg-brand-neutral-lightest mb-2">
          {category}
        </Badge>
        <h1 className="text-3xl font-bold">{title}</h1>
        <div className="flex items-center mt-1 text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{communityName}</span>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button variant="ghost" size="icon" onClick={handleShare}>
          <Share2 className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Heart className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Flag className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ItemHeader;
