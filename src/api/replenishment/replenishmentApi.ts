import { baseReplenishmentApi } from "@/store/api/replenishmentApi";
import {
    AllReplenishmentsResponse,
    ReplenishmentLimitsResponse,
    CreateReplenishmentRequest,
    CreateReplenishmentResponse,
    SuccessResponse,
    CancelReplenishmentRequest,
    ConfirmReplenishmentRequest
} from "./types";

export const replenishmentApi = baseReplenishmentApi.injectEndpoints({
    endpoints: builder => ({
        fetchAllReplenishments: builder.query<AllReplenishmentsResponse, void>({
            query: () => ({
                url: "replenishments"
            }),
            transformResponse: (response: AllReplenishmentsResponse) => {
                if (Array.isArray(response)) {
                    return response.reverse();
                }
                return response;
            },
            providesTags: ["Replenishment"]
        }),
        fetchReplenishmentLimits: builder.query<
            ReplenishmentLimitsResponse,
            void
        >({
            query: () => ({
                url: "/replenishments/limits"
            })
        }),
        createReplenishment: builder.mutation<
            CreateReplenishmentResponse,
            CreateReplenishmentRequest
        >({
            query: body => ({
                url: `replenishments`,
                method: "POST",
                body
            }),
            invalidatesTags: (result, error) => (error ? [] : ["Replenishment"])
        }),
        cancelReplenishmentById: builder.mutation<
            SuccessResponse,
            CancelReplenishmentRequest
        >({
            query: ({ id }) => ({
                url: `replenishments/cancel/${id}`,
                method: "PUT"
            }),
            invalidatesTags: (result, error) => (error ? [] : ["Replenishment"])
        }),
        confirmReplenishmentById: builder.mutation<
            SuccessResponse,
            ConfirmReplenishmentRequest
        >({
            query: ({ id }) => ({
                url: `replenishments/confirm/${id}`,
                method: "PUT"
            }),
            invalidatesTags: (result, error) => (error ? [] : ["Replenishment"])
        })
    })
});

export const {
    useFetchAllReplenishmentsQuery,
    useLazyFetchAllReplenishmentsQuery,
    useFetchReplenishmentLimitsQuery,
    useLazyFetchReplenishmentLimitsQuery,
    useCreateReplenishmentMutation,
    useCancelReplenishmentByIdMutation,
    useConfirmReplenishmentByIdMutation
} = replenishmentApi;
