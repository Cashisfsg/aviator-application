import { Link } from "react-router-dom";

import { BalanceMenu } from "@/components/dropdown-menus";
import { Logo } from "@/containers/header/components/logo";

export const Header = () => {
    return (
        <header className="flex items-center justify-between py-2">
            <Link to="/aviator_front/main">
                <Logo />
            </Link>
            <BalanceMenu />
        </header>
    );
};
