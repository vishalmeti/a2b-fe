export interface ItemImage {
  url: string;
  id: number;
  image_url: string;
  caption: string;
  uploaded_at: string;
}

export interface ItemOwner {
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  phone_number: string;
  profile_picture_url: string;
  community: number;
  community_name: string | null;
  average_lender_rating: number | null;
  average_borrower_rating: number | null;
}

export interface Item {
  location: string;
  price: number | string;
  id: number;
  title: string;
  description: string;
  category: {
    id: number;
    name: string;
    icon: string | null;
  };
  condition: string;
  availability_status: string;
  availability_notes: string;
  deposit_amount: string;
  borrowing_fee: string;
  max_borrow_duration_days: number;
  pickup_details: string;
  is_active: boolean;
  average_item_rating: number | null;
  owner: ItemOwner;
  community_name: string;
  images: ItemImage[];
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string | null;
}

export interface ItemsState {
  itemsById: Record<string, Item>;
  allIds: number[];
  myItemIds: number[];
  categories: Record<string, number>; // Map of category name to id
  loading: boolean;
  error: string | null;
}
