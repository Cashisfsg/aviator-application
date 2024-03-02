import { toast } from "sonner";

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
            invalidatesTags: ["Withdraw"]
        }),
        cancelWithdrawById: builder.mutation<
            CancelWithdrawByIdResponse,
            CancelWithdrawByIdRequest
        >({
            query: ({ id }) => ({
                url: `withdrawals/${id}/cancel`,
                method: "PUT"
            }),
            invalidatesTags: ["Withdraw"],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    toast(data?.message, {
                        position: "top-center",
                        action: {
                            label: "Скрыть",
                            onClick: () => {}
                        }
                    });

                    dispatch(userApi.util.invalidateTags(["Balance"]));
                } catch (error) {
                    toast(error?.data?.message, {
                        position: "top-center",
                        action: {
                            label: "Скрыть",
                            onClick: () => {}
                        }
                    });
                }
            }
        })
    })
});

export const {
    useFetchAllWithdrawsQuery,
    useLazyFetchAllWithdrawsQuery,
    useCreateWithdrawMutation,
    useCancelWithdrawByIdMutation
} = withdrawApi;
