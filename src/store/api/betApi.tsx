import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Bet, PaginationParams } from "./types";
import { RootStore } from "../types";

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
        getTopBets: builder.query({
            query: (args: PaginationParams | void) => ({
                url: "bets/tops",
                params: args
                    ? { limit: args.limit, skip: args.skip }
                    : undefined
            }),
            transformResponse: (response: Bet[]) => {
                return { data: response, hasNextPage: true } as const;
            },
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName;
            },
            forceRefetch: ({ currentArg, previousArg, endpointState }) => {
                console.log("Is has next page", endpointState?.data);

                return (
                    endpointState?.data?.hasNextPage &&
                    currentArg?.skip !== previousArg?.skip
                );
            },
            merge: (currentCacheData, responseData, { arg }) => {
                currentCacheData.data.push(...responseData.data);
                currentCacheData.hasNextPage =
                    responseData.data.length === (arg?.limit ?? 0);
            }
            // merge: (currentCacheData, responseData) => {
            //     topBetsAdapter.addMany(
            //         currentCacheData,
            //         topBetsSelector.selectAll(responseData)
            //     );
            // }
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
