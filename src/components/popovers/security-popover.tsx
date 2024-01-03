import { Outlet } from "react-router-dom";

import {
    Popover,
    PopoverTrigger,
    PopoverContent
} from "@/components/ui/popover";

interface SecurityPopoverProps {
    open: boolean;
    setPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SecurityPopover: React.FC<SecurityPopoverProps> = ({
    open,
    setPopoverOpen
}) => {
    return (
        <Popover
            open={open}
            onOpenChange={setPopoverOpen}
        >
            <PopoverTrigger
                // className="sr-only"
                tabIndex={-1}
            >
                Trigger
            </PopoverTrigger>
            <PopoverContent className="w-60  border-[#414148] bg-[#1b1c1d] text-sm font-semibold leading-none text-white">
                <Outlet />
            </PopoverContent>
        </Popover>
    );
};
