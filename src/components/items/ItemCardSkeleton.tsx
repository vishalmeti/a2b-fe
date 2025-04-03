import React from "react";

interface ItemCardSkeletonProps {
  listView?: boolean;
}

const ItemCardSkeleton: React.FC<ItemCardSkeletonProps> = ({ listView = false }) => {
  if (listView) {
    return (
      <div className="h-full overflow-hidden rounded-lg bg-background border shadow-sm">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-48 h-48 bg-muted animate-pulse" />
          <div className="flex-1 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="h-5 w-20 bg-muted rounded-full animate-pulse" />
              <div className="h-4 w-16 bg-muted rounded-full animate-pulse" />
            </div>
            <div className="h-6 w-3/4 bg-muted rounded-md animate-pulse mb-3" />
            <div className="h-4 w-full bg-muted rounded animate-pulse mb-2" />
            <div className="h-4 w-2/3 bg-muted rounded animate-pulse mb-4" />
            
            <div className="flex items-center space-x-2 mt-2">
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
              <div>
                <div className="h-4 w-24 bg-muted rounded animate-pulse mb-1" />
                <div className="h-3 w-12 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden rounded-lg bg-background border shadow-sm">
      {/* Image skeleton */}
      <div className="aspect-video w-full bg-muted animate-pulse" />
      
      {/* Content skeleton */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="h-5 w-20 bg-muted rounded-full animate-pulse" />
          <div className="h-4 w-16 bg-muted rounded-full animate-pulse" />
        </div>
        <div className="h-6 w-3/4 bg-muted rounded-md animate-pulse mb-3" />
        <div className="h-4 w-full bg-muted rounded animate-pulse mb-2" />
        <div className="h-4 w-2/3 bg-muted rounded animate-pulse mb-4" />
        
        {/* User info skeleton */}
        <div className="flex items-center space-x-2 mt-2">
          <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          <div>
            <div className="h-4 w-24 bg-muted rounded animate-pulse mb-1" />
            <div className="h-3 w-12 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCardSkeleton;
