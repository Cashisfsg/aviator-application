import { useState, useEffect, useId } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

import {
    useGetUserQuery,
    useSendConfirmationCodeOnExistingEmailMutation,
    useConfirmExistingEmailMutation
} from "@/store";
import { isErrorWithMessage, isFetchBaseQueryError } from "@/store/services";

import { PreviousRouteLink } from "@/components/previous-route-link";
import { Input, ErrorMessage } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImSpinner9 } from "react-icons/im";
import { PiWarningFill } from "react-icons/pi";

interface FormFields {
    code: HTMLInputElement;
}

export const SecurityConfirmExistingEmailForm = () => {
    const [errorState, setErrorState] = useState({
        message: "",
        isError: false
    });

    const codeId = useId();
    const codeErrorId = useId();

    const { data: user } = useGetUserQuery();
    const [sendConfirmationCodeOnExistingEmail] =
        useSendConfirmationCodeOnExistingEmailMutation();
    const [confirmExistingEmail, { isSuccess, isLoading }] =
        useConfirmExistingEmailMutation();

    const location = useLocation();

    useEffect(() => {
        (async () => {
            try {
                await sendConfirmationCodeOnExistingEmail().unwrap();
            } catch (error) {
                if (isFetchBaseQueryError(error)) {
                    const errorMessage =
                        "error" in error
                            ? error.error
                            : (
                                  error.data as {
                                      status: number;
                                      message: string;
                                  }
                              ).message;
                    toast.error(errorMessage, {
                        position: "top-center",
                        action: {
                            label: "Скрыть",
                            onClick: () => {}
                        },
                        icon: (
                            <PiWarningFill className="text-4xl leading-none text-red-500" />
                        )
                    });
                } else if (isErrorWithMessage(error)) {
                    toast.error(error.message, {
                        position: "top-center",
                        action: {
                            label: "Скрыть",
                            onClick: () => {}
                        },
                        icon: (
                            <PiWarningFill className="text-4xl leading-none text-red-500" />
                        )
                    });
                }
            }
        })();
    }, []);

    const onSubmitHandler: React.FormEventHandler<
        HTMLFormElement & FormFields
    > = async event => {
        event.preventDefault();

        try {
            const { code } = event.currentTarget;

            await confirmExistingEmail({
                code: Number(code.value),
                email: user?.email as string
            }).unwrap();
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
        return <Navigate to={location.state?.nextUrl} />;
    }

    return (
        <form
            onSubmit={onSubmitHandler}
            className="relative grid gap-y-4"
        >
            <PreviousRouteLink />
            <h3 className="text-center">Подтвердждение Email</h3>
            <Label>
                <span>На ваш Email отправлен код</span>
                <Input
                    defaultValue={user?.email}
                    readOnly
                    className="border-[#414148] focus-visible:outline-transparent"
                />
            </Label>

            <Label>
                <span>Код</span>
                <Input
                    id={codeId}
                    placeholder="Введите код"
                    name="code"
                    required
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
                    "Изменить"
                )}
            </button>
        </form>
    );
};
