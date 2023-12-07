export const Bet = () => {
    return (
        <section className="bg-black-50 rounded-3xl px-6 pb-8 pt-4">
            <header>
                <ul className="mx-auto w-fit rounded-full border-2 border-gray-50 text-lg">
                    <li className="inline-block w-32 rounded-full bg-gray-700 py-0.5">
                        Ставка
                    </li>
                    <li className="inline-block w-32 rounded-full  py-0.5">
                        Авто
                    </li>
                </ul>
            </header>
            <div className="mt-6 grid grid-cols-[80px_80px_1fr] gap-x-1 gap-y-2 text-lg">
                <div className="bg-black-250 col-span-2 flex w-full items-center justify-between gap-4 rounded-full px-2 py-2 leading-none">
                    <input className="w-full border-none bg-inherit text-center text-lg font-bold text-white outline-none" />

                    <div className="flex gap-x-2">
                        <button className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-500 text-xl font-bold text-black">
                            -
                        </button>
                        <button className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-500 text-xl font-bold text-black">
                            +
                        </button>
                    </div>
                </div>
                <button className="hover:bg-green-350 bg-green-450 rounded-2.5xl row-span-3 border-2 border-green-50 font-semibold uppercase leading-none tracking-wider transition-colors duration-500">
                    <p className="text-xl">Ставка</p>
                    <p>
                        <span className="text-2xl">1.00</span>&nbsp;
                        <span className="text-lg">USD</span>
                    </p>
                </button>
                <button className="h-4.5 bg-black-150 w-full rounded-full bg-white text-sm leading-none">
                    1
                </button>
                <button className="h-4.5 bg-black-150 w-full rounded-full bg-white text-sm leading-none">
                    2
                </button>
                <button className="h-4.5 bg-black-150 w-full rounded-full bg-white text-sm leading-none">
                    5
                </button>
                <button className="h-4.5 bg-black-150 w-full rounded-full bg-white text-sm leading-none">
                    10
                </button>
            </div>
        </section>
    );
};
