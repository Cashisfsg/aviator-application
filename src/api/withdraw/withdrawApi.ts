import { userApi } from "@/store/api/userApi";
import { baseWithdrawApi } from "@/store/api/withdrawal";
import {
    FetchAllWithdrawsResponse,
    CreateWithdrawRequest,
    CreateWithdrawResponse,
    CancelWithdrawByIdRequest,
    CancelWithdrawByIdResponse
} from "./types";

export const withdrawApi = baseWithdrawApi.injectEndpoints({
    endpoints: builder => ({
        fetchAllWithdraws: builder.query<FetchAllWithdrawsResponse[], void>({
            query: () => ({
                url: "withdrawals"
            }),
            transformResponse: (response: FetchAllWithdrawsResponse[]) => {
                return response.reverse();
            },
            providesTags: ["Withdraw"]
        }),
        createWithdraw: builder.mutation<
            CreateWithdrawResponse,
            CreateWithdrawRequest
        >({
            query: body => ({
                url: "withdrawals",
                method: "POST",
                body
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;

                    dispatch(userApi.util.invalidateTags(["Balance"]));
                } catch {}
            },
            invalidatesTags: (result, error) => (error ? [] : ["Withdraw"])
        }),
        cancelWithdrawById: builder.mutation<
            CancelWithdrawByIdResponse,
            CancelWithdrawByIdRequest
        >({
            query: ({ id }) => ({
                url: `withdrawals/${id}/cancel`,
                method: "PUT"
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;

                    dispatch(userApi.util.invalidateTags(["Balance"]));
                } catch {}
            },
            invalidatesTags: (result, error) => (error ? [] : ["Withdraw"])
        })
    })
});

export const {
    useFetchAllWithdrawsQuery,
    useLazyFetchAllWithdrawsQuery,
    useCreateWithdrawMutation,
    useCancelWithdrawByIdMutation
} = withdrawApi;
