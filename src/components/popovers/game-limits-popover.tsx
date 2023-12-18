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
    return (
        <Popover
            open={open}
            onOpenChange={setOpen}
        >
            <PopoverTrigger className="sr-only right-0">das</PopoverTrigger>
            <PopoverContent
                side="bottom"
                sideOffset={20}
                align="end"
                className="grid select-none grid-cols-[3fr_1fr] items-start gap-x-1 gap-y-1.5 border-gray-50 bg-[#1b1c1d] text-xs leading-none text-[#83878e]"
            >
                <h3 className="col-span-2 pb-2 text-center text-sm font-bold text-white">
                    Игровые лимиты
                </h3>
                <span className="self-center">Минимальная ставка (UZS)</span>
                <button className="rounded border border-green-50 bg-green-450 px-1.5 py-1 text-white shadow-[inset_0_1px_1px_#ffffff80] transition-all duration-150 hover:bg-green-350 active:translate-y-[1px] active:border-[#1c7430]">
                    1000
                </button>
                <span className="self-center">Максимальная ставка (UZS)</span>
                <button className="rounded border border-green-50 bg-green-450 px-1.5 py-1 text-white shadow-[inset_0_1px_1px_#ffffff80] transition-all duration-150 hover:bg-green-350 active:translate-y-[1px] active:border-[#1c7430]">
                    100000
                </button>
                <span>Максимальный выигрыш за одну ставку (UZS)</span>
                <button className="rounded border border-green-50 bg-green-450 px-1.5 py-1 text-white shadow-[inset_0_1px_1px_#ffffff80] transition-all duration-150 hover:bg-green-350 active:translate-y-[1px] active:border-[#1c7430]">
                    1000000
                </button>
            </PopoverContent>
        </Popover>
    );
};
