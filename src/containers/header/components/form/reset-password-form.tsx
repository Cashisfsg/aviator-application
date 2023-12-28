// import { useRef } from "react";
import { Form, redirect, useSubmit } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { DialogClose } from "@/components/ui/dialog";
// import { DialogCloseProps } from "@radix-ui/react-dialog";

interface FormFields {
    password: string;
    confirm_password: string;
}

export const action = async () => {
    return redirect("/aviator_front/main/");
};

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
        confirm_password: z
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
    .refine(data => data.password === data.confirm_password, {
        message: "Пароли должны совпадать",
        path: ["confirm_password"]
    });

export const ResetPasswordForm = () => {
    const submit = useSubmit();
    // const closeRef = useRef<
    //     DialogCloseProps & React.RefAttributes<HTMLButtonElement>
    // >(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirm_password: ""
        }
    });

    const onSubmit: SubmitHandler<FormFields> = () => {
        submit(null, { method: "post" });
    };

    // const handleSubmit = () => {
    //     submit(null, { method: "post" });
    //     // closeRef.current?.click();
    //     console.log("click");
    // };

    return (
        <Form
            // method="POST"
            className="grid gap-y-8"
            onSubmit={form.handleSubmit(onSubmit)}
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
                <output className="block text-xs text-red-750">
                    {form.formState.errors.password?.message}
                </output>
            </Label>
            <Label>
                <span className="text-sm">Повторите пароль</span>
                <Input
                    {...form.register("confirm_password")}
                    aria-invalid={
                        form.formState.errors.confirm_password
                            ? "true"
                            : "false"
                    }
                    autoComplete="off"
                />
                <output className="block text-xs text-red-750">
                    {form.formState.errors.confirm_password?.message}
                </output>
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
        </Form>
    );
};
