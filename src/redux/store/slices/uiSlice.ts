import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  /** Visual privacy mode: hides every financial value (NOT an authorization mechanism). */
  privacy: boolean;
  unreadNotifications: number;
}

const initialState: UiState = { privacy: false, unreadNotifications: 0 };

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setPrivacy: (state, action: PayloadAction<boolean>) => {
      state.privacy = action.payload;
    },
    setUnread: (state, action: PayloadAction<number>) => {
      state.unreadNotifications = action.payload;
    },
  },
});

export const { setPrivacy, setUnread } = uiSlice.actions;
export default uiSlice.reducer;
