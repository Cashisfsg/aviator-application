import { useEffect, useRef } from "react";
import { useGetUserBalanceQuery } from "@/store/api/userApi";
import { useAuth } from "@/store/hooks/useAuth";
import { useStateSelector } from "@/store/hooks";

import { useFirstRender } from "@/utils/hooks/useFirstRender";

import { TotalRoundDetailsTable } from "./total-round-details-table";
import { PlayersList } from "./players-list";
import {
    selectPlayersList,
    selectRoundStatistic
} from "@/store/slices/test.slice";

export const CurrentRoundDetailsTab = ({ tableRef }) => {
    const { isAuthenticated } = useAuth();
    const { data: balance } = useGetUserBalanceQuery(undefined, {
        skip: !isAuthenticated
    });
    // const tableRef = useRef<HTMLDivElement>(null);

    // const roundDetails = useStateSelector(state => selectGameDetails(state));
    const roundStats = useStateSelector(state => selectRoundStatistic(state));
    const playersList = useStateSelector(state => selectPlayersList(state));

    // const isFirstRender = useFirstRender();

    // useEffect(() => {
    //     console.log("First render");
    //     console.log(isFirstRender);

    //     if (isFirstRender) return;

    //     console.log("Scroll");

    //     tableRef.current?.scrollIntoView({
    //         behavior: "smooth",
    //         block: "start"
    //     });
    // }, [isFirstRender]);

    return (
        <div
            ref={tableRef}
            onLoad={() => console.log("Loading finished")}
        >
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
