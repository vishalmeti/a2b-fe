import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from './slices/notificationSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    notifications: notificationReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
