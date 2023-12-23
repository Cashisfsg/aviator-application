import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
    AdminAuthorizationData,
    SuccessResponse,
    Token,
    Requisite,
    Replenishment
} from "./types";

export const adminApi = createApi({
    reducerPath: "adminApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://raw.githubusercontent.com"
    }),
    endpoints: builder => ({
        //! =================================================================
        getAdminRequisites: builder.query<Requisite[], void>({
            query: () => ({
                url: "admin/requisites"
            })
        }),
        getAdminReplenishments: builder.query<Replenishment[], void>({
            query: () => ({
                url: "admin/requisites"
            })
        }),
        //! =================================================================
        adminLogin: builder.mutation<Token, AdminAuthorizationData>({
            query: body => ({
                url: "admin/login",
                method: "POST",
                body
            })
        }),
        addAdminRequisite: builder.mutation<Requisite, { requisite: string }>({
            query: body => ({
                url: "admin/requisites",
                method: "POST",
                body
            })
        }),
        //! =================================================================
        confirmAdminReplenishmentById: builder.mutation<
            SuccessResponse,
            { id: number }
        >({
            query: ({ id }) => ({
                url: `admin/replenishments/${id}`,
                method: "PUT"
            })
        })
    })
});

export const {
    useGetAdminRequisitesQuery,
    useLazyGetAdminRequisitesQuery,
    useAdminLoginMutation,
    useAddAdminRequisiteMutation,
    useConfirmAdminReplenishmentByIdMutation
} = adminApi;
