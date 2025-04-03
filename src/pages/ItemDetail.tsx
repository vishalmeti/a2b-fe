import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchItemById } from "@/store/slices/itemsSlice";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LoadingScreen } from "@/components/loader/LoadingScreen";
import { ArrowLeft, TriangleAlert } from "lucide-react";
import ItemImageCarousel from "@/components/items-detail/ItemImageCarousel";
import ItemHeader from "@/components/items-detail/ItemHeader";
import ItemDetailsCard from "@/components/items-detail/ItemDetailsCard";
import OwnerCard from "@/components/items-detail/OwnerCard";
import BorrowRequestForm from "@/components/items-detail/BorrowRequestForm";

const ItemDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { itemsById, loading } = useSelector((state: RootState) => state.items);
  const item = id ? itemsById[id] : undefined;

  useEffect(() => {
    if (id) {
      dispatch(fetchItemById(id));
    }
  }, [dispatch, id]);
  
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <NavBar />
        <LoadingScreen baseMessage={'Fetching item details...'} />
      </div>
    );
  }
  
  if (!item) {
    return (
      <div className="flex min-h-screen flex-col">
        <NavBar />
        <div className="flex justify-center items-center flex-1">
          <div className="w-full max-w-lg bg-card text-card-foreground p-8 md:p-12 rounded-xl border shadow-md text-center transition-shadow duration-300 ease-in-out hover:shadow-xl animate-fade-in">
            <div className="mb-6 flex justify-center">
              <TriangleAlert className="w-20 h-20 text-primary animate-pulse" strokeWidth={2.5} />
            </div>
            <div style={{ animationDelay: '150ms' }}>
              <h1 className="text-7xl lg:text-8xl font-extrabold text-primary mb-3 tracking-tight">
                404
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground mb-4">
                Item Not Found
              </p>
              <p className="text-sm text-muted-foreground/80 mb-8">
                Sorry, we couldn't find the item you're looking for.
              </p>
            </div>
            <div style={{ animationDelay: '300ms' }}>
              <Button asChild size="lg">
                <Link to="/browse">Back to All Items</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isAvailable = item.availability_status === 'AVAILABLE';
  const ownerName = `${item.owner.user.first_name} ${item.owner.user.last_name}`;

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />

      <main className="flex-1 container py-8">
        <div className="mb-6">
          <Link to="/browse" className="text-muted-foreground hover:text-foreground inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to browse
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Item Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Carousel */}
            <ItemImageCarousel images={item.images} />

            {/* Item Details */}
            <div className="space-y-4">
              <ItemHeader 
                title={item.title} 
                category={item.category.name} 
                communityName={item.community_name} 
              />

              <Separator />

              <div>
                <h2 className="text-xl font-semibold mb-2">About this item</h2>
                <p className="text-muted-foreground whitespace-pre-line">
                  {item.description}
                </p>
              </div>

              <ItemDetailsCard 
                details={{
                  condition: item.condition,
                  categoryName: item.category.name,
                  depositAmount: parseFloat(item.deposit_amount),
                  borrowingFee: parseFloat(item.borrowing_fee),
                  maxBorrowDuration: item.max_borrow_duration_days,
                  pickupDetails: item.pickup_details,
                  availabilityNotes: item.availability_notes
                }}
              />
            </div>
          </div>

          {/* Owner info and Borrow Request */}
          <div className="space-y-6">
            {/* Availability Badge */}
            <Badge className={`w-full justify-center py-2 text-base 
              ${isAvailable 
                ? 'bg-green-100 hover:bg-green-100 text-green-800 border-green-200' 
                : 'bg-amber-100 hover:bg-amber-100 text-amber-800 border-amber-200'}`}
            >
              {item.availability_status}
            </Badge>

            {/* Owner Card */}
            <OwnerCard 
              owner={{
                ...item.owner,
                user: {
                  ...item.owner.user,
                  id: item.owner.user.id.toString(),
                },
              }} 
              communityName={item.community_name} 
            />

            {/* Request Form */}
            <BorrowRequestForm 
              itemTitle={item.title} 
              ownerName={ownerName} 
              isAvailable={isAvailable} 
            />
          </div>
        </div>
      </main>

      <footer className="w-full py-6 bg-muted">
        <div className="container px-4 md:px-6">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Borrow Anything. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ItemDetail;
