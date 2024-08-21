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

    const roundStats = useStateSelector(state => selectRoundStatistic(state));
    const playersList = useStateSelector(state => selectPlayersList(state));

    return (
        <>
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

            {playersList.length === 0 ? (
                <p className="py-2 text-center text-base font-semibold">
                    Пусто
                </p>
            ) : null}
        </>
    );
};
