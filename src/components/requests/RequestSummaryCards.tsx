import React from "react";

// Shadcn components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Icons
import { Clock, CheckCircle, Check, X, Inbox } from "lucide-react";

// Types
import { FilterType } from "./RequestFilterTabs";

interface RequestSummaryCardsProps {
  counts: Record<FilterType, number>;
}

const RequestSummaryCards: React.FC<RequestSummaryCardsProps> = ({ counts }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-amber-900/20 border-amber-200 dark:border-amber-900/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-amber-900 dark:text-amber-300">Pending Actions</CardTitle>
          <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-900 dark:text-amber-300">{counts.PENDING}</div>
          <p className="text-xs text-amber-700/70 dark:text-amber-400/70">Requests awaiting your response</p>
        </CardContent>
      </Card>
        
      <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-emerald-900/20 border-emerald-200 dark:border-emerald-900/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-emerald-900 dark:text-emerald-300">Approved & Active</CardTitle>
          <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-300">{counts.APPROVED}</div>
          <p className="text-xs text-emerald-700/70 dark:text-emerald-400/70">Current or upcoming borrows</p>
        </CardContent>
      </Card>
        
      <Card className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-sky-900/20 border-sky-200 dark:border-sky-900/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-sky-900 dark:text-sky-300">Completed</CardTitle>
          <Check className="h-4 w-4 text-sky-600 dark:text-sky-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-sky-900 dark:text-sky-300">{counts.COMPLETED}</div>
          <p className="text-xs text-sky-700/70 dark:text-sky-400/70">Successfully completed borrows</p>
        </CardContent>
      </Card>
        
      <Card className="bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-900/50 dark:to-slate-800/30 border-slate-200 dark:border-slate-700/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          <Inbox className="h-4 w-4 text-slate-600 dark:text-slate-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{counts.all}</div>
          <p className="text-xs text-muted-foreground">All requests received</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestSummaryCards;
