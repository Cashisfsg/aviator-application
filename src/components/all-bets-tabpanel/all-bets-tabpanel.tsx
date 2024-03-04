import { useState, useEffect, lazy, Suspense } from "react";
import { useStateSelector, selectSocket } from "@/store";

import { ToggleRoundDetailsButton } from "./toggle-round-details-button";
import { CurrentRoundDetailsTab } from "./current-round-details-tab";
import GridLoader from "react-spinners/GridLoader";

const PreviousRoundDetailsTab = lazy(() =>
    import("./previous-round-details-tab").then(module => ({
        default: module.PreviousRoundDetailsTab
    }))
);

export const AllBetsTabpanel = () => {
    const socket = useStateSelector(state => selectSocket(state));

    const [currentRound, setCurrentRound] = useState(true);

    useEffect(() => {
        const resetRoundDetails = () => {
            if (currentRound) return;

            setCurrentRound(true);
        };

        socket.on("loading", resetRoundDetails);

        return () => socket.off("loading", resetRoundDetails);
    }, [socket, currentRound]);

    const onClickHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
        setCurrentRound(round => !round);
    };

    return (
        <>
            <ToggleRoundDetailsButton onClick={onClickHandler}>
                {currentRound ? "Предыдущий" : "Текущий"}
            </ToggleRoundDetailsButton>
            {currentRound ? (
                <CurrentRoundDetailsTab />
            ) : (
                <Suspense
                    fallback={
                        <div className="mt-5">
                            <GridLoader color="red" />
                        </div>
                    }
                >
                    <PreviousRoundDetailsTab />
                </Suspense>
            )}
        </>
    );
};
