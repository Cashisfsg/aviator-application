import { Header } from "./header/header";
import { BettingZone } from "./betting-zone";
import { Statistics } from "./statistics";
import { Toaster } from "@/components/ui/toaster";
import { Chart } from "@/components/chart/chart";

export const Layout = () => {
    return (
        <>
            <Header />
            <Chart />
            <BettingZone />
            <Statistics />
            <Toaster />
        </>
    );
};
