import { useId, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
    const location = useLocation();

    console.log(
        "Email: ",
        location?.state?.email,
        " password: ",
        location?.state?.password
    );

    console.log("Location: ", location);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            login: sessionStorage.getItem("email") || undefined,
            password: location?.state?.password
        }
    });

    const onSubmitHandler: SubmitHandler<FormSchema> = async data => {
        const response = await authenticate(data);

        if (response?.error) return;

        reset();
        navigate("/main");
        // sessionStorage.removeItem("email");
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
                    <span>Логин или Email</span>
                    <Input
                        type="text"
                        // defaultValue={
                        //     sessionStorage.getItem("email") || undefined
                        // }
                        // defaultValue={"dasdas"}
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
                        // defaultValue={123456789}
                        aria-invalid={
                            isError || errors.password ? "true" : "false"
                        }
                        {...register("password")}
                    />
                    {/* <span>{location?.state?.password}</span> */}
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
