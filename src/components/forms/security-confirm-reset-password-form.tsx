import { Navigate } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import {
    passwordPairSchema as formSchema,
    PasswordPairFormSchema as FormSchema
} from "@/utils/schemas";

import { useChangeUserPasswordMutation } from "@/store";
import { useAuth } from "@/store/hooks/useAuth";

import { PreviousRouteLink } from "@/components/previous-route-link";
import { Input, ErrorMessage } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImSpinner9 } from "react-icons/im";

export const SecurityConfirmResetPasswordForm = () => {
    const [changePassword, { isLoading, isSuccess, isError, error }] =
        useChangeUserPasswordMutation();
    const { token } = useAuth();

    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<FormSchema>({
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

        await changePassword({ token, password, passwordConfirm });
    };

    if (isSuccess) {
        return <Navigate to="/main/security" />;
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className="relative grid gap-y-4"
        >
            <PreviousRouteLink />

            <h3 className="text-center">Сброс пароля</h3>
            <Label>
                <span>Введите новый пароль</span>
                <Input
                    placeholder="Введите пароль"
                    aria-invalid={errors?.password ? "true" : "false"}
                    {...register("password")}
                    className="border-[#414148]"
                />
                {errors?.password ? (
                    <ErrorMessage message={errors?.password?.message} />
                ) : null}
            </Label>
            <Label>
                <span>Повторите пароль</span>
                <Input
                    placeholder="Повторите пароль"
                    aria-invalid={errors?.passwordConfirm ? "true" : "false"}
                    {...register("passwordConfirm")}
                    className="border-[#414148]"
                />
                {errors?.passwordConfirm ? (
                    <ErrorMessage message={errors?.passwordConfirm?.message} />
                ) : null}
                {isError ? (
                    <ErrorMessage message={error?.data?.message} />
                ) : null}
            </Label>
            <button
                disabled={isLoading}
                className="mt-2 border border-gray-50 bg-[#2c2d30] py-2"
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
