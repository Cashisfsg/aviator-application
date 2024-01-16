import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import {
    registrationCredentialsSchema as formSchema,
    RegistrationCredentialsFormSchema as FormSchema
} from "@/utils/schemas";

import {
    useStateSelector,
    selectInitData,
    useCreateNewUserAccountMutation
} from "@/store";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { DialogClose } from "@/components/ui/dialog";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";

// import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input, ErrorMessage } from "@/components/ui/input";

import { FaCheck } from "react-icons/fa6";
import { Check, ChevronsUpDown } from "lucide-react";
import { ImSpinner9 } from "react-icons/im";

import { cn } from "@/utils";

const currencies = [
    { id: 1, label: "Казахский тенге", value: "KZT" },
    { id: 2, label: "Российский рубль", value: "RUB" },
    { id: 3, label: "Узбекистанский сум", value: "UZS" }
];

export const SignUpForm = () => {
    const [open, setOpen] = useState(false);
    const [promoOpen, setPromoOpen] = useState(false);
    const dialogCloseRef = useRef<HTMLButtonElement>(null);

    const [createNewUser, { isLoading, isError, error }] =
        useCreateNewUserAccountMutation();
    const navigate = useNavigate();

    const { login, telegramId } = useStateSelector(state =>
        selectInitData(state)
    );

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            login: login,
            password: "",
            passwordConfirm: "",
            email: "",
            from: "",
            telegramId,
            accepted_terms: undefined
        }
    });

    const onSubmit: SubmitHandler<FormSchema> = async ({
        currency,
        login,
        password,
        passwordConfirm,
        email,
        from,
        telegramId
    }) => {
        const response = await createNewUser({
            currency,
            login,
            password,
            passwordConfirm,
            email,
            from,
            telegramId
        });

        if (response?.error) return;

        navigate("/main");
        dialogCloseRef?.current?.click();
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
            >
                <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Валюта</FormLabel>
                            <Popover
                                open={open}
                                onOpenChange={setOpen}
                            >
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            role="combobox"
                                            className={cn(
                                                "w-full justify-between border-2 border-gray-500 bg-none py-4 text-base aria-[invalid=true]:border-red-750 focus:aria-[invalid=true]:outline focus:aria-[invalid=true]:-outline-offset-2",
                                                !field.value &&
                                                    "text-muted-foreground"
                                            )}
                                            {...field}
                                        >
                                            {field.value
                                                ? currencies.find(
                                                      currency =>
                                                          currency.value ===
                                                          field.value
                                                  )?.label
                                                : "Выберите валюту"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[270px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Поиск валюты..." />
                                        <CommandEmpty>
                                            Валюта не найдена
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {/* <ScrollArea className="h-64"> */}
                                            {currencies.map(currency => (
                                                <CommandItem
                                                    value={currency.label}
                                                    key={currency.value}
                                                    onSelect={() => {
                                                        form.resetField(
                                                            "currency",
                                                            {
                                                                keepError: false
                                                            }
                                                        );
                                                        form.setValue(
                                                            "currency",
                                                            currency.value
                                                        );

                                                        setOpen(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            currency.value ===
                                                                field.value
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                    {currency.label}
                                                </CommandItem>
                                            ))}
                                            {/* </ScrollArea> */}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="login"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Логин</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Пароль</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="passwordConfirm"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Подтвердите пароль</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="from"
                    render={({ field }) => (
                        <FormItem>
                            <Popover
                                open={promoOpen}
                                onOpenChange={setPromoOpen}
                            >
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            role="combobox"
                                            className="h-max p-0 text-base text-blue-500"
                                        >
                                            {field.value || "Введите промокод"}
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                    align="start"
                                    className="w-[270px] border-gray-50 bg-[#2c2d30] text-white"
                                >
                                    <form
                                        onSubmit={event => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            const code =
                                                event.currentTarget.elements?.namedItem(
                                                    "code"
                                                )?.value;
                                            form.setValue("from", code);
                                            setPromoOpen(false);
                                        }}
                                        className="relative "
                                    >
                                        <Input
                                            name="code"
                                            autoComplete="off"
                                        />
                                        <button className="absolute right-4 top-1/2 w-max -translate-y-1/2 rounded-md bg-blue-300 p-0.5">
                                            <FaCheck />
                                        </button>
                                    </form>
                                </PopoverContent>
                            </Popover>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="accepted_terms"
                    render={({ field: { value, ...rest } }) => (
                        <FormItem className="flex items-center gap-4 ">
                            <FormControl>
                                <Input
                                    type="checkbox"
                                    checked={value}
                                    className="flex-grow-0 cursor-pointer appearance-none border border-slate-300"
                                    {...rest}
                                />
                            </FormControl>
                            <p className="inline select-none text-xs">
                                <span>
                                    Я подтверждаю, что я ознакомлен и полностью
                                    согласен с
                                </span>{" "}
                                <a
                                    href=""
                                    target="_blank"
                                    className="cursor-pointer text-blue-500 underline-offset-2 hover:underline"
                                >
                                    Условиями пользовательского соглашения
                                </a>
                            </p>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="telegramId"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-4 ">
                            <FormControl>
                                <Input
                                    type="hidden"
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                {isError ? (
                    <ErrorMessage message={error?.data?.message} />
                ) : null}

                <Button
                    type="submit"
                    variant="confirm"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ImSpinner9 className="mx-auto animate-spin text-[28px]" />
                    ) : (
                        "Зарегистрироваться"
                    )}
                </Button>
                <DialogClose
                    className="hidden"
                    ref={dialogCloseRef}
                />
            </form>
        </Form>
    );
};
