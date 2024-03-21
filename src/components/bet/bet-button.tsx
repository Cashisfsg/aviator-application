import { useAppDispatch, useStateSelector } from "@/store/hooks";
import { selectBonus, selectCurrentGameTab } from "@/store/slices/gameSlice";
import {
    abortBet,
    makeBet,
    cashOut,
    selectRoundRate
} from "@/store/slices/test.slice";
import { toast } from "@/components/toasts/toast";

interface BetButtonProps {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    betNumber: 1 | 2;
}

export const BetButton: React.FC<BetButtonProps> = ({ betNumber, onClick }) => {
    const dispatch = useAppDispatch();
    const currentGameTab = useStateSelector(state =>
        selectCurrentGameTab(state, betNumber)
    );
    const bonus = useStateSelector(state => selectBonus(state));
    const rate = useStateSelector(state => selectRoundRate(state, betNumber));

    const placeBet = () => {
        if (currentGameTab.currentBet > currentGameTab.balance) {
            toast.notEnoughMoney();
            return;
        }

        dispatch(
            makeBet({
                betNumber,
                currency: currentGameTab.currency,
                bet: currentGameTab.currentBet
            })
        );
    };

    const cancelBet = () => {
        dispatch(abortBet(betNumber));
    };

    const cashOutMoney: React.MouseEventHandler<HTMLButtonElement> = event => {
        toast.win(
            rate * currentGameTab.currentBet,
            rate,
            currentGameTab.currency
        );

        dispatch(cashOut(betNumber));
        onClick?.(event);
    };

    switch (currentGameTab.betState) {
        case "init":
            return (
                <button
                    style={{ textShadow: "0 1px 2px rgba(0, 0, 0, .5)" }}
                    onClick={placeBet}
                    className="min-h-[86px] rounded-2.5xl border-2 border-green-50 bg-green-450 px-3 py-1.5 font-semibold uppercase leading-none tracking-wider shadow-[inset_0_1px_1px_#ffffff80] transition-all duration-150 active:translate-y-[1px] active:border-[#1c7430] mh:hover:bg-green-350"
                >
                    <p className="text-xl">Ставка</p>
                    <p>
                        <span className="text-2xl">
                            {betNumber === 1 && bonus.bonusActive
                                ? bonus.bonusQuantity
                                : currentGameTab.currentBet.toFixed(2)}
                        </span>{" "}
                        <span className="text-lg">
                            {currentGameTab.currency}
                        </span>
                    </p>
                </button>
            );
        case "start":
            return (
                <button
                    onClick={cancelBet}
                    className="h-full min-h-[86px] w-full rounded-2.5xl border-2 border-[#ff7171] bg-[#cb011a] px-3 py-1.5 text-xl font-semibold uppercase leading-none tracking-wider shadow-[inset_0_1px_1px_#ffffff80] transition-all duration-150 active:translate-y-[1px] active:border-[#b21f2d] mh:hover:bg-[#f7001f]"
                >
                    Отмена
                </button>
            );
        case "bet":
            return (
                <div className="grid h-full w-full grid-rows-[1fr_2fr] place-items-center">
                    <p className="text-sm text-[#ffffffb3]">
                        Ожидаем новый раунд
                    </p>
                    <button
                        onClick={cancelBet}
                        className="h-full min-h-[57px] w-full rounded-2.5xl border-2 border-[#ff7171] bg-[#cb011a] px-3 py-1.5 text-xl font-semibold uppercase leading-none tracking-wider shadow-[inset_0_1px_1px_#ffffff80] transition-all duration-150 active:translate-y-[1px] active:border-[#b21f2d] mh:hover:bg-[#f7001f]"
                    >
                        Отмена
                    </button>
                </div>
            );
        case "cash":
            return (
                <button
                    onClick={cashOutMoney}
                    disabled={bonus.bonusActive && !bonus.bonusCashOutEnabled}
                    className="min-h-[86px] rounded-2.5xl border-2 border-[#ffbd71] bg-[#d07206] px-3 py-1.5 text-xl font-semibold uppercase leading-none tracking-wider shadow-[inset_0_1px_1px_#ffffff80] transition-all duration-150 active:translate-y-[1px] active:border-[#c69500] disabled:opacity-80 mh:hover:enabled:bg-[#f58708] mh:disabled:hover:cursor-not-allowed"
                >
                    <p>Вывести</p>
                    <p className="text-2xl">
                        <span className="text-2xl">
                            {(
                                rate *
                                (bonus.bonusActive
                                    ? bonus.bonusQuantity
                                    : currentGameTab.currentBet)
                            )?.toFixed(2)}
                        </span>{" "}
                        <span className="text-lg">
                            {currentGameTab.currency}
                        </span>
                    </p>
                </button>
            );

        default:
            return <></>;
    }
};
