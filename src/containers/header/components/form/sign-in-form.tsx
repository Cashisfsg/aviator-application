import { useEffect, useId } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form } from "./form";

export const SignInForm = () => {
    const formId = useId();

    useEffect(() => {
        sessionStorage.removeItem("email");
    }, []);

    return (
        <>
            <Form id={formId}>
                <Label>
                    <span>Логин</span>
                    <Input type="text" />
                </Label>
                <Label>
                    <span>Пароль</span>
                    <Input type="password" />
                </Label>
            </Form>
            <p className="text-right text-sm text-blue-500">
                <Link to="password/restore">Забыли пароль?</Link>
            </p>
            <button
                form={formId}
                className="text-white w-full bg-blue-500 py-2 text-xl font-bold"
            >
                Войти
            </button>
        </>
    );
};
