import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SessionUser } from "@/services/types/auth_interface";

interface UserState {
  profile: SessionUser | null;
}

const userSlice = createSlice({
  name: "user",
  initialState: { profile: null } as UserState,
  reducers: {
    setProfile: (state, action: PayloadAction<SessionUser | null>) => {
      state.profile = action.payload;
    },
  },
});

export const { setProfile } = userSlice.actions;
export default userSlice.reducer;
