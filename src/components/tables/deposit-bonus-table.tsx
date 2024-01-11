import { Table, Caption, Row, Cell } from "@/components/ui/table";

import { formatDate, formatTime, formatCurrency } from "@/utils/helpers";

import { useGetUserBalanceQuery, useGetUserPromoQuery } from "@/store";

export const DepositBonusTable = () => {
    const { data: balance } = useGetUserBalanceQuery();
    const { data: promo } = useGetUserPromoQuery({ type: "add_balance" });

    return (
        <div className="scrollbar max-h-[25dvh]">
            <Table
                className="table-fixed px-1.5 text-center"
                headers={[
                    `Лимит бонуса, ${balance?.currency}`,
                    "Скидка, %",
                    "Срок действия"
                ]}
                data={promo || []}
                renderCaption={
                    <Caption className="px-3 text-left">Список</Caption>
                }
                renderData={data => (
                    <>
                        {data.map(code => (
                            <Row key={code._id}>
                                <Cell className="text-white">
                                    {formatCurrency(code?.amount)}
                                </Cell>
                                <Cell className="text-white">{code?.coef}</Cell>
                                <Cell className="px-2 py-1 text-left text-[10px] leading-none">
                                    <time dateTime={code?.will_finish}>
                                        {formatTime(code?.will_finish)}
                                    </time>
                                    <time dateTime={code?.will_finish}>
                                        {formatDate(code?.will_finish)}
                                    </time>
                                </Cell>
                            </Row>
                        ))}
                    </>
                )}
            />
            {!promo || promo.length === 0 ? (
                <p className="py-2 text-center text-base font-semibold">
                    Пусто
                </p>
            ) : null}
        </div>
    );
};
