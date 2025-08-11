import { configureStore } from "@reduxjs/toolkit";
import userStateReducer from "./features/userSlice";

export const store = configureStore({
  reducer: { userStateReducer },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
