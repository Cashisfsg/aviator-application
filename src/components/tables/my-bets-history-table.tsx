import { useLayoutEffect, useRef, useState } from "react";
import { TableVirtuoso } from "react-virtuoso";

import { useGetUserBalanceQuery } from "@/store/api/userApi";
import {
    useGetUserBetsQuery,
    userBetsEntityAdapter,
    userBetsEntitySelector
} from "@/store/api/betApi";

import { TableHeaderCell, Row, Cell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { formatDate, formatTime, formatCurrency } from "@/utils/helpers";
import { Bet } from "@/store";

export const MyBetsHistoryTable = () => {
    const [queryParams, setQueryParams] = useState({ skip: 0, limit: 6 });

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
        <>
            {isError && <pre>{error?.data?.message}</pre>}

            {isSuccess ? (
                <MyBetsTable
                    bets={bets}
                    setQueryParams={setQueryParams}
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

interface MyBetsTableProps {
    bets: Bet[];
    setQueryParams: React.Dispatch<
        React.SetStateAction<{
            skip: number;
            limit: number;
        }>
    >;
}

const MyBetsTable: React.FC<MyBetsTableProps> = ({ bets, setQueryParams }) => {
    const { data: balance } = useGetUserBalanceQuery();

    const tableRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        tableRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }, []);

    return (
        <div ref={tableRef}>
            <TableVirtuoso
                data={bets}
                className="scrollbar ml-auto !h-64 w-[calc(100%_-_6px)]"
                itemContent={(_, bet) => (
                    <>
                        <Cell
                            className={`border-y-2 border-l-2 px-2 py-1 text-left text-[10px] leading-none ${
                                isNaN(bet?.win?.["USD"])
                                    ? "border-transparent"
                                    : "border-[#427f00] bg-[#123405]"
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
                            className={`border-y-2 font-bold text-white ${
                                isNaN(bet?.win?.["USD"])
                                    ? "border-transparent"
                                    : "border-[#427f00] bg-[#123405]"
                            }`}
                        >
                            {formatCurrency(
                                bet?.bet?.[balance?.currency || "USD"]
                            )}
                        </Cell>
                        <Cell
                            className={`border-y-2
                    ${
                        isNaN(bet?.win?.["USD"])
                            ? "border-transparent"
                            : "border-[#427f00] bg-[#123405]"
                    }`}
                        >
                            <Badge value={bet?.coeff} />
                        </Cell>
                        <Cell
                            className={`border-y-2 border-r-2 font-bold text-white ${
                                isNaN(bet?.win?.["USD"])
                                    ? "border-transparent"
                                    : "border-[#427f00] bg-[#123405]"
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
                        return (
                            <Row
                                {...props}
                                // className="mx-1.5"
                            />
                        );
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
        </div>
    );
};
