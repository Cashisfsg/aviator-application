import { useNavigate } from "react-router-dom";

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

export const ResetPasswordForm = () => {
    const navigate = useNavigate();
    const [changePassword] = useChangePasswordMutation();
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

        const response = await changePassword({
            password,
            passwordConfirm,
            token
        });

        if (response?.error) return;

        navigate("/aviator_front/main/sign-in");
    };

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
                variant="confirm"
                // onClick={handleSubmit}
            >
                Восстановить
            </Button>
            {/* <DialogClose
                ref={closeRef}
                hidden
            ></DialogClose> */}
        </form>
    );
};
