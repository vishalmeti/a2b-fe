/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '@/services/apiService';
import { UserRepository } from '@/repositories/User';

export interface UserState {
  data: any;
  loading: boolean;
  error: string | null;
  receivedRequests: any[];
  requestsLoading: boolean;
  requestsError: string | null;
}

export const fetchUser = createAsyncThunk(
  'users/me',
  async () => {
    const response = await apiService.get('/users/me');
    return response.data;
  }
);

export const fetchReceivedRequests = createAsyncThunk(
  'users/receivedRequests',
  async () => {
    const response = await apiService.get('/requests/');
    return response.data;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    loading: false,
    error: null,
    receivedRequests: [],
    requestsLoading: false,
    requestsError: null,
  } as UserState,
  reducers: {
    clearUser: (state) => {
      state.data = null;
    },
    updateUserData: (state, action) => {
      state.data = { ...state.data, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user data';
      })
      .addCase(fetchReceivedRequests.pending, (state) => {
        state.requestsLoading = true;
        state.requestsError = null;
      })
      .addCase(fetchReceivedRequests.fulfilled, (state, action) => {
        state.requestsLoading = false;
        state.receivedRequests = action.payload;
      })
      .addCase(fetchReceivedRequests.rejected, (state, action) => {
        state.requestsLoading = false;
        state.requestsError = action.error.message || 'Failed to fetch requests';
      });
  },
});

export const { clearUser, updateUserData } = userSlice.actions;
export default userSlice.reducer;
