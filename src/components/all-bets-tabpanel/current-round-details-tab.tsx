import { useGetUserBalanceQuery } from "@/store/api/userApi";
import { useStateSelector, selectGameDetails } from "@/store";

import { TotalRoundDetailsTable } from "./total-round-details-table";
import { PlayersList } from "./players-list";

export const CurrentRoundDetailsTab = () => {
    const { data: balance, isLoading } = useGetUserBalanceQuery();
    const roundDetails = useStateSelector(state => selectGameDetails(state));

    return (
        <>
            {/* {!isLoading ? (
                <> */}
            <TotalRoundDetailsTable
                betsAmount={roundDetails?.currentPlayers.length}
                totalBets={roundDetails?.betAmount}
                totalWinnings={roundDetails?.winAmount}
                currency={balance?.currency}
            />

            <PlayersList
                players={roundDetails.currentPlayers || []}
                currency={balance?.currency}
            />
            {/* </>
            ) : null} */}
            {roundDetails === undefined ||
            roundDetails.currentPlayers.length === 0 ? (
                <p className="py-2 text-center text-base font-semibold">
                    Пусто
                </p>
            ) : null}
        </>
    );
};
