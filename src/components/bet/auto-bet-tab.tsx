import { useState, useEffect, useRef } from "react";

import { userApi } from "@/store/api/userApi";
import { useGetUserBetsQuery } from "@/store/api/betApi";
import { useStateSelector, useAppDispatch } from "@/store/hooks";
import {
    selectBonus,
    selectCurrentGameTab,
    setBetState,
    toggleAutoMode
} from "@/store/slices/gameSlice";
import { selectSoundSettings } from "@/store/slices/settingsSlice";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { decimal, validateBet } from "@/utils/helpers/validate-bet";

interface AutoBetTabProps {
    betNumber: 1 | 2;
    audioRef: React.RefObject<HTMLAudioElement>;
}

const MIN_RATE = 1.1;

export const AutoBetTab: React.FC<AutoBetTabProps> = ({
    betNumber,
    audioRef
}) => {
    const dispatch = useAppDispatch();

    const currentGameTab = useStateSelector(state =>
        selectCurrentGameTab(state, betNumber)
    );
    const { refetch } = useGetUserBetsQuery({ skip: 0, limit: 6 });

    const bonus = useStateSelector(state => selectBonus(state));
    const soundEnabled = useStateSelector(state => selectSoundSettings(state));

    const inputValidValue = useRef<string>(
        bonus.bonusActive
            ? (bonus.bonusCoefficient as number).toFixed(2)
            : MIN_RATE.toFixed(2)
    );
    const [rate, setRate] = useState(
        bonus.bonusActive ? (bonus.bonusCoefficient as number) : MIN_RATE
    );

    // useEffect(() => {
    //     const autoBet = ({ x }: { x: number }) => {
    //         if (
    //             !currentGameTab.autoModeOn ||
    //             currentGameTab.betState !== "cash"
    //         ) {
    //             // socket.off("game", autoBet);
    //             return;
    //         }

    //         if (x < rate) return;

    //         socket.emit("cash-out", {
    //             betNumber
    //         });

    //         if (bonus.bonusActive && betNumber === 1) {
    //             // dispatch(deactivateBonus());
    //             // toast({
    //             //     title: `Вы выиграли ${(
    //             //         (rate - 1) *
    //             //         (bonus?.bonusQuantity as number)
    //             //     ).toFixed(2)} ${currentGameTab.currency}`,
    //             //     duration: 5000
    //             // });
    //         } else {
    //             // toast({
    //             //     title: `Вы выиграли ${(
    //             //         (rate - 1) *
    //             //         currentGameTab.currentBet
    //             //     ).toFixed(2)} ${currentGameTab.currency}`,
    //             //     duration: 5000
    //             // });
    //             toast.custom(
    //                 t => (
    //                     <SucceedToast
    //                         t={t}
    //                         gain={rate * currentGameTab.currentBet}
    //                         rate={rate}
    //                         currency={currentGameTab.currency}
    //                     />
    //                 ),
    //                 {
    //                     position: "top-center",
    //                     classNames: {
    //                         toast: "group-[.toaster]:!bg-transparent group-[.toaster]:!gap-0 group-[.toaster]:!shadow-none"
    //                     },
    //                     className: "w-[356px]"
    //                 }
    //             );
    //         }

    //         dispatch(userApi.util.invalidateTags(["Balance"]));
    //         // dispatch(betApi.util.resetApiState());
    //         // dispatch(betApi.util.invalidateTags(["My"]));
    //         refetch();
    //         dispatch(setBetState({ betNumber, betState: "init" }));

    //         // socket.off("game", autoBet);

    //         if (!audioRef.current || !soundEnabled) return;

    //         audioRef.current.currentTime = 0.25;
    //         audioRef.current?.play();
    //     };

    //     socket.on("game", autoBet);

    //     // return () => {
    //     //     socket.off("game", autoBet);
    //     // };
    // }, [
    //     rate,
    //     currentGameTab.autoModeOn,
    //     currentGameTab.betState,
    //     soundEnabled
    // ]);

    const onChangeHandler: React.ChangeEventHandler<
        HTMLInputElement
    > = event => {
        try {
            inputValidValue.current = decimal(event.currentTarget.value);
        } catch (error) {
            return;
        } finally {
            event.currentTarget.value = inputValidValue.current;
        }
    };

    const onBlurHandler: React.FocusEventHandler<HTMLInputElement> = event => {
        if (!currentGameTab.balance) return;

        const value = validateBet(
            event.target.value,
            bonus.bonusActive ? (bonus.bonusCoefficient as number) : MIN_RATE,
            100
        );
        event.currentTarget.value = value.toFixed(2);
        setRate(value);
    };

    return (
        <fieldset
            disabled={currentGameTab.betState !== "init"}
            className="grid grid-cols-[auto_100px] items-center justify-evenly  gap-3"
        >
            <Label
                direction="row"
                className="text-xs leading-none text-[#9ea0a3]"
            >
                <span>Авто кешаут</span>
                <Switch
                    disabled={currentGameTab.betState !== "init"}
                    onClick={() => dispatch(toggleAutoMode({ betNumber }))}
                />
            </Label>
            {/* <div className="flex h-8 items-center gap-2 rounded-full border border-gray-50 bg-black-250 px-3 leading-none"> */}
            <input
                disabled={!currentGameTab.autoModeOn}
                defaultValue={MIN_RATE.toFixed(2)}
                onChange={onChangeHandler}
                onBlur={onBlurHandler}
                className="h-8 w-full rounded-full border border-gray-50 bg-black-250 px-3 text-center font-bold leading-none focus-visible:outline-none disabled:opacity-50"
            />

            {/* </div> */}
        </fieldset>
    );
};
