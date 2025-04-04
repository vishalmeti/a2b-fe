import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '@/services/apiService';
import { ItemRepository } from '@/repositories/Item';

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

export const fetchCategories = createAsyncThunk(
  'items/fetchCategories',
  async () => {
    const response = await apiService.get(ItemRepository.GET_CATEGORIES);
    return response.data;
  }
);

export const fetchItemById = createAsyncThunk(
  'items/fetchById',
  async (id: string | number) => {
    const response = await apiService.get(`/items/${id}/`);
    return response.data;
  }
);

export const fetchAllItems = createAsyncThunk(
  'items/fetchAll',
  async (_, { getState }) => {
    const response = await apiService.get('/items/');
    return { data: response.data, globalState: getState() };
  }
);

export const fetchMyItems = createAsyncThunk(
  'items/fetchMyItems',
  async (_, { getState }) => {
    const state = getState() as { user: { data?: { user?: { id?: number } } } };
    const userId = state.user.data?.user?.id;
    const response = await apiService.get('/items/?user_id=' + userId);
    return { data: response.data, globalState: getState() };
  }
);

export const updateItemData = createAsyncThunk(
  'items/updateItemData',
  async (item: Item) => {
    const { id , ...itemData } = item;
    const response = await apiService.patch(`/items/${id}/`, itemData);
    return response.data;
  }
);

export const deleteItem = createAsyncThunk(
  'items/deleteItem',
  async (itemId: number) => {
    const response = await apiService.delete(`/items/${itemId}/`);
    return response.data;
  }
);

const itemsSlice = createSlice({
  name: 'items',
  initialState: {
    itemsById: {},
    allIds: [],
    myItemIds: [],
    categories: {}, // Added categories to initial state
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
      })

      // Fetch all items
      .addCase(fetchAllItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllItems.fulfilled, (state, action) => {
        state.loading = false;
        // Store items by ID
        const newItemsById: Record<string, Item> = {};
        const newAllIds: number[] = [];
        const newMyItemIds: number[] = [];

        const globalState = action.payload.globalState as { user: { data: { user: { id?: number } } } };
        action.payload.data.forEach((item: Item) => {
          newItemsById[item.id] = item;
          newAllIds.push(item.id);
          console.log("GLobAL STATE", globalState);
          if (item.owner.user.id === globalState.user?.data?.user?.id) {
            newMyItemIds.push(item.id);
          }
        });
        
        state.itemsById = newItemsById;
        state.allIds = newAllIds;
        state.myItemIds = newMyItemIds;
      })
      .addCase(fetchAllItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch items';
      });

      // Fetch my items
      builder
      .addCase(fetchMyItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      }
      )
      .addCase(fetchMyItems.fulfilled, (state, action) => {
        state.loading = false;
        // Store items by ID
        const newMyItemIds: number[] = [];
        const newItemsById: Record<string, Item> = {};

        action.payload.data.forEach((item: Item) => {
          newItemsById[item.id] = item;
          newMyItemIds.push(item.id);
        });
        
        state.myItemIds = newMyItemIds;
        state.itemsById = { ...state.itemsById, ...newItemsById };
      }
      )
      .addCase(fetchMyItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch items';
      }
      );

      // Add the categories fetch cases
      builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        // Create a map of category names to ids
        const categoryMap: Record<string, number> = {};
        action.payload.forEach((category: Category) => {
          categoryMap[category.name] = category.id;
        });
        state.categories = categoryMap;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      });
  },
});

export default itemsSlice.reducer;
