import { Table, Caption, Row, Cell } from "@/components/ui/table";

const formatterUSD = new Intl.NumberFormat("ru-RU", {
    style: "decimal",
    maximumFractionDigits: 0
});

const data = [
    { id: 1, date: new Date(), limit: 100000, discount: 10 },
    { id: 2, date: new Date(), limit: 100000, discount: 15 },
    { id: 3, date: new Date(), limit: 100000, discount: 20 }
];

export const DepositBonusTable = () => {
    return (
        <Table
            className="table-fixed px-1.5 text-center"
            headers={["Лимит бонуса, UZS", "Скидка, %", "Срок действия"]}
            data={data}
            renderCaption={<Caption className="px-3 text-left">Список</Caption>}
            renderData={data => (
                <>
                    {data.map(row => (
                        <Row key={row.id}>
                            <Cell className="text-white">
                                {formatterUSD.format(row.limit)}
                            </Cell>
                            <Cell className="text-white">{row.discount}</Cell>
                            <Cell className="px-2 py-1 text-left text-[10px] leading-none">
                                <p>
                                    {row.date.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </p>
                                <p>{row.date.toLocaleDateString()}</p>
                            </Cell>
                        </Row>
                    ))}
                </>
            )}
        />
    );
};
