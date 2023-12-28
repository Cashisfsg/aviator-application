import { createSlice } from "@reduxjs/toolkit";
import { authApi as api } from "../api/authApi";
import { RootStore } from "..";

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
}

const authSlice = createSlice({
    name: "auth",
    initialState: () => {
        const token = localStorage.getItem("token");

        return {
            token,
            isAuthenticated: false
        } as AuthState;
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addMatcher(
                api.endpoints.authenticateUser.matchFulfilled,
                (state, { payload }) => {
                    localStorage.setItem(
                        "token",
                        JSON.stringify(payload.token)
                    );
                    state.token = payload.token;
                    state.isAuthenticated = true;
                }
            )
            .addMatcher(
                api.endpoints.createNewUserAccount.matchFulfilled,
                (state, { payload }) => {
                    localStorage.setItem(
                        "token",
                        JSON.stringify(payload.token)
                    );
                    state.token = payload.token;
                    state.isAuthenticated = true;
                }
            )
            .addMatcher(
                api.endpoints.confirmPasswordChange.matchFulfilled,
                (state, { payload }) => {
                    localStorage.setItem(
                        "token",
                        JSON.stringify(payload.token)
                    );
                    state.token = payload.token;
                }
            );
    }
});

export const { reducer: authReducer, actions: authActions } = authSlice;

export const getAuthenticationStatus = (state: RootStore) => ({
    token: state.auth.token,
    isAuthenticated: state.auth.isAuthenticated
});
