import { Table, Row, Cell } from "./ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    useGetUserBalanceQuery,
    useGetTopBetsQuery,
    useStateSelector,
    useAppDispatch,
    fetchUserBetsThunk
} from "@/store";

import { formatDate, formatTime, formatCurrency } from "@/utils/helpers";

export const TopBetsTabpanel = () => {
    const dispatch = useAppDispatch();
    return (
        <>
            <Tabs defaultValue="day">
                <TabsList className="mt-4">
                    <TabsTrigger value="day">День</TabsTrigger>
                    <TabsTrigger value="month">Месяц</TabsTrigger>
                    <TabsTrigger value="year">Год</TabsTrigger>
                </TabsList>
                <TabsContent value="day">
                    <TabDay />
                </TabsContent>
                <TabsContent value="month">
                    <TabDay />
                </TabsContent>
                <TabsContent value="year">
                    <TabDay />
                </TabsContent>
                <button
                    onClick={() => {
                        dispatch(fetchUserBetsThunk());
                    }}
                >
                    Get bets
                </button>
            </Tabs>
        </>
    );
};

const TabDay = () => {
    // const { data: bets } = useGetTopBetsQuery();
    const { data: balance } = useGetUserBalanceQuery();
    const { bets, status, error } = useStateSelector(state => state.bets);

    console.log("Top bets: ", bets);

    return (
        <>
            {status === "rejected" && <pre>{error}</pre>}
            <Table
                className="px-1.5"
                headers={[
                    "Время",
                    `Ставка, ${balance?.currency}`,
                    "Коэфф.",
                    `Выигрыш, ${balance?.currency}`
                ]}
                data={bets || []}
                renderData={data => (
                    <>
                        {data.map(bet => (
                            <Row
                                key={bet?._id}
                                className="[&>td:nth-child(even)]:font-bold [&>td:nth-child(even)]:text-white"
                            >
                                <Cell className="px-2 py-1 text-left text-[10px] leading-none">
                                    <time
                                        dateTime={bet?.time}
                                        className="block"
                                    >
                                        {formatTime(bet?.time)}
                                    </time>
                                    <time
                                        dateTime={bet?.time}
                                        className="block"
                                    >
                                        {formatDate(bet?.time)}
                                    </time>
                                </Cell>
                                <Cell>{formatCurrency(bet?.bet)}</Cell>
                                <Cell>
                                    <span
                                        className={
                                            bet?.win && bet?.win !== 0
                                                ? "rounded-full bg-black/80 px-3 py-0.5 text-xs font-bold"
                                                : "px-3 py-0.5 text-sm font-bold"
                                        }
                                    >
                                        {bet?.win && bet?.win !== 0
                                            ? `${formatCurrency(bet?.coeff)}x`
                                            : "-"}
                                    </span>
                                </Cell>
                                <Cell>
                                    {bet?.win && bet?.win !== 0
                                        ? formatCurrency(bet?.win)
                                        : "-"}
                                </Cell>
                            </Row>
                        ))}
                    </>
                )}
            />
            {!bets || bets.length === 0 ? (
                <p className="py-2 text-center text-base font-semibold">
                    Пусто
                </p>
            ) : null}
        </>
    );
};

// const TabMonth = () => {
//     const { data: bets } = useGetTopBetsQuery();

//     console.log(bets);

//     return (
//         <>
//             <Table
//                 headers={["Куши", "Наибольшие выигрыши", "Коэфф."]}
//                 data={[]}
//                 renderData={() => <></>}
//             />
//             {!bets || bets.length === 0 ? (
//                 <p className="py-2 text-center text-base font-semibold">
//                     Пусто
//                 </p>
//             ) : null}
//         </>
//     );
// };
