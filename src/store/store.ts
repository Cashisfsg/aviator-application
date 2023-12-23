import { configureStore } from "@reduxjs/toolkit";
import { adminApi, authApi, betApi, userApi, replenishmentApi } from "./api";
import { authReducer } from "./slices";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [adminApi.reducerPath]: adminApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [betApi.reducerPath]: betApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [replenishmentApi.reducerPath]: replenishmentApi.reducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware()
            .concat(adminApi.middleware)
            .concat(authApi.middleware)
            .concat(betApi.middleware)
            .concat(userApi.middleware)
            .concat(replenishmentApi.middleware)
});
