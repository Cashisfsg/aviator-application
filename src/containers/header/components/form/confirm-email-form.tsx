import { Form, redirect } from "react-router-dom";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const action = async () => {
    return redirect("/aviator_front/main/password/reset");
};

export const ConfirmEmailForm = () => {
    const email = sessionStorage.getItem("email");

    return (
        <Form
            method="POST"
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
                <Input />
            </Label>
            <Button variant="confirm">Восстановить</Button>
        </Form>
    );
};
