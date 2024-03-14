import { useLocation, useNavigate } from "react-router-dom";
import { useSend2FAConfirmationCodeMutation } from "@/api/securityApi";
import { handleErrorResponse } from "@/store/services";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/toasts/toast";
import { PreviousRouteLink } from "@/components/previous-route-link";

export const SecurityTwoFAForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [verifyUser, { isLoading: isUserVerifying }] =
        useSend2FAConfirmationCodeMutation();

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
            navigate("/main/security");
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

            <h3 className="text-center">Двойная проверка</h3>

            <Label>
                <span>На ваш Email отправлен код</span>
                <Input
                    defaultValue={location?.state?.email}
                    readOnly
                    className="border-[#414148] focus-visible:outline-transparent"
                />
            </Label>

            <Label>
                <span>Код</span>
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
                className="mt-2 border border-gray-50 bg-[#2c2d30] py-2 disabled:cursor-wait disabled:opacity-80"
            >
                Подтвердить
            </button>
            {/* <button
                disabled={isUserVerifying}
                className="ml-auto block text-xs text-[#757b85]"
            >
                Подтвердить
            </button> */}
        </form>
    );
};
