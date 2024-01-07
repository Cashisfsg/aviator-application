import { useAuth } from "@/store/hooks/useAuth";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AllBetsTabpanel } from "@/components/all-bets-tabpanel";
import { MyBetsTabpanel } from "@/components/my-bets-tabpanel";
import { TopBetsTabpanel } from "@/components/top-bets-tabpanel";

export const Statistics = () => {
    const { isAuthenticated } = useAuth();

    return (
        <>
            {isAuthenticated ? (
                <Tabs
                    defaultValue="all"
                    className="rounded-2.5xl pb-8"
                >
                    <TabsList>
                        <TabsTrigger value="all">Все ставки</TabsTrigger>
                        <TabsTrigger value="my">Мои</TabsTrigger>
                        <TabsTrigger value="top">Топ</TabsTrigger>
                    </TabsList>
                    <TabsContent
                        value="all"
                        className="mt-5 gap-x-1 gap-y-2 rounded-2.5xl bg-black-50 px-1.5 py-5"
                    >
                        <AllBetsTabpanel />
                    </TabsContent>
                    <TabsContent
                        value="my"
                        className="mt-5 gap-x-1 gap-y-2 overflow-hidden rounded-2.5xl bg-black-50 pb-5 text-lg"
                    >
                        <MyBetsTabpanel />
                    </TabsContent>
                    <TabsContent
                        value="top"
                        className="mt-5 gap-x-1 gap-y-2 overflow-hidden rounded-2.5xl bg-black-50 pb-5 text-lg"
                    >
                        <TopBetsTabpanel />
                    </TabsContent>
                </Tabs>
            ) : (
                <section className="overflow-hidden rounded-2.5xl bg-black-50">
                    <h2 className="rounded-md bg-[#2c2d30] px-4 py-2 text-lg font-bold text-gray-300">
                        Игровая статистика
                    </h2>
                    <div className="px-1.5 py-5">
                        <AllBetsTabpanel />
                    </div>
                </section>
            )}
        </>
    );
};
