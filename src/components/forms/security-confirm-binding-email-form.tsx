import { Navigate } from "react-router-dom";
import { useChangeEmailMutation } from "@/store";
import { useToast } from "@/components/ui/use-toast";

import { PreviousRouteLink } from "@/components/previous-route-link";
import { Input, ErrorMessage } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImSpinner9 } from "react-icons/im";

interface FormFields {
    code: HTMLInputElement;
}

export const SecurityConfirmBindingEmailForm = () => {
    const [changeEmail, { isError, isSuccess, isLoading, error }] =
        useChangeEmailMutation();
    const { toast } = useToast();

    const onSubmitHandler: React.FormEventHandler<
        HTMLFormElement & FormFields
    > = async event => {
        event.preventDefault();

        const { code } = event.currentTarget;

        const response = await changeEmail({ code: code.value });

        if (response?.error) return;

        toast({
            description: "Email был успешно изменён",
            duration: 5000
        });
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
                    className="border-[#414148] focus-visible:outline-transparent"
                />
            </Label>
            <Label>
                <span>Введите код</span>
                <Input
                    placeholder="Введите код"
                    name="code"
                    aria-invalid={isError}
                    className="border-[#414148]"
                />
                {isError ? (
                    <ErrorMessage message={error?.data?.message} />
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
