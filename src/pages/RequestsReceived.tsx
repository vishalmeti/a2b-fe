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
      {/* Main content area - Full width */}
      <div className="flex flex-col w-full">
        <NavBar />

        {/* Content area */}
        <main className="flex-1 pb-8">
          <div className="container max-w-6xl mx-auto px-4 py-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-3">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Incoming Requests</h1>
                    <p className="text-muted-foreground text-sm mt-1">Manage borrow requests for your items</p>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                   {/* Mobile Filter Trigger */}
                   <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
                      <SheetTrigger asChild className="lg:hidden">
                        <Button variant="outline" size="icon" className="rounded-full">
                           <FilterIcon className="h-4 w-4" />
                           <span className="sr-only">Filters</span>
                        </Button>
                      </SheetTrigger>
                      {/* <SheetContent side="left" className="w-72 p-0">
                         <SidebarContent />
                      </SheetContent> */}
                    </Sheet>

                    {/* Search */}
                    <div className="relative flex-1 md:flex-initial md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search requests..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9 rounded-full border-muted-foreground/20"
                        />
                    </div>
                    {/* Sort/Advanced Filters */}
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="outline" size="icon" className="hidden md:inline-flex rounded-full">
                              <SlidersHorizontal className="h-4 w-4"/>
                              <span className="sr-only">Sort & Filter</span>
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                           <DropdownMenuItem>Newest First</DropdownMenuItem>
                           <DropdownMenuItem>Oldest First</DropdownMenuItem>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem>Borrow Date</DropdownMenuItem>
                           <DropdownMenuItem>Item Name</DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                </div>
            </div>

            {/* Tabbed Navigation for Request Stages */}
            <div className="border-b border-border mb-8">
              <div className="flex overflow-x-auto scrollbar-none -mb-px">
                {(["all", "PENDING", "APPROVED", "COMPLETED", "other"] as FilterType[]).map((filter) => {
                  const isActive = activeFilter === filter;
                  const label = filter === 'all' ? 'All Requests' : 
                               filter === 'PENDING' ? 'Pending' : 
                               filter === 'APPROVED' ? 'Approved' :
                               filter === 'COMPLETED' ? 'Completed' : 
                               'Declined/Canceled';
                  const count = counts[filter];
                  return (
                    <button
                      key={filter}
                      className={`px-4 py-2 flex items-center whitespace-nowrap text-sm font-medium ${
                        isActive 
                          ? 'text-primary border-b-2 border-primary' 
                          : 'text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-muted-foreground/30'
                      }`}
                      onClick={() => setActiveFilter(filter)}
                    >
                      {label}
                      {count > 0 && (
                        <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                          isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                        }`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Summary Cards - Show based on active filter */}
            {activeFilter === "all" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-amber-900/20 border-amber-200 dark:border-amber-900/50">
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-amber-900 dark:text-amber-300">Pending Actions</CardTitle>
                        <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                     </CardHeader>
                     <CardContent>
                        <div className="text-2xl font-bold text-amber-900 dark:text-amber-300">{counts.PENDING}</div>
                        <p className="text-xs text-amber-700/70 dark:text-amber-400/70">Requests awaiting your response</p>
                     </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-emerald-900/20 border-emerald-200 dark:border-emerald-900/50">
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-emerald-900 dark:text-emerald-300">Approved & Active</CardTitle>
                        <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                     </CardHeader>
                     <CardContent>
                        <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-300">{counts.APPROVED}</div>
                        <p className="text-xs text-emerald-700/70 dark:text-emerald-400/70">Current or upcoming borrows</p>
                     </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-sky-900/20 border-sky-200 dark:border-sky-900/50">
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-sky-900 dark:text-sky-300">Completed</CardTitle>
                        <Check className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                     </CardHeader>
                     <CardContent>
                        <div className="text-2xl font-bold text-sky-900 dark:text-sky-300">{counts.COMPLETED}</div>
                        <p className="text-xs text-sky-700/70 dark:text-sky-400/70">Successfully completed borrows</p>
                     </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-900/50 dark:to-slate-800/30 border-slate-200 dark:border-slate-700/50">
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                        <Inbox className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                     </CardHeader>
                     <CardContent>
                        <div className="text-2xl font-bold">{counts.all}</div>
                        <p className="text-xs text-muted-foreground">All requests received</p>
                     </CardContent>
                  </Card>
              </div>
            )}

            {/* Section Title based on active filter */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {activeFilter === "all" ? "All Requests" : 
                 activeFilter === "PENDING" ? "Pending Requests" :
                 activeFilter === "APPROVED" ? "Approved Requests" :
                 activeFilter === "COMPLETED" ? "Completed Requests" :
                 "Declined/Canceled Requests"}
              </h2>
              
              {filteredRequests?.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Showing {filteredRequests.length} {filteredRequests.length === 1 ? 'request' : 'requests'}
                </p>
              )}
            </div>

            {/* Request List - Grouped by stages for better organization */}
            <div className="space-y-6">
              {filteredRequests?.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {filteredRequests.map((request: BorrowRequest) => (
                    <div key={request.id} className="animate-fadeIn">
                      <RequestCard
                        key={request.id}
                        request={request}
                        onApprove={handleApprove}
                        onDecline={handleDecline}
                        onMessage={handleMessage}
                        navigate={navigate}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                // Enhanced Empty State with animation
                <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-border bg-muted/30 min-h-[300px] animate-fadeIn">
                  <div className="mb-4 p-4 bg-background rounded-full border border-border">
                    <Package className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {searchQuery ? "No matching requests" : `No ${activeFilter !== 'all' ? activeFilter.toLowerCase() : ''} requests`}
                  </h3>
                  <p className="text-muted-foreground mt-2 max-w-sm text-sm">
                    {searchQuery
                      ? "Try adjusting your search or changing the filter."
                      : activeFilter === 'PENDING' ? "When someone requests to borrow your items, they'll appear here."
                      : activeFilter === 'APPROVED' ? "Requests you've approved will appear here."
                      : activeFilter === 'COMPLETED' ? "Completed borrows will appear here."
                      : activeFilter === 'other' ? "Declined or canceled requests will appear here."
                      : "You haven't received any requests yet."}
                  </p>
                  {activeFilter !== 'all' && (
                    <Button variant="outline" onClick={() => setActiveFilter('all')} className="mt-6">
                      View All Requests
                    </Button>
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
                <DropdownMenuItem onClick={() => navigate(`/items/${request.item.id}`)}>View Item</DropdownMenuItem>
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
              <Link to={`/items/${request.item.id}`}>
                {/* Placeholder - we'll need to get actual image from the API */}
                <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                  <Package className="h-8 w-8" />
                </div>
              </Link>
            </div>

            <div className="flex-1 min-w-0">
              {/* Item Title & Category */}
              <Link to={`/items/${request.item.id}`} className="block">
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