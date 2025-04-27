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
import { Hero } from "@/components/homepage/Hero";
import { FeaturedItems } from "@/components/homepage/FeaturedItems";
import { Benefits } from "@/components/homepage/Benefits";

const featuredItems = [
  {
    id: 'dummy',
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
    id: 'dummy',
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
    id: 'dummy',
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
    id: 'dummy',
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
  const [community, setCommunity] = useState("Bengaluru / Bangalore, India");

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      
      <main className="flex-1">
        <Hero community={community} />
        {/* How It Works */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-brand-neutral-light px-3 py-1 text-sm">
                  Simple Process
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-brand-green">
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

        <FeaturedItems items={featuredItems} community={community} />
        <Benefits />

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

      <footer className="w-full py-12 bg-muted border-t">
        <div className="container px-4 md:px-6">
          {/* Newsletter Section */}
          <div className="mb-12 grid gap-8 md:grid-cols-2 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">Stay Connected</h3>
              <p className="text-muted-foreground">Join our newsletter for community updates and exclusive offers.</p>
            </div>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-2 rounded-lg border bg-background"
              />
              <Button variant="default">Subscribe</Button>
            </div>
          </div>

          {/* Main Footer Content */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-8 border-b">
            <div className="col-span-2 lg:col-span-2">
              <h3 className="text-xl font-bold mb-4">Borrow Bundle</h3>
              <p className="text-muted-foreground mb-4 max-w-sm">
                Connecting communities through sustainable sharing. Borrow what you need, share what you have.
              </p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-brand-green"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg></a>
                <a href="#" className="hover:text-brand-green"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/></svg></a>
                <a href="#" className="hover:text-brand-green"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/></svg></a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Discover</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="text-muted-foreground hover:text-brand-green">About Us</Link></li>
                <li><Link to="/how-it-works" className="text-muted-foreground hover:text-brand-green">How It Works</Link></li>
                <li><Link to="/trust-safety" className="text-muted-foreground hover:text-brand-green">Trust & Safety</Link></li>
                <li><Link to="/pricing" className="text-muted-foreground hover:text-brand-green">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Community</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/communities" className="text-muted-foreground hover:text-brand-green">Find Communities</Link></li>
                <li><Link to="/guidelines" className="text-muted-foreground hover:text-brand-green">Guidelines</Link></li>
                <li><Link to="/blog" className="text-muted-foreground hover:text-brand-green">Blog</Link></li>
                <li><Link to="/stories" className="text-muted-foreground hover:text-brand-green">Stories</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/help" className="text-muted-foreground hover:text-brand-green">Help Center</Link></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-brand-green">Contact</Link></li>
                <li><Link to="/faq" className="text-muted-foreground hover:text-brand-green">FAQ</Link></li>
                <li><Link to="/report" className="text-muted-foreground hover:text-brand-green">Report Issue</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Borrow Bundle. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link to="/terms" className="hover:text-brand-green">Terms</Link>
              <Link to="/privacy" className="hover:text-brand-green">Privacy</Link>
              <Link to="/cookies" className="hover:text-brand-green">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
