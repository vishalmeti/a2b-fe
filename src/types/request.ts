export type RequestStatus = "PENDING" | "APPROVED" | "DECLINED" | "CANCELLED" | "COMPLETED";

export type RequestItem = { 
  id: number; 
  title: string; 
  owner_username: string 
};

export type RequestProfile = { 
  user_id: number; 
  username: string 
};

export interface BorrowRequest {
  id: number;
  item: RequestItem;
  borrower_profile: RequestProfile;
  lender_profile: RequestProfile;
  start_date: string;
  end_date: string;
  status: RequestStatus;
  status_display: string;
  borrower_message: string;
  lender_response_message: string;
  created_at: string;
  updated_at: string;
  processed_at: string | null;
  pickup_confirmed_at: string | null;
  return_initiated_at: string | null;
  completed_at: string | null;
}
