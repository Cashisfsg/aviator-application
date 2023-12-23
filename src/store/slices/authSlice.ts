import { createSlice } from "@reduxjs/toolkit";
import { authApi as api } from "../api/authApi";
import { RootStore } from "..";

interface AuthState {
    token: string | null;
}

const authSlice = createSlice({
    name: "auth",
    initialState: { token: null } as AuthState,
    reducers: {},
    extraReducers: builder => {
        builder.addMatcher(
            api.endpoints.authenticateUser.matchFulfilled,
            (state, { payload }) => {
                state.token = payload.token;
            }
        );
    }
});

export const { reducer: authReducer, actions: authActions } = authSlice;

export const getAuthenticationStatus = (state: RootStore) => state.auth.token;
