import { RefObject } from "react";
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

interface Bonus {
    bonusId: string | null;
    bonusActive: boolean;
    bonusQuantity: number | null;
}

type Game = [Bet & Bonus, Bet];

const MIN_BET = 0.1;

const initialState = [
    {
        betState: "init",
        betNumber: 1,
        balance: 300,
        currency: "USD",
        autoModeOn: false,
        currentBet: 1,
        bonusId: null,
        bonusQuantity: null,
        bonusActive: false
    },
    {
        betState: "init",
        betNumber: 2,
        balance: 300,
        currency: "USD",
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
            action: PayloadAction<
                | {
                      type: "input";
                      betNumber: 1 | 2;
                      value: number;
                      inputRef?: never;
                  }
                | {
                      type: "increment" | "decrement";
                      betNumber: 1 | 2;
                      value: number;
                      inputRef: RefObject<HTMLInputElement>;
                  }
            >
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
                            state[action.payload.betNumber - 1].balance ||
                        !action.payload.inputRef.current
                    )
                        return state;

                    state[action.payload.betNumber - 1].currentBet += Number(
                        action.payload.value.toFixed(2)
                    );
                    action.payload.inputRef.current.value =
                        state[action.payload.betNumber - 1].currentBet.toFixed(
                            2
                        );

                    break;

                case "decrement":
                    if (
                        state[action.payload.betNumber - 1].currentBet -
                            action.payload.value <
                            MIN_BET ||
                        !action.payload.inputRef.current
                    )
                        return state;

                    state[action.payload.betNumber - 1].currentBet -= Number(
                        action.payload.value.toFixed(2)
                    );
                    action.payload.inputRef.current.value =
                        state[action.payload.betNumber - 1].currentBet.toFixed(
                            2
                        );

                    break;

                default:
                    return state;
            }
        },
        activateBonus: (
            state,
            action: PayloadAction<{ bonusId: string; bonusQuantity: number }>
        ) => {
            state[0].bonusActive = true;
            state[0].bonusId = action.payload.bonusId;
            state[0].bonusQuantity = action.payload.bonusQuantity;
        },
        deactivateBonus: state => {
            state[0].bonusActive = false;
            state[0].bonusId = null;
            state[0].bonusQuantity = null;
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

export const {
    setBetState,
    setCurrentBet,
    toggleAutoMode,
    activateBonus,
    deactivateBonus
} = gameSlice.actions;

const gameTab = (state: RootStore) => state.game;

export const selectCurrentGameTab = createSelector(
    [gameTab, (gameTab, betNumber: 1 | 2) => betNumber],
    (gameTab, betNumber) => {
        return gameTab[betNumber - 1];
    }
);

const bonusId = (state: RootStore) => state.game[0].bonusId;
const bonusActive = (state: RootStore) => state.game[0].bonusActive;
const bonusQuantity = (state: RootStore) => state.game[0].bonusQuantity;

export const selectBonus = createSelector(
    [bonusId, bonusActive, bonusQuantity],
    (bonusId, bonusActive, bonusQuantity) => ({
        bonusId,
        bonusActive,
        bonusQuantity
    })
);
