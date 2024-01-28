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
                message: "Поле должно содержать не менее 2 символов"
            })
            .max(20, {
                message:
                    "Превышено максимально допустимое количество символов (20)"
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
                message: "Поле должно содержать не менее 8 символов"
            })
            .max(30, {
                message:
                    "Превышено максимально допустимое количество символов (30)"
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
                message: "Поле должно содержать не менее 8 символов"
            })
            .max(30, {
                message:
                    "Превышено максимально допустимое количество символов (30)"
            }),
        email: z
            .union([
                z.literal(""),
                z
                    .string()
                    .email({
                        message: "Укажите корректный адрес электронной почты"
                    })
                    .max(60, {
                        message:
                            "Превышено максимально допустимое количество символов (60)"
                    })
            ])
            .optional()
            .transform(e => (e === "" ? undefined : e))

            .optional(),
        from: z.string().optional(),
        telegramId: z.number().optional(),
        accepted_terms: z.literal(true)
    })
    .refine(data => data.password === data.passwordConfirm, {
        message: "Пароли должны совпадать",
        path: ["passwordConfirm"]
    });

export type RegistrationCredentialsFormSchema = z.infer<
    typeof registrationCredentialsSchema
>;
