import { Table } from "./ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
            </Tabs>
        </>
    );
};
