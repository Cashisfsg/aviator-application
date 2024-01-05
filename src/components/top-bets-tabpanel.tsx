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
                <TabsContent value="day">
                    <TabDay />
                </TabsContent>
                <TabsContent value="month">
                    <TabDay />
                </TabsContent>
                <TabsContent value="year">
                    <TabDay />
                </TabsContent>
                <TabsList>
                    <TabsTrigger value="day">День</TabsTrigger>
                    <TabsTrigger value="month">Месяц</TabsTrigger>
                    <TabsTrigger value="year">Год</TabsTrigger>
                </TabsList>
            </Tabs>
        </>
    );
};

const TabDay = () => {
    const { data: bets } = useGetTopBetsQuery({});

    console.log(bets);

    return (
        <>
            {/* {!bets || bets.length === 0 ? ( */}
            <p className="py-2 text-center text-base font-semibold">Пусто</p>
            {/* ) : null} */}
        </>
    );
};
