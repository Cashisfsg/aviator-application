import { useNavigate } from "react-router-dom";
import { useConfirmPasswordChangeMutation } from "@/store";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/input";

// export const action = async () => {
//     return redirect("/main/password/reset");
// };

interface FormFields {
    code: HTMLInputElement;
}

export const ConfirmEmailForm = () => {
    const email = sessionStorage.getItem("email");
    const navigate = useNavigate();

    const [confirmChange, { isError, error }] =
        useConfirmPasswordChangeMutation();

    const handleSubmit: React.FormEventHandler<
        HTMLFormElement & FormFields
    > = async event => {
        event.preventDefault();

        const { code } = event.currentTarget;

        const response = await confirmChange({ code: code.value });

        if (response?.error) return;

        navigate("/main/password/reset");
    };

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
            <Button variant="confirm">Восстановить</Button>
        </form>
    );
};
