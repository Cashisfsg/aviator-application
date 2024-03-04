import { useGetUserBalanceQuery } from "@/store/api/userApi";
import { useGetPreviousRoundInfoQuery } from "@/store/api/betApi";

import { TotalRoundDetailsTable } from "./total-round-details-table";
import { PlayersList } from "./players-list";

export const PreviousRoundDetailsTab = () => {
    const { data: roundDetails } = useGetPreviousRoundInfoQuery(undefined, {
        refetchOnFocus: true
    });
    const { data: balance, isLoading } = useGetUserBalanceQuery();

    return (
        <>
            {/* {!isLoading ? (
                <> */}
            <TotalRoundDetailsTable
                betsAmount={roundDetails?.bets.length}
                totalBets={roundDetails?.betAmount?.[balance?.currency]}
                totalWinnings={roundDetails?.winAmount?.[balance?.currency]}
                currency={balance?.currency}
            />

            <PlayersList
                players={roundDetails?.bets || []}
                currency={balance?.currency}
            />
            {/* </>
            ) : null} */}
            {roundDetails === undefined || roundDetails.bets.length === 0 ? (
                <p className="py-2 text-center text-base font-semibold">
                    Пусто
                </p>
            ) : null}
        </>
    );
};
