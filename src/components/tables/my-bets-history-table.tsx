import { useState } from "react";

import {
    useGetUserBalanceQuery,
    useGetUserBetsQuery,
    userBetsEntityAdapter,
    userBetsEntitySelector
} from "@/store";

import { Table, TableHeaderCell, Row, Cell } from "@/components/ui/table";
import { InfiniteScroll } from "../infinite-scroll";

import { formatDate, formatTime, formatCurrency } from "@/utils/helpers";

export const MyBetsHistoryTable = () => {
    const [queryParams, setQueryParams] = useState({ skip: 0, limit: 6 });

    const { data: balance } = useGetUserBalanceQuery();

    // const {
    //     data: bets,
    //     hasNextPage,
    //     isSuccess,
    //     isError,
    //     error
    // } = useGetUserBetsQuery(
    //     {
    //         skip: queryParams.skip,
    //         limit: queryParams.limit
    //     },
    //     {
    //         selectFromResult: ({ data, ...otherParams }) => ({
    //             data: data?.data,
    //             hasNextPage: data?.hasNextPage,
    //             ...otherParams
    //         })
    //         // refetchOnMountOrArgChange: true
    //     }
    // );

    const {
        data: bets,
        isSuccess,
        isError,
        error
    } = useGetUserBetsQuery(
        {
            skip: queryParams.skip,
            limit: queryParams.limit
        },
        {
            selectFromResult: ({ data, ...otherParams }) => ({
                data: userBetsEntitySelector.selectAll(
                    data ?? userBetsEntityAdapter.getInitialState()
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
            {isError && <pre>{error?.data?.message}</pre>}
            {!isError ? (
                <Table
                    className="px-1.5"
                    headers={[
                        "Время",
                        `Ставка, ${balance?.currency || "USD"}`,
                        "Коэфф.",
                        "Выигрыш, USD"
                    ]}
                    data={bets || []}
                    renderHeader={headers => (
                        <Row>
                            {headers.map(header => (
                                <TableHeaderCell
                                    key={header}
                                    className="sticky -top-0.5 bg-black-50"
                                >
                                    {header}
                                </TableHeaderCell>
                            ))}
                        </Row>
                    )}
                    renderData={data => (
                        <>
                            {data.map(bet => (
                                <Row
                                    key={bet?._id}
                                    className={`[&>td:nth-child(even)]:font-bold [&>td:nth-child(even)]:text-white ${
                                        isNaN(bet?.win)
                                            ? ""
                                            : "[&>td:first-child]:border-l-2 [&>td:last-child]:border-r-2 [&>td]:border-y-2 [&>td]:border-[#427f00] [&>td]:bg-[#123405]"
                                    }`}
                                >
                                    <Cell className="px-2 py-1 text-left text-[10px] leading-none">
                                        <time
                                            dateTime={bet?.time}
                                            className="block"
                                        >
                                            {formatTime(bet?.time)}
                                        </time>
                                        <time
                                            dateTime={bet?.time}
                                            className="block"
                                        >
                                            {formatDate(bet?.time)}
                                        </time>
                                    </Cell>
                                    <Cell>{formatCurrency(bet?.bet)}</Cell>
                                    <Cell>
                                        {!isNaN(bet?.coeff) ? (
                                            <span className="rounded-full bg-[#c017b4] px-3 py-0.5 text-xs font-bold">
                                                {bet?.coeff}x
                                            </span>
                                        ) : (
                                            "-"
                                        )}
                                    </Cell>
                                    <Cell>
                                        {!isNaN(bet?.win)
                                            ? formatCurrency(bet?.win)
                                            : "-"}
                                    </Cell>
                                </Row>
                            ))}
                        </>
                    )}
                />
            ) : null}
            {isSuccess && (!bets || bets.length === 0) ? (
                <p className="py-2 text-center text-base font-semibold">
                    Пусто
                </p>
            ) : null}
        </InfiniteScroll>
    );
};
