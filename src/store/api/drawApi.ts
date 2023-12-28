import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Requisite } from "./types";
import { RootStore } from "..";

interface Draw {
    user: string;
    amount: number;
    currency: string;
    status: string;
    statusMessage: string;
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
    endpoints: builder => ({
        getAllDraws: builder.query<Draw[], void>({
            query: () => ({
                url: "withdrawals"
            })
        }),
        createDraw: builder.mutation<
            Draw,
            {
                currency: string;
                amount: number;
                requisite: string;
            }
        >({
            query: body => ({
                url: "withdrawals",
                method: "POST",
                body
            })
        }),
        cancelDraw: builder.mutation<
            Draw,
            {
                id: number;
            }
        >({
            query: ({ id }) => ({
                url: `withdrawals/${id}/cancel`,
                method: "PUT"
            })
        })
    })
});

export const {
    useGetAllDrawsQuery,
    useLazyGetAllDrawsQuery,
    useCreateDrawMutation
} = drawApi;
