import { Table, Caption, Row, Cell } from "@/components/ui/table";

import { formatDate, formatTime, formatCurrency } from "@/utils/helpers";

import { useGetUserBalanceQuery, UserBonus } from "@/store";
interface DepositBonusTableProps {
    bonuses: UserBonus[] | undefined;
}

export const DepositBonusTable: React.FC<DepositBonusTableProps> = ({
    bonuses
}) => {
    const { data: balance } = useGetUserBalanceQuery();

    return (
        <div className="scrollbar max-h-[25dvh]">
            <Table
                className="table-fixed px-1.5 text-center"
                headers={[
                    `Лимит бонуса, ${balance?.currency}`,
                    "Скидка, %",
                    "Срок действия"
                ]}
                data={bonuses || []}
                renderCaption={
                    <Caption className="px-3 text-left">Список</Caption>
                }
                renderData={data => (
                    <>
                        {data.map(bonus => (
                            <Row key={bonus._id}>
                                <Cell className="text-white">
                                    {formatCurrency(bonus?.bonus)}
                                </Cell>
                                <Cell className="text-white">
                                    {bonus?.bonusPercent}
                                </Cell>
                                <Cell className="px-2 py-1 text-left text-[10px] leading-none">
                                    <time dateTime={bonus?.expiresIn}>
                                        {formatTime(bonus?.expiresIn)}
                                    </time>
                                    <time dateTime={bonus?.expiresIn}>
                                        {formatDate(bonus?.expiresIn)}
                                    </time>
                                </Cell>
                            </Row>
                        ))}
                    </>
                )}
            />
            {!bonuses || bonuses.length === 0 ? (
                <p className="py-2 text-center text-base font-semibold">
                    Пусто
                </p>
            ) : null}
        </div>
    );
};
