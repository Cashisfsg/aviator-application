import { Header } from "./header/header";
import { BettingZone } from "./betting-zone";
import { Statistics } from "./statistics";
import { Chart } from "@/components/chart";

export const Layout = () => {
    return (
        <>
            <Header />
            <Chart />
            <BettingZone />
            <Statistics />
        </>
    );
};
