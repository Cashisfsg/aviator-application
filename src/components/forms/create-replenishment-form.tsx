import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    depositValidationSchema as formSchema,
    DepositValidationSchema as FormSchema
} from "@/utils/schemas";

import {
    useCreateReplenishmentMutation,
    useFetchReplenishmentLimitsQuery
} from "@/api/replenishment/replenishmentApi";
import { useFetchRequisitesQuery } from "@/api/requisite/requisiteApi";
import { handleErrorResponse } from "@/store/services";

import { toast } from "@/components/toasts/toast";
import { Label } from "@/components/ui/label";
import { ErrorMessage, Input } from "@/components/ui/input";

import { ImSpinner9 } from "react-icons/im";
import Visa from "@/assets/visa-360w.webp";

export const CreateReplenishmentForm = () => {
    const navigate = useNavigate();
    const { requisiteId } = useParams();

    const {
        data: limits,
        isSuccess: isLimitsSuccessResponse,
        isLoading: isLimitsLoading
    } = useFetchReplenishmentLimitsQuery({ id: requisiteId || "" });
    const [createReplenishment, { isLoading: isReplenishmentRequestLoading }] =
        useCreateReplenishmentMutation();
    const { data: requisites } = useFetchRequisitesQuery();

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

    const requisite = useMemo(
        () =>
            requisites
                ?.flatMap(requisite => requisite.requisites)
                .find(requisite => requisite._id === requisiteId),
        [requisites, requisiteId]
    );

    const onSubmitHandler: SubmitHandler<FormSchema> = async ({ amount }) => {
        try {
            const {
                _id,
                requisite: { isCardFileRequired }
            } = await createReplenishment({
                currency: requisite?.currency as string,
                amount: Number(amount),
                requisite: requisite?._id as string
            }).unwrap();
            if (isCardFileRequired) {
                navigate(
                    `/payment/replenishment/${_id}/requisite/${requisiteId}/verify`,
                    {
                        replace: true
                    }
                );
            } else {
                navigate(
                    `/payment/replenishment/${_id}/requisite/${requisiteId}`,
                    { replace: true }
                );
            }
        } catch (error) {
            handleErrorResponse(error, message => toast.error(message));
        }
    };

    const onErrorHandler: React.ReactEventHandler<HTMLImageElement> = event => {
        event.currentTarget.src = Visa;
    };

    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmitHandler)}
                className="grid gap-y-4"
            >
                <p className="flex h-10 items-center gap-2 rounded-lg bg-slate-300/70 px-2 py-1 leading-none text-black">
                    <img
                        src={requisite?.img || Visa}
                        alt={requisite?.name}
                        onError={onErrorHandler}
                        className="h-full"
                    />
                    <span className="inline-block w-full truncate font-semibold">
                        {requisite?.name}
                    </span>
                </p>

                <Label className="grid gap-y-1 space-y-0 text-sm text-slate-400">
                    <span>Сумма депозита</span>
                    <Input
                        inputMode="numeric"
                        aria-invalid={errors?.amount ? "true" : "false"}
                        {...register("amount")}
                        placeholder="0"
                        className="h-10 border-transparent bg-slate-300/70 leading-none text-black shadow-md focus:placeholder:opacity-0 focus-visible:outline-slate-400/70"
                    />
                    {errors?.amount ? (
                        <ErrorMessage message={errors?.amount?.message} />
                    ) : null}

                    {isLimitsSuccessResponse ? (
                        <span className="text-right text-xs">
                            {`от ${limits?.minLimit?.toFixed(
                                2
                            )} до ${limits?.maxLimit?.toFixed(
                                2
                            )} ${limits?.currency}`}
                        </span>
                    ) : null}
                </Label>

                <button
                    disabled={isLimitsLoading || isReplenishmentRequestLoading}
                    className="mt-4 rounded-md bg-[#36ca12] px-4 py-2 text-white shadow-md transition-colors duration-300 focus-visible:outline-green-400 active:translate-y-0.5 disabled:pointer-events-none disabled:bg-slate-400/70"
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
                    Нажимая на кнопку <b>«Пополнить»</b> вы соглашаетесь с
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
};
