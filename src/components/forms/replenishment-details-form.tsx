import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ScaleLoader } from "react-spinners";

import { useGetUserBalanceQuery } from "@/store/api/userApi";
import {
    useFetchReplenishmentByIdQuery,
    useConfirmReplenishmentByIdMutation,
    useCancelReplenishmentByIdMutation,
    Replenishment
} from "@/api/replenishment";

import { DialogClose } from "@/components/ui/dialog";
import { CountDownTimer } from "../timer/count-down-timer";
import { ClipboardCopy } from "@/components/ui/clipboard-copy";
import { TimerTooltip } from "@/components/tooltips/timer-tooltip";
import { toast } from "@/components/toasts/toast";

import { cn } from "@/utils";
import { handleErrorResponse } from "@/store/services";

import { ImSpinner9 } from "react-icons/im";
import Visa from "@/assets/visa-360w.webp";

type ReplenishmentFormState =
    | "init"
    | "confirm"
    | "confirmed"
    | "reject"
    | "rejected";

export const ReplenishmentDetailsForm = () => {
    const params = useParams();
    const navigate = useNavigate();

    const { data: replenishment, isLoading: isReplenishmentDataLoading } =
        useFetchReplenishmentByIdQuery({
            id: params?.replenishmentId as string
        });

    const [formState, setFormState] = useState<ReplenishmentFormState>("init");

    const [
        confirmReplenishment,
        { isLoading: isPaymentConfirmRequestLoading }
    ] = useConfirmReplenishmentByIdMutation();
    const [cancelReplenishment, { isLoading: isPaymentCancelRequestLoading }] =
        useCancelReplenishmentByIdMutation();

    const confirmPayment = async (id: string | undefined) => {
        if (!id) return;

        try {
            await confirmReplenishment({ id }).unwrap();

            setFormState("confirmed");
        } catch (error) {
            handleErrorResponse(error, message => toast.error(message));
        }
    };

    const abortReplenishment = async (id: string | undefined) => {
        if (!id) return;

        try {
            await cancelReplenishment({ id }).unwrap();

            setFormState("rejected");
        } catch (error) {
            handleErrorResponse(error, message => toast.error(message));
        }
    };

    if (isReplenishmentDataLoading)
        return (
            <div className="flex w-full items-center justify-center px-3">
                <ScaleLoader color="rgb(54, 215, 183)" />
            </div>
        );

    if (replenishment?.status === "В обработке...")
        return (
            <PaymentDetails replenishment={replenishment}>
                <Field
                    label={"Статус заявки"}
                    value={"В обработке..."}
                />

                <DialogClose
                    type="button"
                    onClick={() =>
                        navigate("/payment/replenishment", { replace: true })
                    }
                    className="border-none bg-slate-400/70 py-2 text-center text-black shadow-md focus-visible:outline-slate-400/70"
                >
                    Закрыть
                </DialogClose>
            </PaymentDetails>
        );

    if (replenishment?.status === "Отменена")
        return (
            <PaymentDetails replenishment={replenishment}>
                <Field
                    label={"Статус заявки"}
                    value={"Отменена"}
                />

                <DialogClose
                    type="button"
                    onClick={() =>
                        navigate("/payment/replenishment", { replace: true })
                    }
                    className="border-none bg-slate-400/70 py-2 text-center text-black shadow-md focus-visible:outline-slate-400/70"
                >
                    Закрыть
                </DialogClose>
            </PaymentDetails>
        );

    switch (formState) {
        case "init":
            return (
                <PaymentDetails replenishment={replenishment}>
                    <p className="flex items-center justify-between text-xs text-slate-400">
                        <span className="justify-self-start text-nowrap text-sm leading-5 text-slate-400">
                            <span>ID</span>{" "}
                            <ClipboardCopy
                                textToCopy={String(replenishment?.uid)}
                                className="inline-block max-w-[13ch] overflow-hidden text-ellipsis whitespace-nowrap transition-colors mh:hover:text-slate-600"
                            >
                                {replenishment?.uid || ""}
                            </ClipboardCopy>
                        </span>
                        <span>
                            <span>Время на оплату</span>{" "}
                            <CountDownTimer
                                finishTime={replenishment?.createdAt}
                            />{" "}
                            <TimerTooltip />
                        </span>
                    </p>

                    <button
                        onClick={() => setFormState("confirm")}
                        className="mt-4 rounded-md bg-green-500 px-4 py-2 text-white shadow-md focus-visible:outline-green-400 active:translate-y-0.5"
                    >
                        Подтвердить оплату
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
                <PaymentDetails replenishment={replenishment}>
                    <p className="flex items-center justify-between text-xs text-slate-400">
                        <span className="justify-self-start text-nowrap text-sm leading-5 text-slate-400">
                            <span>ID</span>{" "}
                            <ClipboardCopy
                                textToCopy={String(replenishment?.uid)}
                                className="inline-block max-w-[13ch] overflow-hidden text-ellipsis whitespace-nowrap transition-colors mh:hover:text-slate-600"
                            >
                                {replenishment?.uid || ""}
                            </ClipboardCopy>
                        </span>
                        <span>
                            <span>Время на оплату</span>{" "}
                            <CountDownTimer
                                finishTime={replenishment?.createdAt}
                            />{" "}
                            <TimerTooltip />
                        </span>
                    </p>

                    <p className="text-center text-sm text-black">
                        Вы подтверждаете оплату?
                    </p>

                    <p className="text-center text-sm text-black">
                        <button
                            onClick={() => confirmPayment(replenishment?._id)}
                            disabled={isPaymentConfirmRequestLoading}
                            className="float-left w-24 bg-green-500 py-2 text-white disabled:pointer-events-none"
                        >
                            {isPaymentConfirmRequestLoading ? (
                                <ImSpinner9 className="mx-auto animate-spin text-xl" />
                            ) : (
                                "Да"
                            )}
                        </button>
                        <button
                            onClick={() => {
                                setFormState("init");
                            }}
                            className="float-right w-24 bg-red-600 py-2 text-white"
                        >
                            Нет
                        </button>
                    </p>
                </PaymentDetails>
            );

        case "confirmed":
            return (
                <PaymentDetails replenishment={replenishment}>
                    <Field
                        label={"Статус заявки"}
                        value={"В обработке..."}
                    />

                    <DialogClose
                        type="button"
                        onClick={() =>
                            navigate("/payment/replenishment", {
                                replace: true
                            })
                        }
                        className="border-none bg-slate-400/70 py-2 text-center text-black shadow-md focus-visible:outline-slate-400/70"
                    >
                        Закрыть
                    </DialogClose>
                </PaymentDetails>
            );

        case "reject":
            return (
                <PaymentDetails replenishment={replenishment}>
                    <p className="flex items-center justify-between text-xs text-slate-400">
                        <span className="justify-self-start text-nowrap text-sm leading-5 text-slate-400">
                            <span>ID</span>{" "}
                            <ClipboardCopy
                                textToCopy={String(replenishment?.uid)}
                                className="inline-block max-w-[13ch] overflow-hidden text-ellipsis whitespace-nowrap transition-colors mh:hover:text-slate-600"
                            >
                                {replenishment?.uid || ""}
                            </ClipboardCopy>
                        </span>
                        <span>
                            <span>Время на оплату</span>{" "}
                            <CountDownTimer
                                finishTime={replenishment?.createdAt}
                            />{" "}
                            <TimerTooltip />
                        </span>
                    </p>

                    <p className="text-center text-sm text-black">
                        Вы уверены, что хотите отменить оплату?
                    </p>

                    <p className="text-center text-sm text-black">
                        <button
                            onClick={() =>
                                abortReplenishment(replenishment?._id)
                            }
                            disabled={isPaymentCancelRequestLoading}
                            className="float-left w-24 bg-red-600 py-2 text-white disabled:pointer-events-none"
                        >
                            {isPaymentCancelRequestLoading ? (
                                <ImSpinner9 className="mx-auto animate-spin text-xl" />
                            ) : (
                                "Да"
                            )}
                        </button>
                        <button
                            onClick={() => {
                                setFormState("init");
                            }}
                            className="float-right w-24 bg-green-500 py-2 text-white"
                        >
                            Нет
                        </button>
                    </p>
                </PaymentDetails>
            );

        case "rejected":
            return (
                <PaymentDetails replenishment={replenishment}>
                    <Field
                        label={"Статус заявки"}
                        value={"Отменена"}
                    />

                    <DialogClose
                        type="button"
                        onClick={() =>
                            navigate("/payment/replenishment", {
                                replace: true
                            })
                        }
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
    value: string | number | undefined;
}

const Field: React.FC<FieldProps> = ({ className, label, value }) => {
    return (
        <div className="grid gap-y-1 space-y-0 text-sm text-slate-400">
            <p>{label}</p>
            <p
                className={cn(
                    "h-10 rounded-lg border-none bg-slate-300/70 px-4 py-2 align-middle leading-6 text-black shadow-md focus-visible:outline-slate-400/70",
                    className
                )}
            >
                {value}
            </p>
        </div>
    );
};

interface PaymentDetailsProps {
    replenishment: Replenishment | undefined;
    children: React.ReactNode;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
    replenishment,
    children
}) => {
    const { data: balance } = useGetUserBalanceQuery();

    const onErrorHandler: React.ReactEventHandler<HTMLImageElement> = event => {
        event.currentTarget.src = Visa;
    };

    return (
        <div className="grid gap-y-4">
            <p className="flex h-10 items-center gap-2 rounded-lg bg-slate-300/70 px-2 py-1 leading-none text-black">
                <img
                    src={replenishment?.method?.img || Visa}
                    alt={replenishment?.method?.name}
                    onError={onErrorHandler}
                    className="h-full"
                />
                <span className="inline-block w-full truncate font-semibold">
                    {replenishment?.method?.name}
                </span>
            </p>

            <div className="grid gap-y-1 space-y-0 text-sm text-slate-400">
                <p>Реквизиты для пополнения</p>
                <ClipboardCopy
                    textToCopy={replenishment?.requisite?.requisite}
                    toastMessage="Реквизиты скопированы в буфер обмена"
                    className="h-10 rounded-lg border-none bg-slate-300/70 px-4 py-2 text-black shadow-md transition-colors focus-visible:outline-slate-400/70 mh:hover:text-slate-600"
                >
                    {replenishment?.requisite?.requisite || ""}
                </ClipboardCopy>
            </div>

            <Field
                label={"Сумма депозита"}
                value={`${replenishment?.amount?.[
                    balance?.currency || "USD"
                ]?.toFixed(2)} ${balance?.currency}`}
            />

            <Field
                label={"Комиссия"}
                value={`${(
                    (replenishment?.deduction?.[balance?.currency || "USD"] ||
                        0) -
                    (replenishment?.amount?.[balance?.currency || "USD"] || 0)
                )?.toFixed(2)} ${balance?.currency}`}
            />

            <Field
                label={"К оплате"}
                value={`${replenishment?.deduction?.[
                    balance?.currency || "USD"
                ]?.toFixed(2)} ${balance?.currency}`}
                className="border-green-50 bg-green-450 shadow-[inset_0_1px_1px_#ffffff80]"
            />

            {children}
        </div>
    );
};
