import { useId } from "react";
import { Link, useNavigate } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { passwordSchema, PasswordFormSchema } from "@/utils/schemas";

import {
    useGetUserQuery,
    useChangePasswordConfirmMutation
} from "@/store/api/userApi";

import { PreviousRouteLink } from "@/components/previous-route-link";
import { Input, ErrorMessage } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImSpinner9 } from "react-icons/im";
import { handleErrorResponse } from "@/store/services";

export const SecurityResetPasswordForm = () => {
    const passwordId = useId();
    const passwordErrorId = useId();
    const serverErrorId = useId();

    const navigate = useNavigate();
    const { data: user } = useGetUserQuery();
    const [changeOldPassword, { isLoading }] =
        useChangePasswordConfirmMutation();
    const {
        handleSubmit,
        register,
        setError,
        clearErrors,
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
        try {
            await changeOldPassword({ password }).unwrap();
            navigate("/main/security/reset-password/confirm");
        } catch (error) {
            handleErrorResponse(error, message => {
                setError("root", {
                    type: "manual",
                    message: message
                });
            });
        }
    };

    const onFocusHandler: React.FocusEventHandler<HTMLInputElement> = () => {
        if (!errors?.root) return;

        clearErrors("root");
    };

    // if (isSuccess) {
    //     return <Navigate to="/main/security/reset-password/confirm" />;
    // }

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
                    id={passwordId}
                    placeholder="Введите пароль"
                    aria-invalid={
                        errors?.root || errors?.password ? "true" : "false"
                    }
                    aria-errormessage={
                        errors?.root
                            ? serverErrorId
                            : errors?.password
                              ? passwordErrorId
                              : undefined
                    }
                    {...register("password")}
                    onFocus={onFocusHandler}
                    className="border-[#414148]"
                />
                {errors?.root ? (
                    <ErrorMessage
                        id={serverErrorId}
                        htmlFor={passwordId}
                        message={errors?.root?.message}
                    />
                ) : errors?.password ? (
                    <ErrorMessage
                        id={passwordErrorId}
                        htmlFor={passwordId}
                        message={errors?.password?.message}
                    />
                ) : null}
                <Link
                    to={
                        user?.email
                            ? "/main/security/email/confirm"
                            : "/main/security/bind-email"
                    }
                    state={
                        user?.email
                            ? {
                                  nextUrl:
                                      "/main/security/reset-password/confirm"
                              }
                            : null
                    }
                    className="ml-auto block w-fit text-xs text-[#757b85]"
                >
                    Сбросить через Email
                </Link>
            </Label>

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
