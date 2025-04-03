import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '@/services/apiService';

export interface ItemImage {
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

export interface ItemsState {
  itemsById: Record<string, Item>;
  loading: boolean;
  error: string | null;
}

export const fetchItemById = createAsyncThunk(
  'items/fetchById',
  async (id: string | number) => {
    const response = await apiService.get(`/items/${id}/`);
    return response.data;
  }
);

const itemsSlice = createSlice({
  name: 'items',
  initialState: {
    itemsById: {},
    loading: false,
    error: null,
  } as ItemsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItemById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItemById.fulfilled, (state, action) => {
        state.loading = false;
        state.itemsById[action.payload.id] = action.payload;
      })
      .addCase(fetchItemById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch item';
      });
  },
});

export default itemsSlice.reducer;
