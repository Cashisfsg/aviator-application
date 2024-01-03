import { Navigate } from "react-router-dom";
import { useChangeEmailMutation } from "@/store";

import { Input, ErrorMessage } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormFields {
    code: HTMLInputElement;
}

export const SecurityConfirmBindingEmailForm = () => {
    const [changeEmail, { isError, isSuccess }] = useChangeEmailMutation();

    const onSubmitHandler: React.FormEventHandler<
        HTMLFormElement & FormFields
    > = async event => {
        event.preventDefault();

        const { code } = event.currentTarget;

        await changeEmail({ code: code.value });
    };

    if (isSuccess) {
        return <Navigate to="/aviator_front/main/security" />;
    }

    return (
        <form
            onSubmit={onSubmitHandler}
            className="grid gap-y-4"
        >
            <h3 className="text-center">Привязать Email</h3>
            <Label>
                <span>На ваш Email отправлен код</span>
                <Input
                    readOnly
                    className="border-[#414148]"
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
                {isError ? <ErrorMessage message="Неверный код" /> : null}
            </Label>
            <button className="mt-2 border border-gray-50 bg-[#2c2d30] py-1.5">
                Сохранить
            </button>
        </form>
    );
};
