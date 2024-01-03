import { Table } from "./ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useGetTopBetsQuery } from "@/store";

export const TopBetsTabpanel = () => {
    return (
        <>
            <Table
                headers={["Куши", "Наибольшие выигрыши", "Коэфф."]}
                data={[]}
                renderData={() => <></>}
            />

            <Tabs defaultValue="day">
                <TabsList>
                    <TabsTrigger value="day">День</TabsTrigger>
                    <TabsTrigger value="month">Месяц</TabsTrigger>
                    <TabsTrigger value="year">Год</TabsTrigger>
                </TabsList>
                <TabsContent value="day">
                    <TabDay />
                </TabsContent>
            </Tabs>
        </>
    );
};

const TabDay = () => {
    const { data: bets } = useGetTopBetsQuery({});

    console.log(bets);

    return <></>;
};
