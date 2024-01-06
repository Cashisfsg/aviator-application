import * as z from "zod";

import { PaymentDrawRequest } from "@/store";

const alphanumericRegex = /^[A-Za-z0-9]+$/;

export const withdrawValidationSchema: z.ZodType<
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

export type WithdrawValidationSchema = z.infer<typeof withdrawValidationSchema>;
