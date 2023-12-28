import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
    UserRegistrationCredentials,
    UserAuthorizationData,
    Token,
    SuccessResponse,
    ForgotPasswordRequest,
    ChangePasswordConfirmRequest,
    ChangePasswordRequest
} from "./types";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE_URL
    }),
    endpoints: builder => ({
        createNewUserAccount: builder.mutation<
            Token,
            UserRegistrationCredentials
        >({
            query: body => ({
                url: "auth/registration",
                method: "POST",
                body
            })
        }),
        authenticateUser: builder.mutation<Token, UserAuthorizationData>({
            query: body => ({
                url: "auth/login",
                method: "POST",
                body
            })
        }),
        sendConfirmationCode: builder.mutation<
            SuccessResponse,
            ForgotPasswordRequest
        >({
            query: body => ({
                url: "auth/forgot/send-code",
                method: "POST",
                body
            })
        }),
        confirmPasswordChange: builder.mutation<
            Token,
            ChangePasswordConfirmRequest
        >({
            query: body => ({
                url: "auth/forgot/confirm-code",
                method: "POST",
                body
            })
        }),
        changePassword: builder.mutation<
            SuccessResponse,
            ChangePasswordRequest & Token
        >({
            query: ({ token, ...body }) => ({
                url: `auth/forgot/change-password/${token}`,
                method: "PUT",
                body
            })
        })
    })
});

export const {
    useCreateNewUserAccountMutation,
    useAuthenticateUserMutation,
    useSendConfirmationCodeMutation,
    useConfirmPasswordChangeMutation,
    useChangePasswordMutation
} = authApi;
