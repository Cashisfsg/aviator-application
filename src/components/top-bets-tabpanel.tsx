import {
    useGetUserBalanceQuery,
    useStateSelector,
    useAppDispatch,
    fetchUserBetsThunk,
    resetState
} from "@/store";

import { Table, TableHeaderCell, Row, Cell } from "./ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { InfiniteScroll } from "./InfiniteScroll";

import { formatDate, formatTime, formatCurrency } from "@/utils/helpers";
import { useEffect } from "react";

export const TopBetsTabpanel = () => {
    return (
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
        </Tabs>
    );
};

const TabDay = () => {
    const dispatch = useAppDispatch();

    const { data: balance } = useGetUserBalanceQuery();
    const { bets, status, error, hasNextPage } = useStateSelector(
        state => state.bets
    );

    useEffect(() => {
        dispatch(resetState());
    }, []);

    console.log("Top bets: ", bets);

    return (
        <InfiniteScroll
            hasNextPage={hasNextPage}
            callback={() => {
                dispatch(fetchUserBetsThunk());
            }}
            className="scrollbar max-h-64"
        >
            {status === "rejected" && <pre>{error}</pre>}
            <Table
                className="px-1.5"
                headers={[
                    "Время",
                    `Ставка, ${balance?.currency}`,
                    "Коэфф.",
                    `Выигрыш, ${balance?.currency}`
                ]}
                renderHeader={headers => (
                    <thead className="sticky -top-0.5">
                        <Row>
                            {headers.map(header => (
                                <TableHeaderCell
                                    key={header}
                                    className="bg-black-50"
                                >
                                    {header}
                                </TableHeaderCell>
                            ))}
                        </Row>
                    </thead>
                )}
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
        </InfiniteScroll>
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
