import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
    AdminAuthorizationData,
    SuccessResponse,
    Token,
    Requisite,
    Replenishment
} from "./types";
import { RootStore } from "../types";

export const adminApi = createApi({
    reducerPath: "adminApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootStore).adminAuth.token;
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: builder => ({
        //! =================================================================
        getAdminRequisites: builder.query<Requisite[], void>({
            query: () => ({
                url: "admin/requisites"
            })
        }),
        getAllReplenishmentsListForAdmin: builder.query<Replenishment[], void>({
            query: () => ({
                url: "admin/replenishments"
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
    useGetAllReplenishmentsListForAdminQuery,
    useLazyGetAllReplenishmentsListForAdminQuery,
    useAdminLoginMutation,
    useAddAdminRequisiteMutation,
    useConfirmAdminReplenishmentByIdMutation
} = adminApi;
