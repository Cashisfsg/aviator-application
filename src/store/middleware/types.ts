import { BetTest, CurrencyRecordTest, PlayerTest } from "../slices/test.slice";

interface CurrentPlayers {
    betAmount: CurrencyRecordTest;
    winAmount: CurrencyRecordTest;
    currentPlayers: PlayerTest[];
}

export interface ServerToClientListen {
    game: ({ x }: { x: number }) => void;
    loading: () => void;
    crash: () => void;
    currentPlayers: (data: CurrentPlayers) => void;
    "replenishment-refresh": () => void;
    "withdrawal-refresh": () => void;
    error: ({ message }: { message: string }) => void;
    "game-stop": (message: string) => void;
    "bot-stop": (message: string) => void;
    "user-balance": (balance: number) => void;
}
export interface ClientToServerListen {
    bet: (data: BetTest) => void;
    "cash-out": (data: { betNumber: 1 | 2; winX: number }) => void;
    cancel: (data: { betNumber: 1 | 2 }) => void;
}
