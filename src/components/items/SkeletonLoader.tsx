import React from "react";
import ItemCardSkeleton from "./ItemCardSkeleton";

interface SkeletonLoaderProps {
  count?: number;
  listView?: boolean;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  count = 8,
  listView = false 
}) => {
  return (
    <div className="w-full">
      <div className={
        listView 
          ? "space-y-4"
          : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      }>
        {Array(count).fill(0).map((_, index) => (
          <ItemCardSkeleton key={index} listView={listView} />
        ))}
      </div>
      <div className="flex justify-center mt-8 text-muted-foreground text-sm">
        <p>Loading items from your community...</p>
      </div>
    </div>
  );
};

export default SkeletonLoader;
