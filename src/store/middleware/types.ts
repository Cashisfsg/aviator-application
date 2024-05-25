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
    "game-stop": (text: string) => void;
}
export interface ClientToServerListen {
    // message: (message: ) => void;
    bet: (data: BetTest) => void;
    "cash-out": (data: { betNumber: 1 | 2; winX: number }) => void;
    cancel: (data: { betNumber: 1 | 2 }) => void;
}
