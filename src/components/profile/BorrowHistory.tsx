import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface BorrowItem {
  id: string;
  name: string;
  image: string;
  owner: string;
  category: string;
  date: string;
  status: string;
}

interface BorrowHistoryProps {
  items: BorrowItem[];
}

const BorrowHistory = ({ items }: BorrowHistoryProps) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Borrow History ({items.length})</h2>
      
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id}>
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-48 h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <Badge
                    variant={item.status === "Active" ? "default" : "secondary"}
                  >
                    {item.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Borrowed from: {item.owner}
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  Date: {item.date}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Category: {item.category}
                </p>
                <div className="flex space-x-2">
                  <Link to={`/items/${item.id}`}>
                    <Button variant="outline" size="sm">
                      View Item
                    </Button>
                  </Link>
                  {item.status === "Returned" && (
                    <Button variant="outline" size="sm">
                      Leave Review
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
        
        {items.length === 0 && (
          <div className="text-center py-12">
            <div className="rounded-full bg-muted p-3 mx-auto w-12 h-12 flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No borrowing history</h3>
            <p className="text-muted-foreground max-w-md mx-auto mt-1 mb-6">
              You haven't borrowed any items yet. Browse available items and start borrowing.
            </p>
            <Link to="/browse">
              <Button>Browse Items</Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default BorrowHistory;
