import { useState } from "react";
import { Calendar as CalendarIcon, Info } from "lucide-react";
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

interface BorrowRequestFormProps {
  itemTitle: string;
  ownerName: string;
  isAvailable: boolean;
}

export const BorrowRequestForm = ({ itemTitle, ownerName, isAvailable }: BorrowRequestFormProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [message, setMessage] = useState("");
  const { toast } = useToast();

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
      description: `Your request to borrow ${itemTitle} has been sent to ${ownerName}.`,
    });
  };

  return (
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
        <Button 
          className="w-full" 
          onClick={handleBorrowRequest}
          disabled={!isAvailable}
        >
          Send Request
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BorrowRequestForm;
