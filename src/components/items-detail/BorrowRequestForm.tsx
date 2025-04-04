import { useState } from "react";
import { Calendar as CalendarIcon, Info, AlertCircle } from "lucide-react";
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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  
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

  const handleBorrowRequest = () => {
    if (!selectedDate) {
      toast({
        variant: "destructive",
        title: "Please select a date",
        description: "Select when you want to borrow this item.",
      });
      console.log(currentUserId,ownerId,isOwner);
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

    toast({
      title: "Request sent!",
      description: `Your request to borrow ${itemTitle} has been sent to ${ownerName}.`,
    });
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
          Select a date and send a message to the owner
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
            When do you need it?
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                disabled={isDisabled}
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
          disabled={isDisabled}
        >
          {isOwner ? "You own this item" : 
           isAlreadyBorrowed ? "Currently Borrowed" :
           isAlreadyBooked ? "Already Booked" : 
           "Send Request"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BorrowRequestForm;
