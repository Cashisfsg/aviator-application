//! ================= Authentication types ================= //

export interface UserRegistrationCredentials {
    currency: string;
    login: string;
    password: string;
    passwordConfirm: string;
    email: string;
    telegramId: number;
    from?: string;
}

export interface UserAuthorizationData {
    login: string;
    password: string;
}

export interface Token {
    token: string;
}

export interface SuccessResponse {
    message: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ChangePasswordConfirmRequest {
    code: string;
}

export interface ChangePasswordRequest {
    password: string;
    passwordConfirm: string;
}

//! ================= User types ================= //

export interface User {
    _id: string;
    telegramId: number;
    currency: string;
    login: string;
    email: string;
    balance: number;
    referralBalance: number;
    leader: string;
    descendants: string[];
    bonuses: string[];
    profileImage: string;
}

export interface UserBalance {
    balance: number;
    currency: string;
}

export interface UserBonus {
    _id: string;
    type: number;
    promoCode: string;
    currency: string;
    bonus: number;
    bonusPercent: number;
    bonusCoeff: number;
    maxUsedCount: number;
    usedCount: number;
    expiresIn: string;
    users: string[];
}

export interface UserRequisite {
    requisites: Requisite[];
    currency: string;
}

//! ================= Bet types ================= //

export interface Bet {
    bet: number;
    currency: string;
    time: string;
    coeff: number;
    win: number;
    player: string;
}

export interface BetRequestQueryParams {
    skip?: number;
    limit?: number;
}

//! ================= Admin types ================= //

export interface AdminAuthorizationData {
    login: string;
    password: string;
}

//! ================= Payment types ================= //
export interface Requisite {
    _id: string;
    requisite: string;
    name: string;
    currency: string;
    img: string;
    commission: number;
    status: string;
}

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
}

export interface PaymentDrawRequest {
    currency: string;
    amount: number;
    requisite: string;
    userRequisite: string;
}
