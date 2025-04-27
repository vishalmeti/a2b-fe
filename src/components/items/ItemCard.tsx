import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ItemCardProps {
  id: number | string;
  name: string;
  description: string;
  image: string;
  category: string;
  owner: {
    name: string;
    avatar: string;
    rating: number;
  };
}

const ItemCard = ({ id, name, description, image, category, owner }: ItemCardProps) => {
  return (
    <Link to={`/items/${id}`}>
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="bg-brand-neutral-lightest dark:text-gray-950">
              {category}
            </Badge>
          </div>
          <CardTitle className="text-lg">{name}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
            {description}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={owner.avatar} alt={owner.name} />
              <AvatarFallback>{owner.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium">{owner.name}</p>
              <div className="flex items-center">
                <span className="text-yellow-500">★</span>
                <span className="ml-1">{owner.rating}</span>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ItemCard;
