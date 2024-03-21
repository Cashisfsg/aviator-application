import { Middleware } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";
import { ClientToServerListen, ServerToClientListen } from "./types";
import { RootStore } from "../types";
import {
    setRate,
    setLastRate,
    toggleState,
    updateRoundData,
    BetTest
} from "../slices/test.slice";
import {
    setBetState,
    setCurrentRound,
    deactivateBonus,
    enableBonusCashOut
} from "../slices/gameSlice";
import { userApi } from "../api/userApi";
import { betApi } from "../api/betApi";
import { toast } from "@/components/toasts/toast";

const BASE_URL: string = import.meta.env.VITE_API_BASE_URL;

let socket: Socket<ServerToClientListen, ClientToServerListen> = io(BASE_URL, {
    auth: {
        token: JSON.parse(localStorage.getItem("token") || "{}")?.token
    },
    autoConnect: false
});

const initialRoundData = {
    betAmount: { USD: 0, UZS: 0, KZT: 0, RUB: 0, USDT: 0 },
    winAmount: { USD: 0, UZS: 0, KZT: 0, RUB: 0, USDT: 0 },
    currentPlayers: []
};

// const userSocket: Socket<ServerToClientListen, ClientToServerListen> = io(
//     BASE_URL,
//     {
//         auth: {
//             token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZTJkZDljODUwYTU5YjRhMTAzYmIxZCIsImlhdCI6MTcxMDU3NzY1MSwiZXhwIjoxNzExMTgyNDUxfQ.cagKAE90xfW2qu4UmV9hn0Gv01f7A2Et2JklGSNWAEc"
//         }
//         // autoConnect: false
//     }
// );

export const webSocketMiddleware: Middleware<{}, RootStore> =
    store => next => action => {
        // const webSocketState = (store.getState() as RootStore).webSocket;
        // const gameState = (store.getState() as RootStore).test;

        switch (action.type) {
            case "webSocket/wsConnect":
                socket.on("connect", () => {
                    console.log("Соединение успешно установлено");
                });

                socket.on("game", ({ x }) => {
                    const bets = store.getState().game.bets;
                    const gameState = store.getState().test.state;
                    store.dispatch(setRate(x));

                    if (x === 1) {
                        // if (gameState !== "start") {
                        store.dispatch(toggleState("start"));
                        // }

                        bets.forEach((bet, index) => {
                            if (bet.betState === "start") {
                                store.dispatch(
                                    setBetState({
                                        betNumber: (index + 1) as 1 | 2,
                                        betState: "cash"
                                    })
                                );
                            }
                        });
                    } else {
                        const bonus = store.getState().game.bonus;

                        if (gameState !== "game") {
                            store.dispatch(toggleState("game"));
                        }

                        if (bonus.bonusActive && bets[0].state === "cash") {
                            if (x >= bonus.bonusCoefficient) {
                                store.dispatch(enableBonusCashOut());
                            }
                        }
                    }

                    bets.forEach((bet, index) => {
                        if (!bet.autoModeOn || bet.betState !== "cash") return;

                        if (x < bet.autoBetCoefficient) return;

                        socket.emit("cash-out", {
                            betNumber: (index + 1) as 1 | 2
                        });
                        store.dispatch(
                            setBetState({
                                betNumber: (index + 1) as 1 | 2,
                                betState: "init"
                            })
                        );
                        store.dispatch(
                            betApi.endpoints.getUserBets.initiate(
                                { skip: 0, limit: 6 },
                                { subscribe: false, forceRefetch: true }
                            )
                        );
                        store.dispatch(
                            userApi.util.invalidateTags(["Balance"])
                        );
                        toast.win(
                            bet.autoBetCoefficient * bet.currentBet,
                            bet.autoBetCoefficient,
                            bet.currency
                        );
                    });
                });

                socket.on("loading", () => {
                    store.dispatch(toggleState("loading"));
                    if (store.getState().test.roundStats.playersAmount !== 0) {
                        store.dispatch(updateRoundData(initialRoundData));
                    }

                    const { bets, bonus } = store.getState().game;

                    bets.forEach((bet, index) => {
                        if (bet.betState === "bet") {
                            if (bonus.bonusActive && index === 0) {
                                socket.emit("bet", {
                                    betNumber: 1,
                                    currency: bet.currency,
                                    bet: bonus.bonusQuantity,
                                    promoId: bonus.bonusId
                                });
                            } else {
                                socket.emit("bet", {
                                    betNumber: (index + 1) as 1 | 2,
                                    currency: bet.currency,
                                    bet: bet.currentBet
                                });
                            }
                            store.dispatch(
                                setBetState({
                                    betNumber: (index + 1) as 1 | 2,
                                    betState: "start"
                                })
                            );

                            // if (index === 1) {
                            //     console.log("Invalidate balance");

                            //     store.dispatch(
                            //         userApi.util.invalidateTags(["Balance"])
                            //     );
                            // }
                        }
                    });

                    if (bets.some(bet => bet.betState === "bet")) {
                        console.log("Invalidate balance");

                        store.dispatch(
                            userApi.util.invalidateTags(["Balance"])
                        );
                    }
                });

                socket.on("crash", () => {
                    store.dispatch(toggleState("crash"));
                    store.dispatch(setLastRate(store.getState().test.rate));

                    const { bets, bonus } = store.getState().game;

                    if (bonus.bonusActive && bets[0].state === "cash") {
                        store.dispatch(deactivateBonus());
                    }

                    // if (bets.some(bet => bet.betState === "cash")) {
                    //     store.dispatch(
                    //         userApi.util.invalidateTags(["Balance"])
                    //     );
                    // }

                    bets.forEach((bet, index) => {
                        if (bet.betState !== "cash") return;

                        store.dispatch(
                            setBetState({
                                betNumber: (index + 1) as 1 | 2,
                                betState: "init"
                            })
                        );
                    });

                    setTimeout(() => {
                        store.dispatch(toggleState("end"));
                    }, 0);

                    if (!store.getState().game.currentRound) {
                        console.log(
                            "Current round: " +
                                store.getState().game.currentRound
                        );

                        store.dispatch(setCurrentRound(true));
                    }
                });

                socket.on("currentPlayers", data => {
                    store.dispatch(updateRoundData(data));
                });

                socket.connect();
                break;

            case "webSocket/wsDisconnect":
                socket.disconnect();
                break;

            case "webSocket/authenticate":
                // socket.emit("disconnect");

                socket = io(BASE_URL, {
                    auth: {
                        token: action.payload
                    }
                });

                // socket.auth = { token: action.payload };

                break;

            case "test/makeBet":
                if (store.getState().test.state !== "loading")
                    store.dispatch(
                        setBetState({
                            betNumber: (action.payload as BetTest).betNumber,
                            betState: "bet"
                        })
                    );
                else {
                    socket.emit("bet", action.payload as BetTest);
                    store.dispatch(
                        setBetState({
                            betNumber: (action.payload as BetTest).betNumber,
                            betState: "start"
                        })
                    );
                    store.dispatch(userApi.util.invalidateTags(["Balance"]));
                }

                break;

            case "test/cashOut":
                store.dispatch(
                    setBetState({
                        betNumber: action.payload,
                        betState: "init"
                    })
                );

                socket.emit("cash-out", { betNumber: action.payload as 1 | 2 });
                store.dispatch(
                    betApi.endpoints.getUserBets.initiate(
                        { skip: 0, limit: 6 },
                        { subscribe: false, forceRefetch: true }
                    )
                );
                store.dispatch(userApi.util.invalidateTags(["Balance"]));

                break;

            case "test/abortBet":
                // if (store.getState().game.bonus.bonusActive) {
                //     store.dispatch(deactivateBonus());
                // }

                store.dispatch(
                    setBetState({
                        betNumber: action.payload as 1 | 2,
                        betState: "init"
                    })
                );
                socket.emit("cancel", { betNumber: action.payload as 1 | 2 });
                store.dispatch(userApi.util.invalidateTags(["Balance"]));

                break;

            default:
                break;
        }

        // if (action.type === "webSocket/wsConnect") {
        //     socket.on("connect", () => {
        //         console.log("Соединение успешно установлено");
        //     });

        //     socket.on("game", ({ x }) => {
        //         store.dispatch(setRate(x));

        //         store.dispatch(toggleState("game"));
        //     });

        //     socket.on("loading", () => {
        //         store.dispatch(toggleState("loading"));
        //     });

        //     socket.on("crash", () => {
        //         store.dispatch(toggleState("crash"));
        //     });

        //     socket.connect();
        // }
        // else if (action.type === "webSocket/wsDisconnect") {
        //     socket.disconnect();
        // }

        // if (webSocketState.connect) {
        //     socket.on("connect", () => {
        //         console.log("Соединение успешно установлено");
        //     });

        //     socket.on("game", ({ x }) => {
        //         store.dispatch(setRate(x));
        //     });
        // }

        // if (!webSocketState.connect || !socket) {
        //     // = io(BASE_URL, { autoConnect: false });
        //     socket.on("connect", () => {
        //         console.log("Соединение успешно установлено");
        //     });

        //     socket.on("game", ({ x }) => {
        //         store.dispatch(setRate(x));
        //     });
        // }

        next(action);
    };
