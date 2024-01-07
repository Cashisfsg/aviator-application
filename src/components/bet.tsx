import { useState, useReducer, useEffect, useRef } from "react";
import { useAuth } from "@/store/hooks/useAuth";
import { useAppDispatch, useGetUserBalanceQuery, userApi } from "@/store";
import { useToast } from "@/components/ui/use-toast";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Label } from "./ui/label";
// import { Switch } from "./ui/switch";
import { socket } from "./socket/socket";
import { decimal, validateBet } from "@/utils/helpers/validate-bet";

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

type BetState = "init" | "bet" | "cash";

type Action =
    | {
          type: "input";
          payload: number;
      }
    | {
          type: "increment";
          payload: { value: number; maxValue: number | undefined };
      }
    | {
          type: "decrement";
          payload: { value: number; maxValue: number | undefined };
      };

const MIN_BET = 0.1;

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "input":
            return action.payload;

        case "increment":
            if (
                !action.payload.maxValue ||
                state + action.payload.value > action.payload.maxValue
            ) {
                return state;
            }

            return +(state + action.payload.value).toFixed(2);

        case "decrement":
            if (
                !action.payload.maxValue ||
                state - action.payload.value < MIN_BET
            )
                return state;

            return +(state - action.payload.value).toFixed(2);

        default:
            return state;
    }
};

const BetTab = () => {
    const initialState: State = 1;
    const [state, dispatch] = useReducer(reducer, initialState);
    const [betState, setBetState] = useState<BetState>("init");

    const inputValidValue = useRef<string>(String(initialState));
    const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

    const { token } = useAuth();
    const { data: balance } = useGetUserBalanceQuery();

    const appDispatch = useAppDispatch();

    useEffect(() => {
        const onConnect = () => {
            console.log("Connect to server");
        };

        const onDisconnect = () => {
            console.log("Disconnect from server");
        };

        const makeBet = () => {
            if (betState === "bet") {
                setBetState("cash");

                socket.emit("bet", {
                    currency: balance?.currency,
                    bet: state
                });
            }
        };

        const loose = () => {
            if (betState === "cash") {
                setBetState("init");
                appDispatch(userApi.util.invalidateTags(["Balance"]));
            }
        };

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("loading", makeBet);
        socket.on("crash", loose);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("loading", makeBet);
            socket.off("crash", loose);
        };
    }, [state, betState, token]);

    console.log("rerender");

    const handlePointerDown = (
        type: "increment" | "decrement",
        value: number
    ) => {
        dispatch({
            type: type,
            payload: { value, maxValue: balance?.balance }
        });

        timerRef.current = setTimeout(() => {
            intervalRef.current = setInterval(() => {
                dispatch({
                    type: type,
                    payload: { value, maxValue: balance?.balance }
                });
            }, 100);
        }, 500);
    };

    const onChangeHandler: React.ChangeEventHandler<
        HTMLInputElement
    > = event => {
        try {
            inputValidValue.current = decimal(event.currentTarget.value);
        } catch (error) {
            return;
        } finally {
            dispatch({
                type: "input",
                payload: +inputValidValue.current
            });
        }
    };

    const onBlurHandler: React.FocusEventHandler<HTMLInputElement> = event => {
        if (!balance?.balance) return;

        const value = validateBet(
            event.target.value,
            MIN_BET,
            balance?.balance
        );
        event.currentTarget.value = value.toFixed(2);

        dispatch({
            type: "input",
            payload: value
        });
    };

    const resetInterval = () => {
        clearTimeout(timerRef.current);
        clearInterval(intervalRef.current);
    };

    return (
        <section
            className={`mx-auto mt-5 grid max-w-[400px] grid-cols-[68px_68px_1fr] gap-x-1 gap-y-2 text-lg`}
        >
            <div className="col-span-2 flex h-8.5 w-full items-center justify-between gap-1.5 rounded-full border border-gray-50 bg-black-250 px-2.5 leading-none">
                <button
                    className="shrink-0"
                    onPointerDown={() => {
                        handlePointerDown("decrement", 0.01);
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
                    maxLength={7}
                    autoComplete="off"
                    inputMode="numeric"
                    defaultValue={state}
                    onChange={onChangeHandler}
                    onBlur={onBlurHandler}
                    className="h-full w-full border-none bg-inherit text-center text-xl font-bold leading-none text-white outline-none focus-visible:outline-none"
                />

                <button
                    onPointerDown={() => {
                        handlePointerDown("increment", 0.01);
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

            <BetButton
                state={state}
                betState={betState}
                setBetState={setBetState}
            />

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
        </section>
    );
};

interface BetButtonProps {
    state: number;
    betState: BetState;
    setBetState: React.Dispatch<React.SetStateAction<BetState>>;
}

const BetButton: React.FC<BetButtonProps> = ({
    state,
    betState,
    setBetState
}) => {
    const [gain, setGain] = useState(state);

    const dispatch = useAppDispatch();
    const { toast } = useToast();

    useEffect(() => {
        const winnings = ({ x }: { x: number }) => {
            if (betState === "cash") {
                setGain(x * state);
            }
        };

        const resetBet = () => {
            setGain(state);
        };

        socket.on("game", winnings);
        socket.on("crash", resetBet);

        return () => {
            socket.off("game", winnings);
            socket.off("crash", resetBet);
        };
    }, [state, betState]);

    const abortBet = () => {
        setBetState("init");
    };

    const cashOut = () => {
        socket.emit("cash-out", {
            betNumber: 1
        });
        toast({
            title: `Вы выиграли ${(gain - state).toFixed(2)} USD`,
            duration: 5000
        });
        dispatch(userApi.util.invalidateTags(["Balance"]));
        setBetState("init");
    };

    switch (betState) {
        case "init":
            return (
                <button
                    style={{ textShadow: "0 1px 2px rgba(0, 0, 0, .5)" }}
                    onClick={() => {
                        setBetState("bet");
                    }}
                    className="row-span-3 rounded-2.5xl border-2 border-green-50 bg-green-450 px-3 py-1.5 font-semibold uppercase leading-none tracking-wider shadow-[inset_0_1px_1px_#ffffff80] transition-all duration-150 hover:bg-green-350 active:translate-y-[1px] active:border-[#1c7430]"
                >
                    <p className="text-xl">Ставка</p>
                    <p>
                        <span className="text-2xl">{state.toFixed(2)}</span>{" "}
                        <span className="text-lg">USD</span>
                    </p>
                </button>
            );
        case "bet":
            return (
                <button
                    onClick={abortBet}
                    className="row-span-3 rounded-2.5xl border-2 border-[#ff7171] bg-[#cb011a] px-3 py-1.5 text-xl font-semibold uppercase leading-none tracking-wider shadow-[inset_0_1px_1px_#ffffff80] transition-all duration-150 hover:bg-[#f7001f] active:translate-y-[1px] active:border-[#b21f2d]"
                >
                    Отмена
                </button>
            );
        case "cash":
            return (
                <button
                    onClick={cashOut}
                    className="row-span-3 rounded-2.5xl border-2 border-[#ffbd71] bg-[#d07206] px-3 py-1.5 font-semibold uppercase leading-none tracking-wider shadow-[inset_0_1px_1px_#ffffff80] transition-all duration-150 hover:bg-[#f58708] active:translate-y-[1px] active:border-[#c69500]"
                >
                    <p>Вывести</p>
                    <p className="text-2xl">
                        <span className="text-2xl">{gain.toFixed(2)}</span>{" "}
                        <span className="text-lg">USD</span>
                    </p>
                </button>
            );

        default:
            return <></>;
    }
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
