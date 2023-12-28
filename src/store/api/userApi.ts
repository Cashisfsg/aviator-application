import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
    User,
    UserBalance,
    UserBonus,
    UserRequisite,
    Token,
    SuccessResponse,
    ChangePasswordRequest
} from "./types";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE_URL
    }),
    endpoints: builder => ({
        //! =================================================================
        getUser: builder.query<User, void>({
            query: () => ({
                url: "user"
            })
        }),
        getUserBalance: builder.query<UserBalance, void>({
            query: () => ({
                url: "user/balance"
            })
        }),
        getUserBonus: builder.query<UserBonus, void>({
            query: () => ({
                url: "user/bonus"
            })
        }),
        getUserRequisite: builder.query<UserRequisite, void>({
            query: () => ({
                url: "user/requisites"
            })
        }),
        //! =================================================================
        sendPromo: builder.mutation<SuccessResponse, { promoCode: string }>({
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
    useGetUserRequisiteQuery,
    useLazyGetUserRequisiteQuery,
    useSendPromoMutation,
    useSendEmailConfirmationCodeMutation,
    useConfirmEmailMutation,
    useSendEmailChangeCodeMutation,
    useChangeEmailMutation,
    useChangePasswordConfirmMutation,
    useChangeUserPasswordMutation
} = userApi;
