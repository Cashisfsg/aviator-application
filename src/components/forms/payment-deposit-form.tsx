import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    depositValidationSchema as formSchema,
    DepositValidationSchema as FormSchema
} from "@/utils/schemas";

import { useGetUserBalanceQuery } from "@/store/api/userApi";

import { useFetchRequisitesQuery } from "@/api/requisite";
import {
    useFetchAllReplenishmentsQuery,
    useFetchReplenishmentLimitsQuery,
    useCreateReplenishmentMutation,
    useConfirmReplenishmentByIdMutation,
    useCancelReplenishmentByIdMutation,
    Replenishment
} from "@/api/replenishment";

import { DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input, ErrorMessage } from "@/components/ui/input";
import { CountDownTimer } from "../timer/count-down-timer";
import { ClipboardCopy } from "@/components/ui/clipboard-copy";
import { ImSpinner9 } from "react-icons/im";
import { PiWarningFill } from "react-icons/pi";

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
    initialFormState: {
        state: string;
        replenishmentId: string;
    };
}

export const PaymentDepositForm: React.FC<ReplenishmentFormProps> = ({
    selectedRequisiteId,
    initialFormState
}) => {
    const [formState, setFormState] = useState<ReplenishmentFormState>(
        initialFormState.state
    );
    const { data: allReplenishments } = useFetchAllReplenishmentsQuery();
    const {
        data: limits,
        isSuccess: isLimitsSuccessResponse,
        isLoading: isLimitsLoading
    } = useFetchReplenishmentLimitsQuery();

    const [currentReplenishment, setCurrentReplenishment] = useState<
        Replenishment | undefined
    >(() => {
        return allReplenishments?.find(
            replenishment =>
                replenishment?._id === initialFormState.replenishmentId
        );
    });

    const { data: requisites } = useFetchRequisitesQuery();
    const [depositBalance, { isLoading: isReplenishmentRequestLoading }] =
        useCreateReplenishmentMutation();
    const [
        confirmReplenishment,
        { isLoading: isPaymentConfirmRequestLoading }
    ] = useConfirmReplenishmentByIdMutation();
    const [cancelReplenishment, { isLoading: isPaymentCancelRequestLoading }] =
        useCancelReplenishmentByIdMutation();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormSchema>({
        resolver: zodResolver(
            formSchema(
                limits?.minLimit || 100,
                limits?.maxLimit || 1000,
                limits?.currency || "RUB"
            )
        ),
        defaultValues: {
            amount: undefined
        }
    });

    const selectedRequisite = requisites
        ?.flatMap(requisite => requisite.requisites)
        .find(requisite => requisite._id === selectedRequisiteId);

    const onSubmitHandler: SubmitHandler<FormSchema> = async ({ amount }) => {
        const response = await depositBalance({
            currency: selectedRequisite?.currency as string,
            amount: Number(amount),
            requisite: selectedRequisite?._id as string
        });

        if (response?.error) {
            toast.error(response?.error?.data?.message, {
                position: "top-center",
                action: {
                    label: "Скрыть",
                    onClick: () => {}
                },
                icon: (
                    <PiWarningFill className="text-4xl leading-none text-red-500" />
                )
            });

            return;
        }

        setCurrentReplenishment(response?.data);
        setFormState("second");
    };

    const confirmPayment = async (id: string | undefined) => {
        if (!id) return;

        const response = await confirmReplenishment({ id });

        if (response?.error) {
            toast.error(response?.error?.data?.message, {
                position: "top-center",
                action: {
                    label: "Скрыть",
                    onClick: () => {}
                },
                icon: (
                    <PiWarningFill className="text-4xl leading-none text-red-500" />
                )
            });
        } else {
            toast(response?.data?.message, {
                position: "top-center",
                action: {
                    label: "Скрыть",
                    onClick: () => {}
                }
            });
        }

        setFormState("confirmed");
    };

    const abortReplenishment = async (id: string | undefined) => {
        if (!id) return;

        const response = await cancelReplenishment({ id });

        if (response?.error) {
            toast.error(response?.error?.data?.message, {
                position: "top-center",
                action: {
                    label: "Скрыть",
                    onClick: () => {}
                },
                icon: (
                    <PiWarningFill className="text-4xl leading-none text-red-500" />
                )
            });
        } else {
            toast(response?.data?.message, {
                position: "top-center",
                action: {
                    label: "Скрыть",
                    onClick: () => {}
                }
            });
            setFormState("rejected");
        }
    };

    switch (formState) {
        case "init":
            return (
                <>
                    <form
                        onSubmit={handleSubmit(onSubmitHandler)}
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
                                aria-invalid={errors?.amount ? "true" : "false"}
                                {...register("amount")}
                                placeholder="0"
                                className="border-transparent bg-slate-300/70 leading-none text-black shadow-md focus:placeholder:opacity-0 focus-visible:outline-slate-400/70"
                            />
                            {errors?.amount ? (
                                <ErrorMessage
                                    message={errors?.amount?.message}
                                />
                            ) : null}

                            {isLimitsSuccessResponse ? (
                                <span className="text-right text-xs">
                                    {`от ${limits?.minLimit.toFixed(
                                        2
                                    )} до ${limits?.maxLimit.toFixed(
                                        2
                                    )} ${limits?.currency}`}
                                </span>
                            ) : null}
                        </Label>

                        <button
                            disabled={
                                isLimitsLoading || isReplenishmentRequestLoading
                            }
                            className="mt-4 rounded-md bg-lime-500 px-4 py-2 text-white shadow-md transition-colors duration-300 focus-visible:outline-green-400 active:translate-y-0.5 disabled:pointer-events-none disabled:bg-slate-400/70"
                        >
                            {isReplenishmentRequestLoading ? (
                                <ImSpinner9 className="mx-auto animate-spin text-2xl" />
                            ) : (
                                "Пополнить"
                            )}
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
                <PaymentDetails currentDeposit={currentReplenishment}>
                    <p className="flex items-center justify-between text-xs text-slate-400">
                        <span className="justify-self-start text-nowrap text-sm leading-5 text-slate-400">
                            <span>ID</span>{" "}
                            <ClipboardCopy
                                textToCopy={currentReplenishment?._id}
                                className="inline-block max-w-[13ch] overflow-hidden text-ellipsis whitespace-nowrap transition-colors mh:hover:text-slate-600"
                            >
                                {currentReplenishment?._id || ""}
                            </ClipboardCopy>
                        </span>
                        <span>
                            Время на оплату{" "}
                            <CountDownTimer
                                targetDate={currentReplenishment?.createdAt}
                            />
                        </span>
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
                <PaymentDetails currentDeposit={currentReplenishment}>
                    <p className="flex items-center justify-between text-xs text-slate-400">
                        <span className="justify-self-start text-nowrap text-sm leading-5 text-slate-400">
                            <span>ID</span>{" "}
                            <ClipboardCopy
                                textToCopy={currentReplenishment?._id}
                                className="inline-block max-w-[13ch] overflow-hidden text-ellipsis whitespace-nowrap transition-colors mh:hover:text-slate-600"
                            >
                                {currentReplenishment?._id || ""}
                            </ClipboardCopy>
                        </span>
                        <span>
                            Время на оплату{" "}
                            <CountDownTimer
                                targetDate={currentReplenishment?.createdAt}
                            />
                        </span>
                    </p>

                    <p className="text-center text-sm text-black">
                        Вы подтверждаете оплату?
                    </p>

                    <p className="text-center text-sm text-black">
                        <button
                            onClick={() =>
                                confirmPayment(currentReplenishment?._id)
                            }
                            disabled={isPaymentConfirmRequestLoading}
                            className="float-left w-24 bg-lime-500 py-2 text-white disabled:pointer-events-none"
                        >
                            {isPaymentConfirmRequestLoading ? (
                                <ImSpinner9 className="mx-auto animate-spin text-xl" />
                            ) : (
                                "Да"
                            )}
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
                <PaymentDetails currentDeposit={currentReplenishment}>
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
                <PaymentDetails currentDeposit={currentReplenishment}>
                    <p className="flex items-center justify-between text-xs text-slate-400">
                        <span className="justify-self-start text-nowrap text-sm leading-5 text-slate-400">
                            <span>ID</span>{" "}
                            <ClipboardCopy
                                textToCopy={currentReplenishment?._id}
                                className="inline-block max-w-[13ch] overflow-hidden text-ellipsis whitespace-nowrap transition-colors mh:hover:text-slate-600"
                            >
                                {currentReplenishment?._id || ""}
                            </ClipboardCopy>
                        </span>
                        <span>
                            Время на оплату{" "}
                            <CountDownTimer
                                targetDate={currentReplenishment?.createdAt}
                            />
                        </span>
                    </p>

                    <p className="text-center text-sm text-black">
                        Вы уверены, что хотите отменить оплату?
                    </p>

                    <p className="text-center text-sm text-black">
                        <button
                            onClick={() =>
                                abortReplenishment(currentReplenishment?._id)
                            }
                            disabled={isPaymentCancelRequestLoading}
                            className="float-left w-24 bg-red-500 py-2 text-white disabled:pointer-events-none"
                        >
                            {isPaymentCancelRequestLoading ? (
                                <ImSpinner9 className="mx-auto animate-spin text-xl" />
                            ) : (
                                "Да"
                            )}
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
                <PaymentDetails currentDeposit={currentReplenishment}>
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
    currentDeposit: Replenishment | undefined;
    children: React.ReactNode;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
    currentDeposit,
    children
}) => {
    const { data: balance } = useGetUserBalanceQuery();

    return (
        <div className="grid gap-y-4">
            <p className="flex h-10 items-center rounded-lg bg-slate-300/70 px-2 py-1 leading-none text-black">
                <img
                    src={currentDeposit?.requisite?.img}
                    alt=""
                    className="h-full"
                />{" "}
                <span className="inline-block w-full overflow-hidden text-ellipsis">
                    {currentDeposit?.requisite?.name}
                </span>
            </p>

            {/* <Field
                label={"Реквизиты для пополнения"}
                value={currentDeposit?.requisite?.requisite || ""}
            /> */}

            <div className="grid gap-y-1 space-y-0 text-sm text-slate-400">
                <p>Реквизиты для пополнения</p>
                <ClipboardCopy
                    textToCopy={currentDeposit?.requisite?.requisite}
                    toastMessage="Реквизиты скопированы в буфер обмена"
                    className="rounded-lg border-none bg-slate-300/70 px-4 py-2 text-black shadow-md transition-colors focus-visible:outline-slate-400/70 mh:hover:text-slate-600"
                >
                    {currentDeposit?.requisite?.requisite || ""}
                </ClipboardCopy>
            </div>

            <Field
                label={"Сумма депозита"}
                value={`${currentDeposit?.amount?.[balance?.currency].toFixed(
                    2
                )} ${balance?.currency}`}
            />

            <Field
                label={"Комиссия"}
                value={`${(
                    currentDeposit?.deduction?.[balance?.currency] -
                    currentDeposit?.amount?.[balance?.currency]
                ).toFixed(2)} ${balance?.currency}`}
            />

            <Field
                label={"К оплате"}
                value={`${currentDeposit?.deduction?.[
                    balance?.currency
                ].toFixed(2)} ${balance?.currency}`}
                className="border-green-50 bg-green-450 shadow-[inset_0_1px_1px_#ffffff80]"
            />

            {children}
        </div>
    );
};
