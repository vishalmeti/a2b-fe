import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from './slices/notificationSlice';
import userReducer from './slices/userSlice';
import itemsReducer from './slices/itemsSlice';

export const store = configureStore({
  reducer: {
    notifications: notificationReducer,
    user: userReducer,
    items: itemsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
