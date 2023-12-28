import { createSlice } from "@reduxjs/toolkit";
import { authApi as api } from "../api/authApi";
import { RootStore } from "..";

interface AuthState {
    token: string | null;
}

const authSlice = createSlice({
    name: "auth",
    initialState: () => {
        const token = localStorage.getItem("token");

        return { token: token ? JSON.parse(token) : null } as AuthState;
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

export const getAuthenticationStatus = (state: RootStore) => state.auth.token;
