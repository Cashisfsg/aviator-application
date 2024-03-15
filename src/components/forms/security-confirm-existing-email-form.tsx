import { useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
    useGetUserQuery,
    useSendConfirmationCodeOnExistingEmailMutation,
    useConfirmExistingEmailMutation
} from "@/store/api/userApi";
import { useAuth } from "@/store/hooks/useAuth";
import { handleErrorResponse } from "@/store/services";

import { PreviousRouteLink } from "@/components/previous-route-link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    ResendCodeButton,
    ResendCodeElement
} from "@/components/ui/resend-code-button";
import { toast } from "@/components/toasts/toast";

import { ImSpinner9 } from "react-icons/im";

interface FormFields {
    code: HTMLInputElement;
}

export const SecurityConfirmExistingEmailForm = () => {
    const buttonRef = useRef<ResendCodeElement>(null);

    const { isAuthenticated } = useAuth();
    const { data: user } = useGetUserQuery(undefined, {
        skip: !isAuthenticated
    });
    const [sendConfirmationCodeOnExistingEmail, { isLoading: isCodeSending }] =
        useSendConfirmationCodeOnExistingEmailMutation();
    const [confirmExistingEmail, { isLoading }] =
        useConfirmExistingEmailMutation();

    const location = useLocation();
    const navigate = useNavigate();

    const onClickHandler: React.MouseEventHandler<
        HTMLButtonElement
    > = async () => {
        try {
            await sendConfirmationCodeOnExistingEmail().unwrap();
            buttonRef.current?.show();
            buttonRef.current?.disable();
        } catch (error) {
            handleErrorResponse(error, message => toast.error(message));
        }
    };

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
                toast.error(message);
            });
        }
    };

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
                    placeholder="Введите код"
                    name="code"
                    required
                    className="border-[#414148]"
                />
                <ResendCodeButton
                    disabled={isCodeSending}
                    onClick={onClickHandler}
                    ref={buttonRef}
                />
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
