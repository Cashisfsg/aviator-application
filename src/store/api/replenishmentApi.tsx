import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithLogout } from "./api";
import { SuccessResponse, Replenishment } from "./types";

interface Currency {
    currency: string;
    amount: number;
    requisite: string;
}

interface Limit {
    minLimit: number;
    maxLimit: number;
    currency: string;
}

export const replenishmentApi = createApi({
    reducerPath: "replenishmentApi",
    baseQuery: baseQueryWithLogout,
    tagTypes: ["Deposit"],
    endpoints: builder => ({
        //! =================================================================
        getAllDeposits: builder.query<Replenishment[], void>({
            query: () => ({
                url: "replenishments"
            }),
            transformResponse: (response: Replenishment[]) => {
                if (Array.isArray(response)) {
                    return response.reverse();
                }
                return response;
            },
            providesTags: ["Deposit"]
        }),
        getReplenishmentLimits: builder.query<Limit, void>({
            query: () => ({
                url: "/replenishments/limits"
            })
        }),
        getReplenishmentById: builder.query<Replenishment, { id: number }>({
            query: ({ id }) => ({
                url: `replenishments/${id}`
            })
        }),
        //! =================================================================
        addReplenishment: builder.mutation<Replenishment, Currency>({
            query: body => ({
                url: `replenishments`,
                method: "POST",
                body
            }),
            invalidatesTags: ["Deposit"]
        }),
        //! =================================================================
        cancelReplenishmentById: builder.mutation<
            SuccessResponse,
            { id: string }
        >({
            query: ({ id }) => ({
                url: `replenishments/cancel/${id}`,
                method: "PUT"
            }),
            invalidatesTags: ["Deposit"]
        }),
        confirmReplenishmentById: builder.mutation<
            SuccessResponse,
            { id: string }
        >({
            query: ({ id }) => ({
                url: `replenishments/confirm/${id}`,
                method: "PUT"
            }),
            invalidatesTags: ["Deposit"]
        })
    })
});

export const {
    useGetAllDepositsQuery,
    useLazyGetAllDepositsQuery,
    useGetReplenishmentLimitsQuery,
    useLazyGetReplenishmentLimitsQuery,
    useGetReplenishmentByIdQuery,
    useLazyGetReplenishmentByIdQuery,
    useAddReplenishmentMutation,
    useCancelReplenishmentByIdMutation,
    useConfirmReplenishmentByIdMutation
} = replenishmentApi;
