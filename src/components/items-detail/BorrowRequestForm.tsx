/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Calendar as CalendarIcon, Info, AlertCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDispatch } from "react-redux";
import { requestItem } from "@/store/slices/itemsSlice";

// Define the item interface
interface Item {
  id: string;
  title: string;
  availability_status: 'AVAILABLE' | 'BORROWED' | 'BOOKED';
  owner: {
    user: {
      id: string;
      first_name: string;
      last_name: string;
      // other user properties
    };
    // other owner properties
  };
  // other item properties
}

interface BorrowRequestFormProps {
  item: Item;
  currentUserId: string;
}

export const BorrowRequestForm = ({ 
  item,
  currentUserId
}: BorrowRequestFormProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const dispatch = useDispatch();
  
  // Extract necessary data from the item object
  const itemTitle = item.title;
  const ownerId = item.owner.user.id.toString();
  const ownerName = `${item.owner.user.first_name} ${item.owner.user.last_name}`;
  const itemStatus = item.availability_status;
  const isAvailable = itemStatus === 'AVAILABLE';
  
  const isOwner = currentUserId.toString() === ownerId;
  const isAlreadyBooked = itemStatus === 'BOOKED';
  const isAlreadyBorrowed = itemStatus === 'BORROWED';
  const isDisabled = isOwner || !isAvailable || isAlreadyBooked || isAlreadyBorrowed;

  const handleBorrowRequest = async () => {
    if (!startDate) {
      toast({
        variant: "destructive",
        title: "Please select a start date",
        description: "Select when you want to start borrowing this item.",
      });
      return;
    }

    if (!endDate) {
      toast({
        variant: "destructive",
        title: "Please select an end date",
        description: "Select when you plan to return this item.",
      });
      return;
    }

    if (endDate < startDate) {
      toast({
        variant: "destructive",
        title: "Invalid date range",
        description: "The end date must be after the start date.",
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

    try {
      setIsSubmitting(true);
      
      // Format dates as YYYY-MM-DD
      const formattedStartDate = format(startDate, "yyyy-MM-dd");
      const formattedEndDate = format(endDate, "yyyy-MM-dd");
      
      // Create the request payload
      const requestData = {
        item: Number(item.id),
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        borrower_message: message
      };
      
      // Dispatch the requestItem action
      await dispatch(requestItem(requestData) as any);
      
      toast({
        title: "Request sent!",
        description: `Your request to borrow ${itemTitle} from ${format(startDate, "PPP")} to ${format(endDate, "PPP")} has been sent to ${ownerName}.`,
        variant: "success",
      });
      
      // Reset form after successful submission
      setStartDate(undefined);
      setEndDate(undefined);
      setMessage("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error sending request",
        description: "There was an error sending your borrow request. Please try again later.",
      });
      console.error("Error sending borrow request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get status message
  const getStatusMessage = () => {
    if (isOwner) {
      return "You cannot borrow your own item";
    } else if (isAlreadyBorrowed) {
      return "This item is currently borrowed by someone else";
    } else if (isAlreadyBooked) {
      return "This item is already booked for borrowing";
    }
    return null;
  };
  
  const statusMessage = getStatusMessage();
  
  // Helper function to determine card styling
  const getCardClassName = () => {
    if (isOwner) {
      return "border-dashed border-gray-300 opacity-75";
    } else if (isAlreadyBorrowed || isAlreadyBooked) {
      return "border-dashed border-amber-300 opacity-75";
    }
    return "";
  };

  return (
    <Card className={getCardClassName()}>
      <CardHeader>
        <CardTitle className="text-lg">Request to Borrow</CardTitle>
        <CardDescription>
          Select borrowing dates and send a message to the owner
        </CardDescription>
      </CardHeader>
      
      {statusMessage && (
        <CardContent className="pt-0">
          <Alert 
            variant={isOwner ? "destructive" : "default"} 
            className={`bg-muted ${!isOwner ? "border-amber-300 text-amber-800" : ""}`}
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {statusMessage}
            </AlertDescription>
          </Alert>
        </CardContent>
      )}
      
      <CardContent className={`space-y-4 ${isDisabled ? 'opacity-50' : ''}`}>
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Borrowing period
          </label>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <div className="w-full">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    disabled={isDisabled}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, "PPP")
                    ) : (
                      <span>Start date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date);
                      // If end date is before new start date, reset it
                      if (endDate && date && endDate < date) {
                        setEndDate(undefined);
                      }
                    }}
                    initialFocus
                    disabled={(date) => 
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="w-full">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    disabled={isDisabled || !startDate}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, "PPP")
                    ) : (
                      <span>End date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={(date) => 
                      !startDate || date < startDate
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
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
            disabled={isDisabled}
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
        <Button 
          className="w-full" 
          onClick={handleBorrowRequest}
          disabled={isDisabled || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending Request...
            </>
          ) : isOwner ? "You own this item" : 
             isAlreadyBorrowed ? "Currently Borrowed" :
             isAlreadyBooked ? "Already Booked" : 
             "Send Request"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BorrowRequestForm;
