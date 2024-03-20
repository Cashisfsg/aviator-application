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
}
export interface ClientToServerListen {
    // message: (message: ) => void;
    bet: (data: BetTest) => void;
    "cash-out": (data: { betNumber: 1 | 2 }) => void;
    cancel: (data: { betNumber: 1 | 2 }) => void;
}
