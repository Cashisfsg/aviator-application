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
        <DropdownMenu>
            <DropdownMenuTrigger>3000 $</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Баланс 3000 $</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Пополнить</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Вывести</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
