import React, { useState, useLayoutEffect, useRef } from "react";
import {
    topBetsEntityAdapter,
    topBetsEntitySelector,
    useGetTopBetsQuery
} from "@/store/api/betApi";
import { useGetUserBalanceQuery } from "@/store/api/userApi";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { InfiniteScroll } from "./infinite-scroll";
import { Badge } from "@/components/ui/badge";
import Avatar from "@/assets/avatar-360w.webp";

import { formatCurrency } from "@/utils/helpers";

export const TopBetsTabpanel = () => {
    return (
        <Tabs defaultValue="day">
            <TabsList className="mt-4">
                <TabsTrigger value="day">День</TabsTrigger>
                <TabsTrigger value="month">Месяц</TabsTrigger>
                <TabsTrigger value="year">Год</TabsTrigger>
            </TabsList>
            <TabsContent value="day">
                <TopBetsTab dateSort="day" />
            </TabsContent>
            <TabsContent value="month">
                <TopBetsTab dateSort="month" />
            </TabsContent>
            <TabsContent value="year">
                <TopBetsTab dateSort="year" />
            </TabsContent>
        </Tabs>
    );
};

interface TopBetsTabProps {
    dateSort: "day" | "month" | "year";
}

const TopBetsTab: React.FC<TopBetsTabProps> = ({ dateSort }) => {
    const [queryParams, setQueryParams] = useState({ skip: 0, limit: 6 });

    const { data: balance } = useGetUserBalanceQuery();

    const {
        data: bets,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetTopBetsQuery(
        {
            skip: queryParams.skip,
            limit: queryParams.limit,
            dateSort: dateSort
        },
        {
            selectFromResult: ({ data, ...otherParams }) => ({
                data: topBetsEntitySelector.selectAll(
                    data ?? topBetsEntityAdapter.getInitialState()
                ),
                ...otherParams
            })
        }
    );

    return (
        <InfiniteScroll
            skip={queryParams.skip === bets.length || false}
            // isLoading={status === "pending"}
            callback={() => {
                // if (!hasNextPage) return;
                setQueryParams(queryParams => ({
                    ...queryParams,
                    skip: bets?.length ?? 0
                }));
            }}
            className="scrollbar max-h-64"
        >
            {isLoading ? (
                <ul className="grid grid-cols-1 grid-rows-1 gap-2 px-1.5 sm:grid-cols-2">
                    {Array(6)
                        .fill(0)
                        .map((_, index) => (
                            <TopBetSkeleton key={index} />
                        ))}
                </ul>
            ) : null}
            {isSuccess ? (
                <TopBetsList
                    bets={bets}
                    currency={balance?.currency}
                />
            ) : null}

            {isError && <pre>{error?.data?.message}</pre>}

            {isSuccess && (!bets || bets.length === 0) ? (
                <p className="py-2 text-center text-base font-semibold">
                    Пусто
                </p>
            ) : null}
        </InfiniteScroll>
    );
};

const TopBetsList = ({ bets, currency }) => {
    const listRef = useRef<HTMLUListElement>(null);

    useLayoutEffect(() => {
        listRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }, []);

    return (
        <ul
            ref={listRef}
            className="grid grid-cols-1 grid-rows-1 gap-2 px-1.5 sm:grid-cols-2"
        >
            {bets.map(bet => (
                <TopBetItem
                    key={bet?._id}
                    img={bet?.profileImage}
                    login={bet?.playerLogin}
                    bet={bet?.bet?.[currency]}
                    win={bet?.win?.[currency]}
                    currency={currency || ""}
                    rate={bet?.coeff}
                    dateTime={bet?.time}
                />
            ))}
        </ul>
    );
};

interface TopBetItemProps {
    img: string;
    login: string;
    bet: number;
    win: number;
    rate: number;
    currency: string;
    dateTime: string;
}

const TopBetItem: React.FC<TopBetItemProps> = ({
    img,
    login,
    bet,
    win,
    rate,
    currency,
    dateTime
}) => {
    const onErrorHandler: React.ReactEventHandler<HTMLImageElement> = event => {
        event.currentTarget.src = Avatar;
    };

    return (
        <li className="grid grid-cols-[1fr_4fr] grid-rows-[auto_auto]  place-items-center overflow-hidden rounded-md bg-[#101112] text-xs text-[#9ea0a3] sm:grid-cols-[3fr_7fr]">
            <div className="space-y-2">
                <img
                    src={img || Avatar}
                    alt="Аватар профиля"
                    width="40"
                    height="40"
                    loading="lazy"
                    onError={onErrorHandler}
                    className="size-10 rounded-full"
                />
                <p className="text-sm font-semibold">{`${login?.at(
                    0
                )}***${login?.at(-1)}`}</p>
            </div>
            <table className="w-full table-fixed">
                <tbody className="leading-4">
                    <tr>
                        <td className="p-1 text-right ">Ставка {currency}:</td>
                        <td className="p-1 text-left text-sm font-bold text-white">
                            {formatCurrency(bet)}
                        </td>
                    </tr>
                    <tr>
                        <td className="p-1 text-right">Коэффициент:</td>
                        <td className="p-1 text-left font-bold">
                            <Badge value={rate} />
                        </td>
                    </tr>
                    <tr>
                        <td className="p-1 text-right">Выигрыш {currency}:</td>
                        <td className="p-1 text-left text-sm font-bold text-white">
                            {formatCurrency(win)}
                        </td>
                    </tr>
                </tbody>
            </table>
            <p className="col-span-2 w-full space-x-4 bg-black py-1.5 text-start text-sm">
                <time
                    className="ml-2"
                    dateTime={dateTime}
                >
                    {new Date(dateTime).toLocaleDateString(undefined, {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    })}
                </time>
                <span>
                    Раунд: <b className="text-white">{rate?.toFixed(2)}x</b>
                </span>
            </p>
        </li>
    );
};

const TopBetSkeleton = () => {
    return (
        <li className="grid grid-cols-[1fr_4fr] grid-rows-[auto_auto]  place-items-center overflow-hidden rounded-md bg-[#101112] text-xs text-[#9ea0a3] sm:grid-cols-[3fr_7fr]">
            <div className="space-y-2">
                <div className="size-10 animate-pulse rounded-full bg-slate-400" />
                <p className="h-3 animate-pulse rounded-full bg-slate-400" />
            </div>
            <table className="w-full table-fixed">
                <tbody>
                    <tr>
                        <td className="h-7 px-1 py-0 text-right">
                            <p className="inline-block h-3 w-24 animate-pulse rounded-full bg-slate-400" />
                        </td>
                        <td className="h-7 px-1 py-0 text-left">
                            <p className="inline-block h-3 w-14 animate-pulse rounded-full bg-slate-400" />
                        </td>
                    </tr>
                    <tr>
                        <td className="h-7 px-1 py-0 text-right">
                            <p className="inline-block h-3 w-24 animate-pulse rounded-full bg-slate-400" />
                        </td>
                        <td className="h-7 px-1 py-0 text-left">
                            <p className="inline-block h-3 w-14 animate-pulse rounded-full bg-slate-400" />
                        </td>
                    </tr>
                    <tr>
                        <td className="h-7 px-1 py-0 text-right">
                            <p className="inline-block h-3 w-24 animate-pulse rounded-full bg-slate-400" />
                        </td>
                        <td className="h-7 px-1 py-0 text-left">
                            <p className="inline-block h-3 w-14 animate-pulse rounded-full bg-slate-400" />
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="col-span-2 flex h-8 w-full items-center space-x-4 bg-black text-start">
                <p className="ml-2 inline-block h-3 w-25 animate-pulse rounded-full bg-slate-400" />
                <p className="inline-block h-3 w-20 animate-pulse rounded-full bg-slate-400" />
            </div>
        </li>
    );
};
