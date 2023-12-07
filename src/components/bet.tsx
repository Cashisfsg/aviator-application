import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Bet = () => {
    return (
        <Tabs
            defaultValue="bet"
            className="bg-black-50 rounded-3xl px-6 pb-8 pt-4"
        >
            <TabsList className="mx-auto w-fit rounded-full border-2 border-gray-50 text-sm leading-none">
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
            <div className="bg-black-250 col-span-2 flex w-full items-center justify-between gap-4 rounded-full border border-gray-50 px-3 py-2 leading-none">
                <input
                    maxLength={5}
                    className="w-full border-none bg-inherit text-center text-lg font-bold text-white outline-none"
                />

                <div className="flex gap-x-2">
                    <button className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-500 text-xl font-bold text-black">
                        -
                    </button>
                    <button className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-500 text-xl font-bold text-black">
                        +
                    </button>
                </div>
            </div>
            <button className="hover:bg-green-350 bg-green-450 rounded-2.5xl row-span-3 border-2 border-green-50 px-3 py-1.5 font-semibold uppercase leading-none tracking-wider transition-colors duration-500">
                <p className="text-xl">Ставка</p>
                <p>
                    <span className="text-2xl">1.00</span>&nbsp;
                    <span className="text-lg">USD</span>
                </p>
            </button>

            {[1, 2, 5, 10].map(number => (
                <button
                    key={number}
                    className="bg-black-150 w-full rounded-full border border-gray-50 bg-white py-1 text-sm leading-none"
                >
                    {number}
                </button>
            ))}
        </>
    );
};
