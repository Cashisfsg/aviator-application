import { useId, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthenticateUserMutation } from "@/store";
import { isErrorWithMessage, isFetchBaseQueryError } from "@/store/services";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import {
    authorizationCredentialsSchema as formSchema,
    AuthorizationCredentialsFormSchema as FormSchema
} from "@/utils/schemas";

import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Password, ErrorMessage } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ImSpinner9 } from "react-icons/im";

export const SignInForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [authenticate, { isLoading }] = useAuthenticateUserMutation();

    const dialogCloseRef = useRef<HTMLButtonElement>(null);

    const formId = useId();
    const loginId = useId();
    const passwordId = useId();
    const loginErrorId = useId();
    const passwordErrorId = useId();
    const serverErrorId = useId();

    const {
        register,
        handleSubmit,
        reset,
        clearErrors,
        setError,
        formState: { errors }
    } = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            login: sessionStorage.getItem("email") || undefined,
            password: location?.state?.password
        },
        shouldFocusError: false,
        mode: "onSubmit",
        reValidateMode: "onSubmit"
    });

    const onSubmitHandler: SubmitHandler<FormSchema> = async data => {
        try {
            await authenticate(data).unwrap();
            reset();
            navigate("/main");
            sessionStorage.removeItem("email");
            dialogCloseRef?.current?.click();
        } catch (error) {
            if (isFetchBaseQueryError(error)) {
                const errorMessage =
                    "error" in error
                        ? error.error
                        : (error.data as { status: number; message: string })
                              .message;
                setError("root", {
                    type: "manual",
                    message: errorMessage
                });
            } else if (isErrorWithMessage(error)) {
                setError("root", {
                    type: "manual",
                    message: error.message
                });
            }
        }
    };

    const onFocusHandler: React.FocusEventHandler<HTMLInputElement> = () => {
        clearErrors();
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
                        id={loginId}
                        type="text"
                        aria-invalid={
                            errors?.root || errors.login ? "true" : "false"
                        }
                        aria-errormessage={
                            errors.login
                                ? loginErrorId
                                : errors.password
                                  ? passwordErrorId
                                  : errors.root
                                    ? serverErrorId
                                    : undefined
                        }
                        onFocus={onFocusHandler}
                        {...register("login")}
                    />
                    {errors?.login ? (
                        <ErrorMessage
                            id={loginErrorId}
                            htmlFor={loginId}
                            message={errors?.login?.message}
                        />
                    ) : null}
                </Label>
                <Label>
                    <span>Пароль</span>
                    <Password
                        id={passwordId}
                        {...register("password")}
                        aria-invalid={
                            errors?.root || errors.password ? "true" : "false"
                        }
                        aria-errormessage={
                            errors.password
                                ? passwordErrorId
                                : errors.root
                                  ? serverErrorId
                                  : undefined
                        }
                        onFocus={onFocusHandler}
                    />
                    {/* <span>{location?.state?.password}</span> */}
                    {errors?.password ? (
                        <ErrorMessage
                            id={passwordErrorId}
                            htmlFor={passwordId}
                            message={errors?.password?.message}
                        />
                    ) : errors?.root ? (
                        <ErrorMessage
                            id={serverErrorId}
                            htmlFor={passwordId}
                            message={errors?.root?.message}
                        />
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
                className="disabled:cursor-wait"
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
