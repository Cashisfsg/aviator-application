import { Table, Row, Cell } from "@/components/ui/table";
import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent
} from "@/components/ui/collapsible";

const formatterUSD = new Intl.NumberFormat("ru-RU", {
    style: "decimal",
    maximumFractionDigits: 0
});

const data = [
    { date: new Date(), bet: 15000, ratio: "1.23", gain: 18450 },
    { date: new Date(), bet: 15000, ratio: "1.23", gain: 18450 },
    { date: new Date(), bet: 15000, ratio: "1.23", gain: 18450 },
    { date: new Date(), bet: 15000, ratio: "1.23", gain: 18450 },
    { date: new Date(), bet: 15000, ratio: "1.23", gain: 18450 },
    { date: new Date(), bet: 15000, ratio: "1.23", gain: 18450 },
    { date: new Date(), bet: 15000, ratio: "1.23", gain: 18450 },
    { date: new Date(), bet: 15000, ratio: "1.23", gain: 18450 }
];

export const MyBetsHistoryTableDialog = () => {
    return (
        <Collapsible>
            <Table
                className="px-1.5 text-center"
                headers={["Время", "Ставка, UZS", "Коэфф.", "Выигрыш, UZS"]}
                data={data}
                renderData={data => (
                    <>
                        {data.slice(0, 3).map((row, i) => (
                            <Row
                                key={i}
                                className="[&>td:first-child]:border-l-2 [&>td:last-child]:border-r-2 [&>td:nth-child(even)]:font-bold [&>td:nth-child(even)]:text-white [&>td]:border-y-2 [&>td]:border-[#427f00] [&>td]:bg-[#123405]"
                            >
                                <Cell className="px-2 py-1 text-left text-[10px] leading-none">
                                    <p>
                                        {row.date.toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </p>
                                    <p>{row.date.toLocaleDateString()}</p>
                                </Cell>
                                <Cell>{formatterUSD.format(row.bet)}</Cell>
                                <Cell>
                                    <span className="rounded-full bg-black/80 px-3 py-0.5 text-xs font-bold">
                                        {row.ratio}x
                                    </span>
                                </Cell>
                                <Cell>{formatterUSD.format(row.gain)}</Cell>
                            </Row>
                        ))}
                        <CollapsibleContent asChild>
                            <>
                                {data.slice(3).map((row, i) => (
                                    <Row
                                        key={i}
                                        className="[&>td:first-child]:border-l-2 [&>td:last-child]:border-r-2 [&>td:nth-child(even)]:font-bold [&>td:nth-child(even)]:text-white [&>td]:border-y-2 [&>td]:border-[#427f00] [&>td]:bg-[#123405]"
                                    >
                                        <Cell className="px-2 py-1 text-left text-[10px] leading-none">
                                            <p>
                                                {row.date.toLocaleTimeString(
                                                    [],
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit"
                                                    }
                                                )}
                                            </p>
                                            <p>
                                                {row.date.toLocaleDateString()}
                                            </p>
                                        </Cell>
                                        <Cell>
                                            {formatterUSD.format(row.bet)}
                                        </Cell>
                                        <Cell>
                                            <span className="rounded-full bg-black/80 px-3 py-0.5 text-xs font-bold">
                                                {row.ratio}x
                                            </span>
                                        </Cell>
                                        <Cell>
                                            {formatterUSD.format(row.gain)}
                                        </Cell>
                                    </Row>
                                ))}
                            </>
                        </CollapsibleContent>
                    </>
                )}
            />
            <CollapsibleTrigger className="mt-4 w-full rounded-t-none bg-[#252528] py-2 focus-visible:outline-none focus-visible:ring-0">
                Показать ещё
            </CollapsibleTrigger>
        </Collapsible>
    );
};
