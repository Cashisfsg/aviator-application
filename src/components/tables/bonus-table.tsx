import { Table, Row, Cell } from "@/components/ui/table";

import { formatDate, formatTime } from "@/utils/helpers";
import { useGetUserBalanceQuery, UserBonus } from "@/store";

interface BonusTableProps {
    bonuses: UserBonus[] | undefined;
}

export const BonusTable: React.FC<BonusTableProps> = ({ bonuses }) => {
    const { data: balance } = useGetUserBalanceQuery();

    return (
        <div className="scrollbar max-h-[25dvh]">
            <Table
                className="px-1.5 text-center"
                headers={[
                    `Сумма бонуса, ${balance?.currency}`,
                    "Коэфф., при котором можно заработать выигрыш",
                    "Срок действия"
                ]}
                data={bonuses || []}
                renderData={data => (
                    <>
                        {data.map(bonus => (
                            <Row key={bonus?._id}>
                                <Cell className="text-white">
                                    {bonus?.bonus}
                                </Cell>
                                <Cell>
                                    <span className="rounded-full bg-black/80 px-3 py-0.5 text-xs font-bold text-white">
                                        {bonus?.bonusCoeff}x
                                    </span>
                                </Cell>
                                <Cell className="grid grid-cols-[1fr_auto] grid-rows-2 gap-x-2 px-2 py-1 text-left text-[10px] leading-none">
                                    <time
                                        dateTime={bonus?.expiresIn}
                                        className="block"
                                    >
                                        {formatTime(bonus?.expiresIn)}
                                    </time>
                                    <time
                                        dateTime={bonus?.expiresIn}
                                        className="block"
                                    >
                                        {formatDate(bonus?.expiresIn)}
                                    </time>
                                    <button className="col-start-2 col-end-3 row-start-1 row-end-3 w-full rounded border border-green-50 bg-green-450 px-1.5 py-1 text-white shadow-[inset_0_1px_1px_#ffffff80] transition-all duration-150 hover:bg-green-350 active:translate-y-[1px] active:border-[#1c7430]">
                                        Активировать
                                    </button>
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
