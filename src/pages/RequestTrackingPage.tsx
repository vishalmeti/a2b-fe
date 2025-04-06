/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Redux
import { AppDispatch, RootState } from "@/store/store";
import { fetchRequestById } from "@/store/slices/items/thunks";

// Components
import Navbar from "@/components/NavBar";

// Shadcn components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Icons
import {
  CheckCircle, XCircle, Clock, ArrowLeft, Package,
  CalendarRange, AlertCircle, MessageCircle, InfoIcon, 
  CheckCheck, ArrowUpRight, User, Calendar
} from "lucide-react";

// Types
import { BorrowRequest } from "@/types/request";

// Helpers
const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr) return "N/A";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  } catch (e) { return "Invalid date"; }
};

interface TimelineStepProps {
  title: string;
  description: string;
  date?: string;
  icon: React.ReactNode;
  status: "completed" | "current" | "upcoming" | "declined" | "cancelled";
  isLast?: boolean;
}

const TimelineStep: React.FC<TimelineStepProps> = ({ 
  title, 
  description, 
  date, 
  icon, 
  status,
  isLast 
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
      case "current":
        return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
      case "declined":
        return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
      case "cancelled":
        return "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800";
      default:
        return "bg-muted/50 text-muted-foreground border-muted dark:bg-muted/10";
    }
  };

  return (
    <div className="flex">
      {/* Timeline indicator with icon */}
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${getStatusStyles()}`}>
          {icon}
        </div>
        {!isLast && <div className={`w-0.5 h-full ${status === "upcoming" ? "bg-muted" : "bg-primary/60"} mt-2`} />}
      </div>
      
      {/* Content */}
      <div className="ml-4 pb-8">
        <h3 className={`text-sm font-medium ${status !== "upcoming" ? "text-foreground" : "text-muted-foreground"}`}>{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
        {date && <p className="text-xs text-muted-foreground mt-1">{date}</p>}
      </div>
    </div>
  );
};

const RequestTrackingPage: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [request, setRequest] = useState({} as BorrowRequest);
  
  // Get request data from Redux store
  const { 
    reqById,
    loading, 
    error 
  } = useSelector((state: RootState) => state.items);
  
  // Get current user from Redux store
  const { data } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (requestId) {
      dispatch(fetchRequestById(Number(requestId)));
    }
  }, [dispatch, requestId]);

  useEffect(() => {
    if (requestId && reqById[requestId]) {
      setRequest(reqById[requestId] as any);
    }
  }, [reqById, requestId]);

  // Helper to determine the current step
  const getStepStatus = (stepStatus: string): "completed" | "current" | "upcoming" | "declined" | "cancelled" => {
    if (!requestId) return "upcoming";
    
    const statusOrder = [
      "PENDING",
      "ACCEPTED",
      "PICKED_UP",
      "RETURNED",
      "COMPLETED"
    ];
    
    const currentIndex = statusOrder.indexOf(request.status);
    const stepIndex = statusOrder.indexOf(stepStatus);
    
    if (request.status === "DECLINED") return stepStatus === "DECLINED" ? "declined" : "upcoming";
    if (request.status === "CANCELLED_BORROWER" || request.status === "CANCELLED_LENDER") 
      return stepStatus === "CANCELLED_BORROWER" || stepStatus === "CANCELLED_LENDER" ? "cancelled" : "upcoming";
      
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  // Placeholder while loading
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container max-w-4xl mx-auto py-8 px-4">
          <div className="flex items-center mb-6">
            <Skeleton className="h-8 w-8 rounded-full mr-2" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="ml-4 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (error || !request) {
    return (
      <>
        <Navbar />
        <div className="container max-w-4xl mx-auto py-8 px-4">
          <Card className="p-8 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-medium mb-2">Error Loading Request</h2>
            <p className="text-muted-foreground mb-4">{error || "Request not found"}</p>
            <Button asChild>
              <Link to="/requests-received">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Requests
              </Link>
            </Button>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container max-w-4xl mx-auto py-8 px-4">
        {/* Back button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/requests-received">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Requests
          </Link>
        </Button>
        
        {/* Request Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Borrow Request #{request.id}</CardTitle>
                <p className="text-sm text-muted-foreground">Created on {formatDate(request.created_at)}</p>
              </div>
              <Badge 
                variant={request.status === "PENDING" ? "default" : 
                 (request.status === "COMPLETED" ? "outline" : 
                 (request.status === "DECLINED" || request.status?.includes("CANCELLED") ? "destructive" : "secondary"))}
                className="text-sm py-1 px-3"
              >
                {request.status_display}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Item Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium flex items-center">
                  <Package className="h-4 w-4 mr-2" /> Item Details
                </h3>
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                    {request.item?.image_url ? (
                      <img src={request.item.image_url} alt={request.item.title} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <Link 
                      to={`/items/${request.item?.id}`} 
                      className="text-base font-medium hover:text-primary transition-colors flex items-center"
                    >
                      {request.item?.title}
                      <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">Owner: {request.item?.owner_username}</p>
                  </div>
                </div>
              </div>
              
              {/* Borrowing Period */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2" /> Borrowing Period
                </h3>
                <div className="flex items-center gap-2 text-sm">
                  <CalendarRange className="h-4 w-4" />
                  <div>
                    <p><strong>From:</strong> {formatDate(request.start_date)}</p>
                    <p><strong>To:</strong> {formatDate(request.end_date)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            {/* Borrower Message */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <MessageCircle className="h-4 w-4 mr-2" /> Message from Borrower
              </h3>
              <div className="p-3 rounded-md bg-muted/40 dark:bg-muted/10 border border-border/10">
                <p className="text-sm">{request.borrower_message || "No message provided."}</p>
              </div>
            </div>
            
            {/* Borrower Profile */}
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <User className="h-4 w-4 mr-2" /> Borrower
              </h3>
              <Link 
                to={`/profile/${request.borrower_profile?.user_id}`}
                className="flex items-center gap-2 group hover:bg-muted/50 p-2 rounded-md transition-colors"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{request.borrower_profile?.username.charAt(0).toUpperCase()}</AvatarFallback>
                  {request.borrower_profile?.avatar && <AvatarImage src={request.borrower_profile?.avatar} />}
                </Avatar>
                <span className="text-sm font-medium group-hover:text-primary transition-colors">
                  {request.borrower_profile?.username}
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 ml-auto opacity-50 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Status Timeline */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <CardTitle className="text-lg">Request Timeline</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                      <InfoIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>This timeline shows the current status and history of your request.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            <div className="pl-4">
              {/* Pending */}
              <TimelineStep
                title="Request Submitted"
                description="Waiting for lender to review your request."
                date={formatDate(request.created_at)}
                icon={<Clock className="h-5 w-5" />}
                status={getStepStatus("PENDING")}
              />
              
              {/* Conditional: If declined - show declined step */}
              {request.status === "DECLINED" ? (
                <TimelineStep
                  title="Request Declined"
                  description="The lender has declined your request."
                  date={request.updated_at ? formatDate(request.updated_at) : undefined}
                  icon={<XCircle className="h-5 w-5" />}
                  status="declined"
                  isLast={true}
                />
              ) : request.status === "CANCELLED_BORROWER" || request.status === "CANCELLED_LENDER" ? (
                <TimelineStep
                  title={request.status === "CANCELLED_BORROWER" ? "Cancelled by You" : "Cancelled by Lender"}
                  description={`The request was cancelled ${request.status === "CANCELLED_BORROWER" ? "by you" : "by the lender"}.`}
                  date={request.updated_at ? formatDate(request.updated_at) : undefined}
                  icon={<AlertCircle className="h-5 w-5" />}
                  status="cancelled"
                  isLast={true}
                />
              ) : (
                // Normal flow steps
                <>
                  <TimelineStep
                    title="Request Accepted"
                    description="Lender has approved your request. Arrange pickup with the lender."
                    date={request.status !== "PENDING" ? formatDate(request.updated_at) : undefined}
                    icon={<CheckCircle className="h-5 w-5" />}
                    status={getStepStatus("ACCEPTED")}
                  />
                  
                  <TimelineStep
                    title="Item Picked Up"
                    description="You've confirmed that you've received the item."
                    date={request.status === "PICKED_UP" || request.status === "RETURNED" || request.status === "COMPLETED" ? 
                      formatDate(request.pickup_date) : undefined}
                    icon={<Package className="h-5 w-5" />}
                    status={getStepStatus("PICKED_UP")}
                  />
                  
                  <TimelineStep
                    title="Item Returned"
                    description="You've marked the item as returned. Waiting for lender confirmation."
                    date={request.status === "RETURNED" || request.status === "COMPLETED" ? 
                      formatDate(request.return_date) : undefined}
                    icon={<ArrowLeft className="h-5 w-5" />}
                    status={getStepStatus("RETURNED")}
                  />
                  
                  <TimelineStep
                    title="Borrowing Completed"
                    description="Lender has confirmed the return. The borrowing process is complete."
                    date={request.status === "COMPLETED" ? formatDate(request.updated_at) : undefined}
                    icon={<CheckCheck className="h-5 w-5" />}
                    status={getStepStatus("COMPLETED")}
                    isLast={true}
                  />
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Action Buttons based on status */}
        <div className="mt-6 flex justify-end gap-2">
          {request.status === "PENDING" && (
            <Button variant="outline" size="sm">
              <XCircle className="h-4 w-4 mr-1.5" /> Cancel Request
            </Button>
          )}
          
          {(request.status === "ACCEPTED" || request.status === "PICKED_UP") && (
            <Button variant="outline" size="sm">
              <MessageCircle className="h-4 w-4 mr-1.5" /> Message Lender
            </Button>
          )}
          
          {request.status === "ACCEPTED" && 
           data?.user?.id === request.borrower_profile?.user_id && (
            <Button size="sm">
              <CheckCircle className="h-4 w-4 mr-1.5" /> Confirm Pickup
            </Button>
          )}
          
          {request.status === "PICKED_UP" && (
            <Button size="sm">
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Mark as Returned
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default RequestTrackingPage;
