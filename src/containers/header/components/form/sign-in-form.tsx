import { useEffect, useId } from "react";
import { Link } from "react-router-dom";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useAuthenticateUserMutation } from "@/store";
// import { useDialogContext } from "@/components/ui/dialog/use-dialog-context";

import { Input, ErrorMessage } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const alphanumericRegex = /^[A-Za-z0-9]+$/;

const formSchema = z.object({
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

export const SignInForm = () => {
    // const { dialogRef } = useDialogContext();
    const formId = useId();
    const [authenticate, { isError, error }] = useAuthenticateUserMutation();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            login: "",
            password: ""
        }
    });

    useEffect(() => {
        sessionStorage.removeItem("email");
    }, []);

    const onSubmitHandler = async (data: z.infer<typeof formSchema>) => {
        const response = await authenticate(data);

        if (!response?.error) {
            reset();
            // dialogRef?.current?.close();
        }

        console.log(response);
    };

    return (
        <>
            <form
                id={formId}
                className="grid gap-y-8"
                onSubmit={handleSubmit(onSubmitHandler)}
            >
                <Label>
                    <span>Логин</span>
                    <Input
                        type="text"
                        {...register("login")}
                    />
                    {errors?.login ? (
                        <ErrorMessage message={errors?.login?.message} />
                    ) : null}
                </Label>
                <Label>
                    <span>Пароль</span>
                    <Input
                        type="password"
                        {...register("password")}
                    />
                    {errors?.password ? (
                        <ErrorMessage message={errors?.password?.message} />
                    ) : isError ? (
                        <ErrorMessage message={error?.data?.message} />
                    ) : null}
                </Label>
            </form>
            <p className="text-right text-sm text-blue-500">
                <Link to="/aviator_front/main/password/restore">
                    Забыли пароль?
                </Link>
            </p>
            <button
                form={formId}
                className="w-full bg-blue-500 py-2 text-xl font-bold text-white"
            >
                Войти
            </button>
        </>
    );
};
