import { useRef, useId } from "react";
import { Navigate } from "react-router-dom";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    emailValidationSchema,
    EmailValidationFormSchema
} from "@/utils/schemas";

import { useSendConfirmationCodeMutation } from "@/store";
import { isErrorWithMessage, isFetchBaseQueryError } from "@/store/services";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/input";

import { ImSpinner9 } from "react-icons/im";

export const RestorePasswordForm = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const emailId = useId();
    const emailErrorId = useId();
    const [sendConfirmationCode, { isLoading, isSuccess }] =
        useSendConfirmationCodeMutation();

    const email = sessionStorage.getItem("email");

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors }
    } = useForm<EmailValidationFormSchema>({
        resolver: zodResolver(emailValidationSchema),
        defaultValues: {
            email: email || ""
        }
    });

    const onSubmit: SubmitHandler<EmailValidationFormSchema> = async ({
        email
    }) => {
        try {
            await sendConfirmationCode({ email }).unwrap();
            sessionStorage.setItem("email", email);
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
        clearErrors();
    };

    if (isSuccess) {
        return <Navigate to="/main/password/confirm-email" />;
    }

    return (
        <form
            className="space-y-8"
            onSubmit={handleSubmit(onSubmit)}
            ref={formRef}
        >
            <Label>
                <span className="text-sm">
                    Введите email привязанный к аккаунту
                </span>
                <Input
                    id={emailId}
                    {...register("email")}
                    aria-invalid={
                        errors?.email || errors?.root ? "true" : "false"
                    }
                    aria-errormessage={
                        errors?.email || errors?.root ? emailErrorId : undefined
                    }
                    autoComplete="off"
                    onFocus={onFocusHandler}
                />

                {errors?.root ? (
                    <ErrorMessage
                        id={emailErrorId}
                        message={errors?.root?.message}
                    />
                ) : errors?.email ? (
                    <ErrorMessage
                        id={emailErrorId}
                        message={errors?.email?.message}
                    />
                ) : null}
            </Label>
            <Button
                variant="confirm"
                disabled={isLoading}
            >
                {isLoading ? (
                    <ImSpinner9 className="mx-auto animate-spin text-[28px]" />
                ) : (
                    "Восстановить"
                )}
            </Button>
        </form>
    );
};
