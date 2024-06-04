import { Middleware } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";
import { ClientToServerListen, ServerToClientListen } from "./types";
import { RootStore } from "../types";
import {
    setRate,
    setLastRate,
    toggleState,
    updateRoundData,
    BetTest,
    activateGame,
    deactivateGame
} from "../slices/test.slice";
import {
    setBetState,
    setCurrentRound,
    deactivateBonus,
    enableBonusCashOut
} from "../slices/gameSlice";
import { userApi } from "../api/userApi";
import { betApi } from "../api/betApi";
import { replenishmentApi } from "@/api/replenishment";
import { withdrawApi } from "@/api/withdraw";
import { toast } from "@/components/toasts/toast";
import { authApi } from "..";

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
                    const bonus = store.getState().game.bonus;

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
                        if (gameState !== "game") {
                            store.dispatch(toggleState("game"));
                        }

                        if (
                            bonus.bonusActive &&
                            bets[0].betState === "cash" &&
                            x >= bonus.bonusCoefficient
                        ) {
                            store.dispatch(enableBonusCashOut());
                        }
                    }

                    bets.forEach((bet, index) => {
                        if (
                            !bet.autoModeOn ||
                            bet.betState !== "cash" ||
                            x < bet.autoBetCoefficient
                        )
                            return;

                        socket.emit("cash-out", {
                            betNumber: (index + 1) as 1 | 2,
                            winX: x
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

                        if (bonus.bonusActive && index === 0) {
                            store.dispatch(deactivateBonus());
                            store.dispatch(
                                userApi.util.invalidateTags(["Promo"])
                            );
                            toast.win(
                                bet.autoBetCoefficient * bonus.bonusQuantity,
                                bet.autoBetCoefficient,
                                bet.currency
                            );
                        } else {
                            toast.win(
                                bet.autoBetCoefficient * bet.currentBet,
                                bet.autoBetCoefficient,
                                bet.currency
                            );
                        }
                    });
                });

                socket.on("loading", () => {
                    store.dispatch(toggleState("loading"));

                    if (
                        store.getState().test.gameStatus.status === "inactive"
                    ) {
                        store.dispatch(activateGame());
                    }

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

                    if (
                        (bets[0].betState === "bet" && !bonus.bonusActive) ||
                        bets[1].betState === "bet"
                    ) {
                        store.dispatch(
                            userApi.util.invalidateTags(["Balance"])
                        );
                    }

                    if (!store.getState().game.currentRound) {
                        store.dispatch(setCurrentRound(true));
                    }

                    store.dispatch(betApi.util.invalidateTags(["Previous"]));
                });

                socket.on("crash", () => {
                    const { bets, bonus } = store.getState().game;

                    if (bonus.bonusActive && bets[0].betState === "cash") {
                        store.dispatch(userApi.util.invalidateTags(["Promo"]));
                        store.dispatch(deactivateBonus());
                    }

                    store.dispatch(toggleState("crash"));
                    store.dispatch(setLastRate(store.getState().test.rate));

                    if (bets.some(bet => bet.betState === "cash")) {
                        store.dispatch(
                            betApi.endpoints.getUserBets.initiate(
                                { skip: 0, limit: 6 },
                                { subscribe: false, forceRefetch: true }
                            )
                        );
                    }

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
                });

                socket.on("game-stop", text => {
                    store.dispatch(deactivateGame({ message: text }));
                });

                socket.on("currentPlayers", data => {
                    store.dispatch(updateRoundData(data));
                });

                socket.on("replenishment-refresh", () => {
                    replenishmentApi.util.invalidateTags(["Replenishment"]);
                });

                socket.on("withdrawal-refresh", () => {
                    withdrawApi.util.invalidateTags(["Withdraw"]);
                });

                socket.connect();
                break;

            case "auth/logout":
                if (!localStorage.getItem("token")) return;

                store.dispatch(
                    authApi.endpoints.signOut.initiate(
                        {
                            token: JSON.parse(
                                localStorage.getItem("token") || ""
                            )?.token
                        },
                        { subscribe: false, forceRefetch: true }
                    )
                );

                store.dispatch(userApi.util.resetApiState());
                store.dispatch(betApi.util.resetApiState());
                store.dispatch(replenishmentApi.util.resetApiState());
                store.dispatch(withdrawApi.util.resetApiState());

                socket.auth = { token: "" };

                localStorage.removeItem("token");

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

                    if (!store.getState().game.bonus.bonusActive) {
                        store.dispatch(
                            userApi.util.invalidateTags(["Balance"])
                        );
                    }
                }

                break;

            case "test/cashOut":
                store.dispatch(
                    setBetState({
                        betNumber: action.payload,
                        betState: "init"
                    })
                );

                socket.emit("cash-out", {
                    betNumber: action.payload as 1 | 2,
                    winX: Math.round(store.getState().test.rate * 100) / 100
                });

                store.dispatch(
                    betApi.endpoints.getUserBets.initiate(
                        { skip: 0, limit: 6 },
                        { subscribe: false, forceRefetch: true }
                    )
                );
                store.dispatch(userApi.util.invalidateTags(["Balance"]));

                if (store.getState().game.bonus.bonusActive) {
                    store.dispatch(userApi.util.invalidateTags(["Promo"]));
                    store.dispatch(deactivateBonus());
                }

                break;

            case "test/abortBet":
                store.dispatch(
                    setBetState({
                        betNumber: action.payload as 1 | 2,
                        betState: "init"
                    })
                );
                socket.emit("cancel", { betNumber: action.payload as 1 | 2 });

                if (!store.getState().game.bonus.bonusActive) {
                    store.dispatch(userApi.util.invalidateTags(["Balance"]));
                }
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
