import React from "react";
import { Link } from "react-router-dom";

// Shadcn components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";

import { useToast } from "@/hooks/use-toast";
import { performPickup, performReturn, completeReturn } from "@/store/slices/items/thunks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Icons
import {
  CheckCircle, XCircle, MessageCircle, MoreVertical, Clock,
  CalendarRange, AlertCircle, Package, Check, X,
  ArrowLeft,
  CheckCheck
} from "lucide-react";

// Types
import { BorrowRequest } from "@/types/request";

// Helpers
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

interface RequestCardProps {
  request: BorrowRequest;
  onApprove: (id: number) => void;
  onDecline: (id: number) => void;
  onMessage: (borrowerId: number, requestId: number) => void;
  navigate: (path: string) => void;
}

const RequestCard: React.FC<RequestCardProps> = ({ 
  request, 
  onApprove, 
  onDecline, 
  onMessage, 
  navigate 
}) => {
  const { data } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const statusIcon = {
    PENDING: <Clock className="h-3.5 w-3.5 mr-1.5" />,
    APPROVED: <CheckCircle className="h-3.5 w-3.5 mr-1.5" />,
    COMPLETED: <Check className="h-3.5 w-3.5 mr-1.5" />,
    DECLINED: <X className="h-3.5 w-3.5 mr-1.5" />,
    CANCELLED: <AlertCircle className="h-3.5 w-3.5 mr-1.5" />,
  }

  const handlePickup = async (requestId: number) => {
      try {
        dispatch(performPickup(Number(requestId)));
        toast({ title: "Request Picked Up", variant: "success" });
      } catch (error) {
        toast({ title: "Error picking up request", variant: "destructive" });
      }
    };
  
    const handleReturn = async (requestId: number) => {
      try {
        dispatch(performReturn(Number(requestId)));
        toast({ title: "Request Returned", variant: "success" });
      } catch (error) {
        toast({ title: "Error returning request", variant: "destructive" });
      }
    };
  
    const handleCompleteReturn = async (requestId: number) => {
      try {
        dispatch(completeReturn(Number(requestId)));
        toast({ title: "Request Completed", variant: "success" });
      } catch (error) {
        toast({ title: "Error completing request", variant: "destructive" });
      }
    };
  
  // Check if request is new (created in last 24 hours)
  const isNew = new Date(request.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000);


  return (
    <Card 
      className="transition-shadow hover:shadow-md border border-border dark:border-border/20 dark:hover:border-border/40 dark:bg-gray-800 cursor-pointer"    >
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
            <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden bg-muted dark:bg-muted/20 border border-border/20 dark:border-border/10">
              <Link to={`/items/${request.item.id}`}>
                <div className="w-full h-full flex items-center justify-center bg-muted dark:bg-muted/20 text-muted-foreground">
                  <Package className="h-8 w-8" />
                </div>
              </Link>
            </div>

            <div className="flex-1 min-w-0">
              {/* Item Title & Category */}
              <Link to={`/items/${request.item.id}`} className="block">
                <h3 className="font-medium text-lg mb-0.5 line-clamp-1 hover:text-primary dark:hover:text-primary/90 transition-colors">
                  {request.item.title}
                </h3>
              </Link>
              <p className="text-xs text-muted-foreground dark:text-muted-foreground/80 mb-2">Owner: {request.item.owner_username}</p>

              {/* Borrower Info */}
              <Link to={`/profile/${request.borrower_profile.user_id}`} className="flex items-center gap-2 group mb-2">
                <Avatar className="h-6 w-6 border border-border/20 dark:border-border/10">
                  <AvatarFallback>{request.borrower_profile.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium group-hover:text-primary dark:group-hover:text-primary/90 transition-colors">
                  {request.borrower_profile.username}
                </span>
              </Link>

              {/* Dates */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground dark:text-muted-foreground/80">
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
          <div className="mt-4 p-3 rounded-md bg-muted/40 dark:bg-muted/10 dark:border dark:border-border/10 text-sm">
            <p className="line-clamp-2">{request.borrower_message}</p>
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap items-center gap-2 justify-end">
            {request.status === 'PENDING' && (
              <>
                <Button size="sm" variant="outline" onClick={() => onDecline(request.id)}>
                  <XCircle className="h-4 w-4 mr-1.5" /> Decline
                </Button>
                {data?.user?.id === request.lender_profile?.user_id &&  (
                  <div>
                    <Button size="sm" onClick={() => onApprove(request.id)}>
                      <CheckCircle className="h-4 w-4 mr-1.5" /> Accept Request
                    </Button>
                  </div>
                )}
              </>
            )}
            {request.status === "ACCEPTED" && 
           data?.user?.id === request.borrower_profile?.user_id && (
            <div onClick={() => handlePickup(request.id)} className="flex items-center">
            <Button size="sm" >
              <CheckCircle className="h-4 w-4 mr-1.5" /> Item Picked Up
            </Button>
            </div>
          )}
          
          {request.status === "PICKED_UP" && data?.user?.id === request.borrower_profile?.user_id &&  (
            <div onClick={() => handleReturn(request.id)} className="flex items-center">
              <Button size="sm">
                <ArrowLeft className="h-4 w-4 mr-1.5" /> Item Returned
              </Button>
            </div>
          )}

          {
            request.status === "RETURNED" && data?.user?.id === request.lender_profile?.user_id && (
            <div onClick={() => handleCompleteReturn(request.id)} className="flex items-center">
              <Button size="sm">
                <CheckCheck className="h-4 w-4 mr-1.5" /> Confirm Item Return
              </Button>
            </div>
          )}
            <Button size="sm" variant="outline" onClick={() => navigate(`/requests/${request.id}/tracking`)}>
              <CalendarRange className="h-4 w-4 mr-1.5" /> Track
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestCard;
