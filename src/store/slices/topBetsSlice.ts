import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Bet } from "../api/types";
import { RootStore } from "../types";
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

const initialState = {
    bets: [],
    queryParams: { skip: SKIP, limit: LIMIT },
    status: "init",
    error: null,
    hasNextPage: true
} as BetState;

const betSlice = createSlice({
    name: "bets/top",
    initialState: () => initialState as BetState,
    reducers: {
        resetTopBetsState: state => {
            return { ...state, ...initialState };
        }
    },
    extraReducers: builder =>
        builder
            .addCase(fetchTopBetsThunk.pending, state => {
                state.status = "pending";
                state.error = null;
            })
            .addCase(fetchTopBetsThunk.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.bets = state.bets.concat(action.payload);
                state.queryParams.skip += LIMIT;
                state.hasNextPage = action.payload.length === LIMIT;
            })
            .addCase(fetchTopBetsThunk.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.payload as string;
            })
});

export const fetchTopBetsThunk = createAsyncThunk(
    "bets/top/fetchTopBets",
    async (args, { rejectWithValue, getState }) => {
        const { skip, limit } = (getState() as RootStore).bets.top
            .queryParams as QueryParams;
        const searchParams = new URLSearchParams({
            skip: String(skip),
            limit: String(limit)
        });
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const url = new URL(`/bets/tops?${searchParams}`, baseUrl);

        try {
            const response = await fetch(url, {
                headers: {
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

export const { reducer: topBetsSliceReducer, actions: topBetsSliceActions } =
    betSlice;

export const { resetTopBetsState } = betSlice.actions;
