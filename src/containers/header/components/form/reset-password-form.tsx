// import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChangePasswordMutation } from "@/store";
import { useAuth } from "@/store/hooks/useAuth";

import * as z from "zod";

import { Label } from "@/components/ui/label";
import { Input, ErrorMessage } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { DialogClose } from "@/components/ui/dialog";
// import { DialogCloseProps } from "@radix-ui/react-dialog";

interface FormFields {
    password: string;
    passwordConfirm: string;
}

// export const action = async () => {
//     return redirect("/aviator_front/main/");
// };

const alphanumericRegex = /^[A-Za-z0-9]+$/;

const formSchema = z
    .object({
        password: z
            .string()
            .min(1, {
                message: "Поле обязательно для заполнения"
            })
            .regex(alphanumericRegex, {
                message: "Поле может содержать только символы A-Z и цифры"
            })
            .min(8, {
                message: "Пароль должен содержать не менее 8 символов"
            })
            .max(30, {
                message: "Превышено максимально допустимое количество символов"
            }),
        passwordConfirm: z
            .string()
            .min(1, {
                message: "Поле обязательно для заполнения"
            })
            .regex(alphanumericRegex, {
                message: "Поле может содержать только символы A-Z и цифры"
            })
            .min(8, {
                message: "Пароль должен содержать не менее 8 символов"
            })
            .max(30, {
                message: "Превышено максимально допустимое количество символов"
            })
    })
    .refine(data => data.password === data.passwordConfirm, {
        message: "Пароли должны совпадать",
        path: ["passwordConfirm"]
    });

export const ResetPasswordForm = () => {
    // const submit = useSubmit();
    // const closeRef = useRef<
    //     DialogCloseProps & React.RefAttributes<HTMLButtonElement>
    // >(null);

    const navigate = useNavigate();
    const [changePassword] = useChangePasswordMutation();
    const { token } = useAuth();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            passwordConfirm: ""
        }
    });

    const handleSubmit: SubmitHandler<FormFields> = async ({
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

    // const handleSubmit = () => {
    //     submit(null, { method: "post" });
    //     // closeRef.current?.click();
    //     console.log("click");
    // };

    return (
        <form
            // method="POST"
            className="grid gap-y-8"
            onSubmit={form.handleSubmit(handleSubmit)}
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
