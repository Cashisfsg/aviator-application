import { combineReducers } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import {
    // adminApi,
    authApi,
    betApi,
    drawApi,
    replenishmentApi,
    // socketApi,
    userApi
} from "./api";
import {
    authReducer,
    userBetsSliceReducer,
    topBetsSliceReducer,
    referralReducer,
    gameSliceReducer
} from "./slices";

const betReducer = combineReducers({
    my: userBetsSliceReducer,
    top: topBetsSliceReducer
});

export const store = configureStore({
    reducer: {
        auth: authReducer,
        bets: betReducer,
        game: gameSliceReducer,
        referral: referralReducer,
        // [adminApi.reducerPath]: adminApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [betApi.reducerPath]: betApi.reducer,
        [drawApi.reducerPath]: drawApi.reducer,
        [replenishmentApi.reducerPath]: replenishmentApi.reducer,
        // [socketApi.reducerPath]: socketApi.reducer,
        [userApi.reducerPath]: userApi.reducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware()
            // .concat(adminApi.middleware)
            .concat(authApi.middleware)
            .concat(betApi.middleware)
            .concat(drawApi.middleware)
            .concat(replenishmentApi.middleware)
            // .concat(socketApi.middleware)
            .concat(userApi.middleware)
});
