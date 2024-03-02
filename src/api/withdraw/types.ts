export type Currency = "USD" | "RUB" | "UZS" | "KZT";

export type CurrencyRecord = Record<Currency, number>;

export interface Requisite {
    _id: string;
    requisite: string;
    name: string;
    currency: string;
    img: string;
    commission: number;
    status: string;
}

export interface Withdraw {
    _id: string;
    user: string;
    amount: CurrencyRecord;
    currency: string;
    status: string;
    statusMessage: string;
    userRequisite: string;
    requisite: Requisite;
    createdAt: string;
    completedDate: string;
}

export interface PaymentDrawRequest {
    currency: string;
    amount: number;
    requisite: string;
    userRequisite: string;
}

export interface FetchAllWithdrawsResponse extends Withdraw {}

export interface CreateWithdrawResponse extends Withdraw {}

export interface CreateWithdrawRequest {
    currency: string;
    amount: number;
    requisite: string;
    userRequisite: string;
}

export interface CreateWithdrawResponse extends Withdraw {}

export interface CancelWithdrawByIdRequest {
    id: string;
}

export interface CancelWithdrawByIdResponse {
    message: string;
}
