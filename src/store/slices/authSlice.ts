import { createSlice } from "@reduxjs/toolkit";

import { authApi, userApi, User } from "../api";
import { RootStore } from "..";

interface AuthorizedUser {
    token: string;
    isAuthenticated: true;
    user: User | null;
}

interface NonAuthorizedUser {
    token: null;
    isAuthenticated: false;
    user: Pick<User, "login" | "telegramId" | "profileImage"> | null;
}
// interface AuthState {
//     token: string | null;
//     isAuthenticated: boolean;
//     user: User | Pick<User, "telegramId" | "profileImage"> | null;
// }

type AuthState = AuthorizedUser | NonAuthorizedUser;

const authSlice = createSlice({
    name: "auth",
    initialState: () => {
        const storedData = localStorage.getItem("token");

        if (!storedData)
            return { token: null, isAuthenticated: false, user: null };

        const { token } = JSON.parse(storedData);

        return {
            token,
            isAuthenticated: true,
            user: null
        } as AuthState;
    },
    reducers: {
        logout: state => {
            localStorage.removeItem("token");
            state.token = null;
            state.isAuthenticated = false;
            state.user = {
                login: state?.user?.login as string,
                telegramId: state.user?.telegramId as number,
                profileImage: state.user?.profileImage as string
            };
            userApi.util.resetApiState();
        },
        setUndefinedUser: (
            state,
            {
                payload
            }: { payload: Pick<User, "login" | "telegramId" | "profileImage"> }
        ) => {
            state.user = {
                login: payload.login,
                telegramId: payload.telegramId,
                profileImage: payload.profileImage
            };
        }
    },
    extraReducers: builder => {
        builder
            .addMatcher(
                authApi.endpoints.authenticateUser.matchFulfilled,
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
                userApi.endpoints.getUser.matchFulfilled,
                (state, { payload }) => {
                    state.user = payload;
                }
            )
            .addMatcher(
                authApi.endpoints.createNewUserAccount.matchFulfilled,
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
                authApi.endpoints.confirmPasswordChange.matchFulfilled,
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

export const { logout, setUndefinedUser } = authSlice.actions;
