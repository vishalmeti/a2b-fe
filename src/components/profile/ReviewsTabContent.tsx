import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface ReviewsTabContentProps {
  reviews: Array<{
    id: string;
    reviewer: {
      name: string;
      avatar: string;
    };
    rating: number;
    date: string;
    comment: string;
    item: string;
  }>;
  formatDate: (date: string) => string;
}

export const ReviewsTabContent: React.FC<ReviewsTabContentProps> = ({ reviews, formatDate }) => {
  return (
    <>
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <Card key={review.id} className="shadow-sm dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/60">
              <CardContent className="pt-6 pb-5">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 border dark:border-gray-600">
                    <AvatarImage src={review.reviewer.avatar} alt={review.reviewer.name} />
                    <AvatarFallback className="bg-muted text-muted-foreground">{review.reviewer.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-x-2 gap-y-1">
                      <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-100">{review.reviewer.name}</h4>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"}`} />
                        ))}
                        <span className="mx-2 hidden sm:inline">•</span>
                        <span className="mt-1 sm:mt-0">{formatDate(review.date)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Reviewed item: <span className="font-medium text-gray-600 dark:text-gray-300">{review.item}</span>
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 pt-1">{review.comment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="shadow-sm dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/60">
          <CardContent className="text-center py-16">
            <Star className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">No reviews yet</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Borrower feedback appears here.</p>
          </CardContent>
        </Card>
      )}
    </>
  );
};
