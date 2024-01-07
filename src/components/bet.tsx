import { useReducer, useEffect, useRef } from "react";
import { useAuth } from "@/store/hooks/useAuth";
import { useAppDispatch, userApi } from "@/store";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Label } from "./ui/label";
// import { Switch } from "./ui/switch";
import { socket } from "./socket/socket";

export const Bet = () => {
    return (
        <Tabs
            defaultValue="bet"
            className="rounded-2.5xl bg-black-50 px-6 pb-8 pt-4"
        >
            <TabsList>
                <TabsTrigger value="bet">Ставка</TabsTrigger>
                <TabsTrigger value="auto">Авто</TabsTrigger>
            </TabsList>
            <BetTab />
            {/* <TabsContent
                value="auto"
                className="flex items-center justify-around"
            >
                <AutoBetTab />
            </TabsContent> */}
        </Tabs>
    );
};

type State = number;

type Action =
    | { type: "input"; payload: number }
    | { type: "increment"; payload: number }
    | { type: "decrement"; payload: number };

const MAX_BET = 1000;
const MIN_BET = 1;

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "input":
            if (isNaN(action.payload)) return state;

            if (action.payload > MAX_BET) return MAX_BET;

            return action.payload;

        case "increment":
            if (state + action.payload > MAX_BET) return state;

            return +(state + action.payload).toFixed(2);

        case "decrement":
            if (state - action.payload < MIN_BET) return state;

            return +(state - action.payload).toFixed(2);

        default:
            return state;
    }
};

const BetTab = () => {
    const initialState: State = 1;
    const [state, dispatch] = useReducer(reducer, initialState);
    const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const { token } = useAuth();

    const appDispatch = useAppDispatch();

    useEffect(() => {
        const onConnect = () => {
            console.log("Connect to server");
            socket.on("game", () => {
                console.log("game being started");
            });
            socket.on("loading", () => {
                console.log("Make bet");
            });
        };

        const onDisconnect = () => {
            console.log("Disconnect from server");
        };

        // socket.connect();

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("currentPlayers", data => {
            console.log("Current players: ", data);
        });
        socket.on("game", () => {
            console.log("game being started");
        });
        socket.on("loading", () => {
            console.log("Make bet");
        });

        // socket.on("bet", () => {
        //     console.log("Делайте ваши ставки");
        // });

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            // socket.disconnect();
        };
    }, [token]);

    const handlePointerDown = (
        type: "increment" | "decrement",
        value: number
    ) => {
        dispatch({ type: type, payload: value });

        timerRef.current = setTimeout(() => {
            intervalRef.current = setInterval(() => {
                dispatch({ type: type, payload: value });
            }, 100);
        }, 500);
    };

    const resetInterval = () => {
        clearTimeout(timerRef.current);
        clearInterval(intervalRef.current);
    };

    return (
        <section className="mt-5 grid grid-cols-[68px_68px_1fr] gap-x-1 gap-y-2 text-lg">
            <div className="col-span-2 flex h-8.5 w-full items-center justify-between rounded-full border border-gray-50 bg-black-250 px-2.5 leading-none">
                <button
                    className="shrink-0"
                    onPointerDown={() => {
                        handlePointerDown("decrement", 0.1);
                    }}
                    onPointerUp={() => {
                        resetInterval();
                    }}
                    onPointerLeave={() => {
                        resetInterval();
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                    >
                        <g
                            fillRule="nonzero"
                            fill="none"
                        >
                            <path
                                d="M9 1C4.6 1 1 4.6 1 9s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z"
                                stroke="#767B85"
                            />
                            <path
                                fill="#767B85"
                                d="M13 9.8H5V8.2h8z"
                            />
                        </g>
                    </svg>
                </button>

                <input
                    maxLength={5}
                    autoComplete="off"
                    inputMode="numeric"
                    value={state}
                    onChange={event =>
                        dispatch({
                            type: "input",
                            payload: +event.target.value
                        })
                    }
                    className="h-full w-full border-none bg-inherit text-center text-xl font-bold leading-none text-white outline-none focus-visible:outline-none"
                />

                <button
                    onPointerDown={() => {
                        handlePointerDown("increment", 0.1);
                    }}
                    onPointerUp={() => {
                        resetInterval();
                    }}
                    onPointerLeave={() => {
                        resetInterval();
                    }}
                    className="shrink-0"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                    >
                        <g
                            fillRule="nonzero"
                            fill="none"
                        >
                            <path
                                d="M9 1C4.6 1 1 4.6 1 9s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z"
                                stroke="#767B85"
                            />
                            <path
                                fill="#767B85"
                                d="M13 9.8H9.8V13H8.2V9.8H5V8.2h3.2V5h1.6v3.2H13z"
                            />
                        </g>
                    </svg>
                </button>
            </div>

            <button
                style={{ textShadow: "0 1px 2px rgba(0, 0, 0, .5)" }}
                className="row-span-3 rounded-2.5xl border-2 border-green-50 bg-green-450 px-3 py-1.5 font-semibold uppercase leading-none tracking-wider shadow-[inset_0_1px_1px_#ffffff80] transition-all duration-150 hover:bg-green-350 active:translate-y-[1px] active:border-[#1c7430]"
            >
                <p className="text-xl">Ставка</p>
                <p>
                    <span className="text-2xl">{state.toFixed(2)}</span>{" "}
                    <span className="text-lg">USD</span>
                </p>
            </button>

            {[1, 2, 5, 10].map(number => (
                <button
                    key={number}
                    onPointerDown={() => handlePointerDown("increment", number)}
                    onPointerUp={() => {
                        resetInterval();
                    }}
                    onPointerLeave={() => {
                        resetInterval();
                    }}
                    className="h-4.5 w-full select-none rounded-full border border-gray-50 bg-black-150 text-sm leading-none text-[#83878e] active:translate-y-[1px]"
                >
                    {number}
                </button>
            ))}
            <button
                onClick={() => {
                    socket.emit("bet", {
                        currency: "RUB",
                        bet: 0.01
                    });

                    appDispatch(userApi.util.invalidateTags(["Balance"]));
                }}
            >
                Сделай ставку
            </button>
            <button
                onClick={() => {
                    socket.emit("cash-out", {
                        betNumber: 1
                    });

                    appDispatch(userApi.util.invalidateTags(["Balance"]));
                }}
            >
                Выводи бабки
            </button>
        </section>
    );
};

// const AutoBetTab = () => {
//     return (
//         <>
//             <button className="h-5 w-25 shrink-0 whitespace-nowrap rounded-full border border-[#1d7aca] bg-[#45c0f2] text-xs font-bold uppercase leading-none">
//                 Авто игра
//             </button>
//             <div className="flex">
//                 <Label
//                     direction="row"
//                     className="text-xs leading-none"
//                 >
//                     <span>Авто кешаут</span>
//                     <Switch />
//                 </Label>
//                 <div>
//                     <input className="w-full" />
//                     <button>x</button>
//                 </div>
//             </div>
//         </>
//     );
// };
