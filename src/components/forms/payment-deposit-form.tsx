import React, { useState } from "react";
import { Link } from "react-router-dom";
import { DialogClose } from "@/components/ui/dialog";
import { useToast } from "../ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

import {
    useGetUserRequisitesQuery,
    useAddReplenishmentMutation,
    useConfirmReplenishmentByIdMutation,
    useCancelReplenishmentByIdMutation,
    Replenishment,
    Requisite
} from "@/store";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils";

type ReplenishmentFormState =
    | "init"
    | "second"
    | "confirm"
    | "confirmed"
    | "reject"
    | "rejected";

interface ReplenishmentFormProps {
    selectedRequisiteId: string;
}

interface FormFields {
    amount: HTMLInputElement;
}

export const PaymentDepositForm: React.FC<ReplenishmentFormProps> = ({
    selectedRequisiteId
}) => {
    const [formState, setFormState] = useState<ReplenishmentFormState>("init");
    const [currentDeposit, setCurrentDeposit] = useState<Replenishment | null>(
        null
    );
    const { data: requisites } = useGetUserRequisitesQuery();
    const [depositBalance] = useAddReplenishmentMutation();
    const [confirmReplenishment] = useConfirmReplenishmentByIdMutation();
    const [cancelReplenishment] = useCancelReplenishmentByIdMutation();
    const { toast } = useToast();

    const selectedRequisite = requisites
        ?.flatMap(requisite => requisite.requisites)
        .find(requisite => requisite._id === selectedRequisiteId);

    const onSubmitHandler: React.FormEventHandler<
        HTMLFormElement & FormFields
    > = async event => {
        event.preventDefault();

        const { amount } = event.currentTarget;

        const response = await depositBalance({
            currency: selectedRequisite?.currency as string,
            amount: Number(amount.value),
            requisite: selectedRequisite?._id as string
        });

        if (response?.error) return;

        setCurrentDeposit(response?.data);
        setFormState("second");
    };

    const confirmPayment = async (id: string | undefined) => {
        if (!id) return;

        const date = new Date();
        const response = await confirmReplenishment({ id });

        if (response?.error) {
            toast({
                title: response?.error?.message,
                description: `${date.toLocaleDateString([], {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                })}, ${date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                })}`,
                duration: 5000,
                action: (
                    <ToastAction altText="Скрыть всплывающее окно">
                        Скрыть
                    </ToastAction>
                )
            });
        } else {
            toast({
                title: response?.data?.message,
                description: `${date.toLocaleDateString([], {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                })}, ${date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                })}`,
                duration: 5000,
                action: (
                    <ToastAction altText="Скрыть всплывающее окно">
                        Скрыть
                    </ToastAction>
                )
            });
        }

        setFormState("confirmed");
    };

    const abortReplenishment = async (id: string | undefined) => {
        if (!id) return;

        const date = new Date();
        const response = await cancelReplenishment({ id });

        if (response?.error) {
            toast({
                title: response?.error?.message,
                description: `${date.toLocaleDateString([], {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                })}, ${date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                })}`,
                duration: 5000,
                action: (
                    <ToastAction altText="Скрыть всплывающее окно">
                        Скрыть
                    </ToastAction>
                )
            });
        } else {
            toast({
                title: response?.data?.message,
                description: `${date.toLocaleDateString([], {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                })}, ${date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                })}`,
                duration: 5000,
                action: (
                    <ToastAction altText="Скрыть всплывающее окно">
                        Скрыть
                    </ToastAction>
                )
            });
        }

        setFormState("rejected");
    };

    switch (formState) {
        case "init":
            return (
                <>
                    <form
                        onSubmit={onSubmitHandler}
                        className="grid gap-y-4"
                    >
                        <p className="flex h-10 items-center rounded-lg bg-slate-300/70 px-2 py-1 leading-none text-black">
                            <img
                                src={selectedRequisite?.img}
                                alt=""
                                className="h-full"
                            />{" "}
                            <span className="inline-block w-full overflow-hidden text-ellipsis">
                                {selectedRequisite?.name}
                            </span>
                        </p>
                        <Label className="grid gap-y-1 space-y-0 text-sm text-slate-400">
                            <span>Сумма депозита</span>
                            <Input
                                inputMode="numeric"
                                name="amount"
                                required
                                className="border-none bg-slate-300/70 leading-none text-black shadow-md focus-visible:outline-slate-400/70"
                            />

                            <span className="text-right text-xs">
                                от 10 000 до 2 000 000
                            </span>
                        </Label>
                        <button className="mt-4 rounded-md bg-lime-500 px-4 py-2 text-white shadow-md focus-visible:outline-green-400 active:translate-y-0.5">
                            Пополнить
                        </button>
                    </form>
                    <p className="text-center text-xs text-black">
                        <span>
                            Нажимая на кнопку <b>«Пополнить»</b> вы соглашаетесь
                            с
                        </span>{" "}
                        <Link
                            to=""
                            className="font-semibold text-blue-500"
                        >
                            Условиями сервиса
                        </Link>
                    </p>
                </>
            );

        case "second":
            return (
                <PaymentDetails
                    selectedRequisite={selectedRequisite}
                    currentDeposit={currentDeposit}
                >
                    <p className="flex justify-between text-xs text-slate-400">
                        <span>ID 1234</span>
                        <span>Время на оплату 30:00</span>
                    </p>

                    <button
                        onClick={() => setFormState("confirm")}
                        className="mt-4 rounded-md bg-lime-500 px-4 py-2 text-white shadow-md focus-visible:outline-green-400 active:translate-y-0.5"
                    >
                        Подтвердите оплату
                    </button>

                    <button
                        onClick={() => setFormState("reject")}
                        className="rounded-md bg-red-600 px-4 py-2 text-white shadow-md focus-visible:outline-green-400 active:translate-y-0.5"
                    >
                        Отменить
                    </button>
                </PaymentDetails>
            );

        case "confirm":
            return (
                <PaymentDetails
                    selectedRequisite={selectedRequisite}
                    currentDeposit={currentDeposit}
                >
                    <p className="flex justify-between text-xs text-slate-400">
                        <span>ID 1234</span>
                        <span>Время на оплату 30:00</span>
                    </p>

                    <p className="text-center text-sm text-black">
                        Вы подтверждаете оплату?
                    </p>

                    <p className="text-center text-sm text-black">
                        <button
                            onClick={() => confirmPayment(currentDeposit?._id)}
                            className="float-left w-24 bg-lime-500 py-2 text-white"
                        >
                            Да
                        </button>
                        <button
                            onClick={() => {
                                setFormState("second");
                            }}
                            className="float-right w-24 bg-red-500 py-2 text-white"
                        >
                            Нет
                        </button>
                    </p>
                </PaymentDetails>
            );

        case "confirmed":
            return (
                <PaymentDetails
                    selectedRequisite={selectedRequisite}
                    currentDeposit={currentDeposit}
                >
                    <Field
                        label={"Статус заявки"}
                        value={"В обработке..."}
                    />

                    <DialogClose
                        type="button"
                        className="border-none bg-slate-400/70 py-2 text-center text-black shadow-md focus-visible:outline-slate-400/70"
                    >
                        Закрыть
                    </DialogClose>
                </PaymentDetails>
            );

        case "reject":
            return (
                <PaymentDetails
                    selectedRequisite={selectedRequisite}
                    currentDeposit={currentDeposit}
                >
                    <p className="flex justify-between text-xs text-slate-400">
                        <span>ID 1234</span>
                        <span>Время на оплату 30:00</span>
                    </p>

                    <p className="text-center text-sm text-black">
                        Вы уверены, что хотите отменить оплату?
                    </p>

                    <p className="text-center text-sm text-black">
                        <button
                            onClick={() =>
                                abortReplenishment(currentDeposit?._id)
                            }
                            className="float-left w-24 bg-red-500 py-2 text-white"
                        >
                            Да
                        </button>
                        <button
                            onClick={() => {
                                setFormState("second");
                            }}
                            className="float-right w-24 bg-lime-500 py-2 text-white"
                        >
                            Нет
                        </button>
                    </p>
                </PaymentDetails>
            );

        case "rejected":
            return (
                <PaymentDetails
                    selectedRequisite={selectedRequisite}
                    currentDeposit={currentDeposit}
                >
                    <Field
                        label={"Статус заявки"}
                        value={"Отменена"}
                    />

                    <DialogClose
                        type="button"
                        className="border-none bg-slate-400/70 py-2 text-center text-black shadow-md focus-visible:outline-slate-400/70"
                    >
                        Закрыть
                    </DialogClose>
                </PaymentDetails>
            );

        default:
            break;
    }
};

interface FieldProps {
    className?: string;
    label: string;
    value: string | number;
}

const Field: React.FC<FieldProps> = ({ className, label, value }) => {
    return (
        <div className="grid gap-y-1 space-y-0 text-sm text-slate-400">
            <p>{label}</p>
            <p
                className={cn(
                    "rounded-lg border-none bg-slate-300/70 px-4 py-2 text-black shadow-md focus-visible:outline-slate-400/70",
                    className
                )}
            >
                {value}
            </p>
        </div>
    );
};

interface PaymentDetailsProps {
    selectedRequisite: Requisite | undefined;
    currentDeposit: Replenishment | null;
    children: React.ReactNode;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
    selectedRequisite,
    currentDeposit,
    children
}) => {
    return (
        <div className="grid gap-y-4">
            <p className="flex h-10 items-center rounded-lg bg-slate-300/70 px-2 py-1 leading-none text-black">
                <img
                    src={selectedRequisite?.img}
                    alt=""
                    className="h-full"
                />{" "}
                <span className="inline-block w-full overflow-hidden text-ellipsis">
                    {selectedRequisite?.name}
                </span>
            </p>

            <Field
                label={"Реквизиты для пополнения"}
                value={selectedRequisite?.requisite || ""}
            />

            <Field
                label={"Сумма депозита"}
                value={`${currentDeposit?.amount} ${currentDeposit?.currency}`}
            />

            <Field
                label={"Комиссия"}
                value={`${currentDeposit?.requisite?.commission} ${currentDeposit?.requisite?.currency}`}
            />

            <Field
                label={"К оплате"}
                value={`${currentDeposit?.deduction} ${currentDeposit?.currency}`}
                className="border-green-50 bg-green-450 shadow-[inset_0_1px_1px_#ffffff80]"
            />

            {children}
        </div>
    );
};
