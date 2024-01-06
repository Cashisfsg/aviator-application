import { useEffect } from "react";

import { Navigate, useLocation } from "react-router-dom";

import {
    useGetUserQuery,
    useSendConfirmationCodeOnExistingEmailMutation,
    useConfirmExistingEmailMutation
} from "@/store";

import { PreviousRouteLink } from "@/components/previous-route-link";
import { Input, ErrorMessage } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormFields {
    code: HTMLInputElement;
}

export const SecurityConfirmExistingEmailForm = () => {
    const { data: user } = useGetUserQuery();
    const [sendConfirmationCodeOnExistingEmail] =
        useSendConfirmationCodeOnExistingEmailMutation();
    const [confirmExistingEmail, { isSuccess, isError, error }] =
        useConfirmExistingEmailMutation();

    const location = useLocation();

    useEffect(() => {
        (async () => {
            await sendConfirmationCodeOnExistingEmail();
        })();
    }, [sendConfirmationCodeOnExistingEmail]);

    const onSubmitHandler: React.FormEventHandler<
        HTMLFormElement & FormFields
    > = async event => {
        event.preventDefault();

        const { code } = event.currentTarget;

        await confirmExistingEmail({ code: code.value });
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
                    placeholder="Введите код"
                    required
                    aria-invalid={isError}
                    name="code"
                    className="border-[#414148]"
                />
                {isError ? (
                    <ErrorMessage message={error?.data?.message} />
                ) : null}
            </Label>
            <button className="mt-2 border border-gray-50 bg-[#2c2d30] py-1.5">
                Изменить
            </button>
        </form>
    );
};
