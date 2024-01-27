import { Outlet, useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();

    return (
        <Popover
            open={open}
            onOpenChange={() => {
                if (open) sessionStorage.removeItem("email");
                setPopoverOpen(open => !open);
            }}
        >
            <PopoverTrigger
                tabIndex={-1}
                className="sr-only right-0"
            >
                Trigger
            </PopoverTrigger>
            <PopoverContent
                side="bottom"
                sideOffset={20}
                align="end"
                onPointerDownOutside={() => navigate("/main")}
                className="w-60  border-[#414148] bg-[#1b1c1d] text-sm font-semibold leading-none text-white"
            >
                <Outlet />
            </PopoverContent>
        </Popover>
    );
};
