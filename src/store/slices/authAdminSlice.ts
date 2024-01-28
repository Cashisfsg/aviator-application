import { createSlice } from "@reduxjs/toolkit";
import { adminApi } from "../api";

interface AuthenticatedAdmin {
    token: string;
    isAuthenticated: true;
}

interface NonAuthenticatedAdmin {
    token: null;
    isAuthenticated: false;
}

type AuthAdminState = AuthenticatedAdmin | NonAuthenticatedAdmin;

export const adminAuthSlice = createSlice({
    name: "adminAuth",
    initialState: () => {
        const storedData = localStorage.getItem("token");

        if (!storedData)
            return {
                token: null,
                isAuthenticated: false
            } as AuthAdminState;

        const { token } = JSON.parse(storedData);

        return {
            token,
            isAuthenticated: true
        } as AuthAdminState;
    },
    reducers: {},
    extraReducers: builder =>
        builder.addMatcher(
            adminApi.endpoints.adminLogin.matchFulfilled,
            (state, { payload }) => {
                localStorage.setItem(
                    "token",
                    JSON.stringify({ token: payload.token })
                );
                state.token = payload.token;
                state.isAuthenticated = true;
            }
        )
});

export const { reducer: adminAuthReducer, actions: adminAuthActions } =
    adminAuthSlice;
