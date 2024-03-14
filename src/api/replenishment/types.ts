import { Requisite } from "../requisite";

export interface Replenishment {
    _id: string;
    user: string;
    amount: number;
    currency: string;
    deduction: number;
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
