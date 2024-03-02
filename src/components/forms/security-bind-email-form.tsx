import { useId } from "react";
import { Navigate } from "react-router-dom";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSendEmailChangeCodeMutation } from "@/store/api/userApi";
import { isErrorWithMessage, isFetchBaseQueryError } from "@/store/services";

import {
    emailValidationSchema as formSchema,
    EmailValidationFormSchema as FormSchema
} from "@/utils/schemas";

import { PreviousRouteLink } from "@/components/previous-route-link";
import { Input, ErrorMessage } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImSpinner9 } from "react-icons/im";

export const SecurityBindEmailForm = () => {
    const emailId = useId();
    const emailErrorId = useId();
    const serverErrorId = useId();

    const [sendChangeCode, { isLoading, isSuccess }] =
        useSendEmailChangeCodeMutation();

    const {
        handleSubmit,
        register,
        setError,
        clearErrors,
        formState: { errors }
    } = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ""
        }
    });

    const onSubmitHandler: SubmitHandler<FormSchema> = async ({ email }) => {
        sessionStorage.setItem("email", email);
        try {
            await sendChangeCode({ email }).unwrap();
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
        return <Navigate to="/main/security/bind-email/confirm" />;
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className="relative grid gap-y-4"
        >
            <PreviousRouteLink />
            <h3 className="text-center">Привязать Email</h3>
            <Label>
                {/* <span>Email</span> */}
                <Input
                    id={emailId}
                    placeholder="Введите email"
                    {...register("email")}
                    aria-invalid={
                        errors?.email || errors?.root ? "true" : "false"
                    }
                    aria-errormessage={
                        errors?.root
                            ? serverErrorId
                            : errors?.email
                              ? emailErrorId
                              : undefined
                    }
                    onFocus={onFocusHandler}
                    className="border-[#414148]"
                />
                {errors?.root ? (
                    <ErrorMessage
                        id={emailErrorId}
                        htmlFor={emailId}
                        message={errors?.root?.message}
                    />
                ) : errors?.email ? (
                    <ErrorMessage
                        id={serverErrorId}
                        htmlFor={emailId}
                        message={errors?.email?.message}
                    />
                ) : null}
            </Label>
            <button
                disabled={isLoading}
                className="mt-2 border border-gray-50 bg-[#2c2d30] py-1.5"
            >
                {isLoading ? (
                    <ImSpinner9 className="mx-auto animate-spin text-sm" />
                ) : (
                    "Привязать"
                )}
            </button>
        </form>
    );
};
