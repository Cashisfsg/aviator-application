import { Link, Navigate } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { passwordSchema, PasswordFormSchema } from "@/utils/schemas";

import { useGetUserQuery, useChangePasswordConfirmMutation } from "@/store";

import { Input, ErrorMessage } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const SecurityResetPasswordForm = () => {
    const { data: user } = useGetUserQuery();
    const [changeOldPassword, { isSuccess, isError, error }] =
        useChangePasswordConfirmMutation();
    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<PasswordFormSchema>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            password: ""
        }
    });

    const onSubmitHandler: SubmitHandler<PasswordFormSchema> = async ({
        password
    }) => {
        await changeOldPassword({ password });
    };

    if (isSuccess) {
        return (
            <Navigate to="/aviator_front/main/security/reset-password/confirm" />
        );
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className="grid gap-y-4"
        >
            <h3 className="text-center">Сброс пароля</h3>
            <Label>
                <span>Введите старый пароль</span>
                <Input
                    placeholder="Введите пароль"
                    aria-invalid={
                        isError || errors?.password ? "true" : "false"
                    }
                    {...register("password")}
                    className="border-[#414148]"
                />
                {errors?.password ? (
                    <ErrorMessage message={errors?.password?.message} />
                ) : isError ? (
                    <ErrorMessage message={error?.data?.message} />
                ) : null}
            </Label>
            <Link
                to={
                    user?.email
                        ? "/aviator_front/main/security/email/confirm"
                        : "/aviator_front/main/security/bind-email"
                }
                state={
                    user?.email
                        ? {
                              nextUrl:
                                  "/aviator_front/main/security/reset-password/confirm"
                          }
                        : null
                }
                className="text-right text-xs text-[#757b85]"
            >
                Сбросить через Email
            </Link>
            <button className="mt-2 border border-gray-50 bg-[#2c2d30] py-2">
                Сбросить
            </button>
        </form>
    );
};
