export type RequestStatus = "PENDING" | "APPROVED" | "DECLINED" | "CANCELLED" | "COMPLETED" | "CANCELLED_BORROWER" | "CANCELLED_LENDER" | "RETURN_INITIATED" | "RETURN_COMPLETED" | "RETURN_DECLINED" | "RETURNED" | "PICKED_UP" | "ACCEPTED" | "PICKED_UP";

export type RequestItem = { 
  id: number; 
  title: string; 
  owner_username: string;
  image_url: string | null;
};

export type RequestProfile = { 
  user_id: number; 
  username: string ;
  avatar: string | null;
  
};

export interface BorrowRequest {
  id: number;
  item: RequestItem;
  borrower_profile: RequestProfile;
  lender_profile: RequestProfile;
  pickup_date: string;
  return_date: string;
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
