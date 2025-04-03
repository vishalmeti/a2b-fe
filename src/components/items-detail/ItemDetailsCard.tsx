import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ItemDetailsCardProps {
  details: {
    condition: string;
    categoryName: string;
    depositAmount: number;
    borrowingFee: number;
    maxBorrowDuration: number;
    pickupDetails: string;
    availabilityNotes?: string;
  };
}

export const ItemDetailsCard = ({ details }: ItemDetailsCardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Item Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Condition:</dt>
              <dd className="font-medium">{details.condition}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Category:</dt>
              <dd className="font-medium">{details.categoryName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Deposit Amount:</dt>
              <dd className="font-medium">${details.depositAmount}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Borrowing Fee:</dt>
              <dd className="font-medium">${details.borrowingFee}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Borrowing Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Borrow Period:</dt>
              <dd className="font-medium">Up to {details.maxBorrowDuration} days</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Security Deposit:</dt>
              <dd className="font-medium">${details.depositAmount}</dd>
            </div>
            {details.pickupDetails && (
              <div className="pt-2">
                <dt className="text-muted-foreground mb-1">Pickup/Dropoff:</dt>
                <dd className="font-medium">{details.pickupDetails}</dd>
              </div>
            )}
            {details.availabilityNotes && (
              <div className="pt-2">
                <dt className="text-muted-foreground mb-1">Additional Notes:</dt>
                <dd className="font-medium">{details.availabilityNotes}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

export default ItemDetailsCard;
