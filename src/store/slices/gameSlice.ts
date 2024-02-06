import { RefObject } from "react";
import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import { userApi } from "../api";
import { authSlice } from "../slices";
import { RootStore } from "../types";

type BetState = "init" | "start" | "bet" | "cash";

interface Bet {
    betState: BetState;
    betNumber: 1 | 2;
    balance: number;
    currency: string;
    autoModeOn: boolean;
    currentBet: number;
    min: number;
    max: number;
}

interface ActiveBonus {
    bonusId: string;
    bonusActive: true;
    bonusQuantity: number;
    bonusCoefficient: number;
}

interface UnActiveBonus {
    bonusId: null;
    bonusActive: false;
    bonusQuantity: null;
    bonusCoefficient: null;
}

interface Player {
    playerLogin: string;
    bet: number;
    currency: string;
    time: Date;
    coeff?: number;
    win?: number;
}

export interface GameDetails {
    betAmount: number;
    winAmount: number;
    currentPlayers: Player[];
}

interface Settings {
    animationEnabled: boolean;
    musicEnabled: boolean;
    soundEnabled: boolean;
}

type Bonus = ActiveBonus | UnActiveBonus;

type Game = {
    bets: [Bet, Bet];
    bonus: Bonus;
    gameDetails: GameDetails;
    settings: Settings;
};

const initialState = {
    bets: [
        {
            betState: "init",
            betNumber: 1,
            balance: 300,
            currency: "USD",
            autoModeOn: false,
            currentBet: 1,
            min: 1,
            max: 100
        },
        {
            betState: "init",
            betNumber: 2,
            balance: 300,
            currency: "USD",
            autoModeOn: false,
            currentBet: 1,
            min: 1,
            max: 100
        }
    ],
    bonus: {
        bonusId: null,
        bonusQuantity: null,
        bonusActive: false,
        bonusCoefficient: null
    },
    gameDetails: {
        betAmount: 0,
        winAmount: 0,
        currentPlayers: []
    },
    settings: {
        animationEnabled: true,
        soundEnabled: false,
        musicEnabled: false
    }
} as Game;

const gameSlice = createSlice({
    name: "game",
    initialState: () => {
        const storedData = sessionStorage.getItem("settings");

        if (!storedData) return initialState;

        const settings = JSON.parse(storedData);

        return { ...initialState, settings };
    },
    reducers: {
        setBetState: (
            state,
            action: PayloadAction<{ betNumber: 1 | 2; betState: BetState }>
        ) => {
            state.bets[action.payload.betNumber - 1].betState =
                action.payload.betState;
        },
        toggleAutoMode: (
            state,
            action: PayloadAction<{ betNumber: 1 | 2 }>
        ) => {
            state.bets[action.payload.betNumber - 1].autoModeOn =
                !state.bets[action.payload.betNumber - 1].autoModeOn;
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
                    state.bets[action.payload.betNumber - 1].currentBet =
                        action.payload.value;
                    break;

                case "increment":
                    if (
                        state.bets[action.payload.betNumber - 1].currentBet +
                            action.payload.value >
                            Math.min(
                                state.bets[action.payload.betNumber - 1].max,
                                state.bets[action.payload.betNumber - 1].balance
                            ) ||
                        // state.bets[action.payload.betNumber - 1].currentBet +
                        //     action.payload.value >
                        //     state.bets[action.payload.betNumber - 1].balance ||
                        !action.payload.inputRef.current
                    )
                        return state;

                    state.bets[action.payload.betNumber - 1].currentBet +=
                        Number(action.payload.value.toFixed(2));
                    action.payload.inputRef.current.value =
                        state.bets[
                            action.payload.betNumber - 1
                        ].currentBet.toFixed(2);

                    break;

                case "decrement":
                    if (
                        state.bets[action.payload.betNumber - 1].currentBet -
                            action.payload.value <
                            state.bets[action.payload.betNumber - 1].min ||
                        !action.payload.inputRef.current
                    )
                        return state;

                    state.bets[action.payload.betNumber - 1].currentBet -=
                        Number(action.payload.value.toFixed(2));
                    action.payload.inputRef.current.value =
                        state.bets[
                            action.payload.betNumber - 1
                        ].currentBet.toFixed(2);

                    break;

                default:
                    return state;
            }
        },
        activateBonus: (
            state,
            action: PayloadAction<{
                bonusId: string;
                bonusQuantity: number;
                bonusCoefficient: number;
            }>
        ) => {
            state.bonus.bonusActive = true;
            state.bonus.bonusId = action.payload.bonusId;
            state.bonus.bonusQuantity = Number(action.payload.bonusQuantity);
            state.bonus.bonusCoefficient = Number(
                action.payload.bonusCoefficient
            );
        },
        deactivateBonus: state => {
            state.bonus.bonusActive = false;
            state.bonus.bonusId = null;
            state.bonus.bonusQuantity = null;
            state.bonus.bonusCoefficient = null;
        },
        setGameDetails: (state, action: PayloadAction<GameDetails>) => {
            state.gameDetails.betAmount = action.payload.betAmount;
            state.gameDetails.winAmount = action.payload.winAmount;
            state.gameDetails.currentPlayers = action.payload.currentPlayers;
        },
        resetGameDetails: state => {
            state.gameDetails = initialState.gameDetails;
        },
        toggleAnimation: state => {
            state.settings.animationEnabled = !state.settings.animationEnabled;
            sessionStorage.setItem("settings", JSON.stringify(state.settings));
        },
        toggleSound: state => {
            state.settings.soundEnabled = !state.settings.soundEnabled;
            sessionStorage.setItem("settings", JSON.stringify(state.settings));
        },
        toggleMusic: state => {
            state.settings.musicEnabled = !state.settings.musicEnabled;
            sessionStorage.setItem("settings", JSON.stringify(state.settings));
        }
    },
    extraReducers: builder => {
        builder
            .addCase(authSlice.actions.logout, () => {
                return initialState;
            })
            .addMatcher(
                userApi.endpoints.getUserBalance.matchFulfilled,
                (state, { payload }) => {
                    state.bets[0].balance = payload.balance;
                    state.bets[0].currency = payload.currency;
                    state.bets[1].balance = payload.balance;
                    state.bets[1].currency = payload.currency;
                }
            )
            .addMatcher(
                userApi.endpoints.getGameLimits.matchFulfilled,
                (state, { payload }) => {
                    state.bets[0].currentBet = Math.ceil(payload.min);
                    state.bets[1].currentBet = Math.ceil(payload.min);
                    state.bets[0].min = Math.ceil(payload.min);
                    state.bets[0].max = Math.floor(payload.max);
                    state.bets[1].min = Math.ceil(payload.min);
                    state.bets[1].max = Math.floor(payload.max);
                }
            );
    }
});

export const { reducer: gameSliceReducer, actions: gameSliceActions } =
    gameSlice;

export const {
    setBetState,
    setCurrentBet,
    setGameDetails,
    resetGameDetails,
    toggleAutoMode,
    activateBonus,
    deactivateBonus,
    toggleAnimation,
    toggleMusic,
    toggleSound
} = gameSlice.actions;

const gameTab = (state: RootStore) => state.game;

export const selectCurrentGameTab = createSelector(
    [gameTab, (gameTab, betNumber: 1 | 2) => betNumber],
    (gameTab, betNumber) => {
        return gameTab.bets[betNumber - 1];
    }
);

const bonusId = (state: RootStore) => state.game.bonus.bonusId;
const bonusActive = (state: RootStore) => state.game.bonus.bonusActive;
const bonusQuantity = (state: RootStore) => state.game.bonus.bonusQuantity;
const bonusCoefficient = (state: RootStore) =>
    state.game.bonus.bonusCoefficient;

export const selectBonus = createSelector(
    [bonusId, bonusActive, bonusQuantity, bonusCoefficient],
    (bonusId, bonusActive, bonusQuantity, bonusCoefficient) => ({
        bonusId,
        bonusActive,
        bonusQuantity,
        bonusCoefficient
    })
);

const betAmount = (state: RootStore) => state.game.gameDetails.betAmount;
const winAmount = (state: RootStore) => state.game.gameDetails.winAmount;
const currentPlayers = (state: RootStore) =>
    state.game.gameDetails.currentPlayers;

export const selectGameDetails = createSelector(
    [betAmount, winAmount, currentPlayers],
    (betAmount, winAmount, currentPlayers) => ({
        betAmount,
        winAmount,
        currentPlayers
    })
);

const animationEnabled = (state: RootStore) =>
    state.game.settings.animationEnabled;
const musicEnabled = (state: RootStore) => state.game.settings.musicEnabled;
const soundEnabled = (state: RootStore) => state.game.settings.soundEnabled;

export const selectSettings = createSelector(
    [animationEnabled, musicEnabled, soundEnabled],
    (animationEnabled, musicEnabled, soundEnabled) => ({
        animationEnabled,
        musicEnabled,
        soundEnabled
    })
);
