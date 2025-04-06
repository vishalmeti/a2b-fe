import React from "react";

// Types
export type FilterType = "all" | "PENDING" | "APPROVED" | "COMPLETED" | "other";

interface RequestFilterTabsProps {
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
  counts: Record<FilterType, number>;
}

const RequestFilterTabs: React.FC<RequestFilterTabsProps> = ({
  activeFilter,
  setActiveFilter,
  counts,
}) => {
  return (
    <div className="sticky top-16 z-30 bg-background pt-2 pb-0 border-b border-border mb-8 shadow-sm">
      <div className="flex overflow-x-auto scrollbar-none -mb-px">
        {(["all", "PENDING", "APPROVED", "COMPLETED", "other"] as FilterType[]).map((filter) => {
          const isActive = activeFilter === filter;
          const label = filter === 'all' ? 'All Requests' : 
                        filter === 'PENDING' ? 'Pending' : 
                        filter === 'APPROVED' ? 'Approved' :
                        filter === 'COMPLETED' ? 'Completed' : 
                        'Declined/Canceled';
          const count = counts[filter];
          return (
            <button
              key={filter}
              className={`px-4 py-2 flex items-center whitespace-nowrap text-sm font-medium ${
                isActive 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-muted-foreground/30'
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {label}
              {count > 0 && (
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                  isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RequestFilterTabs;
