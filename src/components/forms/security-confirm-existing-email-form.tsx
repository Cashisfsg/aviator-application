import { useState, useEffect, useId } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
    useGetUserQuery,
    useSendConfirmationCodeOnExistingEmailMutation,
    useConfirmExistingEmailMutation
} from "@/store/api/userApi";
import { handleErrorResponse } from "@/store/services";

import { PreviousRouteLink } from "@/components/previous-route-link";
import { Input, ErrorMessage } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/toasts/toast";

import { ImSpinner9 } from "react-icons/im";

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
    const [confirmExistingEmail, { isLoading }] =
        useConfirmExistingEmailMutation();

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                await sendConfirmationCodeOnExistingEmail().unwrap();
            } catch (error) {
                handleErrorResponse(error, message => toast.error(message));
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
            navigate(location?.state?.nextUrl);
        } catch (error) {
            handleErrorResponse(error, message => {
                setErrorState(err => ({
                    ...err,
                    message: message,
                    isError: true
                }));
            });
        }
    };

    const onFocusHandler: React.FocusEventHandler<HTMLInputElement> = () => {
        setErrorState(state => ({ ...state, isError: false, message: "" }));
    };

    // if (isSuccess) {
    //     return <Navigate to={location.state?.nextUrl} />;
    // }

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
