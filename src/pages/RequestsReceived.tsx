/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Assuming these are defined elsewhere
import { useToast } from "@/hooks/use-toast";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import NavBar from "@/components/NavBar";
import LoadingScreen from "@/components/loader/LoadingScreen";
import { fetchReceivedRequests } from "@/store/slices/userSlice";
import { apiService } from "@/services/apiService";
import { RootState } from "@/store/store";

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

// --- Type Definitions (updated for API format) ---
type RequestStatus = "PENDING" | "APPROVED" | "DECLINED" | "CANCELLED" | "COMPLETED";
type RequestItem = { id: number; title: string; owner_username: string };
type RequestProfile = { user_id: number; username: string };

interface BorrowRequest {
  id: number;
  item: RequestItem;
  borrower_profile: RequestProfile;
  lender_profile: RequestProfile;
  start_date: string;
  end_date: string;
  status: RequestStatus;
  status_display: string;
  borrower_message: string;
  lender_response_message: string;
  created_at: string;
  updated_at: string;
  processed_at: string | null;
  pickup_confirmed_at: string | null;
  return_initiated_at: string | null;
  completed_at: string | null;
}

// --- Helper Functions ---
const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr) return "N/A";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
  const dispatch = useDispatch();
  const { toast } = useToast();

  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  // Get requests from Redux store
  const { receivedRequests, requestsLoading: loading, requestsError } = useSelector(
    (state: RootState) => state.user
  );

  // --- Data Loading ---
  useEffect(() => {
    dispatch(fetchReceivedRequests() as any);
  }, [dispatch]);

  // Show error toast if request fails
  useEffect(() => {
    if (requestsError) {
      toast({
        title: "Error loading requests",
        description: requestsError,
        variant: "destructive"
      });
    }
  }, [requestsError, toast]);

  // --- Filtering Logic ---
  const filteredRequests = useMemo(() => {
    return receivedRequests?.filter((request: BorrowRequest) => {
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
          request.borrower_profile.username.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [receivedRequests, activeFilter, searchQuery]);

  // --- Counts for Sidebar/Stats ---
  const counts = useMemo(() => {
    return (receivedRequests || []).reduce((acc: Record<FilterType, number>, req: BorrowRequest) => {
      acc.all++;
      if (req.status === 'PENDING') acc.PENDING++;
      else if (req.status === 'APPROVED') acc.APPROVED++;
      else if (req.status === 'COMPLETED') acc.COMPLETED++;
      else if (req.status === 'DECLINED' || req.status === 'CANCELLED') acc.other++;
      return acc;
    }, { all: 0, PENDING: 0, APPROVED: 0, COMPLETED: 0, other: 0 });
  }, [receivedRequests]);

  // --- Action Handlers ---
  const handleApprove = async (requestId: number) => {
    try {
      await apiService.post(`/requests/${requestId}/approve/`, {
        lender_response_message: "Request approved"
      });
      toast({ title: "Request Approved", variant: "success" });
      // Refetch requests to update the UI
      dispatch(fetchReceivedRequests() as any);
    } catch (error) {
      toast({ title: "Error approving request", variant: "destructive" });
    }
  };
  
  const handleDecline = async (requestId: number) => {
    try {
      await apiService.post(`/requests/${requestId}/decline/`, {
        lender_response_message: "Request declined"
      });
      toast({ title: "Request Declined", variant: "destructive" });
      // Refetch requests to update the UI
      dispatch(fetchReceivedRequests() as any);
    } catch (error) {
      toast({ title: "Error declining request", variant: "destructive" });
    }
  };
  
  const handleMessage = (borrowerId: number, requestId: number) => {
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
            <Icon className="h-4 w-4 mr-2.5" />
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
                <Card>
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
                      <Hand className="h-4 w-4 text-muted-foreground" />
                   </CardHeader>
                   <CardContent>
                      <div className="text-2xl font-bold">{counts.PENDING}</div>
                      <p className="text-xs text-muted-foreground">Requests awaiting your response</p>
                   </CardContent>
                </Card>
                <Card>
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Approved & Upcoming</CardTitle>
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                   </CardHeader>
                   <CardContent>
                      <div className="text-2xl font-bold">{counts.APPROVED}</div>
                       <p className="text-xs text-muted-foreground">Current or upcoming borrows</p>
                   </CardContent>
                </Card>
                 <Card className="hidden lg:block">
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                      <Inbox className="h-4 w-4 text-muted-foreground" />
                   </CardHeader>
                   <CardContent>
                      <div className="text-2xl font-bold">{counts.all}</div>
                       <p className="text-xs text-muted-foreground">All requests received</p>
                   </CardContent>
                </Card>
            </div>

            {/* Request List */}
            <div className="space-y-4">
              {filteredRequests?.length > 0 ? (
                filteredRequests.map((request: BorrowRequest) => (
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
  onApprove: (id: number) => void;
  onDecline: (id: number) => void;
  onMessage: (borrowerId: number, requestId: number) => void;
  navigate: ReturnType<typeof useNavigate>;
}

const RequestCard: React.FC<RequestCardProps> = ({ request, onApprove, onDecline, onMessage, navigate }) => {
  const statusIcon = {
    PENDING: <Clock className="h-3.5 w-3.5 mr-1.5" />,
    APPROVED: <CheckCircle className="h-3.5 w-3.5 mr-1.5" />,
    COMPLETED: <Check className="h-3.5 w-3.5 mr-1.5" />,
    DECLINED: <X className="h-3.5 w-3.5 mr-1.5" />,
    CANCELLED: <AlertCircle className="h-3.5 w-3.5 mr-1.5" />,
  }
  
  // Check if request is new (created in last 24 hours)
  const isNew = new Date(request.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000);

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        <div className="p-4 md:p-5">
          {/* Status Badge - Top right */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2">
              {isNew && request.status === "PENDING" && (
                <Badge className="rounded-full px-1.5 h-5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">New</Badge>
              )}
              <Badge variant={request.status === "PENDING" ? "default" : "outline"} className="capitalize">
                {statusIcon[request.status]} {request.status_display}
              </Badge>
            </div>

            {/* More Options Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate(`/item/${request.item.id}`)}>View Item</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`/profile/${request.borrower_profile.user_id}`)}>View Profile</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>Report</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Item & Borrower Info */}
          <div className="flex gap-4">
            {/* Item Image */}
            <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden bg-muted">
              <Link to={`/item/${request.item.id}`}>
                {/* Placeholder - we'll need to get actual image from the API */}
                <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                  <Package className="h-8 w-8" />
                </div>
              </Link>
            </div>

            <div className="flex-1 min-w-0">
              {/* Item Title & Category */}
              <Link to={`/item/${request.item.id}`} className="block">
                <h3 className="font-medium text-lg mb-0.5 line-clamp-1 hover:text-primary transition-colors">
                  {request.item.title}
                </h3>
              </Link>
              <p className="text-xs text-muted-foreground mb-2">Owner: {request.item.owner_username}</p>

              {/* Borrower Info */}
              <Link to={`/profile/${request.borrower_profile.user_id}`} className="flex items-center gap-2 group mb-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback>{request.borrower_profile.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium group-hover:text-primary transition-colors">
                  {request.borrower_profile.username}
                </span>
              </Link>

              {/* Dates */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarRange className="h-3.5 w-3.5" />
                <span>{formatDate(request.start_date)}</span>
                <span>-</span>
                <span>{formatDate(request.end_date)}</span>
                <span className="mx-1">•</span>
                <span>Requested {timeAgo(request.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="mt-4 p-3 rounded-md bg-muted/40 text-sm">
            <p className="line-clamp-2">{request.borrower_message}</p>
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap items-center gap-2 justify-end">
            {request.status === 'PENDING' && (
              <>
                <Button size="sm" variant="outline" onClick={() => onDecline(request.id)}>
                  <XCircle className="h-4 w-4 mr-1.5" /> Decline
                </Button>
                <Button size="sm" variant="default" onClick={() => onApprove(request.id)}>
                  <CheckCircle className="h-4 w-4 mr-1.5" /> Approve
                </Button>
              </>
            )}
            <Button size="sm" variant="outline" onClick={() => onMessage(request.borrower_profile.user_id, request.id)}>
              <MessageCircle className="h-4 w-4 mr-1.5" /> Message
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestsReceivedRedesign;