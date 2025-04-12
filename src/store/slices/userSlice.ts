/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '@/services/apiService';
import { UserRepository } from '@/repositories/User';

export interface UserState {
  data: any;
  loading: boolean;
  error: string | null;
  // receivedRequests: any[];
  // requestsLoading: boolean;
  // requestsError: string | null;
  theme: 'light' | 'dark';
}

export const fetchUser = createAsyncThunk(
  'users/me',
  async () => {
    const response = await apiService.get(UserRepository.ME);
    return response.data;
  }
);

export const usersCommunities = createAsyncThunk(
  'users/communities',
  async () => {
    const response = await apiService.get(UserRepository.GET_COMMUNITIES);
    return response.data;
  }
);

// export const fetchReceivedRequests = createAsyncThunk(
//   'users/receivedRequests',
//   async () => {
//     const response = await apiService.get(UserRepository.GET_RECEIVED_REQUESTS);
//     return response.data;
//   }
// );

// Get initial theme from localStorage if available
const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('theme') as 'light' | 'dark' || 'light';
  }
  return 'light';
};

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    loading: false,
    error: null,
    // receivedRequests: [],
    // requestsLoading: false,
    // requestsError: null,
    theme: getInitialTheme(),
  } as UserState,
  reducers: {
    clearUser: (state) => {
      state.data = null;
    },
    updateUserData: (state, action) => {
      state.data = { ...state.data, ...action.payload };
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', state.theme);
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(state.theme);
      }
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
      .addCase(usersCommunities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(usersCommunities.fulfilled, (state, action) => {
        state.loading = false;
        state.data = { ...state.data, communities: action.payload };
      })
      .addCase(usersCommunities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user communities';
      });
      // .addCase(fetchReceivedRequests.pending, (state) => {
      //   state.requestsLoading = true;
      //   state.requestsError = null;
      // })
      // .addCase(fetchReceivedRequests.fulfilled, (state, action) => {
      //   state.requestsLoading = false;
      //   state.receivedRequests = action.payload;
      // })
      // .addCase(fetchReceivedRequests.rejected, (state, action) => {
      //   state.requestsLoading = false;
      //   state.requestsError = action.error.message || 'Failed to fetch requests';
      // });
  },
});

export const { clearUser, updateUserData, toggleTheme } = userSlice.actions;
export default userSlice.reducer;
