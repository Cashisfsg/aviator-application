import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootStore } from "../types";

export type StatusFiltersValues =
    | ""
    | "Ожидает оплаты"
    | "Успешно завершена"
    | "Отменена";

type Filters = [
    {
        id: "status";
        value: StatusFiltersValues;
    }
];

const initialState: Filters = [
    {
        id: "status",
        value: ""
    }
];

const adminSlice = createSlice({
    name: "adminSlice",
    initialState,
    reducers: {
        filterByStatus: (state, action: PayloadAction<StatusFiltersValues>) => {
            state[0].value = action.payload;
        }
    }
});

export const { reducer: adminSliceReducer, actions: adminSliceActions } =
    adminSlice;

export const { filterByStatus } = adminSlice.actions;

const allFilters = (state: RootStore) => state.admin;

export const selectAllFilters = createSelector(
    [allFilters],
    allFilters => allFilters
);
