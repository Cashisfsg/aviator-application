import { useLayoutEffect, useRef } from "react";
import { useGetUserBalanceQuery } from "@/store/api/userApi";
import { useAuth } from "@/store/hooks/useAuth";
import { useStateSelector } from "@/store/hooks";

import { TotalRoundDetailsTable } from "./total-round-details-table";
import { PlayersList } from "./players-list";
import {
    selectPlayersList,
    selectRoundStatistic
} from "@/store/slices/test.slice";

export const CurrentRoundDetailsTab = () => {
    const { isAuthenticated } = useAuth();
    const { data: balance } = useGetUserBalanceQuery(undefined, {
        skip: !isAuthenticated
    });
    const tableRef = useRef<HTMLDivElement>(null);
    const firstRender = useRef(true);

    // const roundDetails = useStateSelector(state => selectGameDetails(state));
    const roundStats = useStateSelector(state => selectRoundStatistic(state));
    const playersList = useStateSelector(state => selectPlayersList(state));

    useLayoutEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }

        tableRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }, []);

    return (
        <div ref={tableRef}>
            {/* {!isLoading ? (
                <> */}
            <TotalRoundDetailsTable
                betsAmount={roundStats.playersAmount}
                totalBets={roundStats.betAmount?.[balance?.currency || "USD"]}
                totalWinnings={
                    roundStats.winAmount?.[balance?.currency || "USD"]
                }
                currency={balance?.currency || "USD"}
            />

            <PlayersList
                players={playersList || []}
                currency={balance?.currency || "USD"}
            />
            {/* </>
            ) : null} */}
            {playersList.length === 0 ? (
                <p className="py-2 text-center text-base font-semibold">
                    Пусто
                </p>
            ) : null}
        </div>
    );
};
