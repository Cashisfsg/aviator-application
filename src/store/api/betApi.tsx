import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Bet, BetRequestQueryParams } from "./types";
import { RootStore } from "..";

export const betApi = createApi({
    reducerPath: "betApi",
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
        getTopBets: builder.query<Bet[], BetRequestQueryParams>({
            query: ({ skip = 0, limit = 6 }) => ({
                url: "bets/tops",
                params: { skip, limit }
            })
        }),
        getUserBets: builder.query<Bet[], BetRequestQueryParams>({
            query: ({ skip = 0, limit = 6 }) => ({
                url: "bets/my",
                params: { skip, limit }
            })
        })
    })
});

export const {
    useGetTopBetsQuery,
    useLazyGetTopBetsQuery,
    useGetUserBetsQuery,
    useLazyGetUserBetsQuery
} = betApi;
