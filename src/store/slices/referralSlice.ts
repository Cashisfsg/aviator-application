import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { RootStore } from "../types";

interface QueryParams {
    skip: number;
    limit: number;
}

interface Referral {
    _id: string;
    date: string;
    totalEarned: number;
}

interface ReferralState {
    referrals: Referral[];
    queryParams: QueryParams;
    status: "init" | "pending" | "fulfilled" | "rejected";
    error: string | null;
    hasNextPage: boolean;
}

const SKIP = 0;
const LIMIT = 3;

const initialState = {
    referrals: [],
    queryParams: { skip: SKIP, limit: LIMIT },
    status: "init",
    error: null,
    hasNextPage: true
} as ReferralState;

const referralSlice = createSlice({
    name: "referrals",
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(fetchReferralByDays.pending, state => {
                state.status = "pending";
                state.error = null;
            })
            .addCase(fetchReferralByDays.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.referrals = state.referrals.concat(action.payload);
                state.queryParams.skip += LIMIT;
                state.hasNextPage = action.payload.length === LIMIT;
            })
            .addCase(fetchReferralByDays.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.payload as string;
            })
});

export const fetchReferralByDays = createAsyncThunk(
    "referrals/fetchReferralByDays",
    async (args, { rejectWithValue, getState }) => {
        const { skip, limit } = (getState() as RootStore).bets.top
            .queryParams as QueryParams;
        const token = (getState() as RootStore).auth.token as string;

        const searchParams = new URLSearchParams({
            skip: String(skip),
            limit: String(limit)
        });
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const url = new URL(`/user/referral/by-days?${searchParams}`, baseUrl);

        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.message || "Something went wrong");
            }

            return data;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const { reducer: referralReducer, actions: referralActions } =
    referralSlice;
