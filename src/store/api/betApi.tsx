import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { EntityState, createEntityAdapter } from "@reduxjs/toolkit";
import { Bet, PaginationParams } from "./types";
import { RootStore } from "../types";

export const topBetsEntityAdapter = createEntityAdapter({
    selectId: (bet: Bet) => bet._id
    // sortComparer: (a, b) => {
    //     if (a.bet < b.bet) {
    //         return 1;
    //     }
    //     if (a.bet > b.bet) {
    //         return -1;
    //     }
    //     return 0;
    // }
});

export const userBetsEntityAdapter = createEntityAdapter({
    selectId: (bet: Bet) => bet._id
});

export const topBetsEntitySelector = topBetsEntityAdapter.getSelectors();

export const userBetsEntitySelector = userBetsEntityAdapter.getSelectors();

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
            // { data: Bet[]; hasNextPage: boolean },
            EntityState<Bet, string>,
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
            // query: (args: PaginationParams | void) => ({
            //     url: "bets/tops",
            //     params: args
            //         ? { limit: args.limit, skip: args.skip }
            //         : undefined
            // }),
            // transformResponse: (response: Bet[]) => {
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
            // },
            // merge: (currentCacheData, responseData) => {
            //     topBetsAdapter.addMany(
            //         currentCacheData,
            //         topBetsSelector.selectAll(responseData)
            //     );
            // }
            // keepUnusedDataFor: 0,

            query: (args: PaginationParams | void) => ({
                url: "bets/tops",
                params: args
                    ? { limit: args.limit, skip: args.skip }
                    : undefined
            }),
            transformResponse: (response: Bet[]) => {
                return topBetsEntityAdapter.addMany(
                    topBetsEntityAdapter.getInitialState(),
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
                // topBetsEntitySelector.selectAll(responseData).length ===
                // (arg?.limit ?? 0);
                topBetsEntityAdapter.addMany(
                    currentCacheData,
                    topBetsEntitySelector.selectAll(responseData)
                );
            },
            providesTags: ["Top"]
        }),
        getUserBets: builder.query<
            EntityState<Bet, string>,
            PaginationParams | void
        >({
            query: args => ({
                url: "bets/my",
                params: args
                    ? { limit: args.limit, skip: args.skip }
                    : undefined
            }),
            // transformResponse: (response: Bet[]) => {
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
            // },
            transformResponse: (response: Bet[]) => {
                return userBetsEntityAdapter.addMany(
                    userBetsEntityAdapter.getInitialState(),
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
                userBetsEntityAdapter.addMany(
                    currentCacheData,
                    userBetsEntitySelector.selectAll(responseData)
                );
            },
            providesTags: ["My"]
            // providesTags: (result, error, arg) => {
            //     console.log(result);

            //     return result
            //         ? [
            //               ...result.ids.map(() => ({
            //                   type: "My" as const,
            //                   page: arg?.skip / arg?.limit
            //               })),
            //               "My"
            //           ]
            //         : ["My"];
            // }
        })
    })
});

export const {
    useGetTopBetsQuery,
    useLazyGetTopBetsQuery,
    useGetUserBetsQuery,
    useLazyGetUserBetsQuery
} = betApi;
