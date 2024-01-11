import { Link } from "react-router-dom";
import { useAuth } from "@/store/hooks/useAuth";
import { useGetUserBalanceQuery } from "@/store";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export const BalanceMenu = () => {
    const { isAuthenticated } = useAuth();

    const { data: balance } = useGetUserBalanceQuery(undefined, {
        skip: !isAuthenticated
    });

    return (
        <>
            {isAuthenticated ? (
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger
                        disabled={!isAuthenticated}
                        className="rounded-full border border-[#414148] bg-[#252528] px-3 py-0.5"
                    >
                        {balance?.balance.toFixed(2) || "300"}{" "}
                        {balance?.currency || "$"}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>
                            Баланс {balance?.balance.toFixed(2)}{" "}
                            {balance?.currency}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link to="/payment/replenishment">Пополнить</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link to="/payment/draw">Вывести</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : null}
        </>
    );
};
