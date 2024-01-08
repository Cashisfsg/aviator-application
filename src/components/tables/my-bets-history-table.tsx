import { useGetUserBetsQuery } from "@/store";

import { Table, Row, Cell } from "@/components/ui/table";

import { formatDate, formatTime, formatCurrency } from "@/utils/helpers";

export const MyBetsHistoryTable = () => {
    const { data: bets } = useGetUserBetsQuery(undefined, {
        refetchOnFocus: true
    });

    return (
        <>
            <Table
                className="px-1.5"
                headers={["Время", "Ставка, UZS", "Коэфф.", "Выигрыш, UZS"]}
                data={bets || []}
                renderData={data => (
                    <>
                        {data.map(bet => (
                            <Row
                                key={bet?._id}
                                className="[&>td:first-child]:border-l-2 [&>td:last-child]:border-r-2 [&>td:nth-child(even)]:font-bold [&>td:nth-child(even)]:text-white [&>td]:border-y-2 [&>td]:border-[#427f00] [&>td]:bg-[#123405]"
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
                                    <span className="rounded-full bg-black/80 px-3 py-0.5 text-xs font-bold">
                                        {bet?.win !== 0
                                            ? `${formatCurrency(bet?.coeff)}x`
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
            {!bets || bets.length === 0 ? (
                <p className="py-2 text-center text-base font-semibold">
                    Пусто
                </p>
            ) : null}
        </>
    );
};
