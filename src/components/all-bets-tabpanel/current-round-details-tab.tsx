import { useGetUserBalanceQuery } from "@/store/api/userApi";
import { useStateSelector } from "@/store/hooks";

import { TotalRoundDetailsTable } from "./total-round-details-table";
import { PlayersList } from "./players-list";
import {
    selectPlayersList,
    selectRoundStatistic
} from "@/store/slices/test.slice";

export const CurrentRoundDetailsTab = () => {
    const { data: balance, isLoading } = useGetUserBalanceQuery();
    // const roundDetails = useStateSelector(state => selectGameDetails(state));
    const roundStats = useStateSelector(state => selectRoundStatistic(state));
    const playersList = useStateSelector(state => selectPlayersList(state));

    return (
        <>
            {/* {!isLoading ? (
                <> */}
            <TotalRoundDetailsTable
                betsAmount={roundStats.playersAmount}
                totalBets={roundStats.betAmount?.[balance?.currency]}
                totalWinnings={roundStats.winAmount?.[balance?.currency]}
                currency={balance?.currency}
            />

            <PlayersList
                players={playersList || []}
                currency={balance?.currency}
            />
            {/* </>
            ) : null} */}
            {playersList.length === 0 ? (
                <p className="py-2 text-center text-base font-semibold">
                    Пусто
                </p>
            ) : null}
        </>
    );
};
