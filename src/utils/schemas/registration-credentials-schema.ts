import * as z from "zod";

const alphanumericRegex = /^[A-Za-z0-9]+$/;

export const registrationCredentialsSchema = z
    .object({
        currency: z.string({
            required_error: "Поле обязательно для заполнения"
        }),
        login: z
            .string()
            .min(1, {
                message: "Поле обязательно для заполнения"
            })
            .regex(alphanumericRegex, {
                message: "Поле может содержать только символы A-Z и цифры"
            })
            .min(2, {
                message: "Минимальное количество символов не достигнуто"
            })
            .max(20, {
                message: "Превышено максимально допустимое количество символов"
            }),
        password: z
            .string()
            .min(1, {
                message: "Поле обязательно для заполнения"
            })
            .regex(alphanumericRegex, {
                message: "Поле может содержать только символы A-Z и цифры"
            })
            .min(8, {
                message: "Минимальное количество символов не достигнуто"
            })
            .max(30, {
                message: "Превышено максимально допустимое количество символов"
            }),
        passwordConfirm: z
            .string()
            .min(1, {
                message: "Поле обязательно для заполнения"
            })
            .regex(alphanumericRegex, {
                message: "Поле может содержать только символы A-Z и цифры"
            })
            .min(8, {
                message: "Минимальное количество символов не достигнуто"
            })
            .max(30, {
                message: "Превышено максимально допустимое количество символов"
            }),
        email: z
            .string()
            .min(1, {
                message: "Поле обязательно для заполнения"
            })
            .email({ message: "Укажите корректный адрес электронной почты" }),
        from: z.string().optional(),
        telegramId: z.number(),
        accepted_terms: z.literal(true)
    })
    .refine(data => data.password === data.passwordConfirm, {
        message: "Пароли должны совпадать",
        path: ["passwordConfirm"]
    });

export type RegistrationCredentialsFormSchema = z.infer<
    typeof registrationCredentialsSchema
>;
