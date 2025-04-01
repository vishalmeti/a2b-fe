import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit2 } from "lucide-react";

interface Item {
  id: string;
  name: string;
  image: string;
  category: string;
  status: string;
}

interface ProfileItemsProps {
  items: Item[];
}

const ProfileItems = ({ items }: ProfileItemsProps) => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">My Items ({items.length})</h2>
        <Link to="/new-listing">
          <Button size="sm">
            Add New Item
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Link to={`/items/${item.id}`} key={item.id}>
            <Card className="overflow-hidden transition-shadow hover:shadow-md h-full">
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{item.name}</h3>
                  <Badge
                    variant={item.status === "Available" ? "outline" : "secondary"}
                    className={item.status === "Available" ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-100" : ""}
                  >
                    {item.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">{item.category}</div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    {item.status === "Available" ? "Mark Unavailable" : "Mark Available"}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
};

export default ProfileItems;
