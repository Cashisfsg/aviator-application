import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Bet, PaginationParams } from "./types";
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
    tagTypes: ["My", "Top"],
    endpoints: builder => ({
        getTopBets: builder.query<Bet[], PaginationParams | void>({
            query: args => ({
                url: "bets/tops",
                params: args
                    ? { limit: args.limit, skip: args.skip }
                    : undefined
            })
        }),
        getUserBets: builder.query<Bet[], PaginationParams | void>({
            query: args => ({
                url: "bets/my",
                params: args
                    ? { limit: args.limit, skip: args.skip }
                    : undefined
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
