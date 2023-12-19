import { Table, Row, Cell } from "@/components/ui/table";

interface Bonus {
    id: number;
    date: Date;
    sum: number;
    ratio: number;
}

interface BonusTableProps {
    data: Bonus[];
}

export const BonusTable: React.FC<BonusTableProps> = ({ data }) => {
    return (
        <Table
            className="px-1.5 text-center"
            headers={[
                "Сумма бонуса, UZS",
                "Коэфф., при котором можно заработать выигрыш",
                "Срок действия"
            ]}
            data={data}
            renderData={data => (
                <>
                    {data.map(row => (
                        <Row key={row.id}>
                            <Cell className="text-white">{row.sum}</Cell>
                            <Cell>
                                <span className="rounded-full bg-black/80 px-3 py-0.5 text-xs font-bold text-white">
                                    {row.ratio}x
                                </span>
                            </Cell>
                            <Cell className="grid grid-cols-[1fr_auto] grid-rows-2 gap-x-2 px-2 py-1 text-left text-[10px] leading-none">
                                <p>
                                    {row.date.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </p>
                                <p>{row.date.toLocaleDateString()}</p>
                                <button className="col-start-2 col-end-3 row-start-1 row-end-3 w-full rounded border border-green-50 bg-green-450 px-1.5 py-1 text-white shadow-[inset_0_1px_1px_#ffffff80] transition-all duration-150 hover:bg-green-350 active:translate-y-[1px] active:border-[#1c7430]">
                                    Активировать
                                </button>
                            </Cell>
                        </Row>
                    ))}
                </>
            )}
        />
    );
};
