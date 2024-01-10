import { createSlice, createSelector } from "@reduxjs/toolkit";
import { userApi } from "../api";
import { RootStore } from "../types";

interface Bet {
    betState: "init" | "bet" | "cash";
    betNumber: 1 | 2;
    balance: number;
    currency: string;
    tabsActive: boolean;
    currentBet: number;
}

type Game = [Bet, Bet];

const initialState = [
    {
        betState: "init",
        betNumber: 1,
        balance: 0,
        currency: "",
        tabsActive: true,
        currentBet: 1
    },
    {
        betState: "init",
        betNumber: 2,
        balance: 0,
        currency: "",
        tabsActive: true,
        currentBet: 1
    }
] as Game;

const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addMatcher(
            userApi.endpoints.getUserBalance.matchFulfilled,
            (state, { payload }) => {
                state[0].balance = payload.balance;
                state[0].currency = payload.currency;
                state[1].balance = payload.balance;
                state[1].currency = payload.currency;
            }
        );
    }
});

export const { reducer: gameSliceReducer, actions: gameSliceActions } =
    gameSlice;

const gameTab = (state: RootStore) => state.game;

export const selectCurrentGameTab = createSelector(
    [gameTab, (gameTab, betNumber: 1 | 2) => betNumber],
    (gameTab, betNumber) => {
        console.log(gameTab);

        return gameTab[betNumber - 1];
    }
);

export const selectAllTabs = createSelector([gameTab], gameTab => {
    console.log(gameTab);

    return gameTab;
});
