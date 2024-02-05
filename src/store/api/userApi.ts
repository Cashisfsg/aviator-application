import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { EntityState, createEntityAdapter } from "@reduxjs/toolkit";

import {
    User,
    UserBalance,
    Promo,
    UserRequisite,
    Token,
    SuccessResponse,
    ChangePasswordRequest,
    Requisite,
    PaginationParams
} from "./types";
import { RootStore } from "..";

interface Referral {
    currency: string;
    referralBalance: number;
    descendants: Descendant[];
}
export interface Descendant {
    _id: string;
    createdAt: string;
    updatedUt: string;
    earnings: number;
}

interface ReferralByDay {
    _id: string;
    date: string;
    totalEarned: number;
}

interface GameLimits {
    min: number;
    max: number;
    maxWin: number;
    currency: string;
}

export const referralEntityAdapter = createEntityAdapter({
    selectId: (referral: ReferralByDay) => referral._id
});

export const referralEntitySelector = referralEntityAdapter.getSelectors();

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
    tagTypes: ["User", "Balance", "Promo"],
    endpoints: builder => ({
        //! =================================================================
        getUser: builder.query<User, void>({
            query: () => ({
                url: "user"
            }),
            providesTags: ["User"]
        }),
        getGameLimits: builder.query<GameLimits, void>({
            query: () => ({
                url: "/user/game-limits"
            })
        }),
        getUserReferral: builder.query<Referral, void>({
            query: () => ({
                url: "/user/referral"
            })
        }),
        getUserReferralByDays: builder.query<
            EntityState<ReferralByDay, string>,
            PaginationParams | void
        >({
            query: args => ({
                url: "/user/referral/by-days",
                params: args
                    ? { limit: args.limit, skip: args.skip }
                    : undefined
            }),
            // transformResponse: (
            //     response: {
            //         _id: string;
            //         date: string;
            //         totalEarned: number;
            //     }[]
            // ) => {
            //     return { data: response, hasNextPage: true } as const;
            // },
            // serializeQueryArgs: ({ endpointName }) => {
            //     return endpointName;
            // },
            // forceRefetch: ({ currentArg, previousArg, endpointState }) => {
            //     return (
            //         endpointState?.data?.hasNextPage &&
            //         currentArg?.skip !== previousArg?.skip
            //     );
            // },
            // merge: (currentCacheData, responseData, { arg }) => {
            //     currentCacheData.data.push(...responseData.data);
            //     currentCacheData.hasNextPage =
            //         responseData.data.length === (arg?.limit ?? 0);
            // }
            transformResponse: (response: ReferralByDay[]) => {
                return referralEntityAdapter.addMany(
                    referralEntityAdapter.getInitialState(),
                    response
                );
            },
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName;
            },
            forceRefetch: ({ currentArg, previousArg }) => {
                return currentArg?.skip !== previousArg?.skip;
            },
            merge: (currentCacheData, responseData) => {
                referralEntityAdapter.addMany(
                    currentCacheData,
                    referralEntitySelector.selectAll(responseData)
                );
            }
        }),
        getUserBalance: builder.query<UserBalance, void>({
            query: () => ({
                url: "user/balance"
            }),
            providesTags: ["Balance"]
        }),
        getUserPromo: builder.query<Promo[], { type: "add_balance" | "promo" }>(
            {
                query: ({ type }) => ({
                    url: "user/promos",
                    params: { type }
                }),
                providesTags: ["Promo"]
            }
        ),
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
                url: "user/promos",
                method: "POST",
                body
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(userApi.util.invalidateTags(["Promo"]));
                } catch (error) {
                    console.error(error);
                }
            }
            // invalidatesTags: ["Promo"]
        }),
        sendConfirmationCodeOnExistingEmail: builder.mutation<
            SuccessResponse,
            void
        >({
            query: () => ({
                url: "user/confirm-email/send-code",
                method: "POST"
            })
        }),
        confirmExistingEmail: builder.mutation<
            SuccessResponse,
            { code: number; email: string }
        >({
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
        changeEmail: builder.mutation<{ message: string }, { code: number }>({
            query: ({ code }) => ({
                url: "user/change-email",
                method: "PUT",
                body: {
                    code,
                    email: sessionStorage.getItem("email")
                }
            })
        }),
        changeUserPassword: builder.mutation<
            SuccessResponse,
            ChangePasswordRequest
        >({
            query: ({ token, ...body }) => ({
                url: `/user/password/${token}`,
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
            // async onQueryStarted(_, { dispatch, queryFulfilled }) {
            //     try {
            //         await queryFulfilled;
            //         dispatch(userApi.util.invalidateTags(["User"]));
            //     } catch (error) {
            //         console.error(error);
            //     }
            // }
            invalidatesTags: ["User"]
        })
    })
});

export const {
    useGetUserQuery,
    useLazyGetUserQuery,
    useGetGameLimitsQuery,
    useLazyGetGameLimitsQuery,
    useGetUserReferralQuery,
    useLazyGetUserReferralQuery,
    useGetUserReferralByDaysQuery,
    useLazyGetUserReferralByDaysQuery,
    useGetUserBalanceQuery,
    useLazyGetUserBalanceQuery,
    useGetUserPromoQuery,
    useLazyGetUserPromoQuery,
    useGetUserRequisitesQuery,
    useLazyGetUserRequisitesQuery,
    useGetUserRecommendedRequisitesQuery,
    useLazyGetUserRecommendedRequisitesQuery,
    useActivatePromoCodeMutation,
    useSendConfirmationCodeOnExistingEmailMutation,
    useConfirmExistingEmailMutation,
    useSendEmailChangeCodeMutation,
    useChangeEmailMutation,
    useChangePasswordConfirmMutation,
    useChangeUserPasswordMutation,
    useChangeProfileImageMutation
} = userApi;
