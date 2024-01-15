import { useRef, useId } from "react";
import { Navigate } from "react-router-dom";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    emailValidationSchema,
    EmailValidationFormSchema
} from "@/utils/schemas";

import { useSendConfirmationCodeMutation } from "@/store";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/input";

import { ImSpinner9 } from "react-icons/im";

export const RestorePasswordForm = () => {
    const formRef = useRef<HTMLFormElement>(null);
    // const submit = useSubmit();
    const emailErrorId = useId();
    const [sendConfirmationCode, { error, isError, isLoading, isSuccess }] =
        useSendConfirmationCodeMutation();

    const email = sessionStorage.getItem("email");

    const form = useForm<EmailValidationFormSchema>({
        resolver: zodResolver(emailValidationSchema),
        defaultValues: {
            email: email || ""
        }
    });

    const onSubmit: SubmitHandler<EmailValidationFormSchema> = async ({
        email
    }) => {
        await sendConfirmationCode({ email });

        sessionStorage.setItem("email", email);
    };

    if (isSuccess) {
        return <Navigate to="/main/password/confirm-email" />;
    }

    return (
        <form
            className="space-y-8"
            onSubmit={form.handleSubmit(onSubmit)}
            ref={formRef}
        >
            <Label>
                <span className="text-sm">
                    Введите email привязанный к аккаунту
                </span>
                <Input
                    {...form.register("email")}
                    aria-invalid={
                        form.formState.errors.email
                            ? "true"
                            : isError
                              ? "true"
                              : "false"
                    }
                    aria-errormessage={emailErrorId}
                    autoComplete="off"
                />
                {isError ? (
                    <ErrorMessage
                        id={emailErrorId}
                        message={error?.data?.message}
                    />
                ) : null}
                {form.formState.errors.email ? (
                    <ErrorMessage
                        id={emailErrorId}
                        message={form.formState.errors.email?.message}
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
