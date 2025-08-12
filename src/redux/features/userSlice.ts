import { IUserInfoResponse } from "@/types/common";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type UserState = {
  userInfo?: IUserInfoResponse;
};

const initialState: UserState = {
  userInfo: undefined,
};

export const userSlice = createSlice({
  name: "userState",
  initialState,
  reducers: {
    reset: () => initialState,
    setUserInfo: (state, action: PayloadAction<UserState>) => {
      state.userInfo = action.payload.userInfo;
    },
  },
});

export const { setUserInfo, reset } = userSlice.actions;
export default userSlice.reducer;
