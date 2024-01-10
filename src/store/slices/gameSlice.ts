import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import { userApi } from "../api";
import { RootStore } from "../types";

type BetState = "init" | "bet" | "cash";

interface Bet {
    betState: BetState;
    betNumber: 1 | 2;
    balance: number;
    currency: string;
    autoModeOn: boolean;
    currentBet: number;
}

type Game = [Bet, Bet];

const MIN_BET = 0.1;

const initialState = [
    {
        betState: "init",
        betNumber: 1,
        balance: 300,
        currency: "",
        autoModeOn: false,
        currentBet: 1
    },
    {
        betState: "init",
        betNumber: 2,
        balance: 300,
        currency: "",
        autoModeOn: false,
        currentBet: 1
    }
] as Game;

const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        setBetState: (
            state,
            action: PayloadAction<{ betNumber: 1 | 2; betState: BetState }>
        ) => {
            state[action.payload.betNumber - 1].betState =
                action.payload.betState;
        },
        toggleAutoMode: (
            state,
            action: PayloadAction<{ betNumber: 1 | 2 }>
        ) => {
            state[action.payload.betNumber - 1].autoModeOn =
                !state[action.payload.betNumber - 1].autoModeOn;
        },
        setCurrentBet: (
            state,
            action: PayloadAction<{
                type: "input" | "increment" | "decrement";
                betNumber: 1 | 2;
                value: number;
            }>
        ) => {
            switch (action.payload.type) {
                case "input":
                    state[action.payload.betNumber - 1].currentBet =
                        action.payload.value;
                    break;

                case "increment":
                    if (
                        state[action.payload.betNumber - 1].currentBet +
                            action.payload.value >
                        state[action.payload.betNumber - 1].balance
                    )
                        return state;

                    state[action.payload.betNumber - 1].currentBet += Number(
                        action.payload.value.toFixed(2)
                    );
                    break;

                case "decrement":
                    if (
                        state[action.payload.betNumber - 1].currentBet -
                            action.payload.value <
                        MIN_BET
                    )
                        return state;

                    state[action.payload.betNumber - 1].currentBet -= Number(
                        action.payload.value.toFixed(2)
                    );
                    break;

                default:
                    return state;
            }
        }
    },
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

export const { setBetState, setCurrentBet, toggleAutoMode } = gameSlice.actions;

const gameTab = (state: RootStore) => state.game;

export const selectCurrentGameTab = createSelector(
    [gameTab, (gameTab, betNumber: 1 | 2) => betNumber],
    (gameTab, betNumber) => {
        console.log(gameTab);

        return gameTab[betNumber - 1];
    }
);
