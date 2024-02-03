import { Table, Row, Cell } from "@/components/ui/table";

// import { formatDate, formatTime } from "@/utils/helpers";
import {
    useAppDispatch,
    useStateSelector,
    selectCurrentGameTab,
    activateBonus,
    useGetUserPromoQuery,
    useGetUserBalanceQuery
} from "@/store";

export const BonusTable = () => {
    const { data: balance } = useGetUserBalanceQuery();
    const { data: promo } = useGetUserPromoQuery({ type: "promo" });
    const dispatch = useAppDispatch();
    const bonusTab = useStateSelector(state => selectCurrentGameTab(state, 1));

    const onClickHandler = (
        id: string | undefined,
        quantity: number | undefined
    ) => {
        if (!id || !quantity || bonusTab.betState !== "init") return;

        dispatch(activateBonus({ bonusId: id, bonusQuantity: quantity }));
    };

    return (
        <div className="scrollbar max-h-[25dvh]">
            <Table
                className="px-1.5 text-center"
                headers={[
                    `Сумма бонуса, ${balance?.currency}`,
                    "Коэфф., при котором можно заработать выигрыш",
                    "Срок действия"
                ]}
                data={promo || []}
                renderData={data => (
                    <>
                        {data.map(promo => (
                            <Row key={promo?._id}>
                                <Cell className="text-white">
                                    {promo?.amount}
                                </Cell>
                                <Cell>
                                    <span className="rounded-full bg-black/80 px-3 py-0.5 text-xs font-bold text-white">
                                        {promo?.coef}x
                                    </span>
                                </Cell>
                                <Cell className="grid grid-cols-[1fr_auto] grid-rows-2 gap-x-2 px-2 py-1 text-left text-[10px] leading-none">
                                    <time
                                        dateTime={"00:00"}
                                        className="block"
                                    >
                                        {"00:00"}
                                    </time>
                                    <time
                                        dateTime={promo?.will_finish}
                                        className="block"
                                    >
                                        {promo?.will_finish}
                                    </time>
                                    <button
                                        onClick={() =>
                                            onClickHandler(
                                                promo?._id,
                                                promo?.amount
                                            )
                                        }
                                        disabled={bonusTab.betState !== "init"}
                                        className="mh:hover:bg-green-350 col-start-2 col-end-3 row-start-1 row-end-3 w-full rounded border border-green-50 bg-green-450 px-1.5 py-1 text-white shadow-[inset_0_1px_1px_#ffffff80] transition-all duration-150 active:translate-y-[1px] active:border-[#1c7430] disabled:pointer-events-none disabled:opacity-50"
                                    >
                                        Активировать
                                    </button>
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
