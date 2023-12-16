import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AllBets } from "@/components/all-bets";
import { BetHistory } from "@/components/bet-history";

export const Statistics = () => {
    return (
        <Tabs
            defaultValue="all"
            className="rounded-2.5xl pb-8 pt-4"
        >
            <TabsList>
                <TabsTrigger value="all">Все ставки</TabsTrigger>
                <TabsTrigger value="history">Мои</TabsTrigger>
                <TabsTrigger value="top">Топ</TabsTrigger>
            </TabsList>
            <TabsContent
                value="all"
                className="mt-5 gap-x-1 gap-y-2 rounded-2.5xl bg-black-50 px-1.5 py-5"
            >
                <AllBets />
            </TabsContent>
            <TabsContent
                value="history"
                className="mt-5 gap-x-1 gap-y-2 overflow-hidden rounded-2.5xl bg-black-50 pb-5 text-lg"
            >
                <BetHistory />
            </TabsContent>
        </Tabs>
    );
};
