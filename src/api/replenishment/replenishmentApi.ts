import { baseReplenishmentApi } from "@/store/api/replenishmentApi";
import {
    AllReplenishmentsResponse,
    FetchReplenishmentByIdRequest,
    FetchReplenishmentByIdResponse,
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
            providesTags: (result, error, arg) =>
                result
                    ? [
                          ...result.map(({ _id }) => ({
                              type: "Replenishment" as const,
                              id: _id
                          })),
                          "Replenishment"
                      ]
                    : ["Replenishment"]
        }),
        fetchReplenishmentById: builder.query<
            FetchReplenishmentByIdResponse,
            FetchReplenishmentByIdRequest
        >({
            query: ({ id }) => ({ url: `/replenishments/${id}` }),
            providesTags: result => [
                {
                    type: "Replenishment" as const,
                    id: result?._id
                }
            ]
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
                url: "/replenishments",
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
            invalidatesTags: (result, error, arg) =>
                error ? [] : [{ type: "Replenishment", id: arg.id }]
        }),
        confirmReplenishmentById: builder.mutation<
            SuccessResponse,
            ConfirmReplenishmentRequest
        >({
            query: ({ id }) => ({
                url: `replenishments/confirm/${id}`,
                method: "PUT"
            }),
            invalidatesTags: (result, error, arg) =>
                error ? [] : [{ type: "Replenishment", id: arg.id }]
        })
    })
});

export const {
    useFetchAllReplenishmentsQuery,
    useLazyFetchAllReplenishmentsQuery,
    useFetchReplenishmentByIdQuery,
    useLazyFetchReplenishmentByIdQuery,
    useFetchReplenishmentLimitsQuery,
    useLazyFetchReplenishmentLimitsQuery,
    useCreateReplenishmentMutation,
    useCancelReplenishmentByIdMutation,
    useConfirmReplenishmentByIdMutation
} = replenishmentApi;
