/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Hooks
import { useToast } from "@/hooks/use-toast";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

// Components
import NavBar from "@/components/NavBar";
import LoadingScreen from "@/components/loader/LoadingScreen";
import RequestCard from "@/components/requests/RequestCard";
import RequestFilterTabs, { FilterType } from "@/components/requests/RequestFilterTabs";
import RequestSummaryCards from "@/components/requests/RequestSummaryCards";
import EmptyRequestState from "@/components/requests/EmptyRequestState";
import { acceptRequest } from "@/store/slices/items/thunks";


// Redux
import { fetchReceivedRequests } from "@/store/slices/itemsSlice";
import { RootState } from "@/store/store";
import { apiService } from "@/services/apiService";

// Types
import { BorrowRequest } from "@/types/request";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import values from "lodash/values";

// Icons
import {
  Search,
  SlidersHorizontal,
  FilterIcon
} from "lucide-react";

const RequestsReceivedPage = () => {
  useAuthRedirect(); // Check auth status
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  // State
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  // Get requests from Redux store
  const { reqById, requestsLoading: loading, requestsError } = useSelector(
    (state: RootState) => state.items
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
    return values(reqById)?.filter((request: BorrowRequest) => {
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
  }, [reqById, activeFilter, searchQuery]);

  // --- Counts for Sidebar/Stats ---
  const counts = useMemo(() => {
    return (values(reqById) || []).reduce((acc: Record<FilterType, number>, req: BorrowRequest) => {
      acc.all++;
      if (req.status === 'PENDING') acc.PENDING++;
      else if (req.status === 'ACCEPTED') acc.ACCEPTED++;
      else if (req.status === 'COMPLETED') acc.COMPLETED++;
      else if (req.status === 'DECLINED' || req.status === 'CANCELLED') acc.other++;
      return acc;
    }, { all: 0, PENDING: 0, ACCEPTED: 0, COMPLETED: 0, other: 0 });
  }, [reqById]);

  // --- Action Handlers ---
  const handleApprove = async (requestId: number) => {
    try {
      const x = dispatch(acceptRequest(requestId) as any);
      console.log("xx",x);
      toast({ title: "Request Approved", variant: "success" });
      // dispatch(fetchReceivedRequests() as any);
    } catch (error) {
      toast({ title: "Error approving request", variant: "destructive" });
    }
  };
  
  const handleDecline = async (requestId: number) => {
    try {
      await apiService.patch(`/requests/${requestId}/cancel/`, {
        lender_response_message: "Request declined"
      });
      toast({ title: "Request Declined", variant: "destructive" });
      dispatch(fetchReceivedRequests() as any);
    } catch (error) {
      toast({ title: "Error declining request", variant: "destructive" });
    }
  };
  
  const handleMessage = (borrowerId: number, requestId: number) => {
    toast({ title: "Opening Chat..." });
    console.log(`Maps to message thread for borrower ${borrowerId}, request ${requestId}`);
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

            {/* Filter Tabs */}
            <RequestFilterTabs 
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              counts={counts}
            />

            {/* Summary Cards */}
            {activeFilter === "all" && <RequestSummaryCards counts={counts} />}

            {/* Section Title based on active filter */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {activeFilter === "all" ? "All Requests" : 
                activeFilter === "PENDING" ? "Pending Requests" :
                activeFilter === "ACCEPTED" ? "Approved Requests" :
                activeFilter === "COMPLETED" ? "Completed Requests" :
                "Declined/Canceled Requests"}
              </h2>
              
              {filteredRequests?.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Showing {filteredRequests.length} {filteredRequests.length === 1 ? 'request' : 'requests'}
                </p>
              )}
            </div>

            {/* Request List */}
            <div className="space-y-6">
              {filteredRequests?.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {filteredRequests.map((request: BorrowRequest) => (
                    <div key={request.id} className="animate-fadeIn">
                      <RequestCard
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
                <EmptyRequestState 
                  activeFilter={activeFilter}
                  setActiveFilter={setActiveFilter}
                  searchQuery={searchQuery}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RequestsReceivedPage;