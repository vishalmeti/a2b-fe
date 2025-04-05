import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

// Assuming these are defined elsewhere
import { useToast } from "@/hooks/use-toast";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import NavBar from "@/components/NavBar";
import LoadingScreen from "@/components/loader/LoadingScreen";

// Shadcn/ui component imports
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // For mobile filters

// Lucide icons
import {
  ArrowLeft, CheckCircle, XCircle, MessageCircle, MoreVertical, Clock,
  CalendarRange, AlertCircle, Package, Search, ClipboardList, SlidersHorizontal,
  Star, Inbox, Filter as FilterIcon, Bell, Check, X, Hand // New icons
} from "lucide-react";

// --- Type Definitions (remain the same) ---
type RequestStatus = "PENDING" | "APPROVED" | "DECLINED" | "CANCELLED" | "COMPLETED";
type RequestItem = { id: string; title: string; image: string; category: string; };
type Borrower = { id: string; name: string; avatar: string; rating: number; borrowCount: number; };
type BorrowRequest = { id: string; item: RequestItem; borrower: Borrower; status: RequestStatus; requestDate: string; startDate: string; endDate: string; message: string; returnDate?: string; isNew: boolean; };

// --- Sample Data (remain the same) ---
const sampleRequests: BorrowRequest[] = [
  // Add more diverse sample data if needed for testing layout
  { id: "req1", item: { id: "item1", title: "Power Drill", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60", category: "Tools" }, borrower: { id: "user1", name: "Sarah Johnson", avatar: "https://randomuser.me/api/portraits/women/44.jpg", rating: 4.8, borrowCount: 12 }, status: "PENDING", requestDate: "2023-07-20T10:30:00Z", startDate: "2023-07-25", endDate: "2023-07-28", message: "Hi! I'm doing some home renovations this weekend and would love to borrow your drill. I'll take good care of it!", isNew: true, },
  { id: "req2", item: { id: "item2", title: "Mountain Bike - High End Model with Carbon Frame", image: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60", category: "Sports" }, borrower: { id: "user2", name: "Mike Peterson", avatar: "https://randomuser.me/api/portraits/men/67.jpg", rating: 4.5, borrowCount: 8 }, status: "APPROVED", requestDate: "2023-07-18T14:45:00Z", startDate: "2023-07-22", endDate: "2023-07-24", message: "Would love to borrow your bike for a weekend trip with some friends. I'm an experienced rider and will bring it back clean and in good condition.", isNew: false, },
  { id: "req3", item: { id: "item3", title: "Digital Camera", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60", category: "Electronics" }, borrower: { id: "user3", name: "Lisa Garcia", avatar: "https://randomuser.me/api/portraits/women/28.jpg", rating: 4.9, borrowCount: 15 }, status: "COMPLETED", requestDate: "2023-07-05T09:20:00Z", startDate: "2023-07-10", endDate: "2023-07-15", returnDate: "2023-07-15T11:30:00Z", message: "I'm taking a weekend photography class and need a good camera. Would appreciate if I could borrow yours.", isNew: false, },
  { id: "req4", item: { id: "item4", title: "Camping Tent", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60", category: "Outdoors" }, borrower: { id: "user4", name: "James Wilson", avatar: "https://randomuser.me/api/portraits/men/43.jpg", rating: 4.6, borrowCount: 7 }, status: "DECLINED", requestDate: "2023-07-12T16:15:00Z", startDate: "2023-07-16", endDate: "2023-07-18", message: "Going camping with my family this weekend. Would it be possible to borrow your tent? We'll clean it thoroughly before returning.", isNew: false, },
  // Add a few more pending
  { id: "req5", item: { id: "item5", title: "Stand Mixer", image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60", category: "Kitchen" }, borrower: { id: "user5", name: "Emma Taylor", avatar: "https://randomuser.me/api/portraits/women/33.jpg", rating: 4.7, borrowCount: 5 }, status: "PENDING", requestDate: "2023-07-19T11:30:00Z", startDate: "2023-07-24", endDate: "2023-07-26", message: "Baking for charity!", isNew: false, },
  { id: "req6", item: { id: "item6", title: "Projector", image: "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60", category: "Electronics" }, borrower: { id: "user6", name: "Daniel Brown", avatar: "https://randomuser.me/api/portraits/men/20.jpg", rating: 4.4, borrowCount: 3 }, status: "PENDING", requestDate: "2023-07-21T08:00:00Z", startDate: "2023-07-29", endDate: "2023-07-30", message: "Movie night this weekend, hope it's available!", isNew: true, },
];

// --- Helper Functions ---
const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr) return "N/A";
  try {
    // Using UTC to avoid timezone issues if dates are just YYYY-MM-DD
    const date = new Date(dateStr + 'T00:00:00Z');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
  } catch (e) { return "Invalid date"; }
};

const timeAgo = (dateStr: string | undefined): string => {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000; // years
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000; // months
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400; // days
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600; // hours
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60; // minutes
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
  } catch (e) { return ""; }
};

// Type for filter states
type FilterType = "all" | RequestStatus | "other"; // "other" includes Declined/Cancelled

// --- Main Component ---
const RequestsReceivedRedesign = () => {
  useAuthRedirect(); // Check auth status
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // --- Data Loading ---
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const sortedRequests = [...sampleRequests].sort((a, b) =>
         // Sort primarily by pending status, then by newest request date
         (a.status === 'PENDING' ? -1 : 1) - (b.status === 'PENDING' ? -1 : 1) ||
         new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
      );
      setRequests(sortedRequests);
      setLoading(false);
    }, 800); // Slightly faster load simulation
    return () => clearTimeout(timer);
  }, []);

  // --- Filtering Logic ---
  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      let filterMatch = false;
      if (activeFilter === "all") filterMatch = true;
      else if (activeFilter === "other") filterMatch = request.status === "DECLINED" || request.status === "CANCELLED";
      else filterMatch = request.status === activeFilter;
      if (!filterMatch) return false;

      if (searchQuery) {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;
        return (
          request.item.title.toLowerCase().includes(query) ||
          request.borrower.name.toLowerCase().includes(query) ||
          request.item.category.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [requests, activeFilter, searchQuery]);

  // --- Counts for Sidebar/Stats ---
  const counts = useMemo(() => {
    return requests.reduce((acc, req) => {
      acc.all++;
      if (req.status === 'PENDING') acc.PENDING++;
      else if (req.status === 'APPROVED') acc.APPROVED++;
      else if (req.status === 'COMPLETED') acc.COMPLETED++;
      else if (req.status === 'DECLINED' || req.status === 'CANCELLED') acc.other++;
      return acc;
    }, { all: 0, PENDING: 0, APPROVED: 0, COMPLETED: 0, other: 0 } as Record<FilterType, number>);
  }, [requests]);

  // --- Action Handlers (Remain similar, log API calls) ---
  const handleApprove = (requestId: string) => {
    toast({ title: "Request Approved", variant: "success" });
    setRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: "APPROVED", isNew: false } : req));
    console.log(`API CALL: Approve request ${requestId}`);
  };
  const handleDecline = (requestId: string) => {
    toast({ title: "Request Declined", variant: "destructive" });
    setRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: "DECLINED", isNew: false } : req));
    console.log(`API CALL: Decline request ${requestId}`);
  };
  const handleMessage = (borrowerId: string, requestId: string) => {
    toast({ title: "Opening Chat..." });
    console.log(`Maps to message thread for borrower ${borrowerId}, request ${requestId}`);
    // navigate(`/messages/${borrowerId}?context=request&requestId=${requestId}`);
  };

  // --- Sidebar Component ---
  const SidebarContent = () => (
    <nav className="flex flex-col gap-1.5 p-4">
      <h2 className="text-lg font-semibold mb-3 px-2">Filter Requests</h2>
      {(["all", "PENDING", "APPROVED", "COMPLETED", "other"] as FilterType[]).map((filter) => {
        const isActive = activeFilter === filter;
        const label = filter === 'other' ? 'Declined/Cancelled' : filter.charAt(0).toUpperCase() + filter.slice(1).toLowerCase();
        const count = counts[filter];
        let Icon = Inbox;
        if (filter === 'PENDING') Icon = Clock;
        else if (filter === 'APPROVED') Icon = CheckCircle;
        else if (filter === 'COMPLETED') Icon = Check;
        else if (filter === 'other') Icon = X;

        return (
          <Button
            key={filter}
            variant={isActive ? "secondary" : "ghost"}
            className={`justify-start h-9 ${isActive ? 'font-medium' : ''}`}
            onClick={() => {
                setActiveFilter(filter);
                setIsMobileFiltersOpen(false); // Close sheet on selection
            }}
          >
            <Icon className={`h-4 w-4 mr-2.5 ${
                filter === 'PENDING' && isActive ? 'text-amber-600 dark:text-amber-400' :
                filter === 'APPROVED' && isActive ? 'text-emerald-600 dark:text-emerald-400' :
                filter === 'COMPLETED' && isActive ? 'text-blue-600 dark:text-blue-400' :
                filter === 'other' && isActive ? 'text-rose-600 dark:text-rose-400' :
                ''
            }`} />
            <span>{label}</span>
            {count > 0 && <Badge variant={isActive ? "default" : "secondary"} className="ml-auto text-xs">{count}</Badge>}
          </Button>
        );
      })}
      <Separator className="my-3" />
      <Button variant="ghost" className="justify-start h-9 text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4 mr-2.5"/> Advanced Filters
      </Button>
    </nav>
  );

  // --- Loading State ---
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingScreen baseMessage="Loading your requests..." />
        </div>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 border-r border-border fixed top-0 left-0 h-full pt-16">
         <div className="h-[calc(100vh-4rem)] overflow-y-auto">
             <SidebarContent />
         </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-col w-full lg:pl-64">
        <NavBar />

        {/* Content area */}
        <main className="flex-1">
          <div className="container max-w-6xl mx-auto px-4 py-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Incoming Requests</h1>
                    <p className="text-muted-foreground text-sm mt-1">Manage borrow requests for your items.</p>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                   {/* Mobile Filter Trigger */}
                   <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
                      <SheetTrigger asChild className="lg:hidden">
                        <Button variant="outline" size="icon">
                           <FilterIcon className="h-4 w-4" />
                           <span className="sr-only">Filters</span>
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-72 p-0">
                         <SidebarContent />
                      </SheetContent>
                    </Sheet>

                    {/* Search */}
                    <div className="relative flex-1 md:flex-initial md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search requests..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9"
                        />
                    </div>
                    {/* Future Sort/Advanced Filters */}
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="outline" size="icon" className="hidden md:inline-flex">
                              <SlidersHorizontal className="h-4 w-4"/>
                              <span className="sr-only">Sort & Filter</span>
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                           {/* ... sort options */}
                        </DropdownMenuContent>
                     </DropdownMenu>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <Card className="bg-card">
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
                      <Hand className="h-4 w-4 text-amber-500" />
                   </CardHeader>
                   <CardContent>
                      <div className="text-2xl font-bold">{counts.PENDING}</div>
                      <p className="text-xs text-muted-foreground">Requests awaiting your response</p>
                   </CardContent>
                </Card>
                <Card className="bg-card">
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Approved & Upcoming</CardTitle>
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                   </CardHeader>
                   <CardContent>
                      <div className="text-2xl font-bold">{counts.APPROVED}</div>
                       <p className="text-xs text-muted-foreground">Current or upcoming borrows</p>
                   </CardContent>
                </Card>
                 <Card className="bg-card hidden lg:block">
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                      <Inbox className="h-4 w-4 text-blue-500" />
                   </CardHeader>
                   <CardContent>
                      <div className="text-2xl font-bold">{counts.all}</div>
                       <p className="text-xs text-muted-foreground">All requests received</p>
                   </CardContent>
                </Card>
            </div>

            {/* Request List */}
            <div className="space-y-4">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onApprove={handleApprove}
                    onDecline={handleDecline}
                    onMessage={handleMessage}
                    navigate={navigate}
                  />
                ))
              ) : (
                // Enhanced Empty State
                 <div className="flex flex-col items-center justify-center py-16 text-center rounded-lg border border-dashed border-border bg-card/50 min-h-[300px]">
                   <Package className="h-16 w-16 text-muted-foreground/30 mb-4" />
                   <h3 className="text-xl font-semibold text-foreground">
                     {searchQuery ? "No matching requests" : `No ${activeFilter !== 'all' ? activeFilter.toLowerCase() : ''} requests`}
                   </h3>
                   <p className="text-muted-foreground mt-1 max-w-sm text-sm">
                     {searchQuery
                       ? "Try adjusting your search or changing the filter."
                       : "Looks like there are no requests in this category."}
                   </p>
                   {activeFilter !== 'all' && (
                     <Button variant="link" onClick={() => setActiveFilter('all')} className="mt-4">View All Requests</Button>
                   )}
                 </div>
              )}
            </div>
          </div> {/* End container */}
        </main>
      </div> {/* End main content wrapper */}
    </div> // End main layout div
  );
};

// --- Refined Request Card Component ---
interface RequestCardProps {
  request: BorrowRequest;
  onApprove: (id: string) => void;
  onDecline: (id: string) => void;
  onMessage: (borrowerId: string, requestId: string) => void;
  navigate: ReturnType<typeof useNavigate>;
}

const RequestCard: React.FC<RequestCardProps> = ({ request, onApprove, onDecline, onMessage, navigate }) => {

  const statusStyles = {
    PENDING: "border-amber-500 bg-amber-50 dark:bg-amber-900/20",
    APPROVED: "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20",
    COMPLETED: "border-blue-500 bg-blue-50 dark:bg-blue-900/20",
    DECLINED: "border-rose-500 bg-rose-50 dark:bg-rose-900/20",
    CANCELLED: "border-slate-500 bg-slate-50 dark:bg-slate-800/20",
  };

  const statusTextStyles = {
      PENDING: "text-amber-700 dark:text-amber-400",
      APPROVED: "text-emerald-700 dark:text-emerald-400",
      COMPLETED: "text-blue-700 dark:text-blue-400",
      DECLINED: "text-rose-700 dark:text-rose-400",
      CANCELLED: "text-slate-700 dark:text-slate-400",
  }

  const statusIcon = {
    PENDING: <Clock className="h-3.5 w-3.5 mr-1" />,
    APPROVED: <CheckCircle className="h-3.5 w-3.5 mr-1" />,
    COMPLETED: <Check className="h-3.5 w-3.5 mr-1" />,
    DECLINED: <X className="h-3.5 w-3.5 mr-1" />,
    CANCELLED: <AlertCircle className="h-3.5 w-3.5 mr-1" />,
  }

  return (
    <Card className={`overflow-hidden transition-shadow duration-200 hover:shadow-lg dark:border-gray-800 border-l-4 ${statusStyles[request.status] ?? 'border-border'} ${request.isNew && request.status === 'PENDING' ? 'border-primary' : statusStyles[request.status] ?? 'border-border'}`}>
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="flex-shrink-0 w-full sm:w-32 h-32 sm:h-auto bg-muted overflow-hidden">
            <Link to={`/item/${request.item.id}`}>
               <img src={request.item.image} alt={request.item.title} className="h-full w-full object-cover"/>
            </Link>
          </div>

          {/* Details */}
          <div className="flex-1 p-4 md:p-5 flex flex-col justify-between">
            <div> {/* Top section for details */}
                <div className="flex justify-between items-start mb-2 gap-2">
                   {/* Item Title & Category */}
                   <div className="flex-1 mr-2">
                       <Link to={`/item/${request.item.id}`} className="block">
                         <h3 className="text-base sm:text-lg font-semibold hover:text-primary transition-colors line-clamp-2 leading-tight">
                           {request.item.title}
                         </h3>
                       </Link>
                       <p className="text-xs text-muted-foreground mt-0.5">{request.item.category}</p>
                   </div>
                    {/* Status Badge */}
                     <Badge variant="outline" className={`capitalize text-xs shrink-0 h-6 ${statusTextStyles[request.status] ?? ''}`}>
                        {statusIcon[request.status]} {request.status.toLowerCase()}
                     </Badge>
                </div>

               {/* Borrower Info */}
               <Link to={`/profile/${request.borrower.id}`} className="flex items-center gap-2 group mb-3 text-sm">
                 <Avatar className="h-6 w-6">
                   <AvatarImage src={request.borrower.avatar} />
                   <AvatarFallback>{request.borrower.name.charAt(0)}</AvatarFallback>
                 </Avatar>
                 <span className="font-medium group-hover:text-primary transition-colors">{request.borrower.name}</span>
                 <span className="text-muted-foreground flex items-center">
                     <Star className="h-3 w-3 mr-0.5 fill-yellow-400 text-yellow-500" /> {request.borrower.rating.toFixed(1)}
                     <span className="mx-1">•</span> {request.borrower.borrowCount} borrows
                 </span>
               </Link>

                {/* Dates */}
               <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                 <CalendarRange className="h-3.5 w-3.5"/>
                 <span>{formatDate(request.startDate)}</span>
                 <span>-</span>
                 <span>{formatDate(request.endDate)}</span>
                 <span className="mx-1">•</span>
                 <span>Requested {timeAgo(request.requestDate)}</span>
               </div>

               {/* Message */}
               <p className="text-sm line-clamp-3 mb-4 text-foreground/90">{request.message}</p>
            </div>

            {/* Actions */}
             <Separator className="my-3 md:my-4"/>
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                 {/* Action Buttons */}
                 <div className="flex items-center gap-2 flex-wrap">
                     {request.status === 'PENDING' && (
                       <>
                         <Button size="sm" variant="outline" onClick={() => onDecline(request.id)}>
                            <XCircle className="h-4 w-4 mr-1.5"/> Decline
                         </Button>
                          <Button size="sm" onClick={() => onApprove(request.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                             <CheckCircle className="h-4 w-4 mr-1.5"/> Approve
                          </Button>
                       </>
                     )}
                      <Button size="sm" variant="outline" onClick={() => onMessage(request.borrower.id, request.id)}>
                         <MessageCircle className="h-4 w-4 mr-1.5"/> Message
                      </Button>
                 </div>

                 {/* More Options Dropdown */}
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                       <Button variant="ghost" size="icon" className="h-8 w-8 self-end sm:self-center">
                          <MoreVertical className="h-4 w-4"/>
                          <span className="sr-only">More options</span>
                       </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                       <DropdownMenuItem onClick={() => navigate(`/item/${request.item.id}`)}>View Item</DropdownMenuItem>
                       <DropdownMenuItem onClick={() => navigate(`/profile/${request.borrower.id}`)}>View Profile</DropdownMenuItem>
                       <DropdownMenuSeparator/>
                       <DropdownMenuItem disabled>Report</DropdownMenuItem>
                    </DropdownMenuContent>
                 </DropdownMenu>
             </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestsReceivedRedesign;