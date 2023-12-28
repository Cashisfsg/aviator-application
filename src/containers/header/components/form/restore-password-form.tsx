import { useRef, useId } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSendConfirmationCodeMutation } from "@/store";

import * as z from "zod";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/input";

interface FormFields {
    email: string;
}

// export const action = async ({ request }: any) => {
//     const formData = await request.formData();
//     sessionStorage.setItem("email", formData.get("email"));

//     return redirect("/aviator_front/main/password/confirm-email");
// };

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
    // const submit = useSubmit();
    const emailErrorId = useId();
    const navigate = useNavigate();
    const [sendConfirmationCode, { error, isError }] =
        useSendConfirmationCodeMutation();

    const email = sessionStorage.getItem("email");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: email || ""
        }
    });

    const onSubmit: SubmitHandler<FormFields> = async ({ email }) => {
        const response = await sendConfirmationCode({ email });

        if (response?.error) return;

        sessionStorage.setItem("email", email);
        navigate("/aviator_front/main/password/confirm-email");
    };

    return (
        <form
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
                        form.formState.errors.email
                            ? "true"
                            : isError
                              ? "true"
                              : "false"
                    }
                    aria-errormessage={emailErrorId}
                    autoComplete="off"
                />
                {isError ? (
                    <ErrorMessage
                        id={emailErrorId}
                        message={error?.data?.message}
                    />
                ) : form.formState.errors.email ? (
                    <ErrorMessage
                        id={emailErrorId}
                        message={form.formState.errors.email?.message}
                    />
                ) : null}
            </Label>
            <Button variant="confirm">Восстановить</Button>
        </form>
    );
};
