import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Bet } from "../api/types";
import { RootStore } from "..";
// import { RootStore } from "..";

interface QueryParams {
    skip: number;
    limit: number;
}

interface BetState {
    bets: Bet[];
    queryParams: QueryParams;
    status: "init" | "pending" | "fulfilled" | "rejected";
    error: string | null;
    hasNextPage: boolean;
}

const SKIP = 0;
const LIMIT = 6;

const betSlice = createSlice({
    name: "bets",
    initialState: () =>
        ({
            bets: [],
            queryParams: { skip: SKIP, limit: LIMIT },
            status: "init",
            error: null,
            hasNextPage: true
        }) as BetState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(fetchUserBetsThunk.pending, state => {
                state.status = "pending";
                state.error = null;
            })
            .addCase(fetchUserBetsThunk.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.bets = state.bets.concat(action.payload);
                state.queryParams.skip += LIMIT;
                state.hasNextPage = action.payload.length === LIMIT;
            })
            .addCase(fetchUserBetsThunk.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.payload as string;
            })
});

export const fetchUserBetsThunk = createAsyncThunk(
    "bets/topBets",
    async (args, { rejectWithValue, getState }) => {
        const { skip, limit } = (getState() as RootStore).bets
            .queryParams as QueryParams;
        const token = (getState() as RootStore).auth.token as string;
        const searchParams = new URLSearchParams({
            skip: String(skip),
            limit: String(limit)
        });
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const url = new URL(`/bets/tops?${searchParams}`, baseUrl);

        try {
            const response = await fetch(url, {
                headers: {
                    Token: token,
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

export const { reducer: betSliceReducer, actions: betSliceActions } = betSlice;
