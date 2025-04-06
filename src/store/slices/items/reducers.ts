import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { ItemsState, Item, Category, ItemImage } from './types';
import { 
  fetchItemById, 
  fetchAllItems, 
  fetchMyItems, 
  fetchCategories, 
  updateItemData, 
  deleteItem,
  fetchRequestById
} from './thunks';

export const buildItemsReducers = (builder: ActionReducerMapBuilder<ItemsState>) => {
  // Fetch item by ID
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

  // Fetch all items  
  builder
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
    })
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
    })
    .addCase(fetchMyItems.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch items';
    });

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
  
  // Update item data
  builder
    .addCase(updateItemData.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateItemData.fulfilled, (state, action) => {
      state.loading = false;
      const listOfImages: ItemImage[] = [];
      for (let i = 0; i < action.payload.images.length; i++) {
        const image = action.payload.images[i];
        listOfImages.push(image.image_url);
      }
      const updatedItem = action.payload;
      state.itemsById[updatedItem.id] = {
        ...state.itemsById[updatedItem.id],
        ...updatedItem,
        images: listOfImages
      };
    })
    .addCase(updateItemData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to update item';
    });
  
  // Delete item
  builder
    .addCase(deleteItem.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteItem.fulfilled, (state, action) => {
      state.loading = false;
      const itemId = action.meta.arg;
      delete state.itemsById[itemId];
      state.allIds = state.allIds.filter((id) => id !== itemId);
      state.myItemIds = state.myItemIds.filter((id) => id !== itemId);
    })
    .addCase(deleteItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to delete item';
    });

    // Fetch request by ID
  builder
    .addCase(fetchRequestById.pending, (state) => {
      state.loading = true;
      state.error = null;
    }
    )
    .addCase(fetchRequestById.fulfilled, (state, action) => {
      state.loading = false;
      const requestId = action.payload.id;
      state.reqById[requestId] = action.payload;
      if (!state.allReqIds.includes(requestId)) {
        state.allReqIds.push(requestId);
      }
    }
    )
    .addCase(fetchRequestById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch request';
    }
    );
};
