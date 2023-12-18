import { Table, Caption, Cell, Row } from "@/components/ui/table";

const data = [
    { id: 121215, date: new Date(), gain: 1200 },
    { id: 121245, date: new Date(), gain: 200 }
];

interface GuestListTableProps {
    setPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setDailyStatisticsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GuestListTable: React.FC<GuestListTableProps> = ({
    setPopoverOpen,
    setDailyStatisticsDialogOpen
}) => {
    return (
        <Table
            className="text-center"
            headers={["ID", "Дата регистрации", "Заработано"]}
            data={data}
            renderCaption={
                <Caption className="align-bottom ">
                    <span className="float-left text-white">
                        Список приглашенных
                    </span>
                    <a
                        onClick={() => {
                            setDailyStatisticsDialogOpen(true);
                            setPopoverOpen(false);
                        }}
                        className="float-right cursor-pointer text-blue-500"
                    >
                        По дням
                    </a>
                </Caption>
            }
            renderData={data => (
                <>
                    {data.map(row => (
                        <Row key={row.id}>
                            <Cell className="text-xs">{row.id}</Cell>
                            <Cell className="text-xs">
                                {row.date.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                                ,{" "}
                                {row.date.toLocaleDateString([], {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric"
                                })}
                            </Cell>
                            <Cell className="text-xs text-white">
                                {row.gain} UZS
                            </Cell>
                        </Row>
                    ))}
                </>
            )}
        />
    );
};
