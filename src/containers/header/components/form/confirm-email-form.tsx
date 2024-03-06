import { useState, useId } from "react";
import { useNavigate } from "react-router-dom";
import { useConfirmPasswordChangeMutation } from "@/store";
import { isErrorWithMessage, isFetchBaseQueryError } from "@/store/services";

import {
    RestorePasswordDialogHeader,
    RestorePasswordDialogFooter
} from "../modals/restore-password-modal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/input";

import { ImSpinner9 } from "react-icons/im";

interface FormFields {
    code: HTMLInputElement;
}

export const ConfirmEmailForm = () => {
    const [errorState, setErrorState] = useState({
        message: "",
        isError: false
    });

    const codeId = useId();
    const codeErrorId = useId();
    const email = sessionStorage.getItem("email");

    const navigate = useNavigate();
    const [confirmChange, { isLoading }] = useConfirmPasswordChangeMutation();

    const handleSubmit: React.FormEventHandler<
        HTMLFormElement & FormFields
    > = async event => {
        event.preventDefault();

        try {
            const { code } = event.currentTarget;

            await confirmChange({ code: Number(code.value) }).unwrap();
            navigate("/main/password/reset");
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
        setErrorState(err => ({
            ...err,
            message: "",
            isError: false
        }));
    };

    return (
        <>
            <RestorePasswordDialogHeader />
            <form
                onSubmit={handleSubmit}
                className="grid gap-y-8"
            >
                <Label direction="column">
                    <span className="text-sm">
                        На ваш Email отправлен код для подтверждения
                    </span>
                    <Input
                        readOnly
                        value={email as string}
                        className="outline-none"
                    />
                </Label>
                <Label direction="column">
                    <span className="text-sm">Введите код</span>
                    <Input
                        id={codeId}
                        name="code"
                        aria-invalid={errorState.isError}
                        aria-errormessage={
                            errorState.isError ? codeErrorId : undefined
                        }
                        onFocus={onFocusHandler}
                    />
                    {errorState.isError ? (
                        <ErrorMessage
                            id={codeErrorId}
                            htmlFor={codeId}
                            message={errorState.message}
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
            <RestorePasswordDialogFooter />
        </>
    );
};
