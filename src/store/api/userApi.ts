import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
    User,
    UserBalance,
    UserBonus,
    UserRequisite,
    Token,
    SuccessResponse,
    ChangePasswordRequest,
    Requisite
} from "./types";
import { RootStore } from "..";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootStore).auth.token;
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        }
    }),
    tagTypes: ["User", "Balance"],
    endpoints: builder => ({
        //! =================================================================
        getUser: builder.query<User, void>({
            query: () => ({
                url: "user"
            }),
            providesTags: ["User"]
        }),
        getUserBalance: builder.query<UserBalance, void>({
            query: () => ({
                url: "user/balance"
            }),
            providesTags: ["Balance"]
        }),
        getUserBonus: builder.query<UserBonus, void>({
            query: () => ({
                url: "user/bonus"
            })
        }),
        getUserRequisites: builder.query<UserRequisite[], void>({
            query: () => ({
                url: "user/requisites"
            })
        }),
        getUserRecommendedRequisites: builder.query<Requisite[], void>({
            query: () => ({
                url: "user/requisites/recommended"
            })
        }),
        //! =================================================================
        activatePromoCode: builder.mutation<
            SuccessResponse,
            { promoCode: string }
        >({
            query: body => ({
                url: "user/bonus",
                method: "POST",
                body
            })
        }),
        sendEmailConfirmationCode: builder.mutation<SuccessResponse, void>({
            query: () => ({
                url: "user/confirm-email/send-code",
                method: "POST"
            })
        }),
        confirmEmail: builder.mutation<SuccessResponse, { code: string }>({
            query: body => ({
                url: "user/confirm-email",
                method: "POST",
                body
            })
        }),
        sendEmailChangeCode: builder.mutation<
            SuccessResponse,
            { email: string }
        >({
            query: body => ({
                url: "user/change-email/send-code",
                method: "POST",
                body
            })
        }),
        //! =================================================================
        changeEmail: builder.mutation<{ message: string }, { code: string }>({
            query: body => ({
                url: "user/change-email",
                method: "PUT",
                body
            })
        }),
        changeUserPassword: builder.mutation<
            SuccessResponse,
            ChangePasswordRequest
        >({
            query: body => ({
                url: "/user/password/{token}",
                method: "PUT",
                body
            })
        }),
        changePasswordConfirm: builder.mutation<Token, { password: string }>({
            query: body => ({
                url: "user/password/confirm",
                method: "PUT",
                body
            })
        }),
        changeProfileImage: builder.mutation<User, File>({
            query: file => {
                const formData = new FormData();
                formData.append("file", file);
                return {
                    url: "/user/profile-image",
                    method: "PUT",
                    body: formData,
                    headers: {
                        Accept: "application/json"
                    },
                    formData: true
                };
            },
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(userApi.util.invalidateTags(["User"]));
                } catch (error) {
                    console.error(error);
                }
            }
        })
    })
});

export const {
    useGetUserQuery,
    useLazyGetUserQuery,
    useGetUserBalanceQuery,
    useLazyGetUserBalanceQuery,
    useGetUserBonusQuery,
    useLazyGetUserBonusQuery,
    useGetUserRequisitesQuery,
    useLazyGetUserRequisitesQuery,
    useGetUserRecommendedRequisitesQuery,
    useLazyGetUserRecommendedRequisitesQuery,
    useActivatePromoCodeMutation,
    useSendEmailConfirmationCodeMutation,
    useConfirmEmailMutation,
    useSendEmailChangeCodeMutation,
    useChangeEmailMutation,
    useChangePasswordConfirmMutation,
    useChangeUserPasswordMutation,
    useChangeProfileImageMutation
} = userApi;
