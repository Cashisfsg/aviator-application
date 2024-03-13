import { useStateSelector } from "@/store/hooks";
import { selectInitData } from "@/store/slices/authSlice";

import {
    DropDownMenuItem,
    DropDownMenuSeparator
} from "@/components/ui/drop-down-list";

import { PiTelegramLogoBold } from "react-icons/pi";
import { BsBrowserEdge } from "react-icons/bs";

export const RedirectMenu = () => {
    const { telegramId } = useStateSelector(state => selectInitData(state));

    return (
        <>
            <DropDownMenuItem>
                <a
                    href={
                        telegramId
                            ? "https://avibet.io"
                            : `https://t.me/${import.meta.env.VITE_BOT_NAME}`
                    }
                    target="_blank"
                    className="flex gap-x-2 px-2.5 py-2"
                >
                    {telegramId ? (
                        <BsBrowserEdge className="text-base text-[#767B85]" />
                    ) : (
                        <PiTelegramLogoBold className="text-base text-[#767B85]" />
                    )}
                    <span>
                        {telegramId
                            ? "Перейти на сайт"
                            : "Перейти в Телеграм-бот"}
                    </span>
                </a>
            </DropDownMenuItem>
            <DropDownMenuSeparator />
        </>
    );
};
