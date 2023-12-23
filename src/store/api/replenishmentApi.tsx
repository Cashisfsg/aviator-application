import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Requisite {
    _id: string;
    requisite: string;
    name: string;
    currency: string;
    img: string;
    commission: number;
    status: string;
}

interface SuccessResponse {
    message: string;
}

interface Currency {
    currency: string;
    amount: number;
    requisite: string;
}

interface Replenishment {
    user: string;
    amount: number;
    currency: string;
    deduction: number;
    status: string;
    statusMessage: string;
    isPayConfirmed: boolean;
    requisite: Requisite;
    createdAt: string;
    completedDate: string;
}

export const replenishmentApi = createApi({
    reducerPath: "replenishmentApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://raw.githubusercontent.com"
    }),
    endpoints: builder => ({
        //! =================================================================
        getAllReplenishments: builder.query<Replenishment[], void>({
            query: () => ({
                url: "replenishments"
            })
        }),
        getReplenishmentById: builder.query<Replenishment, { id: number }>({
            query: ({ id }) => ({
                url: `replenishments/${id}`
            })
        }),
        //! =================================================================
        addReplenishment: builder.mutation<Replenishment, Currency>({
            query: body => ({
                url: `replenishments`,
                method: "POST",
                body
            })
        }),
        //! =================================================================
        cancelReplenishmentById: builder.mutation<
            SuccessResponse,
            { id: number }
        >({
            query: ({ id }) => ({
                url: `replenishments/cancel/${id}`,
                method: "PUT"
            })
        }),
        confirmReplenishmentById: builder.mutation<
            SuccessResponse,
            { id: number }
        >({
            query: ({ id }) => ({
                url: `replenishments/confirm/${id}`,
                method: "PUT"
            })
        })
    })
});

export const {
    useGetAllReplenishmentsQuery,
    useLazyGetAllReplenishmentsQuery,
    useGetReplenishmentByIdQuery,
    useLazyGetReplenishmentByIdQuery,
    useAddReplenishmentMutation,
    useCancelReplenishmentByIdMutation,
    useConfirmReplenishmentByIdMutation
} = replenishmentApi;
