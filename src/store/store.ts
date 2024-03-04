import { configureStore } from "@reduxjs/toolkit";
import {
    authApi,
    betApi,
    baseWithdrawApi,
    replenishmentApi,
    // socketApi,
    userApi
} from "./api";
import { authReducer, gameSliceReducer } from "./slices";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        game: gameSliceReducer,
        [authApi.reducerPath]: authApi.reducer,
        [betApi.reducerPath]: betApi.reducer,
        [baseWithdrawApi.reducerPath]: baseWithdrawApi.reducer,
        [replenishmentApi.reducerPath]: replenishmentApi.reducer,
        // [socketApi.reducerPath]: socketApi.reducer,
        [userApi.reducerPath]: userApi.reducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware()
            .concat(authApi.middleware)
            .concat(betApi.middleware)
            .concat(baseWithdrawApi.middleware)
            .concat(replenishmentApi.middleware)
            // .concat(socketApi.middleware)
            .concat(userApi.middleware)
});
