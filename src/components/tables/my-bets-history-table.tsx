import { useGetUserBetsQuery } from "@/store";

import { Table, Row, Cell } from "@/components/ui/table";

import { formatDate, formatTime, formatCurrency } from "@/utils/helpers";

export const MyBetsHistoryTable = () => {
    const { data: bets, isSuccess } = useGetUserBetsQuery({});

    return (
        <>
            {isSuccess ? (
                <Table
                    className="px-1.5"
                    headers={["Время", "Ставка, UZS", "Коэфф.", "Выигрыш, UZS"]}
                    data={bets}
                    renderData={data => (
                        <>
                            {data.map(bet => (
                                <Row className="[&>td:first-child]:border-l-2 [&>td:last-child]:border-r-2 [&>td:nth-child(even)]:font-bold [&>td:nth-child(even)]:text-white [&>td]:border-y-2 [&>td]:border-[#427f00] [&>td]:bg-[#123405]">
                                    <Cell className="px-2 py-1 text-left text-[10px] leading-none">
                                        <p>{formatTime(bet?.time)}</p>
                                        <p>{formatDate(bet?.time)}</p>
                                    </Cell>
                                    <Cell>{formatCurrency(bet?.bet)}</Cell>
                                    <Cell>
                                        <span className="rounded-full bg-black/80 px-3 py-0.5 text-xs font-bold">
                                            {bet?.win !== 0
                                                ? `${formatCurrency(bet?.win)}x`
                                                : "-"}
                                        </span>
                                    </Cell>
                                    <Cell>
                                        {bet?.win !== 0
                                            ? formatCurrency(bet?.win)
                                            : "-"}
                                    </Cell>
                                </Row>
                            ))}
                        </>
                    )}
                />
            ) : null}
        </>
    );
};
