import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    useCreateDrawMutation,
    useGetUserRequisitesQuery,
    PaymentDrawRequest
} from "@/store";

import { Input, ErrorMessage } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface PaymentDrawFormProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedRequisiteId: string | null;
}

const alphanumericRegex = /^[A-Za-z0-9]+$/;

const formSchema: z.ZodType<
    Pick<PaymentDrawRequest, "amount" | "userRequisite">
> = z.object({
    amount: z.coerce
        .number({
            required_error: "Поле обязательно для заполнения",
            invalid_type_error: "Поле может содержать только цифры"
        })
        .int({ message: "Введенное значение должно быть целым числом" })
        .gte(100, "Минимальная сумма выплат 100"),
    userRequisite: z
        .string()
        .min(1, {
            message: "Поле обязательно для заполнения"
        })
        .regex(alphanumericRegex, {
            message: "Поле может содержать только цифры"
        })
        .min(10, {
            message: "Поле должно содержать не менее 10 символов"
        })
        .max(20, {
            message: "Превышено максимально допустимое количество символов"
        })
});

export const PaymentDrawForm: React.FC<PaymentDrawFormProps> = ({
    setOpen,
    selectedRequisiteId
}) => {
    const [createDraw, { isError, error }] = useCreateDrawMutation();
    const { data: requisites } = useGetUserRequisitesQuery();
    const selectedRequisite = requisites
        ?.flatMap(requisite => requisite.requisites)
        .find(requisite => requisite._id === selectedRequisiteId);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: 0,
            userRequisite: ""
        }
    });

    const { toast } = useToast();

    const onSubmitHandler = async ({
        amount,
        userRequisite
    }: z.infer<typeof formSchema>) => {
        const response = await createDraw({
            currency: selectedRequisite?.currency as string,
            amount: Number(amount),
            requisite: selectedRequisite?._id as string,
            userRequisite
        });

        if (response?.error) return;

        setOpen(false);
        const date = new Date();
        toast({
            title: "Заявка на вывод успешно создана",
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
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className="grid gap-y-4 "
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
            <Label className="text-sm text-slate-400">
                <span className="text-left ">Введите реквизиты для вывода</span>
                <Input
                    inputMode="numeric"
                    {...register("userRequisite")}
                    aria-invalid={errors?.userRequisite ? "true" : "false"}
                    className="border-transparent bg-slate-300/70 text-center leading-none text-black shadow-md focus-visible:outline-slate-400/70"
                />
                {errors?.userRequisite ? (
                    <ErrorMessage message={errors?.userRequisite?.message} />
                ) : null}
            </Label>
            <Label className="text-sm text-slate-400">
                <span className="">
                    Введите сумму в {selectedRequisite?.currency}
                </span>
                <Input
                    inputMode="numeric"
                    {...register("amount")}
                    aria-invalid={errors?.amount ? "true" : "false"}
                    className="border-transparent bg-slate-300/70 leading-none text-black shadow-md focus-visible:outline-slate-400/70"
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

            <button className="mt-4 rounded-md bg-lime-500 px-4 py-2 leading-none text-white shadow-md focus-visible:outline-green-400 active:translate-y-0.5">
                Подтвердить
            </button>
        </form>
    );
};
