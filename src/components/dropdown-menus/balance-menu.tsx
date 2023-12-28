import { Link } from "react-router-dom";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export const BalanceMenu = () => {
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="rounded-full border border-[#414148] bg-[#252528] px-3 py-0.5">
                3000 $
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Баланс 3000 $</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link to="/aviator_front/payment">Пополнить</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link to="/aviator_front/payment/draw">Вывести</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
