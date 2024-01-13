import { useState, useEffect } from "react";

import {
    // useGetUserReferralByDaysQuery
    useStateSelector,
    useAppDispatch,
    useGetUserBalanceQuery,
    fetchReferralByDays
    // fetchReferralByDays
} from "@/store";

import { Table, Row, Cell } from "@/components/ui/table";
import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent
} from "@/components/ui/collapsible";

import { formatDate, formatCurrency } from "@/utils/helpers";

const MAX_ITEMS_BEFORE_EXPAND = 3;

export const DailyStatisticsTable = () => {
    const [open, setOpen] = useState(false);

    const dispatch = useAppDispatch();
    const { data: balance } = useGetUserBalanceQuery();
    const { referrals, status } = useStateSelector(state => state.referral);

    useEffect(() => {
        dispatch(fetchReferralByDays());
    }, []);
    // const { data: referral } = useGetUserReferralByDaysQuery();

    return (
        <Collapsible
            open={open}
            onOpenChange={setOpen}
        >
            <div className="scrollbar max-h-[50dvh]">
                <Table
                    className="px-1.5 text-center"
                    headers={["Дата", "Заработано"]}
                    data={referrals || []}
                    renderData={descendants => (
                        <>
                            {descendants
                                .slice(0, MAX_ITEMS_BEFORE_EXPAND)
                                .map(descendant => (
                                    <Row key={descendant?._id}>
                                        <Cell className="px-2 py-1 text-center leading-none text-white">
                                            <time dateTime={descendant?.date}>
                                                {formatDate(descendant?.date)}
                                            </time>
                                        </Cell>

                                        <Cell>
                                            {formatCurrency(
                                                descendant?.totalEarned
                                            )}{" "}
                                            {balance?.currency}
                                        </Cell>
                                    </Row>
                                ))}
                            <CollapsibleContent asChild>
                                <>
                                    {descendants
                                        .slice(MAX_ITEMS_BEFORE_EXPAND)
                                        .map(descendant => (
                                            <Row key={descendant?._id}>
                                                <Cell className="px-2 py-1 text-center leading-none text-white">
                                                    {formatDate(
                                                        descendant?.date
                                                    )}
                                                </Cell>
                                                <Cell>
                                                    {formatCurrency(
                                                        descendant?.totalEarned
                                                    )}{" "}
                                                    {balance?.currency}
                                                </Cell>
                                            </Row>
                                        ))}
                                </>
                            </CollapsibleContent>
                        </>
                    )}
                />
                {status === "fulfilled" &&
                (!referrals || referrals.length === 0) ? (
                    <p className="py-2 text-center font-semibold">Пусто</p>
                ) : null}
            </div>
            {referrals && referrals.length > MAX_ITEMS_BEFORE_EXPAND ? (
                <CollapsibleTrigger className="mt-4 w-full rounded-t-none bg-[#252528] py-2 focus-visible:outline-none focus-visible:ring-0">
                    {open ? "Скрыть" : "Показать ещё"}
                </CollapsibleTrigger>
            ) : null}
        </Collapsible>
    );
};
