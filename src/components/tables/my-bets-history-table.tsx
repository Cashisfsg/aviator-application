import { useLayoutEffect, useRef, useState } from "react";

import {
    useGetUserBalanceQuery,
    useGetUserBetsQuery,
    userBetsEntityAdapter,
    userBetsEntitySelector
} from "@/store";

import { Table, TableHeaderCell, Row, Cell } from "@/components/ui/table";
import { InfiniteScroll } from "../infinite-scroll";
import { Badge } from "@/components/ui/badge";

import { formatDate, formatTime, formatCurrency } from "@/utils/helpers";
import { TableVirtuoso } from "react-virtuoso";

export const MyBetsHistoryTable = () => {
    const [queryParams, setQueryParams] = useState({ skip: 0, limit: 6 });

    const tableRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        tableRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }, []);

    const { data: balance } = useGetUserBalanceQuery();

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
        // <InfiniteScroll
        //     skip={queryParams.skip === bets.length || false}
        //     // isLoading={status === "pending"}
        //     callback={() => {
        //         // if (!hasNextPage) return;
        //         setQueryParams(queryParams => ({
        //             ...queryParams,
        //             skip: bets?.length ?? 0
        //         }));
        //     }}
        //     className="scrollbar max-h-64"
        // >
        //     {isError && <pre>{error?.data?.message}</pre>}
        //     {isSuccess ? (
        //         <div ref={tableRef}>
        //             <Table
        //                 className="px-1.5"
        //                 headers={[
        //                     "Время",
        //                     `Ставка, ${balance?.currency || "USD"}`,
        //                     "Коэфф.",
        //                     `Выигрыш, ${balance?.currency || "USD"}`
        //                 ]}
        //                 data={bets || []}
        //                 renderHeader={headers => (
        //                     <Row>
        //                         {headers.map(header => (
        //                             <TableHeaderCell
        //                                 key={header}
        //                                 className="sticky -top-0.5 bg-black-50"
        //                             >
        //                                 {header}
        //                             </TableHeaderCell>
        //                         ))}
        //                     </Row>
        //                 )}
        //                 renderData={data => (
        //                     <>
        //                         {data.map(bet => (
        //                             <Row
        //                                 key={bet?._id}
        //                                 className={`[&>td:nth-child(even)]:font-bold [&>td:nth-child(even)]:text-white ${
        //                                     isNaN(bet?.win?.[balance?.currency])
        //                                         ? ""
        //                                         : "[&>td:first-child]:border-l-2 [&>td:last-child]:border-r-2 [&>td]:border-y-2 [&>td]:border-[#427f00] [&>td]:bg-[#123405]"
        //                                 }`}
        //                             >
        //                                 <Cell className="px-2 py-1 text-left text-[10px] leading-none">
        //                                     <time
        //                                         dateTime={bet?.time}
        //                                         className="block"
        //                                     >
        //                                         {formatTime(bet?.time)}
        //                                     </time>
        //                                     <time
        //                                         dateTime={bet?.time}
        //                                         className="block"
        //                                     >
        //                                         {formatDate(bet?.time)}
        //                                     </time>
        //                                 </Cell>
        //                                 <Cell>
        //                                     {formatCurrency(
        //                                         bet?.bet?.[balance?.currency]
        //                                     )}
        //                                 </Cell>
        //                                 <Cell>
        //                                     <Badge value={bet?.coeff} />
        //                                 </Cell>
        //                                 <Cell>
        //                                     {!isNaN(
        //                                         bet?.win?.[balance?.currency]
        //                                     )
        //                                         ? formatCurrency(
        //                                               bet?.win?.[
        //                                                   balance?.currency
        //                                               ]
        //                                           )
        //                                         : "-"}
        //                                 </Cell>
        //                             </Row>
        //                         ))}
        //                     </>
        //                 )}
        //             />
        //         </div>
        //     ) : null}

        //     {isSuccess && (!bets || bets.length === 0) ? (
        //         <p className="py-2 text-center text-base font-semibold">
        //             Пусто
        //         </p>
        //     ) : null}
        // </InfiniteScroll>
        <>
            {isSuccess ? (
                <TableVirtuoso
                    data={bets}
                    className="scrollbar !h-64"
                    itemContent={(_, bet) => (
                        <>
                            <Cell
                                className={`px-2 py-1 text-left text-[10px] leading-none ${
                                    isNaN(bet?.win?.["USD"])
                                        ? ""
                                        : "border-y-2 border-l-2 border-[#427f00] bg-[#123405]"
                                }`}
                            >
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
                            <Cell
                                className={`font-bold text-white ${
                                    isNaN(bet?.win?.["USD"])
                                        ? ""
                                        : "border-y-2 border-[#427f00] bg-[#123405]"
                                }`}
                            >
                                {formatCurrency(
                                    bet?.bet?.[balance?.currency || "USD"]
                                )}
                            </Cell>
                            <Cell
                                className={
                                    isNaN(bet?.win?.["USD"])
                                        ? ""
                                        : "border-y-2 border-[#427f00] bg-[#123405]"
                                }
                            >
                                <Badge value={bet?.coeff} />
                            </Cell>
                            <Cell
                                className={`font-bold text-white ${
                                    isNaN(bet?.win?.["USD"])
                                        ? ""
                                        : "border-y-2 border-r-2 border-[#427f00] bg-[#123405]"
                                }`}
                            >
                                {!isNaN(bet?.win?.[balance?.currency || "USD"])
                                    ? formatCurrency(
                                          bet?.win?.[balance?.currency || "USD"]
                                      )
                                    : "-"}
                            </Cell>
                        </>
                    )}
                    components={{
                        Table: props => {
                            return (
                                <table
                                    {...props}
                                    className="w-full table-fixed !border-separate !border-spacing-x-0 !border-spacing-y-1 text-sm leading-none"
                                />
                            );
                        },
                        TableRow: props => {
                            return <Row {...props} />;
                        }
                    }}
                    fixedHeaderContent={() => (
                        <tr>
                            <TableHeaderCell className="bg-black-50">
                                Время
                            </TableHeaderCell>
                            <TableHeaderCell className="bg-black-50">
                                {`Ставка, ${balance?.currency || "USD"}`}
                            </TableHeaderCell>
                            <TableHeaderCell className="bg-black-50">
                                Коэфф.
                            </TableHeaderCell>
                            <TableHeaderCell className="bg-black-50">
                                {`Выигрыш, ${balance?.currency || "USD"}`}
                            </TableHeaderCell>
                        </tr>
                    )}
                    endReached={() => {
                        setQueryParams(queryParams => ({
                            ...queryParams,
                            skip: bets?.length ?? 0
                        }));
                    }}
                />
            ) : null}

            {isSuccess && (!bets || bets.length === 0) ? (
                <p className="py-2 text-center text-base font-semibold">
                    Пусто
                </p>
            ) : null}
        </>
    );
};
