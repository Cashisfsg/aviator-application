import { Table, Caption, Cell, Row } from "@/components/ui/table";
import { useGetUserReferralQuery } from "@/store";

import { formatDate, formatTime } from "@/utils/helpers";

interface GuestListTableProps {
    setDailyStatisticsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GuestListTable: React.FC<GuestListTableProps> = ({
    setDailyStatisticsDialogOpen
}) => {
    const { data: referral } = useGetUserReferralQuery();

    return (
        <>
            <Table
                className="text-center"
                headers={["ID", "Дата регистрации", "Заработано"]}
                data={referral?.descendants || []}
                renderCaption={
                    <Caption className="align-bottom">
                        <span className="float-left leading-[18px] text-white">
                            Список приглашенных
                        </span>
                        <button
                            onClick={() => {
                                setDailyStatisticsDialogOpen(true);
                            }}
                            className="float-right cursor-pointer text-blue-500"
                        >
                            По дням
                        </button>
                    </Caption>
                }
                renderData={data => (
                    <>
                        {data.map(descendant => (
                            <Row key={descendant._id}>
                                <Cell className="text-xs">
                                    {descendant._id}
                                </Cell>
                                <Cell className="text-xs">
                                    {formatTime(descendant?.createdAt)},{" "}
                                    {formatDate(descendant?.createdAt)}
                                </Cell>
                                <Cell className="text-xs text-white">
                                    {descendant?.earnings} {referral?.currency}
                                </Cell>
                            </Row>
                        ))}
                    </>
                )}
            />
            {!referral?.descendants || referral?.descendants.length === 0 ? (
                <p className="py-1 text-center text-sm font-semibold text-white">
                    Пусто
                </p>
            ) : null}
        </>
    );
};
