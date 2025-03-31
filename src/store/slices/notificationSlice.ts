/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '@/services/apiService';
import { UserRepository } from '@/repositories/User';
import map from 'lodash/map';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async () => {
    const response = await apiService.get(UserRepository.GET_NOTIFICATIONS);
    return map(response.data, (item: any) => ({
      id: item.id,
      text: item.message,
      read: item.is_read,
      time: item.created_at,
    }));
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    markAsRead: (state, action) => {
      state.items = state.items.map((n: any) =>
        n.id === action.payload ? { ...n, read: true } : n
      );
    },
    markAllAsRead: (state) => {
      state.items = state.items.map((n: any) => ({ ...n, read: true }));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notifications';
      });
  },
});

export const { markAsRead, markAllAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;
