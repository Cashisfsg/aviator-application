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
        getTopBets: builder.query<
            { data: Bet[]; hasNextPage: boolean },
            PaginationParams | undefined
        >({
            // queryFn: async (arg, queryApi, extraOptions, baseQuery) => {
            //     const response = await baseQuery(
            //         `bets/tops?skip=${arg?.skip}&limit=${arg?.limit}`
            //     );

            //     if (response.error)
            //         return { error: response.error as FetchBaseQueryError };

            //     const data = response as Bet[];

            //     const hasNextPage = data.length === (arg?.limit ?? 0);

            //     return { data: data, hasNextPage: hasNextPage };
            // },
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
                return (
                    endpointState?.data?.hasNextPage &&
                    currentArg?.skip !== previousArg?.skip
                );
            },
            merge: (currentCacheData, responseData, { arg }) => {
                currentCacheData.data.push(...responseData.data);
                currentCacheData.hasNextPage =
                    responseData.data.length === (arg?.limit ?? 0);
            },
            // merge: (currentCacheData, responseData) => {
            //     topBetsAdapter.addMany(
            //         currentCacheData,
            //         topBetsSelector.selectAll(responseData)
            //     );
            // }
            // keepUnusedDataFor: 0,

            providesTags: ["Top"]
        }),
        getUserBets: builder.query<
            { data: Bet[]; hasNextPage: boolean },
            PaginationParams | void
        >({
            query: args => ({
                url: "bets/my",
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
                return (
                    endpointState?.data?.hasNextPage &&
                    currentArg?.skip !== previousArg?.skip
                );
            },
            merge: (currentCacheData, responseData, { arg }) => {
                currentCacheData.data.push(...responseData.data);
                currentCacheData.hasNextPage =
                    responseData.data.length === (arg?.limit ?? 0);
            },
            providesTags: ["My"]
        })
    })
});

export const {
    useGetTopBetsQuery,
    useLazyGetTopBetsQuery,
    useGetUserBetsQuery,
    useLazyGetUserBetsQuery
} = betApi;
