import React from "react";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { FilterType } from "./RequestFilterTabs";

interface EmptyRequestStateProps {
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
  searchQuery: string;
}

const EmptyRequestState: React.FC<EmptyRequestStateProps> = ({ 
  activeFilter, 
  setActiveFilter, 
  searchQuery 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-border bg-muted/30 min-h-[300px] animate-fadeIn">
      <div className="mb-4 p-4 bg-background rounded-full border border-border">
        <Package className="h-12 w-12 text-muted-foreground/50" />
      </div>
      <h3 className="text-xl font-semibold text-foreground">
        {searchQuery ? "No matching requests" : `No ${activeFilter !== 'all' ? activeFilter.toLowerCase() : ''} requests`}
      </h3>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm">
        {searchQuery
          ? "Try adjusting your search or changing the filter."
          : activeFilter === 'PENDING' ? "When someone requests to borrow your items, they'll appear here."
          : activeFilter === 'APPROVED' ? "Requests you've approved will appear here."
          : activeFilter === 'COMPLETED' ? "Completed borrows will appear here."
          : activeFilter === 'other' ? "Declined or canceled requests will appear here."
          : "You haven't received any requests yet."}
      </p>
      {activeFilter !== 'all' && (
        <Button variant="outline" onClick={() => setActiveFilter('all')} className="mt-6">
          View All Requests
        </Button>
      )}
    </div>
  );
};

export default EmptyRequestState;
