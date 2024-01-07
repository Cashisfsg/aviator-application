import { useState } from "react";

import { useGetUserBetsQuery } from "@/store";

import { Table, Row, Cell } from "@/components/ui/table";
import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent
} from "@/components/ui/collapsible";

import { formatCurrency, formatDate, formatTime } from "@/utils/helpers";

const MAX_ITEMS_BEFORE_EXPAND = 6;

export const MyBetsHistoryDialogTable = () => {
    const [open, setOpen] = useState(false);

    const { data: bets } = useGetUserBetsQuery();

    return (
        <Collapsible
            open={open}
            onOpenChange={setOpen}
        >
            <div className="scrollbar max-h-[50dvh]">
                <Table
                    className="px-1.5 text-center"
                    headers={[
                        "Время",
                        `Ставка${
                            bets && bets[0] ? `, ${bets[0]?.currency}` : ""
                        }`,
                        "Коэфф.",
                        `Выигрыш${
                            bets && bets[0] ? `, ${bets[0]?.currency}` : ""
                        }`
                    ]}
                    data={bets || []}
                    renderData={data => (
                        <>
                            {data.slice(0, MAX_ITEMS_BEFORE_EXPAND).map(bet => (
                                <Row key={bet?._id}>
                                    <Cell className="px-2 py-1 text-left text-[10px] leading-none">
                                        <time
                                            dateTime={formatTime(bet?.time)}
                                            className="block"
                                        >
                                            {formatTime(bet?.time)}
                                        </time>
                                        <time
                                            dateTime={formatTime(bet?.time)}
                                            className="block"
                                        >
                                            {formatDate(bet?.time)}
                                        </time>
                                    </Cell>
                                    <Cell>{formatCurrency(bet?.bet)}</Cell>
                                    <Cell>
                                        <span className="rounded-full bg-black/80 px-3 py-0.5 text-xs font-bold">
                                            {bet?.coeff}x
                                        </span>
                                    </Cell>
                                    <Cell>{formatCurrency(bet?.win)}</Cell>
                                </Row>
                            ))}
                            <CollapsibleContent asChild>
                                <>
                                    {data
                                        .slice(MAX_ITEMS_BEFORE_EXPAND)
                                        .map(bet => (
                                            <Row
                                                key={bet?._id}
                                                className="[&>td:first-child]:border-l-2 [&>td:last-child]:border-r-2 [&>td:nth-child(even)]:font-bold [&>td:nth-child(even)]:text-white [&>td]:border-y-2 [&>td]:border-[#427f00] [&>td]:bg-[#123405]"
                                            >
                                                <Cell className="px-2 py-1 text-left text-[10px] leading-none">
                                                    <time
                                                        dateTime={formatTime(
                                                            bet?.time
                                                        )}
                                                        className="block"
                                                    >
                                                        {formatTime(bet?.time)}
                                                    </time>
                                                    <time
                                                        dateTime={formatTime(
                                                            bet?.time
                                                        )}
                                                        className="block"
                                                    >
                                                        {formatDate(bet?.time)}
                                                    </time>
                                                </Cell>
                                                <Cell>
                                                    {formatCurrency(bet?.bet)}
                                                </Cell>
                                                <Cell>
                                                    <span className="rounded-full bg-black/80 px-3 py-0.5 text-xs font-bold">
                                                        {bet?.coeff}x
                                                    </span>
                                                </Cell>
                                                <Cell>
                                                    {formatCurrency(bet?.win)}
                                                </Cell>
                                            </Row>
                                        ))}
                                </>
                            </CollapsibleContent>
                        </>
                    )}
                />
                {!bets || bets.length === 0 ? (
                    <p className="py-2 text-center font-semibold">Пусто</p>
                ) : null}
            </div>
            {bets && bets.length > MAX_ITEMS_BEFORE_EXPAND ? (
                <CollapsibleTrigger className="mt-4 w-full rounded-t-none bg-[#252528] py-2 focus-visible:outline-none focus-visible:ring-0">
                    {open ? "Скрыть" : "Показать ещё"}
                </CollapsibleTrigger>
            ) : null}
        </Collapsible>
    );
};
