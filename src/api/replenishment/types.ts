import { Requisite } from "../requisite";
import { CurrencyRecord } from "../withdraw/types";

export interface Replenishment {
    _id: string;
    user: string;
    amount: CurrencyRecord;
    // currency: string;
    deduction: CurrencyRecord;
    status: string;
    statusMessage: string;
    isPayConfirmed: boolean;
    requisite: Requisite;
    createdAt: string;
    completedDate: string;
    uid: number;
}

export interface SuccessResponse {
    message: string;
}

export type AllReplenishmentsResponse = Replenishment[];

export interface FetchReplenishmentByIdRequest {
    id: string;
}

export type FetchReplenishmentByIdResponse = Replenishment;

export interface ReplenishmentLimitsResponse {
    minLimit: number;
    maxLimit: number;
    currency: string;
}

export interface CreateReplenishmentRequest {
    currency: string;
    amount: number;
    requisite: string;
}

export type CreateReplenishmentResponse = Replenishment;

export interface CancelReplenishmentRequest {
    id: string;
}

export interface ConfirmReplenishmentRequest {
    id: string;
}
