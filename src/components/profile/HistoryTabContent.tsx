import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Star } from "lucide-react";

interface HistoryTabContentProps {
  history: Array<{
    id: string;
    name: string;
    image: string;
    owner: string;
    category: string;
    date: string;
    status: string;
  }>;
  formatDate: (date: string) => string;
}

export const HistoryTabContent: React.FC<HistoryTabContentProps> = ({ history, formatDate }) => {
  return (
    <>
      {history.length > 0 ? (
        <div className="space-y-4">
          {history.map((item) => (
            <Card key={item.id} className="overflow-hidden transition-shadow hover:shadow-md border-gray-200 dark:border-gray-700/60 dark:bg-gray-800/50">
              <div className="flex flex-col sm:flex-row items-stretch">
                <Link to={`/items/${item.id}`} className="block sm:w-36 h-36 sm:h-auto flex-shrink-0">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover bg-gray-100 dark:bg-gray-700"/>
                </Link>
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <Link to={`/items/${item.id}`}>
                        <h3 className="font-semibold text-base text-gray-800 dark:text-gray-100 hover:text-primary">{item.name}</h3>
                      </Link>
                      <Badge 
                        variant={item.status === "Returned" ? "secondary" : "default"} 
                        className={`text-xs ${item.status !== 'Returned' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' : 'dark:bg-gray-700 dark:text-gray-300'}`}
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">From: <span className="font-medium text-gray-700 dark:text-gray-300">{item.owner}</span></p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date: {formatDate(item.date)}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Category: {item.category}</p>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <Link to={`/items/${item.id}`}>
                      <Button variant="outline" size="sm" className="h-8 text-xs dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600">View Item</Button>
                    </Link>
                    {item.status === "Returned" && (
                      <Button size="sm" className="h-8 text-xs"><Star className="h-3.5 w-3.5 mr-1"/> Leave Review</Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="shadow-sm dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/60">
          <CardContent className="text-center py-16">
            <Calendar className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">No borrow history</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-6">Borrow items near you!</p>
            <Link to="/browse"><Button>Browse Items</Button></Link>
          </CardContent>
        </Card>
      )}
    </>
  );
};
