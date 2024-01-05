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

    const { data } = useGetUserBalanceQuery();

    return (
        <>
            {isAuthenticated ? (
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger
                        disabled={!isAuthenticated}
                        className="rounded-full border border-[#414148] bg-[#252528] px-3 py-0.5"
                    >
                        {data?.balance.toFixed(2) || "300"}{" "}
                        {data?.currency || "$"}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>
                            Баланс {data?.balance.toFixed(2)} {data?.currency}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link to="/aviator_front/payment/replenishment">
                                Пополнить
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link to="/aviator_front/payment/draw">
                                Вывести
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : null}
        </>
    );
};
