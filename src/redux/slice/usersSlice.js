import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoggedIn: false,
  isUsersFetching: false,
  isUsersFetchError: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isUsersFetching = true;
      state.isUsersFetchError = false;
      state.isLoggedIn = false;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isUsersFetching = false;
      state.isUsersFetchError = false;
      state.isLoggedIn = true;
    },
    loginFailure: (state) => {
      state.isUsersFetching = false;
      state.isUsersFetchError = true;
      state.isLoggedIn = false;
    },
    logoutReducer: (state) => {
      state.user = null;
      state.isUsersFetching = false;
      state.isUsersFetchError = false;
      state.isLoggedIn = false;
    },
  },
});

export const { loginSuccess, logoutReducer, loginStart, loginFailure } =
  userSlice.actions;
export default userSlice.reducer;
