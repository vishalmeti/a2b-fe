import { createSlice } from '@reduxjs/toolkit';
import { ItemsState } from './items/types';
import { buildItemsReducers } from './items/reducers';
import { 
  fetchCategories, 
  fetchItemById, 
  fetchAllItems, 
  fetchMyItems, 
  updateItemData, 
  deleteItem,
  requestItem,
  acceptRequest,
  performPickup,
  performReturn,
  completeReturn,
  fetchReceivedRequests,
} from './items/thunks';

// Re-export the types and thunks for use in components
export * from './items/types';
export {
  fetchCategories,
  fetchItemById,
  fetchAllItems,
  fetchMyItems,
  updateItemData,
  deleteItem,
  requestItem,
  acceptRequest,
  performPickup,
  performReturn,
  completeReturn,
  fetchReceivedRequests,
};

const itemsSlice = createSlice({
  name: 'items',
  initialState: {
    itemsById: {},
    allIds: [],
    reqById: {},
    allReqIds: [],
    myItemIds: [],
    categories: {},
    receivedRequests: [],
    requestsLoading: false,
    requestsError: null,
    loading: false,
    error: null,
  } as ItemsState,
  reducers: {},
  extraReducers: buildItemsReducers,
});

export default itemsSlice.reducer;
