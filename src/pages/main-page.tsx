import { BettingZone } from "@/containers/betting-zone";
import { Statistics } from "@/containers/statistics";
import { Chart } from "@/components/chart/chart";
import { Header } from "@/containers/header/header";
import { Toaster } from "@/components/ui/toaster";

export const MainPage = () => {
    return (
        <>
            <Header />

            <main className="flex flex-auto flex-col gap-y-4">
                <Chart />
                <BettingZone />
                <Statistics />
            </main>

            <Toaster />
        </>
    );
};
