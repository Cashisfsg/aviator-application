import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Requisite, PaymentDrawRequest } from "./types";
import { RootStore } from "..";

export interface Draw {
    _id: string;
    user: string;
    amount: number;
    currency: string;
    status: string;
    statusMessage: string;
    userRequisite: string;
    requisite: Requisite;
    createdAt: string;
    completedDate: string;
}

export const drawApi = createApi({
    reducerPath: "drawApi",
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

    tagTypes: ["Draw"],
    endpoints: builder => ({
        getAllDraws: builder.query<Draw[], void>({
            query: () => ({
                url: "withdrawals"
            }),

            providesTags: ["Draw"]
        }),
        createDraw: builder.mutation<Draw, PaymentDrawRequest>({
            query: body => ({
                url: "withdrawals",
                method: "POST",
                body
            }),
            invalidatesTags: ["Draw"]
        }),
        cancelDraw: builder.mutation<
            Draw,
            {
                id: string;
            }
        >({
            query: ({ id }) => ({
                url: `withdrawals/${id}/cancel`,
                method: "PUT"
            }),
            invalidatesTags: ["Draw"]
        })
    })
});

export const {
    useGetAllDrawsQuery,
    useLazyGetAllDrawsQuery,
    useCreateDrawMutation,
    useCancelDrawMutation
} = drawApi;
