import { useEffect, useId, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthenticateUserMutation } from "@/store";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import {
    authorizationCredentialsSchema as formSchema,
    AuthorizationCredentialsFormSchema as FormSchema
} from "@/utils/schemas";

// import { useDialogContext } from "@/components/ui/dialog/use-dialog-context";

import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, ErrorMessage } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ImSpinner9 } from "react-icons/im";

export const SignInForm = () => {
    // const { dialogRef } = useDialogContext();
    const dialogCloseRef = useRef<HTMLButtonElement>(null);
    const formId = useId();
    const [authenticate, { isLoading, isError, error }] =
        useAuthenticateUserMutation();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            login: "",
            password: ""
        }
    });

    useEffect(() => {
        sessionStorage.removeItem("email");
    }, []);

    const onSubmitHandler: SubmitHandler<FormSchema> = async data => {
        const response = await authenticate(data);

        if (response?.error) return;

        reset();
        navigate("/main");
        dialogCloseRef?.current?.click();
    };

    return (
        <>
            <form
                id={formId}
                className="grid gap-y-8"
                onSubmit={handleSubmit(onSubmitHandler)}
            >
                <Label>
                    <span>Логин</span>
                    <Input
                        type="text"
                        aria-invalid={
                            isError || errors.login ? "true" : "false"
                        }
                        {...register("login")}
                    />
                    {errors?.login ? (
                        <ErrorMessage message={errors?.login?.message} />
                    ) : null}
                </Label>
                <Label>
                    <span>Пароль</span>
                    <Input
                        type="password"
                        aria-invalid={
                            isError || errors.password ? "true" : "false"
                        }
                        {...register("password")}
                    />
                    {errors?.password ? (
                        <ErrorMessage message={errors?.password?.message} />
                    ) : isError ? (
                        <ErrorMessage message={error?.data?.message} />
                    ) : null}
                </Label>
            </form>
            <p className="text-right text-sm text-blue-500">
                <Link to="/main/password/restore">Забыли пароль?</Link>
            </p>
            <Button
                variant="confirm"
                form={formId}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ImSpinner9 className="mx-auto animate-spin text-[28px]" />
                ) : (
                    "Войти"
                )}
            </Button>
            <DialogClose
                className="hidden"
                ref={dialogCloseRef}
            />
        </>
    );
};
