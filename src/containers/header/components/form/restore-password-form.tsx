import { useRef, useId } from "react";
import { Form, redirect, useSubmit } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FormFields {
    email: string;
}

export const action = async ({ request }: any) => {
    const formData = await request.formData();
    sessionStorage.setItem("email", formData.get("email"));

    return redirect("/aviator_front/password/confirm-email");
};

const formSchema = z.object({
    email: z
        .string()
        .min(1, {
            message: "Поле обязательно для заполнения"
        })
        .email({ message: "Укажите корректный адрес электронной почты" })
});

export const RestorePasswordForm = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const submit = useSubmit();
    const emailErrorId = useId();

    const email = sessionStorage.getItem("email");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: email || ""
        }
    });

    const onSubmit: SubmitHandler<FormFields> = () => {
        submit(formRef.current, {
            method: "post"
        });
    };

    return (
        <Form
            className="space-y-8"
            onSubmit={form.handleSubmit(onSubmit)}
            ref={formRef}
        >
            <Label>
                <span className="text-sm">
                    Введите email привязанный к аккаунту
                </span>
                <Input
                    {...form.register("email")}
                    aria-invalid={
                        form.formState.errors.email ? "true" : "false"
                    }
                    aria-errormessage={emailErrorId}
                    autoComplete="off"
                />
                <output
                    id={emailErrorId}
                    className="block text-xs text-red-750"
                >
                    {form.formState.errors.email?.message}
                </output>
            </Label>
            <Button variant="confirm">Восстановить</Button>
        </Form>
    );
};
