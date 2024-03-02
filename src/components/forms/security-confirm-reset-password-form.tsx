import { useId } from "react";
import { Navigate } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import {
    passwordPairSchema as formSchema,
    PasswordPairFormSchema as FormSchema
} from "@/utils/schemas";

import { useChangeUserPasswordMutation } from "@/store/api/userApi";
import { useAuth } from "@/store/hooks/useAuth";
import { isErrorWithMessage, isFetchBaseQueryError } from "@/store/services";

import { PreviousRouteLink } from "@/components/previous-route-link";
import { Input, ErrorMessage } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImSpinner9 } from "react-icons/im";

export const SecurityConfirmResetPasswordForm = () => {
    const passwordId = useId();
    const passwordConfirmId = useId();
    const passwordErrorId = useId();
    const passwordConfirmErrorId = useId();
    const serverErrorId = useId();

    const [changePassword, { isLoading, isSuccess }] =
        useChangeUserPasswordMutation();
    const { token } = useAuth();

    const {
        handleSubmit,
        register,
        setError,
        clearErrors,
        formState: { errors }
    } = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            passwordConfirm: ""
        }
    });

    const onSubmitHandler: SubmitHandler<FormSchema> = async ({
        password,
        passwordConfirm
    }) => {
        if (!token) return;

        try {
            await changePassword({ token, password, passwordConfirm }).unwrap();
        } catch (error) {
            if (isFetchBaseQueryError(error)) {
                const errorMessage =
                    "error" in error
                        ? error.error
                        : (error.data as { status: number; message: string })
                              .message;
                setError("root", {
                    type: "manual",
                    message: errorMessage
                });
            } else if (isErrorWithMessage(error)) {
                setError("root", {
                    type: "manual",
                    message: error.message
                });
            }
        }
    };

    const onFocusHandler: React.FocusEventHandler<HTMLInputElement> = () => {
        if (!errors?.root) return;

        clearErrors("root");
    };

    if (isSuccess) {
        return <Navigate to="/main/security" />;
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className="relative grid gap-y-4"
        >
            <PreviousRouteLink />

            <h3 className="text-center">Сброс пароля</h3>
            <Label>
                <span>Введите новый пароль</span>
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
                {errors?.password ? (
                    <ErrorMessage
                        id={passwordErrorId}
                        htmlFor={passwordId}
                        message={errors?.password?.message}
                    />
                ) : null}
            </Label>
            <Label>
                <span>Повторите пароль</span>
                <Input
                    id={passwordConfirmId}
                    placeholder="Повторите пароль"
                    aria-invalid={
                        errors?.root || errors?.passwordConfirm
                            ? "true"
                            : "false"
                    }
                    aria-errormessage={
                        errors?.root
                            ? serverErrorId
                            : errors?.passwordConfirm
                              ? passwordConfirmErrorId
                              : undefined
                    }
                    {...register("passwordConfirm")}
                    className="border-[#414148]"
                />
                {errors?.root ? (
                    <ErrorMessage
                        id={passwordConfirmErrorId}
                        htmlFor={passwordConfirmId}
                        message={errors?.root?.message}
                    />
                ) : errors?.passwordConfirm ? (
                    <ErrorMessage
                        id={serverErrorId}
                        htmlFor={passwordConfirmId}
                        message={errors?.passwordConfirm?.message}
                    />
                ) : null}
            </Label>
            <button
                disabled={isLoading}
                className="mt-2 border border-gray-50 bg-[#2c2d30] py-2"
            >
                {isLoading ? (
                    <ImSpinner9 className="mx-auto animate-spin text-sm" />
                ) : (
                    "Сохранить"
                )}
            </button>
        </form>
    );
};
