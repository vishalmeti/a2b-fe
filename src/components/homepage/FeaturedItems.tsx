import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";

interface FeaturedItem {
  id: number;
  name: string;
  description: string;
  image: string;
  owner: {
    name: string;
    avatar: string;
    rating: number;
  };
  distance: string;
  category: string;
}

interface FeaturedItemsProps {
  items: FeaturedItem[];
  community: string;
}

export function FeaturedItems({ items, community }: FeaturedItemsProps) {
  return (
    <section className="w-full py-12 md:py-24 bg-brand-neutral-lightest dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-brand-neutral-light dark:bg-gray-800 px-3 py-1 text-sm dark:text-gray-200">
              Available Now
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-brand-green dark:text-brand-green/90">
              Featured Items Near You
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-300">
              Check out what your neighbors are sharing in {community}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {items.map((item) => (
            <Link to={`/items/${item.id}`} key={item.id}>
              <Card className="h-full overflow-hidden transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-brand-neutral-lightest dark:bg-gray-700 dark:text-gray-200">
                      {item.category}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground dark:text-gray-400">
                      <MapPin className="mr-1 h-3 w-3" />
                      {item.distance}
                    </div>
                  </div>
                  <CardTitle className="text-lg dark:text-white">{item.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground dark:text-gray-300 line-clamp-2">
                    {item.description}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={item.owner.avatar} alt={item.owner.name} />
                      <AvatarFallback>{item.owner.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <p className="font-medium dark:text-white">{item.owner.name}</p>
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 dark:text-gray-300">{item.owner.rating}</span>
                      </div>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Link to="/browse">
            <Button variant="outline" size="lg" className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700">
              View All Items
              <ArrowRight className="ml-1.5 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
