import { configureStore } from "@reduxjs/toolkit";
import userStateReducer from "./features/userSlice";
import systemStateReducer from "./features/systemSlice";

export const store = configureStore({
  reducer: { userStateReducer, systemStateReducer },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
