import { useState, useRef } from "react";
import { Link } from "react-router-dom";

import { Popover } from "@/components/ui/popover/popover";
import { PaymentDrawForm } from "@/components/forms/payment-draw-form";
import { PaymentHistoryPopover } from "@/components/popovers/payment-history-popoever";
import {
    useGetUserQuery,
    useGetUserRequisitesQuery,
    useGetUserRecommendedRequisitesQuery
} from "@/store";

import { BalanceMenu } from "@/components/dropdown-menus";

import UzCard from "@/assets/uzcard-360w.webp";
import Humo from "@/assets/humo-360w.webp";
import Visa from "@/assets/visa-360w.webp";
import Qiwi from "@/assets/qiwi-360w.webp";
import World from "@/assets/world-360w.webp";
import Bitcoin from "@/assets/bitcoin-360w.webp";

import { FaPhoneVolume } from "react-icons/fa6";
import { Logo } from "@/containers/header/components/logo";

interface Payment {
    id: number;
    img: string;
    currency: string;
    title: string;
    type: string;
}

const methods: Payment[] = [
    {
        id: 1,
        img: UzCard,
        currency: "UZS",
        title: "UzCard",
        type: "recommended"
    },
    {
        id: 2,
        img: Humo,
        currency: "UZS",
        title: "Карта HUMO",
        type: "recommended"
    },
    {
        id: 3,
        img: Visa,
        currency: "UZS",
        title: "Карта Visa",
        type: "recommended"
    },
    {
        id: 4,
        img: Qiwi,
        currency: "RUB",
        title: "Qiwi кошелёк",
        type: "recommended"
    },
    {
        id: 5,
        img: World,
        currency: "RUB",
        title: "Карта РФ банка",
        type: "recommended"
    },
    {
        id: 6,
        img: Bitcoin,
        currency: "CRYPTO",
        title: "Bitcoin",
        type: "recommended"
    }
];

export const PaymentPage = () => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [renderElement, setRenderElement] = useState<HTMLDivElement | null>(
        null
    );

    const { data: user } = useGetUserQuery();
    const { data: requisites } = useGetUserRequisitesQuery();
    const { data: recommended } = useGetUserRecommendedRequisitesQuery();

    console.log("Requisites: ", requisites);
    console.log("Recommended requisites: ", recommended);

    return (
        <>
            <header className="flex items-center justify-between py-2">
                <Link to="/aviator_front/main">
                    <Logo />
                </Link>
                <BalanceMenu />
            </header>
            <h1 className="text-2xl font-bold">Вывод</h1>
            <article className="mt-6 flex-auto space-y-3 rounded-2.5xl bg-white px-2 pb-8 pt-4 text-black xs:px-4">
                <header className="grid grid-cols-2 grid-rows-2 items-start">
                    <p className="justify-self-start leading-5">Все методы</p>
                    <p className="justify-self-start text-sm leading-5 text-slate-400">
                        {user?.telegramId}
                    </p>
                    <div
                        ref={setRenderElement}
                        className="relative col-start-2 col-end-3 row-start-1 row-end-3 inline-block justify-self-end"
                    >
                        <Popover>
                            <Popover.Trigger className="bg-slate-300/70 px-3 py-1.5 leading-none transition-colors duration-300 hover:bg-slate-300/60">
                                История
                            </Popover.Trigger>
                            <Popover.Portal renderElement={renderElement}>
                                <Popover.Content className="bg-transparent">
                                    <PaymentHistoryPopover />
                                </Popover.Content>
                            </Popover.Portal>
                        </Popover>
                        {/* <button
                            id="trigger"
                            onClick={() => {
                                dialogRef.current?.close();
                            }}
                        >
                            История
                        </button>
                        <dialog
                            ref={dialogRef}
                            onClick={event => {
                                const rect =
                                    dialogRef.current?.getBoundingClientRect();
                                const isInDialog =
                                    rect.top <= event.clientY &&
                                    event.clientY <= rect.bottom &&
                                    rect.left <= event.clientX &&
                                    event.clientX <= rect.left + rect.width;
                                if (!isInDialog) {
                                    dialogRef.current?.close();
                                }
                            }}
                            className="absolute left-auto top-[calc(100%+0.25rem)] m-0 border border-red-400"
                        >
                            Popover
                        </dialog> */}
                    </div>
                </header>
                <section>
                    <h2 className="text-lg uppercase text-slate-400">
                        Рекомендуемые способы
                    </h2>
                    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {methods.map(method => (
                            <PaymentMethod
                                key={method.id}
                                payment={method}
                            />
                        ))}
                    </ul>
                </section>
                <section>
                    <h2 className="text-lg uppercase text-slate-400">
                        Методы RUB
                    </h2>
                    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {methods.map(method => (
                            <PaymentMethod
                                key={method.id}
                                payment={method}
                            />
                        ))}
                    </ul>
                </section>
                <section>
                    <h2 className="text-lg uppercase text-slate-400">
                        Методы CRYPTO
                    </h2>
                    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {methods.map(method => (
                            <PaymentMethod
                                key={method.id}
                                payment={method}
                            />
                        ))}
                    </ul>
                </section>

                <TechnicalSupport />
            </article>
            <dialog
                // ref={dialogRef}
                onClose={event => console.log(event.target)}
            >
                <button onClick={() => dialogRef.current?.close()}>x</button>
                <PaymentDrawForm />
            </dialog>
        </>
    );
};

interface PaymentProps {
    payment: Payment;
}

const PaymentMethod: React.FC<PaymentProps> = ({ payment }) => {
    return (
        <li className="grid aspect-video w-full cursor-pointer select-none grid-rows-[minmax(0,1fr)_minmax(0,3fr)_minmax(0,1fr)] items-center gap-y-1 rounded-2.5xl bg-slate-300/70 px-3 py-2 leading-none shadow-md transition-transform duration-200 hover:scale-105">
            <p className="text-right">{payment.currency}</p>
            <img
                src={payment.img}
                alt={payment.title}
                // height="60"
                className="max-h-full object-cover object-center"
            />
            <p className="text-left text-xs font-bold xs:text-sm sm:text-base">
                {payment.title}
            </p>
        </li>
    );
};

const TechnicalSupport = () => {
    return (
        <button className="fixed right-5 top-[80%] flex items-center gap-x-2 border bg-slate-100/90 px-3 py-2 shadow-md transition-transform duration-200 hover:scale-110 lg:bg-slate-300">
            <FaPhoneVolume />
            <span className="sr-only sm:not-sr-only">Поддержка 24/7</span>
            <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
        </button>
    );
};
