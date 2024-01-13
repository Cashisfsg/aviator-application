import { useGetUserBalanceQuery } from "@/store";

import {
    Popover,
    PopoverTrigger,
    PopoverContent
} from "@/components/ui/popover";

interface GameLimitsPopoverProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GameLimitsPopover: React.FC<GameLimitsPopoverProps> = ({
    open,
    setOpen
}) => {
    const { data: balance } = useGetUserBalanceQuery();

    return (
        <Popover
            open={open}
            onOpenChange={setOpen}
        >
            <PopoverTrigger
                tabIndex={-1}
                className="sr-only right-0"
            >
                Игровые лимиты
            </PopoverTrigger>
            <PopoverContent
                side="bottom"
                sideOffset={20}
                align="end"
                className="grid select-none grid-cols-[3fr_1fr] items-start gap-x-1 gap-y-1.5 border-gray-50 bg-[#1b1c1d] text-xs leading-none text-[#83878e]"
            >
                <h3 className="col-span-2 pb-2 text-center text-sm font-bold text-white">
                    Игровые лимиты
                </h3>
                <span className="self-center">{`Минимальная ставка (${balance?.currency})`}</span>
                <span className="rounded border border-green-50 bg-green-450 px-1.5 py-1 text-center text-white shadow-[inset_0_1px_1px_#ffffff80]">
                    1000
                </span>
                <span className="self-center">{`Максимальная ставка (${balance?.currency})`}</span>
                <span className="rounded border border-green-50 bg-green-450 px-1.5 py-1 text-center text-white shadow-[inset_0_1px_1px_#ffffff80]">
                    100000
                </span>
                <span>{`Максимальный выигрыш за одну ставку (${balance?.currency})`}</span>
                <span className="rounded border border-green-50 bg-green-450 px-1.5 py-1 text-center text-white shadow-[inset_0_1px_1px_#ffffff80]">
                    1000000
                </span>
            </PopoverContent>
        </Popover>
    );
};
