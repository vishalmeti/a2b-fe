
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, Users, Repeat, HandCoins, Leaf, 
  Package, MapPin, Search, Clock 
} from "lucide-react";
import NavBar from "@/components/NavBar";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Sample data
const featuredItems = [
  {
    id: 1,
    name: "Power Drill",
    description: "Cordless power drill, perfect for small home projects",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    owner: {
      name: "Alex Smith",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4.8,
    },
    distance: "0.5 miles",
    category: "Tools",
  },
  {
    id: 2,
    name: "Stand Mixer",
    description: "Professional stand mixer, great for baking",
    image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    owner: {
      name: "Maria Johnson",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4.9,
    },
    distance: "0.7 miles",
    category: "Kitchen",
  },
  {
    id: 3,
    name: "Camping Tent",
    description: "4-person tent, waterproof and easy to set up",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    owner: {
      name: "David Brown",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
      rating: 4.7,
    },
    distance: "1.2 miles",
    category: "Outdoors",
  },
  {
    id: 4,
    name: "Air Fryer",
    description: "Large capacity air fryer with digital controls",
    image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    owner: {
      name: "Sarah Wilson",
      avatar: "https://randomuser.me/api/portraits/women/63.jpg",
      rating: 4.6,
    },
    distance: "0.9 miles",
    category: "Kitchen",
  },
];

const Index = () => {
  const isMobile = useIsMobile();
  const [community, setCommunity] = useState("Brighton Heights, Pittsburgh");

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-brand-green-light/10">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-brand-green px-3 py-1 text-sm text-white">
                  <MapPin className="mr-1 h-3 w-3 inline" />
                  {community}
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Borrow from neighbors, save money, reduce waste
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Why buy something you'll only use once? Borrow it from your community instead. 
                  It's more affordable, sustainable, and connects you with neighbors.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/browse">
                    <Button size="lg" className="w-full sm:w-auto">
                      Browse Items <ArrowRight className="ml-1.5 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      List Your First Item
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto max-w-[420px] lg:max-w-none lg:ml-auto">
                <div className="aspect-video overflow-hidden rounded-xl">
                  <img
                    src="https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                    alt="People sharing items in a community"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-brand-neutral-light px-3 py-1 text-sm">
                  Simple Process
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  How It Works
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Borrowing should be simple. Our platform makes it easy to find what you need in your community.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-8">
              <div className="flex flex-col items-center space-y-2 rounded-lg p-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green/10">
                  <Search className="h-6 w-6 text-brand-green" />
                </div>
                <h3 className="text-xl font-bold">Find & Request</h3>
                <p className="text-muted-foreground">
                  Browse items in your community and request to borrow them
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg p-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green/10">
                  <HandCoins className="h-6 w-6 text-brand-green" />
                </div>
                <h3 className="text-xl font-bold">Meet & Borrow</h3>
                <p className="text-muted-foreground">
                  Connect with the owner and borrow the item
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg p-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green/10">
                  <Repeat className="h-6 w-6 text-brand-green" />
                </div>
                <h3 className="text-xl font-bold">Return & Review</h3>
                <p className="text-muted-foreground">
                  Return the item and leave a review for the owner
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Items */}
        <section className="w-full py-12 md:py-24 bg-brand-neutral-lightest">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-brand-neutral-light px-3 py-1 text-sm">
                  Available Now
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Featured Items Near You
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Check out what your neighbors are sharing in {community}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {featuredItems.map((item) => (
                <Link to={`/items/${item.id}`} key={item.id}>
                  <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <CardHeader className="p-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="bg-brand-neutral-lightest">
                          {item.category}
                        </Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="mr-1 h-3 w-3" />
                          {item.distance}
                        </div>
                      </div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-2">
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
                          <p className="font-medium">{item.owner.name}</p>
                          <div className="flex items-center">
                            <span className="text-yellow-500">★</span>
                            <span className="ml-1">{item.owner.rating}</span>
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
                <Button variant="outline" size="lg">
                  View All Items
                  <ArrowRight className="ml-1.5 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-brand-neutral-light px-3 py-1 text-sm">
                  Why Borrow?
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Benefits of Borrowing
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Borrowing is better for your wallet, your space, and the planet.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-8">
              <div className="flex flex-col items-center space-y-2 rounded-lg p-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green/10">
                  <HandCoins className="h-6 w-6 text-brand-green" />
                </div>
                <h3 className="text-xl font-bold">Save Money</h3>
                <p className="text-muted-foreground">
                  Why buy expensive items you'll only use occasionally?
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg p-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green/10">
                  <Leaf className="h-6 w-6 text-brand-green" />
                </div>
                <h3 className="text-xl font-bold">Reduce Waste</h3>
                <p className="text-muted-foreground">
                  Help the environment by reducing consumption and waste
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg p-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green/10">
                  <Users className="h-6 w-6 text-brand-green" />
                </div>
                <h3 className="text-xl font-bold">Build Community</h3>
                <p className="text-muted-foreground">
                  Connect with neighbors and build a stronger community
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full py-12 md:py-24 bg-brand-green text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Start Sharing Today
                </h2>
                <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join your neighbors in building a more sustainable community.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/signup">
                  <Button size="lg" variant="outline" className="bg-white text-brand-green border-white hover:bg-white/90 hover:text-brand-green">
                    Create Account
                  </Button>
                </Link>
                <Link to="/browse">
                  <Button size="lg" variant="ghost" className="text-white border-white hover:bg-white/10">
                    Browse Items
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-6 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Borrow Anything</h3>
              <ul className="space-y-1 text-sm">
                <li><Link to="/about" className="hover:underline">About Us</Link></li>
                <li><Link to="/how-it-works" className="hover:underline">How It Works</Link></li>
                <li><Link to="/trust-safety" className="hover:underline">Trust & Safety</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Community</h3>
              <ul className="space-y-1 text-sm">
                <li><Link to="/communities" className="hover:underline">Find Communities</Link></li>
                <li><Link to="/guidelines" className="hover:underline">Community Guidelines</Link></li>
                <li><Link to="/stories" className="hover:underline">Success Stories</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Support</h3>
              <ul className="space-y-1 text-sm">
                <li><Link to="/help" className="hover:underline">Help Center</Link></li>
                <li><Link to="/contact" className="hover:underline">Contact Us</Link></li>
                <li><Link to="/faq" className="hover:underline">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Legal</h3>
              <ul className="space-y-1 text-sm">
                <li><Link to="/terms" className="hover:underline">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:underline">Privacy Policy</Link></li>
                <li><Link to="/cookies" className="hover:underline">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-muted-foreground text-center">
              © {new Date().getFullYear()} Borrow Anything. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
