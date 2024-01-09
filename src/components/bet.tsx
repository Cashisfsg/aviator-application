import React, { useState, useReducer, useEffect, useRef } from "react";
import { useAuth } from "@/store/hooks/useAuth";
import { useAppDispatch, useGetUserBalanceQuery, userApi } from "@/store";
import { useToast } from "@/components/ui/use-toast";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { socket } from "./socket/socket";
import { decimal, validateBet } from "@/utils/helpers/validate-bet";

interface BetProps {
    betNumber: 1 | 2;
}

export const Bet: React.FC<BetProps> = ({ betNumber }) => {
    const [disabled, setDisabled] = useState(false);

    return (
        <Tabs
            defaultValue="bet"
            className="group rounded-2.5xl border-2 border-transparent bg-black-50 px-6 pb-8 pt-4 has-[fieldset[data-state=bet]:disabled]:border-[#cb011a] has-[fieldset[data-state=cash]:disabled]:border-[#d07206]"
        >
            <TabsList className="group-has-[fieldset:disabled]:pointer-events-none group-has-[fieldset:disabled]:opacity-75">
                <TabsTrigger
                    value="bet"
                    disabled={disabled}
                >
                    Ставка
                </TabsTrigger>
                <TabsTrigger
                    value="auto"
                    disabled={disabled}
                >
                    Авто
                </TabsTrigger>
            </TabsList>
            <BetTab betNumber={betNumber} />
            <TabsContent
                value="auto"
                className="flex items-center justify-around"
            >
                <AutoBetTab
                    disabled={disabled}
                    setDisabled={setDisabled}
                />
            </TabsContent>
        </Tabs>
    );
};

type BetValue = number;

type BetState = "init" | "bet" | "cash";

interface BetTabProps extends Pick<BetProps, "betNumber"> {}

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

const reducer = (state: BetValue, action: Action): BetValue => {
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

const BetTab: React.FC<BetTabProps> = ({ betNumber }) => {
    const initialBet: BetValue = 1;
    const [currentBet, dispatch] = useReducer(reducer, initialBet);
    const [betState, setBetState] = useState<BetState>("init");

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
                    bet: currentBet
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
    }, [currentBet, betState, token]);

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

    const resetInterval = () => {
        clearTimeout(timerRef.current);
        clearInterval(intervalRef.current);
    };

    return (
        <section className=" mx-auto mt-5 grid max-w-[400px] grid-cols-[auto,1fr] gap-x-1 text-lg">
            <form>
                <fieldset
                    disabled={betState !== "init"}
                    data-state={betState}
                    className="grid grid-cols-[68px_68px] gap-x-1 gap-y-2 disabled:pointer-events-none disabled:opacity-75"
                >
                    <div className="col-span-2 flex h-8.5 w-full items-center justify-between gap-1.5 rounded-full border border-gray-50 bg-black-250 px-2.5 leading-none">
                        <button
                            type="button"
                            disabled={betState !== "init"}
                            onPointerDown={() => {
                                handlePointerDown("decrement", 0.01);
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
                                        d="M13 9.8H5V8.2h8z"
                                    />
                                </g>
                            </svg>
                        </button>

                        {/* <input
                            maxLength={7}
                            autoComplete="off"
                            inputMode="numeric"
                            disabled={betState !== "init"}
                            defaultValue={currentBet}
                            onChange={onChangeHandler}
                            onBlur={onBlurHandler}
                            className="h-full w-full border-none bg-inherit text-center text-xl font-bold leading-none text-white outline-none focus-visible:outline-none"
                        /> */}
                        <BetInput
                            balance={balance?.balance}
                            currentBet={currentBet}
                            dispatch={dispatch}
                            disabled={betState !== "init"}
                        />

                        <button
                            type="button"
                            disabled={betState !== "init"}
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
                    {[1, 2, 5, 10].map(number => (
                        <button
                            key={number}
                            type="button"
                            disabled={betState !== "init"}
                            onPointerDown={() =>
                                handlePointerDown("increment", number)
                            }
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
                </fieldset>
            </form>

            <BetButton
                state={currentBet}
                betNumber={betNumber}
                betState={betState}
                setBetState={setBetState}
            />
        </section>
    );
};

interface BetInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    balance: number | undefined;
    currentBet: number;
    dispatch: React.Dispatch<Action>;
}

const BetInput: React.FC<BetInputProps> = ({
    balance,
    currentBet,
    dispatch,
    ...props
}) => {
    const inputValidValue = useRef<string>(String(currentBet));

    const onChangeHandler: React.ChangeEventHandler<
        HTMLInputElement
    > = event => {
        try {
            inputValidValue.current = decimal(event.currentTarget.value);
        } catch (error) {
            return;
        } finally {
            event.currentTarget.value = inputValidValue.current;
        }
    };

    const onBlurHandler: React.FocusEventHandler<HTMLInputElement> = event => {
        if (!balance) return;

        const value = validateBet(event.target.value, MIN_BET, balance);
        event.currentTarget.value = value.toFixed(2);

        dispatch({
            type: "input",
            payload: value
        });
    };

    return (
        <input
            {...props}
            maxLength={7}
            autoComplete="off"
            inputMode="numeric"
            defaultValue={currentBet}
            onChange={onChangeHandler}
            onBlur={onBlurHandler}
            className="h-full w-full border-none bg-inherit text-center text-xl font-bold leading-none text-white outline-none focus-visible:outline-none"
        />
    );
};

interface BetButtonProps extends Pick<BetProps, "betNumber"> {
    state: number;
    betState: BetState;
    setBetState: React.Dispatch<React.SetStateAction<BetState>>;
}

const BetButton: React.FC<BetButtonProps> = ({
    state,
    betNumber,
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
            betNumber
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
                    className="rounded-2.5xl border-2 border-green-50 bg-green-450 px-3 py-1.5 font-semibold uppercase leading-none tracking-wider shadow-[inset_0_1px_1px_#ffffff80] transition-all duration-150 hover:bg-green-350 active:translate-y-[1px] active:border-[#1c7430]"
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
                    className="rounded-2.5xl border-2 border-[#ff7171] bg-[#cb011a] px-3 py-1.5 text-xl font-semibold uppercase leading-none tracking-wider shadow-[inset_0_1px_1px_#ffffff80] transition-all duration-150 hover:bg-[#f7001f] active:translate-y-[1px] active:border-[#b21f2d]"
                >
                    Отмена
                </button>
            );
        case "cash":
            return (
                <button
                    onClick={cashOut}
                    className="rounded-2.5xl border-2 border-[#ffbd71] bg-[#d07206] px-3 py-1.5 text-xl font-semibold uppercase leading-none tracking-wider shadow-[inset_0_1px_1px_#ffffff80] transition-all duration-150 hover:bg-[#f58708] active:translate-y-[1px] active:border-[#c69500]"
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

interface AutoBetTabProps {
    disabled: boolean;
    setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const AutoBetTab: React.FC<AutoBetTabProps> = ({ disabled, setDisabled }) => {
    const inputValidValue = useRef<string>(String(1));
    const [value, setValue] = useState(1);

    const { data: balance } = useGetUserBalanceQuery();

    useEffect(() => {
        const autoBet = ({ x }: { x: number }) => {
            if (x < value || !disabled) return;

            console.log("Game over. Auto bet win", x, value);

            socket.off("game", autoBet);
        };

        socket.on("game", autoBet);

        return () => {
            socket.off("game", autoBet);
        };
    }, [value, disabled]);

    const onChangeHandler: React.ChangeEventHandler<
        HTMLInputElement
    > = event => {
        try {
            inputValidValue.current = decimal(event.currentTarget.value);
        } catch (error) {
            return;
        } finally {
            event.currentTarget.value = inputValidValue.current;
        }
    };

    const onBlurHandler: React.FocusEventHandler<HTMLInputElement> = event => {
        if (!balance?.balance) return;

        const value = validateBet(event.target.value, 1.01, balance?.balance);
        event.currentTarget.value = value.toFixed(2);
        setValue(value);
    };

    return (
        <>
            <div className="grid grid-cols-[auto_100px] items-center justify-evenly  gap-3">
                <Label
                    direction="row"
                    className="text-xs leading-none text-[#9ea0a3]"
                >
                    <span>Авто кешаут</span>
                    <Switch onClick={() => setDisabled(state => !state)} />
                </Label>
                <div className="flex h-8 items-center gap-2 rounded-full border border-gray-50 bg-black-250 px-3 leading-none">
                    <input
                        disabled={!disabled}
                        defaultValue={1}
                        onChange={onChangeHandler}
                        onBlur={onBlurHandler}
                        className="h-full w-full bg-transparent font-bold focus-visible:outline-none disabled:opacity-50"
                    />
                    <span>x</span>
                </div>
            </div>
        </>
    );
};
