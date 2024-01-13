import { useState, useEffect, useRef, forwardRef } from "react";
import {
    useAppDispatch,
    useStateSelector,
    userApi,
    selectCurrentGameTab,
    setBetState,
    setCurrentBet,
    toggleAutoMode,
    selectSocket,
    selectBonus,
    deactivateBonus
} from "@/store";
import { useToast } from "@/components/ui/use-toast";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
// import { socket } from "./socket/socket";
import { decimal, validateBet } from "@/utils/helpers/validate-bet";

import { IoIosCloseCircleOutline } from "react-icons/io";

interface BetProps {
    betNumber: 1 | 2;
}

export const Bet: React.FC<BetProps> = ({ betNumber }) => {
    const currentGameTab = useStateSelector(state =>
        selectCurrentGameTab(state, betNumber)
    );

    return (
        <Tabs
            defaultValue="bet"
            className="group rounded-2.5xl border-2 border-transparent bg-black-50 px-6 pb-8 pt-4 has-[fieldset[data-state=bet]:disabled]:border-[#cb011a] has-[fieldset[data-state=cash]:disabled]:border-[#d07206]"
        >
            <TabsList className="has-[button:disabled]:pointer-events-none has-[button:disabled]:opacity-75">
                <TabsTrigger
                    value="bet"
                    disabled={currentGameTab.autoModeOn}
                >
                    Ставка
                </TabsTrigger>
                <TabsTrigger
                    value="auto"
                    disabled={currentGameTab.autoModeOn}
                >
                    Авто
                </TabsTrigger>
            </TabsList>
            <BetTab betNumber={betNumber} />
            <TabsContent
                value="auto"
                className="flex items-center justify-around"
            >
                <AutoBetTab betNumber={betNumber} />
            </TabsContent>
        </Tabs>
    );
};

interface BetTabProps extends Pick<BetProps, "betNumber"> {}

const MIN_BET = 0.1;

const BetTab: React.FC<BetTabProps> = ({ betNumber }) => {
    const currentGameTab = useStateSelector(state =>
        selectCurrentGameTab(state, betNumber)
    );
    const bonus = useStateSelector(state => selectBonus(state));

    const inputRef = useRef<HTMLInputElement>(null);
    const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

    const dispatch = useAppDispatch();
    const socket = useStateSelector(state => selectSocket(state));

    useEffect(() => {
        const onConnect = () => {
            console.log("Connect to server");
        };

        const onDisconnect = () => {
            console.log("Disconnect from server");
        };

        const makeBet = () => {
            if (currentGameTab.betState !== "bet") return;

            if (bonus.bonusActive && betNumber === 1) {
                socket.emit("bet", {
                    betNumber: betNumber,
                    currency: currentGameTab.currency,
                    bet: bonus.bonusQuantity,
                    promoId: bonus.bonusId
                });

                dispatch(deactivateBonus());
            } else {
                socket.emit("bet", {
                    betNumber: betNumber,
                    currency: currentGameTab.currency,
                    bet: currentGameTab.currentBet
                });
            }

            dispatch(setBetState({ betNumber, betState: "cash" }));
        };

        const loose = () => {
            if (currentGameTab.betState !== "cash") return;

            dispatch(setBetState({ betNumber, betState: "init" }));
            dispatch(userApi.util.invalidateTags(["Balance"]));
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
    }, [currentGameTab.currentBet, currentGameTab.betState]);

    const handlePointerDown = (
        type: "increment" | "decrement",
        value: number
    ) => {
        if (!inputRef.current) return;

        dispatch(
            setCurrentBet({
                type,
                betNumber,
                value,
                inputRef
            })
        );

        timerRef.current = setTimeout(() => {
            intervalRef.current = setInterval(() => {
                dispatch(
                    setCurrentBet({
                        type,
                        betNumber,
                        value,
                        inputRef
                    })
                );
            }, 100);
        }, 500);
    };

    const resetInterval = () => {
        clearTimeout(timerRef.current);
        clearInterval(intervalRef.current);
    };

    return (
        <section className=" mx-auto mt-5 grid max-w-[400px] grid-cols-[auto,1fr] gap-x-1 text-lg">
            <form
                onSubmit={event => {
                    event.preventDefault();
                }}
            >
                <fieldset
                    disabled={currentGameTab.betState !== "init"}
                    data-state={currentGameTab.betState}
                    className="grid grid-cols-[68px_68px] gap-x-1 gap-y-2 disabled:pointer-events-none disabled:opacity-75"
                >
                    {betNumber === 1 && bonus.bonusActive ? (
                        <div className="col-span-2 flex h-8.5 w-full items-center justify-between gap-1.5 rounded-full border border-gray-50 bg-black-250 px-2.5 leading-none">
                            <span className="flex-auto text-center text-xl font-bold">
                                {bonus.bonusQuantity}
                            </span>
                            <button onClick={() => dispatch(deactivateBonus())}>
                                <IoIosCloseCircleOutline className="text-[#83878e]" />
                                <span className="sr-only">Отменить бонус</span>
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="col-span-2 flex h-8.5 w-full items-center justify-between gap-1.5 rounded-full border border-gray-50 bg-black-250 px-2.5 leading-none">
                                <button
                                    type="button"
                                    disabled={
                                        currentGameTab.betState !== "init"
                                    }
                                    onPointerDown={() => {
                                        handlePointerDown("decrement", 0.1);
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

                                <BetInput
                                    betNumber={betNumber}
                                    disabled={
                                        currentGameTab.betState !== "init"
                                    }
                                    ref={inputRef}
                                />

                                <button
                                    type="button"
                                    disabled={
                                        currentGameTab.betState !== "init"
                                    }
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
                            {[1, 2, 5, 10].map(number => (
                                <button
                                    key={number}
                                    type="button"
                                    disabled={
                                        currentGameTab.betState !== "init"
                                    }
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
                        </>
                    )}
                </fieldset>
            </form>

            <BetButton betNumber={betNumber} />
        </section>
    );
};

interface BetInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    betNumber: 1 | 2;
}

const BetInput = forwardRef<HTMLInputElement, BetInputProps>(
    ({ betNumber, ...props }, ref) => {
        const dispatch = useAppDispatch();
        const currentGameTab = useStateSelector(state =>
            selectCurrentGameTab(state, betNumber)
        );
        const inputValidValue = useRef<string>(
            String(currentGameTab.currentBet)
        );

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

        const onBlurHandler: React.FocusEventHandler<
            HTMLInputElement
        > = event => {
            if (!currentGameTab.balance) return;

            const value = validateBet(
                event.target.value,
                MIN_BET,
                currentGameTab.balance
            );
            event.currentTarget.value = value.toFixed(2);

            dispatch(setCurrentBet({ type: "input", betNumber, value }));
        };

        return (
            <input
                {...props}
                maxLength={7}
                autoComplete="off"
                inputMode="numeric"
                defaultValue={currentGameTab.currentBet}
                onChange={onChangeHandler}
                onBlur={onBlurHandler}
                ref={ref}
                className="h-full w-full border-none bg-inherit text-center text-xl font-bold leading-none text-white outline-none focus-visible:outline-none"
            />
        );
    }
);

interface BetButtonProps extends Pick<BetProps, "betNumber"> {}

const BetButton: React.FC<BetButtonProps> = ({ betNumber }) => {
    const dispatch = useAppDispatch();
    const { toast } = useToast();
    const currentGameTab = useStateSelector(state =>
        selectCurrentGameTab(state, betNumber)
    );
    const socket = useStateSelector(state => selectSocket(state));
    const bonus = useStateSelector(state => selectBonus(state));

    const [gain, setGain] = useState(currentGameTab.currentBet);

    useEffect(() => {
        const winnings = ({ x }: { x: number }) => {
            if (currentGameTab.betState === "cash") {
                if (bonus.bonusActive && bonus.bonusQuantity) {
                    setGain(x * bonus.bonusQuantity);
                } else {
                    setGain(x * currentGameTab.currentBet);
                }
            }
        };

        const resetBet = () => {
            setGain(currentGameTab.currentBet);
        };

        socket.on("game", winnings);
        socket.on("crash", resetBet);

        return () => {
            socket.off("game", winnings);
            socket.off("crash", resetBet);
        };
    }, [currentGameTab.currentBet, currentGameTab.betState]);

    const abortBet = () => {
        dispatch(setBetState({ betNumber, betState: "init" }));
    };

    const cashOut = () => {
        socket.emit("cash-out", {
            betNumber
        });
        toast({
            title: `Вы выиграли ${(gain - currentGameTab.currentBet).toFixed(
                2
            )} ${currentGameTab.currency}`,
            duration: 5000
        });
        dispatch(userApi.util.invalidateTags(["Balance"]));
        dispatch(setBetState({ betNumber, betState: "init" }));
    };

    switch (currentGameTab.betState) {
        case "init":
            return (
                <button
                    style={{ textShadow: "0 1px 2px rgba(0, 0, 0, .5)" }}
                    onClick={() => {
                        dispatch(setBetState({ betNumber, betState: "bet" }));
                    }}
                    className="rounded-2.5xl border-2 border-green-50 bg-green-450 px-3 py-1.5 font-semibold uppercase leading-none tracking-wider shadow-[inset_0_1px_1px_#ffffff80] transition-all duration-150 hover:bg-green-350 active:translate-y-[1px] active:border-[#1c7430]"
                >
                    <p className="text-xl">Ставка</p>
                    <p>
                        <span className="text-2xl">
                            {betNumber === 1 && bonus.bonusActive
                                ? bonus.bonusQuantity
                                : currentGameTab.currentBet.toFixed(2)}
                        </span>{" "}
                        <span className="text-lg">
                            {currentGameTab.currency}
                        </span>
                    </p>
                </button>
            );
        case "bet":
            return (
                <div className="grid h-full w-full grid-rows-[1fr_2fr] place-items-center">
                    <p className="text-sm text-[#ffffffb3]">
                        Ожидаем новый раунд
                    </p>
                    <button
                        onClick={abortBet}
                        className="h-full w-full rounded-2.5xl border-2 border-[#ff7171] bg-[#cb011a] px-3 py-1.5 text-xl font-semibold uppercase leading-none tracking-wider shadow-[inset_0_1px_1px_#ffffff80] transition-all duration-150 hover:bg-[#f7001f] active:translate-y-[1px] active:border-[#b21f2d]"
                    >
                        Отмена
                    </button>
                </div>
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
                        <span className="text-lg">
                            {currentGameTab.currency}
                        </span>
                    </p>
                </button>
            );

        default:
            return <></>;
    }
};

interface AutoBetTabProps {
    betNumber: 1 | 2;
}

const AutoBetTab: React.FC<AutoBetTabProps> = ({ betNumber }) => {
    const inputValidValue = useRef<string>(String(1));
    const [rate, setRate] = useState(1);
    const dispatch = useAppDispatch();

    const currentGameTab = useStateSelector(state =>
        selectCurrentGameTab(state, betNumber)
    );
    const socket = useStateSelector(state => selectSocket(state));

    useEffect(() => {
        const autoBet = ({ x }: { x: number }) => {
            if (
                !currentGameTab.autoModeOn ||
                currentGameTab.betState !== "cash"
            ) {
                socket.off("game", autoBet);
                return;
            }

            console.log("autoBet");

            if (x < rate) return;

            socket.emit("cash-out", {
                betNumber
            });

            dispatch(setBetState({ betNumber, betState: "init" }));

            console.log("Game over. Auto bet win", x * rate);

            socket.off("game", autoBet);
        };

        socket.on("game", autoBet);

        return () => {
            socket.off("game", autoBet);
        };
    }, [rate, currentGameTab.autoModeOn, currentGameTab.betState]);

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
        if (!currentGameTab.balance) return;

        const value = validateBet(event.target.value, 1.1, 100);
        event.currentTarget.value = value.toFixed(2);
        setRate(value);
    };

    return (
        <fieldset
            disabled={currentGameTab.betState !== "init"}
            className="grid grid-cols-[auto_100px] items-center justify-evenly  gap-3"
        >
            <Label
                direction="row"
                className="text-xs leading-none text-[#9ea0a3]"
            >
                <span>Авто кешаут</span>
                <Switch
                    disabled={currentGameTab.betState !== "init"}
                    onClick={() => dispatch(toggleAutoMode({ betNumber }))}
                />
            </Label>
            <div className="flex h-8 items-center gap-2 rounded-full border border-gray-50 bg-black-250 px-3 leading-none">
                <input
                    disabled={!currentGameTab.autoModeOn}
                    defaultValue={(1.1).toFixed(2)}
                    onChange={onChangeHandler}
                    onBlur={onBlurHandler}
                    className="h-full w-full bg-transparent font-bold focus-visible:outline-none disabled:opacity-50"
                />
                <span>x</span>
            </div>
        </fieldset>
    );
};
