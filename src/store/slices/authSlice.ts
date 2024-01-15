import { createSlice, createSelector } from "@reduxjs/toolkit";

import { authApi, userApi, User } from "../api";
import { RootStore } from "../types";
import { io, Socket } from "socket.io-client";

// interface AuthorizedUser {
//     token: string;
//     isAuthenticated: true;
//     user: User | null;
//     socket: Socket;
// }

// interface NonAuthorizedUser {
//     token: null;
//     isAuthenticated: false;
//     user: Pick<User, "login" | "telegramId" | "profileImage"> | null;
//     socket: Socket;
// }

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    initData: Pick<User, "login" | "telegramId" | "profileImage"> | null;
    socket: Socket;
}

const BASE_URL: string = import.meta.env.VITE_API_BASE_URL;

// type AuthState = AuthorizedUser | NonAuthorizedUser;

export const authSlice = createSlice({
    name: "auth",
    initialState: () => {
        const storedData = localStorage.getItem("token");

        if (!storedData)
            return {
                token: null,
                isAuthenticated: false,
                socket: io(BASE_URL),
                initData: null
            };

        const { token } = JSON.parse(storedData);

        return {
            token,
            isAuthenticated: true,
            socket: io(BASE_URL, { auth: { token } }),
            initData: null
        } as AuthState;
    },
    reducers: {
        logout: state => {
            localStorage.removeItem("token");
            state.token = null;
            state.isAuthenticated = false;
            state.initData = {
                login: state?.initData?.login as string,
                telegramId: state.initData?.telegramId as number,
                profileImage: state.initData?.profileImage as string
            };
            state.socket.auth = () => {};
            userApi.util.resetApiState();
        },
        setUserInitData: (
            state,
            {
                payload
            }: { payload: Pick<User, "login" | "telegramId" | "profileImage"> }
        ) => {
            state.initData = {
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
                    state.socket.auth = { token: payload.token };
                }
            )
            // .addMatcher(
            //     userApi.endpoints.getUser.matchFulfilled,
            //     (state, { payload }) => {
            //         state.initData = payload;
            //     }
            // )
            .addMatcher(
                authApi.endpoints.createNewUserAccount.matchFulfilled,
                (state, { payload }) => {
                    localStorage.setItem(
                        "token",
                        JSON.stringify({ token: payload.token })
                    );
                    state.token = payload.token;
                    state.isAuthenticated = true;
                    state.socket.auth = { token: payload.token };
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
                    state.socket.auth = { token: payload.token };
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
                    state.socket.auth = { token: payload.token };
                }
            );
    }
});

export const { reducer: authReducer, actions: authActions } = authSlice;

export const getAuthenticationStatus = (state: RootStore) => ({
    token: state.auth.token,
    isAuthenticated: state.auth.isAuthenticated
});

export const selectToken = (state: RootStore) => state.auth.token;
export const selectAuthenticationStatus = (state: RootStore) =>
    state.auth.isAuthenticated;

export const { logout, setUserInitData } = authSlice.actions;

const socket = (state: RootStore) => state.auth.socket;

export const selectSocket = createSelector([socket], socket => socket);

const selectLogin = (state: RootStore) => state.auth.initData?.login;
const selectTelegramId = (state: RootStore) => state.auth.initData?.telegramId;
const selectProfileImage = (state: RootStore) =>
    state.auth.initData?.profileImage;

export const selectInitData = createSelector(
    [selectLogin, selectTelegramId, selectProfileImage],
    (login, telegramId, profileImage) => ({ login, telegramId, profileImage })
);
