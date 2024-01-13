import { useState } from "react";
import {
    useGetTopBetsQuery,
    useGetUserBalanceQuery
    // topBetsSelector,
    // topBetsAdapter
} from "@/store";

import { Table, TableHeaderCell, Row, Cell } from "./ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { InfiniteScroll } from "./InfiniteScroll";

import { formatDate, formatTime, formatCurrency } from "@/utils/helpers";

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
    const [queryParams, setQueryParams] = useState({ skip: 0, limit: 6 });

    const { data: balance, isSuccess } = useGetUserBalanceQuery();
    const {
        data: bets,
        hasNextPage,
        error,
        isError
    } = useGetTopBetsQuery(
        {
            skip: queryParams.skip,
            limit: queryParams.limit
        },
        {
            selectFromResult: ({ data }) => ({
                data: data?.data,
                hasNextPage: data?.hasNextPage
            })
        }
        // {
        //     selectFromResult: ({ data, ...otherParams }) => ({
        //         data: topBetsSelector.selectAll(
        //             data ?? topBetsAdapter.getInitialState()
        //         ),
        //         ...otherParams
        //     })
        // }
    );

    console.log("Bets selected: ", bets);
    console.log("Has next in top bets: ", hasNextPage);

    // const { bets, status, error, hasNextPage } = useStateSelector(
    //     state => state.bets.top
    // );

    // useEffect(() => {
    //     dispatch(resetTopBetsState());
    // }, []);

    // console.log("Top bets: ", bets);

    return (
        <InfiniteScroll
            hasNextPage={hasNextPage}
            // isLoading={status === "pending"}
            callback={() => {
                if (!hasNextPage) return;
                setQueryParams(queryParams => ({
                    ...queryParams,
                    skip: queryParams.skip + 6
                }));
            }}
            className="scrollbar max-h-64"
        >
            {isError && <pre>{error?.data?.message}</pre>}
            {!isError ? (
                <Table
                    className="px-1.5"
                    headers={[
                        "Время",
                        `Ставка, ${balance?.currency}`,
                        "Коэфф.",
                        `Выигрыш, ${balance?.currency}`
                    ]}
                    renderHeader={headers => (
                        // <thead className="sticky -top-0.5">
                        <Row>
                            {headers.map(header => (
                                <TableHeaderCell
                                    key={header}
                                    className="sticky -top-0.5 bg-black-50"
                                >
                                    {header}
                                </TableHeaderCell>
                            ))}
                        </Row>
                        // </thead>
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
                                                    ? "rounded-full bg-black/80 px-3 py-0.5 text-xs font-bold text-[#c017b4]"
                                                    : "px-3 py-0.5 text-sm font-bold"
                                            }
                                        >
                                            {bet?.win && bet?.win !== 0
                                                ? `${formatCurrency(
                                                      bet?.coeff
                                                  )}x`
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
            ) : null}
            {isSuccess && (!bets || bets.length === 0) ? (
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
