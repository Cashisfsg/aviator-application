import { useState } from "react";
import { Link } from "react-router-dom";

import {
    useTurnOn2FAMutation,
    useTurnOff2FAMutation,
    useSend2FAConfirmationCodeMutation
} from "@/api/securityApi";
import { useGetUserQuery } from "@/store/api/userApi";
import { useAuth } from "@/store/hooks/useAuth";
import { Label } from "@/components/ui/label";

import { toast } from "../toasts/toast";
import { handleErrorResponse } from "@/store/services";

export const SecurityForm = () => {
    const [verificationState, setVerificationState] = useState({
        enabled: false,
        success: false
    });
    const { isAuthenticated } = useAuth();
    const { data: user } = useGetUserQuery(undefined, {
        skip: !isAuthenticated
    });
    const [turnOn2FA, { isLoading: is2FATurningOn }] = useTurnOn2FAMutation();
    const [turnOff2FA, { isLoading: is2FATurningOff }] =
        useTurnOff2FAMutation();
    const [verifyUser, { isLoading: isUserVerifying }] =
        useSend2FAConfirmationCodeMutation();

    const onClickHandler: React.MouseEventHandler<
        HTMLButtonElement
    > = async () => {
        try {
            if (user?.twoFA) {
                const { message } = await turnOff2FA().unwrap();
                toast.notify(message);
            } else {
                const { message } = await turnOn2FA().unwrap();
                toast.notify(message);
            }
            setVerificationState(state => ({ ...state, enabled: true }));
        } catch (error) {
            handleErrorResponse(error, message => {
                toast.error(message);
            });
        }
    };

    const onSubmitHandler: React.FormEventHandler<
        HTMLFormElement & { code: HTMLInputElement }
    > = async event => {
        event.preventDefault();

        const { code } = event.currentTarget;

        try {
            const { message } = await verifyUser({
                code: Number(code.value)
            }).unwrap();
            toast.notify(message);
            setVerificationState(state => ({
                ...state,
                enabled: false,
                success: true
            }));
        } catch (error) {
            handleErrorResponse(error, message => {
                toast.error(message);
            });
        }
    };

    return (
        <div className="grid gap-y-4">
            <h3 className="text-center">Безопасность</h3>
            {user?.email ? (
                <>
                    <div className="space-y-2">
                        <p>Ваш Email</p>
                        <input
                            value={user?.email}
                            readOnly
                            className="w-full rounded-md border-2 border-[#414148] bg-transparent px-4 py-2"
                        />

                        <Link
                            to="/main/security/email/confirm"
                            state={{
                                nextUrl: "/main/security/bind-email"
                            }}
                            className="ml-auto block w-fit text-xs text-[#757b85]"
                        >
                            Изменить
                        </Link>
                    </div>
                </>
            ) : (
                <Link
                    to="/main/security/bind-email"
                    className="mt-2 rounded-md border border-gray-50 bg-[#2c2d30] px-4 py-2 text-center"
                >
                    Привязать Email
                </Link>
            )}
            <button
                onClick={onClickHandler}
                disabled={is2FATurningOn || is2FATurningOff}
                className="rounded-md border border-gray-50 bg-[#2c2d30] px-4 py-2 text-center"
            >
                {`${user?.twoFA ? "Отключить" : "Включить"} двойную проверку`}
            </button>
            {verificationState.enabled ? (
                <form
                    className="space-y-2"
                    onSubmit={onSubmitHandler}
                >
                    <Label>
                        <span>Код подтверждения</span>
                        <input
                            inputMode="numeric"
                            autoComplete="off"
                            required
                            name="code"
                            className="w-full rounded-md border border-gray-50 bg-[#2c2d30] px-4 py-2"
                        />
                    </Label>
                    <button
                        disabled={isUserVerifying}
                        className="ml-auto block text-xs text-[#757b85]"
                    >
                        Подтвердить
                    </button>
                </form>
            ) : null}
            <Link
                to="/main/security/reset-password"
                className="rounded-md border border-gray-50 bg-[#2c2d30] px-4 py-2 text-center"
            >
                Изменить пароль
            </Link>
        </div>
    );
};
