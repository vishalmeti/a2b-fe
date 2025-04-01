import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface Review {
  id: string;
  reviewer: {
    name: string;
    avatar: string;
  };
  rating: number;
  date: string;
  comment: string;
  item: string;
}

interface ReviewsListProps {
  reviews: Review[];
}

const ReviewsList = ({ reviews }: ReviewsListProps) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Reviews ({reviews.length})</h2>
      
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={review.reviewer.avatar} alt={review.reviewer.name} />
                  <AvatarFallback>{review.reviewer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-y-1 sm:gap-x-2">
                    <h4 className="font-semibold">{review.reviewer.name}</h4>
                    <div className="flex items-center text-muted-foreground">
                      <span className="hidden sm:inline mx-2">•</span>
                      <span className="text-sm">{review.date}</span>
                      <span className="mx-2">•</span>
                      <span className="text-sm">Item: {review.item}</span>
                    </div>
                  </div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < review.rating ? "text-yellow-500" : "text-muted"}>
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {reviews.length === 0 && (
          <div className="text-center py-12">
            <div className="rounded-full bg-muted p-3 mx-auto w-12 h-12 flex items-center justify-center mb-4">
              <Star className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No reviews yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto mt-1">
              You haven't received any reviews yet. As people borrow your items, they'll be able to leave reviews.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ReviewsList;
