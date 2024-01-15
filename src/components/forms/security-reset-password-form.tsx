import { Link, Navigate } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { passwordSchema, PasswordFormSchema } from "@/utils/schemas";

import { useGetUserQuery, useChangePasswordConfirmMutation } from "@/store";

import { PreviousRouteLink } from "@/components/previous-route-link";
import { Input, ErrorMessage } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImSpinner9 } from "react-icons/im";

export const SecurityResetPasswordForm = () => {
    const { data: user } = useGetUserQuery();
    const [changeOldPassword, { isLoading, isSuccess, isError, error }] =
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
        return <Navigate to="/main/security/reset-password/confirm" />;
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className="relative grid gap-y-4"
        >
            <PreviousRouteLink />

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
                ) : null}
                {isError ? (
                    <ErrorMessage message={error?.data?.message} />
                ) : null}
            </Label>
            <Link
                to={
                    user?.email
                        ? "/main/security/email/confirm"
                        : "/main/security/bind-email"
                }
                state={
                    user?.email
                        ? {
                              nextUrl: "/main/security/reset-password/confirm"
                          }
                        : null
                }
                className="text-right text-xs text-[#757b85]"
            >
                Сбросить через Email
            </Link>
            <button
                disabled={isLoading}
                className="mt-2 border border-gray-50 bg-[#2c2d30] py-2"
            >
                {isLoading ? (
                    <ImSpinner9 className="mx-auto animate-spin text-sm" />
                ) : (
                    "Сбросить"
                )}
            </button>
        </form>
    );
};
