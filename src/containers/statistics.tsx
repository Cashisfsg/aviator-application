import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table } from "@/components/table";
import { BetHistory } from "@/components/bet-history";

export const Statistics = () => {
    return (
        <Tabs
            defaultValue="all"
            className="rounded-3xl pb-8 pt-4"
        >
            <TabsList>
                <TabsTrigger value="all">Все ставки</TabsTrigger>
                <TabsTrigger value="history">Мои</TabsTrigger>
                <TabsTrigger value="top">Топ</TabsTrigger>
            </TabsList>
            <TabsContent
                value="all"
                className="bg-black-50 rounded-2.5xl mt-5 gap-x-1 gap-y-2"
            >
                <Table />
            </TabsContent>
            <TabsContent
                value="history"
                className="bg-black-50 rounded-2.5xl mt-5 gap-x-1 gap-y-2 overflow-hidden pb-5 text-lg"
            >
                <BetHistory />
            </TabsContent>
        </Tabs>
    );
};
