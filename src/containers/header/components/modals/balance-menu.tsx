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
            <DropdownMenuContent className="bg-black-250 text-slate-200">
                <DropdownMenuLabel>Баланс 3000 $</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Пополнить</DropdownMenuItem>
                <DropdownMenuItem>Вывести</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
