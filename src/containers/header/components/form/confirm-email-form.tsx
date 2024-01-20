import { Navigate } from "react-router-dom";
import { useConfirmPasswordChangeMutation } from "@/store";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/input";

import { ImSpinner9 } from "react-icons/im";

// export const action = async () => {
//     return redirect("/main/password/reset");
// };

interface FormFields {
    code: HTMLInputElement;
}

export const ConfirmEmailForm = () => {
    const email = sessionStorage.getItem("email");

    const [confirmChange, { isLoading, isSuccess, isError, error }] =
        useConfirmPasswordChangeMutation();

    const handleSubmit: React.FormEventHandler<
        HTMLFormElement & FormFields
    > = async event => {
        event.preventDefault();

        const { code } = event.currentTarget;

        await confirmChange({ code: Number(code.value) });
    };

    if (isSuccess) {
        return <Navigate to="/main/password/reset" />;
    }

    return (
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
                <Input name="code" />
                {isError ? (
                    <ErrorMessage message={error?.data?.message} />
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
    );
};
