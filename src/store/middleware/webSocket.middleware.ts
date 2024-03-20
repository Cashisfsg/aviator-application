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
    deactivateBonus,
    enableBonusCashOut
} from "../slices/gameSlice";
import { userApi } from "../api/userApi";
import { toast } from "@/components/toasts/toast";

const BASE_URL: string = import.meta.env.VITE_API_BASE_URL;

let socket: Socket<ServerToClientListen, ClientToServerListen> = io(BASE_URL, {
    auth: {
        token: JSON.parse(localStorage.getItem("token") || "{}")?.token
    },
    autoConnect: false
});

console.log("Token" + socket.auth.token);

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
                    store.dispatch(setRate(x));

                    if (x === 1) {
                        store.dispatch(toggleState("start"));

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

                        if (store.getState().test.state !== "game") {
                            store.dispatch(toggleState("game"));
                        }

                        if (bonus.bonusActive && bets[0].state === "cash") {
                            if (x >= bonus.bonusCoefficient) {
                                store.dispatch(enableBonusCashOut());
                            }
                        }
                    }
                });

                socket.on("loading", () => {
                    store.dispatch(toggleState("loading"));
                    store.dispatch(updateRoundData(initialRoundData));

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

                            if (index === 1) {
                                console.log("Invalidate balance");

                                store.dispatch(
                                    userApi.util.invalidateTags(["Balance"])
                                );
                            }
                        }
                    });
                });

                socket.on("crash", () => {
                    store.dispatch(toggleState("crash"));
                    store.dispatch(setLastRate(store.getState().test.rate));

                    const { bets, bonus } = store.getState().game;

                    if (bonus.bonusActive && bets[0].state === "cash") {
                        store.dispatch(deactivateBonus());
                    }

                    bets.forEach((bet, index) => {
                        if (bet.betState === "cash") {
                            store.dispatch(
                                setBetState({
                                    betNumber: (index + 1) as 1 | 2,
                                    betState: "init"
                                })
                            );
                        }
                    });

                    setTimeout(() => {
                        store.dispatch(toggleState("end"));
                    }, 0);
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
                console.log("Authenctication");

                // socket.emit("disconnect");

                socket = io(BASE_URL, {
                    auth: {
                        token: action.payload
                    }
                });

                // socket.auth = { token: action.payload };

                // console.log("Token payload: " + action.payload);

                // setTimeout(() => {
                //     console.log(socket.auth);
                // }, 1000);

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
