import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SuccessResponse, Replenishment } from "./types";
import { RootStore } from "..";

interface Currency {
    currency: string;
    amount: number;
    requisite: string;
}

export const replenishmentApi = createApi({
    reducerPath: "replenishmentApi",
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
    useGetReplenishmentByIdQuery,
    useLazyGetReplenishmentByIdQuery,
    useAddReplenishmentMutation,
    useCancelReplenishmentByIdMutation,
    useConfirmReplenishmentByIdMutation
} = replenishmentApi;
