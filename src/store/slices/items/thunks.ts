import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '@/services/apiService';
import { ItemRepository } from '@/repositories/Item';
import { Item } from './types';

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
  async (item: Item, { getState }) => {
    const state = getState() as { user: { data?: { user?: { id?: number } } } };
    const userId = state.user.data?.user?.id;
    const { id , ...itemData } = item;
    const response = await apiService.patch(`/items/${id}/?user_id=${userId}`, itemData);
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

export const requestItem = createAsyncThunk(
  'items/requestItem',
  async (requestData: { item: number; start_date: string; end_date: string; borrower_message: string }) => {
    const response = await apiService.post('/requests/', requestData);
    return response.data;
  }
);

export const fetchRequestById = createAsyncThunk(
  'items/fetchRequestById',
  async (requestId: number) => {
    const response = await apiService.get(`/requests/${requestId}/`);
    return response.data;
  }
);

export const acceptRequest = createAsyncThunk(
  'items/acceptRequest',
  async (requestId: number) => {
    const response = await apiService.patch(`/requests/${requestId}/accept/`, {
        lender_response_message: "Request approved"
      });
    return response.data;
  }
);

export const performPickup = createAsyncThunk(
  'items/performPickup',
  async (requestId: number) => {
    const response = await apiService.patch(`/requests/${requestId}/confirm-pickup/`, {
        lender_response_message: "Item picked up"
      });
    return response.data;
  }
);

export const performReturn = createAsyncThunk(
  'items/performReturn',
  async (requestId: number) => {
    const response = await apiService.patch(`/requests/${requestId}/confirm-return/`, {
        lender_response_message: "Item returned"
      });
    return response.data;
  }
);

export const completeReturn = createAsyncThunk(
  'items/completeReturn',
  async (requestId: number) => {
    const response = await apiService.patch(`/requests/${requestId}/complete/`, {
        lender_response_message: "Return completed"
      });
    return response.data;
  }
);

