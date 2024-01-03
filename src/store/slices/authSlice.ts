import { createSlice } from "@reduxjs/toolkit";

import { authApi as api, userApi } from "../api";
import { RootStore } from "..";

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
}

const authSlice = createSlice({
    name: "auth",
    initialState: () => {
        const storedData = localStorage.getItem("token");

        if (!storedData) return { token: null, isAuthenticated: false };

        const { token } = JSON.parse(storedData);

        return {
            token,
            isAuthenticated: Boolean(token)
        } as AuthState;
    },
    reducers: {
        logout: state => {
            localStorage.removeItem("token");
            state.token = null;
            state.isAuthenticated = false;
            userApi.util.resetApiState();
        }
    },
    extraReducers: builder => {
        builder
            .addMatcher(
                api.endpoints.authenticateUser.matchFulfilled,
                (state, { payload }) => {
                    localStorage.setItem(
                        "token",
                        JSON.stringify({ token: payload.token })
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
                        JSON.stringify({ token: payload.token })
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
                        JSON.stringify({ token: payload.token })
                    );
                    state.token = payload.token;
                }
            )
            .addMatcher(
                userApi.endpoints.changePasswordConfirm.matchFulfilled,
                (state, { payload }) => {
                    localStorage.setItem(
                        "token",
                        JSON.stringify({ token: payload.token })
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

export const { logout } = authSlice.actions;
