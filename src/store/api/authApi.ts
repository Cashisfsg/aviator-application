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
import { userApi } from ".";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE_URL
    }),
    endpoints: builder => ({
        getSupportServiceLink: builder.query<{ link: string }, void>({
            query: () => ({
                url: "links/support"
            })
        }),
        createNewUserAccount: builder.mutation<
            Token,
            UserRegistrationCredentials
        >({
            query: body => ({
                url: "auth/registration",
                method: "POST",
                body
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(userApi.util.invalidateTags(["User", "Balance"]));
                } catch (error) {
                    console.error(error);
                }
            }
        }),
        authenticateUser: builder.mutation<Token, UserAuthorizationData>({
            query: body => ({
                url: "auth/login",
                method: "POST",
                body
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(userApi.util.invalidateTags(["User", "Balance"]));
                } catch (error) {
                    console.error(error);
                }
            }
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
            query: ({ code }) => ({
                url: "auth/forgot/confirm-code",
                method: "POST",
                body: {
                    code,
                    email: sessionStorage.getItem("email")
                }
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
    useChangePasswordMutation,
    useGetSupportServiceLinkQuery,
    useLazyGetSupportServiceLinkQuery
} = authApi;
