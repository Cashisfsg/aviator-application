import { useState, useId } from "react";
import { Navigate } from "react-router-dom";
import { useChangeEmailMutation } from "@/store/api/userApi";
import { toast } from "sonner";

import { PreviousRouteLink } from "@/components/previous-route-link";
import { Input, ErrorMessage } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImSpinner9 } from "react-icons/im";
import { isErrorWithMessage, isFetchBaseQueryError } from "@/store/services";

interface FormFields {
    code: HTMLInputElement;
}

export const SecurityConfirmBindingEmailForm = () => {
    const [errorState, setErrorState] = useState({
        message: "",
        isError: false
    });

    const codeId = useId();
    const codeErrorId = useId();

    const [changeEmail, { isSuccess, isLoading }] = useChangeEmailMutation();

    const onSubmitHandler: React.FormEventHandler<
        HTMLFormElement & FormFields
    > = async event => {
        event.preventDefault();

        try {
            const { code } = event.currentTarget;
            await changeEmail({
                code: Number(code.value)
            }).unwrap();
            sessionStorage.removeItem("email");
            toast("Email был успешно изменён", {
                position: "top-center",
                action: {
                    label: "Скрыть",
                    onClick: () => {}
                }
            });
        } catch (error) {
            if (isFetchBaseQueryError(error)) {
                const errorMessage =
                    "error" in error
                        ? error.error
                        : (error.data as { status: number; message: string })
                              .message;
                setErrorState(err => ({
                    ...err,
                    message: errorMessage,
                    isError: true
                }));
            } else if (isErrorWithMessage(error)) {
                setErrorState(err => ({
                    ...err,
                    message: error.message,
                    isError: true
                }));
            }
        }
    };

    const onFocusHandler: React.FocusEventHandler<HTMLInputElement> = () => {
        setErrorState(state => ({ ...state, isError: false, message: "" }));
    };

    if (isSuccess) {
        return <Navigate to="/main/security" />;
    }

    return (
        <form
            onSubmit={onSubmitHandler}
            className="relative grid gap-y-4"
        >
            <PreviousRouteLink />
            <h3 className="text-center">Привязать Email</h3>
            <Label>
                <span>На ваш Email отправлен код</span>
                <Input
                    readOnly
                    value={sessionStorage.getItem("email") || ""}
                    className="border-[#414148] focus-visible:outline-transparent"
                />
            </Label>
            <Label>
                <span>Введите код</span>
                <Input
                    id={codeId}
                    placeholder="Введите код"
                    name="code"
                    aria-invalid={errorState.isError}
                    aria-errormessage={
                        errorState.isError ? codeErrorId : undefined
                    }
                    onFocus={onFocusHandler}
                    className="border-[#414148]"
                />
                {errorState.isError ? (
                    <ErrorMessage
                        id={codeErrorId}
                        htmlFor={codeId}
                        message={errorState.message}
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
                    "Сохранить"
                )}
            </button>
        </form>
    );
};
