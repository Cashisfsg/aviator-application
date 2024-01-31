import { Navigate } from "react-router-dom";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    passwordPairSchema as formSchema,
    PasswordPairFormSchema as FormSchema
} from "@/utils/schemas";

import { useChangePasswordMutation } from "@/store";
import { useAuth } from "@/store/hooks/useAuth";

import { Label } from "@/components/ui/label";
import { Input, ErrorMessage } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { ImSpinner9 } from "react-icons/im";

export const ResetPasswordForm = () => {
    const [changePassword, { isSuccess, isLoading }] =
        useChangePasswordMutation();
    const { token } = useAuth();

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            passwordConfirm: ""
        }
    });

    const onSubmitHandler: SubmitHandler<FormSchema> = async ({
        password,
        passwordConfirm
    }) => {
        if (!token) return;

        await changePassword({
            password,
            passwordConfirm,
            token
        });
    };

    if (isSuccess) {
        const email = sessionStorage.getItem("email");
        sessionStorage.removeItem("email");

        return (
            <Navigate
                to="/main/sign-in"
                state={{ password: form.getValues().password, email }}
            />
        );
    }

    return (
        <form
            className="grid gap-y-8"
            onSubmit={form.handleSubmit(onSubmitHandler)}
        >
            <Label>
                <span className="text-xs">
                    Придумайте новый пароль (мин. 8 символов)
                </span>
                <Input
                    {...form.register("password")}
                    aria-invalid={
                        form.formState.errors.password ? "true" : "false"
                    }
                    autoComplete="off"
                />
                {form.formState.errors.password ? (
                    <ErrorMessage
                        message={form.formState.errors.password?.message}
                    />
                ) : null}
            </Label>
            <Label>
                <span className="text-sm">Повторите пароль</span>
                <Input
                    {...form.register("passwordConfirm")}
                    aria-invalid={
                        form.formState.errors.passwordConfirm ? "true" : "false"
                    }
                    autoComplete="off"
                />
                {form.formState.errors.passwordConfirm ? (
                    <ErrorMessage
                        message={form.formState.errors.passwordConfirm?.message}
                    />
                ) : null}
            </Label>

            <Button
                disabled={isLoading}
                variant="confirm"
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
