import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    withdrawValidationSchema as formSchema,
    WithdrawValidationSchema as FormSchema
} from "@/utils/schemas";

import { useGetUserBalanceQuery } from "@/store/api/userApi";
import { useFetchRequisitesQuery } from "@/api/requisite";
import { useCreateWithdrawMutation } from "@/api/withdraw";

import { Input, ErrorMessage } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/toasts/toast";

import { ImSpinner9 } from "react-icons/im";
import Visa from "@/assets/visa-360w.webp";

interface PaymentWithdrawFormProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedRequisiteId: string | null;
}

export const PaymentDrawForm: React.FC<PaymentWithdrawFormProps> = ({
    setOpen,
    selectedRequisiteId
}) => {
    const [createDraw, { isLoading, isError, error }] =
        useCreateWithdrawMutation();
    const { data: requisites } = useFetchRequisitesQuery();
    const { data: balance } = useGetUserBalanceQuery();

    const selectedRequisite = requisites
        ?.flatMap(requisite => requisite.requisites)
        .find(requisite => requisite._id === selectedRequisiteId);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: undefined,
            userRequisite: ""
        }
    });

    const onSubmitHandler: SubmitHandler<FormSchema> = async ({
        amount,
        userRequisite
    }) => {
        try {
            await createDraw({
                currency: selectedRequisite?.currency as string,
                amount: Number(amount),
                requisite: selectedRequisite?._id as string,
                userRequisite
            }).unwrap();

            toast.notify("Заявка на вывод успешно создана");
            setOpen(false);
        } catch (error) {}
    };

    const onErrorHandler: React.ReactEventHandler<HTMLImageElement> = event => {
        event.currentTarget.src = Visa;
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className="grid gap-y-4 "
        >
            <p className="flex h-10 items-center gap-2 rounded-lg bg-slate-300/70 px-2 py-1 leading-none text-black">
                <img
                    src={selectedRequisite?.img}
                    alt={selectedRequisite?.name}
                    onError={onErrorHandler}
                    className="h-full"
                />
                <span className="inline-block w-full truncate font-semibold">
                    {selectedRequisite?.name}
                </span>
            </p>
            <Label className="text-sm text-slate-400">
                <span className="text-left ">Введите реквизиты для вывода</span>
                <Input
                    inputMode="numeric"
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    {...register("userRequisite")}
                    aria-invalid={errors?.userRequisite ? "true" : "false"}
                    className="h-10 border-transparent bg-slate-300/70 text-center leading-none text-black shadow-md focus:placeholder:opacity-0 focus-visible:outline-slate-400/70"
                />
                {errors?.userRequisite ? (
                    <ErrorMessage message={errors?.userRequisite?.message} />
                ) : null}
            </Label>
            <Label className="text-sm text-slate-400">
                <span className="">Введите сумму в {balance?.currency}</span>
                <Input
                    inputMode="numeric"
                    // placeholder="0"
                    {...register("amount")}
                    placeholder="0"
                    aria-invalid={errors?.amount ? "true" : "false"}
                    className="h-10 border-transparent bg-slate-300/70 leading-none text-black shadow-md focus:placeholder:opacity-0 focus-visible:outline-slate-400/70"
                />
                {errors?.amount ? (
                    <ErrorMessage
                        message={`${errors?.amount?.message} ${selectedRequisite?.currency}`}
                    />
                ) : null}
                {isError ? (
                    <ErrorMessage message={error?.data?.message} />
                ) : null}
            </Label>

            <button
                disabled={isLoading}
                className="mt-4 rounded-md bg-green-500 px-4 py-2 text-white shadow-md focus-visible:outline-green-400 active:translate-y-0.5 disabled:pointer-events-none disabled:bg-slate-400/70"
            >
                {isLoading ? (
                    <ImSpinner9 className="mx-auto animate-spin text-2xl" />
                ) : (
                    "Подтвердить"
                )}
            </button>
        </form>
    );
};
