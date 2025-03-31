import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { ItemImages } from "@/components/items/ItemImages";
import { itemsData } from "@/components/items/mock-data";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingScreen } from "@/components/loader/LoadingScreen";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, Calendar as CalendarIcon, Share2, Flag, 
  Heart, MessageCircle, ArrowLeft, Clock, Info, User
} from "lucide-react";
import { format } from "date-fns";
import { TriangleAlert } from "lucide-react"; // Using a different icon

import { Calendar } from "@/components/ui/calendar";

const ItemDetail = () => {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);
  
  // Find the item with the matching id
  const item = itemsData.find(item => item.id === id);
  
  if (!item) {
    return (
      <div className="flex min-h-screen flex-col">
        <NavBar />
        <div className="flex justify-center items-center flex-1">
        <div
                className="
                    w-full max-w-lg bg-card text-card-foreground
                    p-8 md:p-12 rounded-xl border shadow-md text-center
                    transition-shadow duration-300 ease-in-out hover:shadow-xl
                    animate-fade-in
                "
            >
                <div className="mb-6 flex justify-center">
                    <TriangleAlert className="w-20 h-20 text-primary  animate-pulse" strokeWidth={2.5} />
                </div>

                <div
                    className=""
                    style={{ animationDelay: '150ms' }}
                >
                    <h1 className="text-7xl lg:text-8xl font-extrabold text-primary mb-3 tracking-tight">
                        404
                    </h1>
                    <p className="text-xl lg:text-2xl text-muted-foreground mb-4">
                        Item Not Found
                    </p>
                    {/* Updated paragraph for path display */}
                    <p className="text-sm text-muted-foreground/80 mb-8">
                        Sorry, we couldn't find the page:{" "} {/* Added space for readability */}
                        {/* Apply break-words to the code element */}
                        {/* <code className="bg-muted px-1 py-0.5 rounded text-muted-foreground font-mono break-words">
                            {attemptedPath}
                        </code> */}
                    </p>
                </div>

                <div
                    className=""
                    style={{ animationDelay: '300ms' }}
                >
                    <Button asChild size="lg">
                        <Link to="/browse">Back to All Items</Link>
                    </Button>
                </div>
            </div>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.name,
        text: `Check out this ${item.name} on Borrow Anything!`,
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

  const handleBorrowRequest = () => {
    if (!selectedDate) {
      toast({
        variant: "destructive",
        title: "Please select a date",
        description: "Select when you want to borrow this item.",
      });
      return;
    }

    if (!message.trim()) {
      toast({
        variant: "destructive",
        title: "Please add a message",
        description: "Let the owner know why you want to borrow this item.",
      });
      return;
    }

    // This would send the request to an API in a real app
    toast({
      title: "Request sent!",
      description: `Your request to borrow ${item.name} has been sent to ${item.owner.name}.`,
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />

      <main className="flex-1 container py-8">
      {isLoading && <LoadingScreen baseMessage={'Fetching details ...'} />}
        <div className="mb-6">
          <Link to="/browse" className="text-muted-foreground hover:text-foreground inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to browse
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Item Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            <ItemImages images={item.images} name={item.name} />

            {/* Item Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="outline" className="bg-brand-neutral-lightest mb-2">
                    {item.details.category}
                  </Badge>
                  <h1 className="text-3xl font-bold">{item.name}</h1>
                  <div className="flex items-center mt-1 text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{item.location.distance}</span>
                    <span className="mx-2">•</span>
                    <span>{item.location.neighborhood}</span>
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

              <Separator />

              <div>
                <h2 className="text-xl font-semibold mb-2">About this item</h2>
                <p className="text-muted-foreground whitespace-pre-line">
                  {item.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Item Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Condition:</dt>
                        <dd className="font-medium">{item.details.condition}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Brand:</dt>
                        <dd className="font-medium">{item.details.brand}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Estimated Value:</dt>
                        <dd className="font-medium">{item.details.estimatedValue}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Age:</dt>
                        <dd className="font-medium">{item.details.ageOfItem}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Borrowing Terms</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Borrow Period:</dt>
                        <dd className="font-medium">{item.borrowingTerms.returnPeriod}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Security Deposit:</dt>
                        <dd className="font-medium">{item.borrowingTerms.securityDeposit}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Pickup/Dropoff:</dt>
                        <dd className="font-medium">{item.borrowingTerms.meetupPreference}</dd>
                      </div>
                      {item.borrowingTerms.additionalNotes && (
                        <div className="pt-2">
                          <dt className="text-muted-foreground mb-1">Additional Notes:</dt>
                          <dd className="font-medium">{item.borrowingTerms.additionalNotes}</dd>
                        </div>
                      )}
                    </dl>
                  </CardContent>
                </Card>
              </div>

              {/* Reviews */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Reviews ({item.reviews.length})</h2>
                <div className="space-y-4">
                  {item.reviews.map((review, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage src={review.userAvatar} alt={review.userName} />
                            <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <h4 className="font-semibold">{review.userName}</h4>
                              <span className="mx-2 text-muted-foreground">•</span>
                              <span className="text-muted-foreground text-sm">{review.date}</span>
                            </div>
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className={i < review.rating ? "text-yellow-500" : "text-muted"}>
                                  ★
                                </span>
                              ))}
                            </div>
                            <p className="text-muted-foreground">{review.comment}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Owner info and Borrow Request */}
          <div className="space-y-6">
            {/* Availability Badge */}
            <Badge className="w-full justify-center py-2 text-base bg-green-100 hover:bg-green-100 text-green-800 border-green-200">
              {item.availability}
            </Badge>

            {/* Owner Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Owner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={item.owner.avatar} alt={item.owner.name} />
                    <AvatarFallback>{item.owner.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{item.owner.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span>{item.owner.rating}</span>
                      <span className="mx-1">•</span>
                      <span>Member since {item.owner.memberSince}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <MessageCircle className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <span className="font-medium">Response Rate: </span>
                      <span className="text-muted-foreground">{item.owner.responseRate}</span>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <span className="font-medium">Response Time: </span>
                      <span className="text-muted-foreground">{item.owner.responseTime}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link to={`/profile/${item.owner.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    <User className="mr-2 h-4 w-4" />
                    View Profile
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Request Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Request to Borrow</CardTitle>
                <CardDescription>
                  Select a date and send a message to the owner
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    When do you need it?
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                          format(selectedDate, "PPP")
                        ) : (
                          <span>Select a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                        disabled={(date) => 
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Message to owner
                  </label>
                  <Textarea
                    placeholder="Introduce yourself and explain why you'd like to borrow this item..."
                    className="min-h-[120px]"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <div className="flex items-start pt-2">
                  <Info className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    By sending a request, you agree to the borrowing terms specified by the owner.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleBorrowRequest}>
                  Send Request
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      <footer className="w-full py-6 bg-muted">
        <div className="container px-4 md:px-6">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Borrow Anything. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ItemDetail;
