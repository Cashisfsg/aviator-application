import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Requisite, SuccessResponse } from "./types";
import { RootStore } from "..";

interface Currency {
    currency: string;
    amount: number;
    requisite: string;
}

interface Replenishment {
    user: string;
    amount: number;
    currency: string;
    deduction: number;
    status: string;
    statusMessage: string;
    isPayConfirmed: boolean;
    requisite: Requisite;
    createdAt: string;
    completedDate: string;
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
    endpoints: builder => ({
        //! =================================================================
        getAllDeposits: builder.query<Replenishment[], void>({
            query: () => ({
                url: "replenishments"
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
            })
        }),
        //! =================================================================
        cancelReplenishmentById: builder.mutation<
            SuccessResponse,
            { id: number }
        >({
            query: ({ id }) => ({
                url: `replenishments/cancel/${id}`,
                method: "PUT"
            })
        }),
        confirmReplenishmentById: builder.mutation<
            SuccessResponse,
            { id: number }
        >({
            query: ({ id }) => ({
                url: `replenishments/confirm/${id}`,
                method: "PUT"
            })
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
