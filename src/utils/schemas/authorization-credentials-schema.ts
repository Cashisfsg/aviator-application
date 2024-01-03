import * as z from "zod";

const alphanumericRegex = /^[A-Za-z0-9]+$/;

export const authorizationCredentialsSchema = z.object({
    login: z
        .string()
        .min(1, {
            message: "Поле обязательно для заполнения"
        })
        .regex(alphanumericRegex, {
            message: "Поле может содержать только символы A-Z и цифры"
        })
        .min(2, {
            message: "Логин должен содержать не менее 2 символов"
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
            message: "Пароль должен содержать не менее 8 символов"
        })
        .max(30, {
            message: "Превышено максимально допустимое количество символов"
        })
});

export type AuthorizationCredentialsFormSchema = z.infer<
    typeof authorizationCredentialsSchema
>;
