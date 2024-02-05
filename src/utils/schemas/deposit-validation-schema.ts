import * as z from "zod";

export const depositValidationSchema = (
    min: number,
    max: number,
    currency: string
) => {
    return z.object({
        amount: z.coerce
            .number({
                required_error: "Поле обязательно для заполнения",
                invalid_type_error: "Поле может содержать только цифры"
            })
            .int({ message: "Введенное значение должно быть целым числом" })
            .gte(
                min,
                `Минимальная сумма пополнения ${min.toFixed(2)} ${currency}`
            )
            .lte(
                max,
                `Максимальная сумма пополнения ${max.toFixed(2)} ${currency}`
            )
    });
};

export type DepositValidationSchema = z.infer<
    ReturnType<typeof depositValidationSchema>
>;
