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
    { date: new Date(), gain: 18450 },
    { date: new Date(), gain: 18450 },
    { date: new Date(), gain: 18450 },
    { date: new Date(), gain: 18450 },
    { date: new Date(), gain: 18450 },
    { date: new Date(), gain: 18450 },
    { date: new Date(), gain: 18450 },
    { date: new Date(), gain: 18450 }
];

export const DailyStatisticsTable = () => {
    return (
        <Collapsible>
            <Table
                className="px-1.5 text-center"
                headers={["Дата", "Заработано"]}
                data={data}
                renderData={data => (
                    <>
                        {data.slice(0, 3).map((row, i) => (
                            <Row key={i}>
                                <Cell className="px-2 py-1 text-center leading-none text-white">
                                    {row.date.toLocaleDateString()}
                                </Cell>

                                <Cell>{formatterUSD.format(row.gain)} UZS</Cell>
                            </Row>
                        ))}
                        <CollapsibleContent asChild>
                            <>
                                {data.slice(3).map((row, i) => (
                                    <Row key={i}>
                                        <Cell className="px-2 py-1 text-center leading-none text-white">
                                            {row.date.toLocaleDateString()}
                                        </Cell>
                                        <Cell>
                                            {formatterUSD.format(row.gain)} UZS
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
