import { useRef } from "react";

import { useGetUserQuery, useGetUserReferralQuery } from "@/store";

import {
    Popover,
    PopoverTrigger,
    PopoverContent
} from "@/components/ui/popover";

import { GuestListTable } from "../tables";

interface ReferralProgramPopoverProps {
    open: boolean;
    setPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setDailyStatisticsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ReferralProgramPopover: React.FC<ReferralProgramPopoverProps> = ({
    open,
    setPopoverOpen,
    setDailyStatisticsDialogOpen
}) => {
    const telegramLinkRef = useRef<HTMLAnchorElement>(null);

    const { data: referral } = useGetUserReferralQuery();
    const { data: user } = useGetUserQuery();

    const copyTelegramLinkToClipboard = async () => {
        const link = telegramLinkRef.current?.textContent;

        if (!link) return;

        try {
            await navigator.clipboard.writeText(link);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Popover
            open={open}
            onOpenChange={setPopoverOpen}
        >
            <PopoverTrigger
                tabIndex={-1}
                className="sr-only right-0"
            >
                Реферальная программа
            </PopoverTrigger>
            <PopoverContent
                side="bottom"
                sideOffset={20}
                align="end"
                className="space-y-2 border-gray-50 bg-[#1b1c1d] leading-none text-[#83878e]"
            >
                <h3 className="col-span-2 text-center text-base font-bold text-white">
                    Реферальная программа
                </h3>
                <p className="text-sm">
                    Приглашая людей, вы можете заработать до 40% от их ставок{" "}
                    <a
                        href="#"
                        target="_blank"
                        className="text-blue-600"
                    >
                        Подробнее...
                    </a>
                </p>
                <p className="text-center text-sm font-bold text-white">
                    Ваша ссылка для приглашения
                </p>

                <p className="grid grid-cols-[1fr_auto] items-center gap-1.5 text-xs text-white">
                    <span
                        ref={telegramLinkRef}
                        className="w-full overflow-hidden text-ellipsis text-nowrap text-blue-600"
                    >
                        {`https://t.me/${
                            import.meta.env.VITE_BOT_NAME
                        }?start=${user?.telegramId}`}
                    </span>
                    <button
                        onClick={copyTelegramLinkToClipboard}
                        className="rounded border border-green-50 bg-green-450 px-1.5 py-1 text-xs text-white shadow-[inset_0_1px_1px_#ffffff80] transition-all duration-150 hover:bg-green-350 active:translate-y-[1px] active:border-[#1c7430]"
                    >
                        Скопировать
                    </button>

                    <span>Количество приглашённых</span>
                    <span className="rounded border border-green-50 bg-green-450 px-1.5 py-1 text-center text-xs text-white shadow-[inset_0_1px_1px_#ffffff80]">
                        {referral?.descendants
                            ? referral?.descendants.length
                            : 0}
                    </span>

                    <span>Всего заработанных</span>
                    <span className="rounded border border-green-50 bg-green-450 px-1.5 py-1 text-center text-xs text-white shadow-[inset_0_1px_1px_#ffffff80]">
                        {referral?.referralBalance || 0} {referral?.currency}
                    </span>
                </p>

                <GuestListTable
                    setDailyStatisticsDialogOpen={setDailyStatisticsDialogOpen}
                />
            </PopoverContent>
        </Popover>
    );
};
