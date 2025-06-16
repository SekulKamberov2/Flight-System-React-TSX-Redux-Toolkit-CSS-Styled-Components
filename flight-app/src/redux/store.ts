// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { flightApi } from './services/flightApi';

export const store = configureStore({
  reducer: {
    [flightApi.reducerPath]: flightApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(flightApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
