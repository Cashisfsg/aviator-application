// import { Suspense, lazy } from "react";

import { BettingZone } from "@/containers/betting-zone";
import { Statistics } from "@/containers/statistics";
import { Chart } from "@/components/chart/chart";
import { Header } from "@/containers/header/header";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
// import { toast } from "sonner";

// const Statistics = lazy(() =>
//     import("@/containers/statistics").then(module => ({
//         default: module.Statistics
//     }))
// );

export const MainPage = () => {
    return (
        <>
            <Header />

            <main className="content-wrapper flex flex-auto flex-col gap-y-4">
                <Chart />
                <BettingZone />
                {/* {inView ? (
                    <Suspense fallback={<pre>Loading...</pre>}> */}
                <Statistics />
                {/* </Suspense>
                ) : null} */}
            </main>

            {/* <button
                onClick={() =>
                    toast.custom(
                        t => (
                            <div className="flex h-14 w-[300px] items-center rounded-[26px] border border-[#427f00] bg-[#123405] text-white">
                                <div className="pl-3 pr-2.5">
                                    <p className="text-xs text-[#9ea0a3]">
                                        Вы вывели средства
                                    </p>
                                    <p className="mt-1 text-xl font-bold leading-none">
                                        1.10x
                                    </p>
                                </div>
                                <div className="min-w-[120px] max-w-[120px] rounded-3xl bg-[#4eaf11] py-0.5 font-bold">
                                    <p className="text-xs">Выигрыш, USZ</p>
                                    <p className="mt-1 text-xl leading-none">
                                        111100.00
                                    </p>
                                </div>
                                <button
                                    onClick={() => toast.dismiss(t)}
                                    className="flex-auto"
                                >
                                    x
                                </button>
                            </div>
                        ),
                        {
                            position: "top-center",
                            classNames: {
                                toast: "group-[.toaster]:bg-transparent group-[.toaster]:flex group-[.toaster]:justify-center group-[.toaster]:shadow-none"
                            }
                        }
                    )
                }
                className="text-red-700"
            >
                Click me please
            </button> */}

            <Toaster />
            <Sonner />
        </>
    );
};
