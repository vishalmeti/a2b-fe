/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '@/services/apiService';
import { UserRepository } from '@/repositories/User';

export interface UserState {
  data: any;
  loading: boolean;
  error: string | null;
}

export const fetchUser = createAsyncThunk(
  'users/me',
  async () => {
    const response = await apiService.get('/users/me');
    return response.data;
  }
);

// export const fetchUserById = createAsyncThunk(
//   'users/fetchById',
//   async (id: string | number) => {
//     const response = await apiService.get(`/users/${id}`);
//     return response.data;
//   }
// );

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    loading: false,
    error: null,
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
      });
    // builder
    //   .addCase(fetchUserById.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(fetchUserById.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.data = action.payload;
    //   })
    //   .addCase(fetchUserById.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.error.message || 'Failed to fetch user data';
    //   }
    //   );
  
  },
});

export const { clearUser, updateUserData } = userSlice.actions;
export default userSlice.reducer;
