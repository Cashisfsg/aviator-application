import { BettingZone } from "@/containers/betting-zone";
import { Statistics } from "@/containers/statistics";
import { Chart } from "@/components/chart/chart";
import { Header } from "@/containers/header/header";

export const MainPage = () => {
    return (
        <>
            <Header />
            {/* <Chart /> */}
            <BettingZone />
            <Statistics />
        </>
    );
};
