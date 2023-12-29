import { useState } from "react";
import { Link } from "react-router-dom";
import { DialogClose } from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import Visa from "@/assets/visa-360w.webp";

type DepositStatus =
    | "init"
    | "second"
    | "confirm"
    | "confirmed"
    | "reject"
    | "rejected";

export const PaymentDepositForm = () => {
    const [depositStatus, setDepositStatus] = useState<DepositStatus>("init");

    return (
        <>
            <form
                className="grid gap-y-4"
                onSubmit={event => {
                    event.preventDefault();
                    // switch (depositStatus) {
                    //     case "init":
                    //         setDepositStatus("submitted");
                    //         break;
                    //     case "submitted":
                    //         console.log(event.currentTarget);

                    //         break;

                    //     default:
                    //         break;
                    // }
                }}
            >
                <p className="flex h-10 justify-center rounded-lg bg-slate-300/70 px-2 py-1 leading-none text-black">
                    <img
                        src={Visa}
                        alt=""
                        className="h-full"
                    />{" "}
                    {/* <span className="">Qiwi кошелёк</span> */}
                </p>

                {depositStatus === "second" ||
                depositStatus === "confirm" ||
                depositStatus === "reject" ? (
                    <Label className="grid gap-y-1 space-y-0 text-sm text-slate-400">
                        <span>Реквизиты для пополнения</span>
                        <Input
                            inputMode="numeric"
                            className="border-none bg-slate-300/70 text-center leading-none text-black shadow-md focus-visible:outline-slate-400/70"
                        />
                    </Label>
                ) : null}

                <Label className="grid gap-y-1 space-y-0 text-sm text-slate-400">
                    <span>Сумма депозита</span>
                    <Input
                        inputMode="numeric"
                        required
                        readOnly={depositStatus !== "init"}
                        className="border-none bg-slate-300/70 leading-none text-black shadow-md focus-visible:outline-slate-400/70"
                    />

                    {depositStatus === "init" ? (
                        <span className="text-right text-xs">
                            от 10 000 до 2 000 000
                        </span>
                    ) : null}
                </Label>

                {depositStatus !== "init" ? (
                    <Label className="grid gap-y-1 space-y-0 text-sm text-slate-400">
                        <span>Комиссия</span>
                        <Input
                            readOnly
                            value={"300 UZS"}
                            className="border-none bg-slate-300/70 leading-none text-black shadow-md focus-visible:outline-slate-400/70"
                        />
                    </Label>
                ) : null}

                {depositStatus !== "init" ? (
                    <>
                        <Label className="grid gap-y-1 space-y-0 text-sm text-slate-400">
                            <span>К оплате</span>
                            <Input
                                readOnly
                                value={"1300 UZS"}
                                className="border-none border-green-50 bg-green-450 leading-none text-white shadow-[inset_0_1px_1px_#ffffff80] shadow-md focus-visible:outline-slate-400/70"
                            />
                        </Label>
                    </>
                ) : null}

                {depositStatus === "second" ||
                depositStatus === "confirm" ||
                depositStatus === "reject" ? (
                    <p className="flex justify-between text-xs text-slate-400">
                        <span>ID 1234</span>
                        <span>Время на оплату 30:00</span>
                    </p>
                ) : null}

                {depositStatus === "init" ? (
                    <button
                        value="second"
                        onClick={event =>
                            setDepositStatus(
                                event.currentTarget.value as DepositStatus
                            )
                        }
                        className="mt-4 rounded-md bg-lime-500 px-4 py-2 text-white shadow-md focus-visible:outline-green-400 active:translate-y-0.5"
                    >
                        Пополнить
                    </button>
                ) : null}

                {depositStatus === "second" ? (
                    <>
                        <button
                            value="confirm"
                            onClick={event =>
                                setDepositStatus(
                                    event.currentTarget.value as DepositStatus
                                )
                            }
                            className="mt-4 rounded-md bg-lime-500 px-4 py-2 text-white shadow-md focus-visible:outline-green-400 active:translate-y-0.5"
                        >
                            Подтвердите оплату
                        </button>
                        <button
                            value="reject"
                            onClick={event =>
                                setDepositStatus(
                                    event.currentTarget.value as DepositStatus
                                )
                            }
                            className="rounded-md bg-red-600 px-4 py-2 text-white shadow-md focus-visible:outline-green-400 active:translate-y-0.5"
                        >
                            Отменить
                        </button>
                    </>
                ) : null}

                {depositStatus === "confirm" ? (
                    <>
                        <p className="text-center text-sm text-black">
                            Вы подтверждаете оплату?
                        </p>
                        <p className="text-center text-sm text-black">
                            <button
                                type="button"
                                value="confirmed"
                                onClick={event => {
                                    setDepositStatus(
                                        event.currentTarget
                                            .value as DepositStatus
                                    );
                                }}
                                className="float-left w-24 bg-lime-500 py-2 text-white"
                            >
                                Да
                            </button>
                            <button
                                value="second"
                                type="button"
                                onClick={event => {
                                    setDepositStatus(
                                        event.currentTarget
                                            .value as DepositStatus
                                    );
                                }}
                                className="float-right w-24 bg-red-500 py-2 text-white"
                            >
                                Нет
                            </button>
                        </p>
                    </>
                ) : null}

                {depositStatus === "confirmed" ? (
                    <>
                        <div className="grid gap-y-1 space-y-0 text-sm text-slate-400">
                            <p>Статус заявки</p>
                            <p className="rounded-lg border-none bg-slate-300/70 px-4 py-2 text-black shadow-md focus-visible:outline-slate-400/70">
                                В обработке
                            </p>
                            {/* <Input
                                readOnly
                                value={"Отменена"}
                                className="border-none bg-slate-300/70  leading-none text-black shadow-md focus-visible:outline-slate-400/70"
                            /> */}
                        </div>
                        <DialogClose
                            type="button"
                            className="border-none bg-slate-400/70 py-2 text-center text-black shadow-md focus-visible:outline-slate-400/70"
                        >
                            Закрыть
                        </DialogClose>
                    </>
                ) : null}

                {depositStatus === "reject" ? (
                    <>
                        <p className="text-center text-sm text-black">
                            Вы уверены, что хотите отменить оплату?
                        </p>
                        <p className="text-center text-sm text-black">
                            <button
                                type="button"
                                value="rejected"
                                onClick={event => {
                                    setDepositStatus(
                                        event.currentTarget
                                            .value as DepositStatus
                                    );
                                }}
                                className="float-left w-24 bg-red-500 py-2 text-white"
                            >
                                Да
                            </button>
                            <button
                                value="second"
                                type="button"
                                onClick={event => {
                                    setDepositStatus(
                                        event.currentTarget
                                            .value as DepositStatus
                                    );
                                }}
                                className="float-right w-24 bg-lime-500 py-2 text-white"
                            >
                                Нет
                            </button>
                        </p>
                    </>
                ) : null}

                {depositStatus === "rejected" ? (
                    <>
                        <div className="grid gap-y-1 space-y-0 text-sm text-slate-400">
                            <p>Статус заявки</p>
                            <p className="rounded-lg border-none bg-slate-300/70 px-4 py-2 text-black shadow-md focus-visible:outline-slate-400/70">
                                Отменена
                            </p>
                            {/* <Input
                                readOnly
                                value={"Отменена"}
                                className="border-none bg-slate-300/70  leading-none text-black shadow-md focus-visible:outline-slate-400/70"
                            /> */}
                        </div>
                        <DialogClose
                            type="button"
                            className="border-none bg-slate-400/70 py-2 text-center text-black shadow-md focus-visible:outline-slate-400/70"
                        >
                            Закрыть
                        </DialogClose>
                    </>
                ) : null}
            </form>

            {depositStatus === "init" ? (
                <p className="text-center text-xs text-black">
                    <span>
                        Нажимая на кнопку <b>«Пополнить»</b> вы соглашаетесь с
                    </span>{" "}
                    <Link
                        to=""
                        className="font-semibold text-blue-500"
                    >
                        Условиями сервиса
                    </Link>
                </p>
            ) : null}
        </>
    );
};
