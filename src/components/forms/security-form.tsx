import { useState } from "react";
import { Link } from "react-router-dom";

import {
    useTurnOn2FAMutation,
    useSend2FAConfirmationCodeMutation
} from "@/api/securityApi";
import { useGetUserQuery } from "@/store/api/userApi";
import { useAuth } from "@/store/hooks/useAuth";
import { Label } from "@/components/ui/label";

import { toast } from "../toasts/toast";

export const SecurityForm = () => {
    const [verifyEnabled, setVerifyEnabled] = useState(false);
    const { isAuthenticated } = useAuth();
    const { data: user } = useGetUserQuery(undefined, {
        skip: !isAuthenticated
    });
    const [turnOn2FA] = useTurnOn2FAMutation();
    const [verifyUser] = useSend2FAConfirmationCodeMutation();

    const onClickHandler: React.MouseEventHandler<
        HTMLButtonElement
    > = async () => {
        try {
            const { message } = await turnOn2FA().unwrap();
            toast.notify(message);
            setVerifyEnabled(true);
        } catch (error) {}
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
            setVerifyEnabled(false);
        } catch (error) {}
    };

    return (
        <div className="grid gap-y-4">
            <h3 className="text-center">Безопасность</h3>
            {user?.email ? (
                <>
                    <div className="space-y-2">
                        <p>Ваш Email</p>
                        <p className="h-10 rounded-md border border-[#414148] px-4 py-2 leading-6">
                            {user?.email}
                        </p>
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
                className="rounded-md border border-gray-50 bg-[#2c2d30] px-4 py-2 text-center"
            >
                Включить двойную проверку
            </button>
            {verifyEnabled ? (
                <form
                    className="space-y-2"
                    onSubmit={onSubmitHandler}
                >
                    <Label>
                        <span>Код подтверждения</span>
                        <input
                            inputMode="numeric"
                            autoComplete="off"
                            name="code"
                            className="w-full rounded-md border border-gray-50 bg-[#2c2d30] px-4 py-2"
                        />
                    </Label>
                    <button className="ml-auto block text-xs text-[#757b85]">
                        Подтвердить
                    </button>
                </form>
            ) : null}
            <Link
                to="/main/security/reset-password"
                className="mt-2 rounded-md border border-gray-50 bg-[#2c2d30] px-4 py-2 text-center"
            >
                Изменить пароль
            </Link>
        </div>
    );
};
