import { Header } from "./header/header";
import { BettingZone } from "./betting-zone";
import { Statistics } from "./statistics";

export const Layout = () => {
    return (
        <>
            <Header />
            <BettingZone />
            <Statistics />
        </>
    );
};
