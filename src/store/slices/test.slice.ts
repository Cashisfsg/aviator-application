import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootStore } from "../types";

type AvailableState = "idle" | "loading" | "start" | "game" | "crash" | "end";

type Currency = "USD" | "RUB" | "KZT" | "UZS" | "USDT";

export type CurrencyRecordTest = Record<Currency, number>;

interface RoundStatistic {
    playersAmount: number;
    betAmount: CurrencyRecordTest;
    winAmount: CurrencyRecordTest;
}

export interface PlayerTest {
    playerLogin: string;
    bet: CurrencyRecordTest;
    currency: string;
    time: Date;
    coeff?: number;
    win?: CurrencyRecordTest;
    profileImage: string;
}

interface State {
    rate: number;
    lastRate: number;
    state: AvailableState;
    roundStats: RoundStatistic;
    playersList: PlayerTest[];
}

const initialState: State = {
    rate: 1,
    lastRate: 1,
    state: "idle",
    roundStats: {
        playersAmount: 0,
        betAmount: { USD: 0, UZS: 0, KZT: 0, RUB: 0, USDT: 0 },
        winAmount: { USD: 0, UZS: 0, KZT: 0, RUB: 0, USDT: 0 }
    },
    playersList: []
};

export interface BetTest {
    betNumber: 1 | 2;
    currency: Currency;
    bet: number;
    promoId?: string;
}

const testSlice = createSlice({
    name: "test",
    initialState,
    reducers: {
        setRate: (state, action: PayloadAction<number>) => {
            state.rate = action.payload;
        },
        setLastRate: (state, action: PayloadAction<number>) => {
            state.lastRate = action.payload;
        },
        toggleState: (state, action: PayloadAction<AvailableState>) => {
            state.state = action.payload;
        },
        abortBet: (state, action: PayloadAction<1 | 2>) => {},
        makeBet: (state, action: PayloadAction<BetTest>) => {},
        cashOut: (state, action: PayloadAction<1 | 2>) => {},
        updateRoundData: (
            state,
            action: PayloadAction<{
                betAmount: CurrencyRecordTest;
                winAmount: CurrencyRecordTest;
                currentPlayers: PlayerTest[];
            }>
        ) => {
            state.roundStats.playersAmount =
                action.payload.currentPlayers.length;
            state.roundStats.betAmount = action.payload.betAmount;
            state.roundStats.winAmount = action.payload.winAmount;
            state.playersList = action.payload.currentPlayers;
        }
    }
    // selectors: { selectRate: state => state.rate }
});

export const { actions: testSliceActions, reducer: testSliceReducer } =
    testSlice;

export const {
    setRate,
    setLastRate,
    toggleState,
    abortBet,
    makeBet,
    cashOut,
    updateRoundData
} = testSlice.actions;

// export const { selectRate } = testSlice.selectors;

const rate = (state: RootStore) => state.test.rate;

export const selectRate = createSelector([rate], rate => rate);

const betTab = (state: RootStore) => state.game;
export const selectRoundRate = createSelector(
    [betTab, rate, (betTab, betNumber: 1 | 2) => betNumber],
    (betTab, rate, betNumber) => {
        if (betTab.bets[betNumber - 1].betState === "cash") return rate;
        return 1;
    }
);

const lastRate = (state: RootStore) => state.test.lastRate;

export const selectLastRate = createSelector([lastRate], lastRate => {
    return lastRate;
});

const airplaneState = (state: RootStore) => state.test.state;

export const selectAirplaneState = createSelector(
    [airplaneState],
    airplaneState => airplaneState
);

const roundStatistic = (state: RootStore) => state.test.roundStats;

export const selectRoundStatistic = createSelector(
    [roundStatistic],
    roundStatistic => roundStatistic
);

const playersList = (state: RootStore) => state.test.playersList;

export const selectPlayersList = createSelector(
    [playersList],
    playersList => playersList
);
