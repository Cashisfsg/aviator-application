import { useReducer, useRef } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

// const formatterUSD = new Intl.NumberFormat("en-US", {
//     style: "decimal",
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//     useGrouping: false
// });

export const Bet = () => {
    return (
        <Tabs
            defaultValue="bet"
            className="rounded-3xl bg-black-50 px-6 pb-8 pt-4"
        >
            <TabsList>
                <TabsTrigger value="bet">Ставка</TabsTrigger>
                <TabsTrigger value="auto">Авто</TabsTrigger>
            </TabsList>
            <BetTab />
            <TabsContent
                value="auto"
                className="flex items-center justify-around"
            >
                <AutoBetTab />
            </TabsContent>
        </Tabs>
    );
};

interface State {
    value: number;
    sum: number;
}

type Action =
    | { type: "sum"; payload: number }
    | { type: "handle"; payload: number }
    | { type: "increment" }
    | { type: "decrement" };

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "sum":
            if (action.payload === state.value)
                if (action.payload + state.sum < 100)
                    return { ...state, sum: state.sum + action.payload };
                else return { ...state, sum: 100 };

            return { ...state, value: action.payload, sum: action.payload };

        case "handle":
            if (action.payload > 100) return { ...state, sum: 100 };

            return { ...state, sum: action.payload };

        case "increment":
            if (state.sum + 0.1 > 100) return state;

            return { ...state, sum: +(state.sum + 0.1).toFixed(2) };

        case "decrement":
            if (state.sum - 0.1 < 1) return state;

            return { ...state, sum: +(state.sum - 0.1).toFixed(2) };

        default:
            return state;
    }
};

const BetTab = () => {
    const initialState: State = { value: 1, sum: 1 };
    const [state, dispatch] = useReducer(reducer, initialState);
    const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

    const handleClick = (value: number) => {
        dispatch({ type: "sum", payload: value });
    };

    const handleMouseDown = (type: "increment" | "decrement") => {
        dispatch({ type: type });

        timerRef.current = setTimeout(() => {
            intervalRef.current = setInterval(() => {
                dispatch({ type: type });
            }, 100);
        }, 500);
    };

    return (
        <section className="mt-5 grid grid-cols-[68px_68px_1fr] gap-x-1 gap-y-2 text-lg">
            <div className="col-span-2 flex h-8.5 w-full items-center justify-between rounded-full border border-gray-50 bg-black-250 px-2.5 leading-none">
                <button
                    className="shrink-0"
                    onPointerDown={() => {
                        handleMouseDown("decrement");
                    }}
                    onPointerUp={() => {
                        clearTimeout(timerRef.current);
                        clearInterval(intervalRef.current);
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                    >
                        <g
                            fill-rule="nonzero"
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
                    defaultValue={state.value}
                    maxLength={5}
                    autoComplete="off"
                    inputMode="numeric"
                    value={state.sum}
                    onChange={event =>
                        dispatch({
                            type: "handle",
                            payload: +event.target.value
                        })
                    }
                    className="text-white h-full w-full border-none bg-inherit text-center text-xl font-bold leading-none outline-none"
                />

                <button
                    onPointerDown={() => {
                        handleMouseDown("increment");
                    }}
                    onPointerUp={() => {
                        clearTimeout(timerRef.current);
                        clearInterval(intervalRef.current);
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
                            fill-rule="nonzero"
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
                    <span className="text-2xl">{state.sum.toFixed(2)}</span>{" "}
                    <span className="text-lg">USD</span>
                </p>
            </button>

            {[1, 2, 5, 10].map(number => (
                <button
                    key={number}
                    onClick={() => handleClick(number)}
                    className="h-4.5 w-full rounded-full border border-gray-50 bg-black-150 text-sm leading-none text-[#83878e] active:translate-y-[1px]"
                >
                    {number}
                </button>
            ))}
        </section>
    );
};

const AutoBetTab = () => {
    return (
        <>
            <button className="h-5 w-25 shrink-0 whitespace-nowrap rounded-full border border-[#1d7aca] bg-[#45c0f2] text-xs font-bold uppercase leading-none">
                Авто игра
            </button>
            <div className="flex">
                <Label
                    direction="row"
                    className="text-xs leading-none"
                >
                    <span>Авто кешаут</span>
                    <Switch />
                </Label>
                <div>
                    <input className="w-full" />
                    <button>x</button>
                </div>
            </div>
        </>
    );
};
