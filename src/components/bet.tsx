import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Bet = () => {
    return (
        <Tabs
            defaultValue="bet"
            className="rounded-3xl bg-black-50 px-6 pb-8 pt-4"
        >
            <TabsList>
                <TabsTrigger value="bet">Ставка</TabsTrigger>
                <TabsTrigger value="auto">Авто</TabsTrigger>
            </TabsList>
            <TabsContent
                value="bet"
                className="mt-5 grid grid-cols-[80px_80px_1fr] gap-x-1 gap-y-2 text-lg"
            >
                <BetTab />
            </TabsContent>
        </Tabs>
    );
};

const BetTab = () => {
    return (
        <>
            <div className="col-span-2 flex w-full items-center justify-between gap-4 rounded-full border border-gray-50 bg-black-250 px-3 py-2 leading-none">
                <input
                    maxLength={5}
                    className="text-white w-full border-none bg-inherit text-center text-lg font-bold outline-none"
                />

                <div className="flex gap-x-2">
                    <button className="text-black flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-500 text-xl font-bold">
                        -
                    </button>
                    <button className="text-black flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-500 text-xl font-bold">
                        +
                    </button>
                </div>
            </div>
            <button className="row-span-3 rounded-2.5xl border-2 border-green-50 bg-green-450 px-3 py-1.5 font-semibold uppercase leading-none tracking-wider transition-colors duration-500 hover:bg-green-350">
                <p className="text-xl">Ставка</p>
                <p>
                    <span className="text-2xl">1.00</span>&nbsp;
                    <span className="text-lg">USD</span>
                </p>
            </button>

            {[1, 2, 5, 10].map(number => (
                <button
                    key={number}
                    className="bg-white w-full rounded-full border border-gray-50 bg-black-150 py-1 text-sm leading-none"
                >
                    {number}
                </button>
            ))}
        </>
    );
};
