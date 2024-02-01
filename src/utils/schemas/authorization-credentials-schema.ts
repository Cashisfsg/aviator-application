import * as z from "zod";

const alphanumericRegex = /^\s?[A-Za-z0-9]+\s?$/;

export const authorizationCredentialsSchema = z.object({
    login: z.union([
        z
            .string()
            .min(1, {
                message: "Поле обязательно для заполнения"
            })
            .regex(alphanumericRegex, {
                message: "Поле может содержать только символы A-Z и цифры"
            })
            .min(5, {
                message: "Логин должен содержать не менее 5 символов"
            })
            .max(20, {
                message:
                    "Превышено максимально допустимое количество символов (20)"
            })
            .transform(e => e.trim()),
        z
            .string()
            .email({
                message: "Укажите корректный адрес электронной почты"
            })
            .max(60, {
                message:
                    "Превышено максимально допустимое количество символов (60)"
            })
    ]),
    password: z
        .string()
        .min(1, {
            message: "Поле обязательно для заполнения"
        })
        .regex(alphanumericRegex, {
            message: "Поле может содержать только символы A-Z и цифры"
        })
        .min(8, {
            message: "Пароль должен содержать не менее 8 символов"
        })
        .max(30, {
            message: "Превышено максимально допустимое количество символов (20)"
        })
});

export type AuthorizationCredentialsFormSchema = z.infer<
    typeof authorizationCredentialsSchema
>;
