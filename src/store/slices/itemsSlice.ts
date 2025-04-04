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
  requestItem
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
  requestItem
};

const itemsSlice = createSlice({
  name: 'items',
  initialState: {
    itemsById: {},
    allIds: [],
    myItemIds: [],
    categories: {},
    loading: false,
    error: null,
  } as ItemsState,
  reducers: {},
  extraReducers: buildItemsReducers,
});

export default itemsSlice.reducer;
