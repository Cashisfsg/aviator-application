import { userApi } from "@/store/api/userApi";
import { RequisitesResponse, RecommendedRequisitesResponse } from "./types";

export const requisiteApi = userApi.injectEndpoints({
    endpoints: builder => ({
        fetchRequisites: builder.query<RequisitesResponse, void>({
            query: () => ({
                url: "user/requisites"
            })
        }),
        fetchRecommendedRequisites: builder.query<
            RecommendedRequisitesResponse,
            void
        >({
            query: () => ({
                url: "user/requisites/recommended"
            })
        })
    })
});

export const {
    useFetchRequisitesQuery,
    useLazyFetchRequisitesQuery,
    useFetchRecommendedRequisitesQuery,
    useLazyFetchRecommendedRequisitesQuery
} = requisiteApi;
