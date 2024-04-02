import { useGetUserBalanceQuery } from "@/store/api/userApi";
import { useGetPreviousRoundInfoQuery } from "@/store/api/betApi";

import { TotalRoundDetailsTable } from "./total-round-details-table";
import { PlayersList } from "./players-list";
import { Skeleton } from "./skeleton";

export const PreviousRoundDetailsTab = () => {
    const { data: roundDetails, isLoading } = useGetPreviousRoundInfoQuery(
        undefined,
        {
            refetchOnFocus: true
        }
    );
    const { data: balance } = useGetUserBalanceQuery();

    return (
        <>
            {!isLoading ? (
                <>
                    {/* <Skeleton currency={balance?.currency || "USD"} /> */}

                    <TotalRoundDetailsTable
                        betsAmount={roundDetails?.bets.length}
                        totalBets={
                            roundDetails?.betAmount?.[
                                balance?.currency || "USD"
                            ]
                        }
                        totalWinnings={
                            roundDetails?.winAmount?.[
                                balance?.currency || "USD"
                            ]
                        }
                        currency={balance?.currency || "USD"}
                    />

                    <PlayersList
                        players={roundDetails?.bets || []}
                        currency={balance?.currency || "USD"}
                    />
                </>
            ) : (
                <Skeleton currency={balance?.currency || "USD"} />
            )}
            {!isLoading &&
            (roundDetails === undefined || roundDetails.bets.length === 0) ? (
                <p className="py-2 text-center text-base font-semibold">
                    Пусто
                </p>
            ) : null}
        </>
    );
};
