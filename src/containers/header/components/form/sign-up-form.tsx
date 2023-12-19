import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Check, ChevronsUpDown } from "lucide-react";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
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

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Form } from "./form";
// import { Label } from "@/components/ui/label";

import { FaCheck } from "react-icons/fa6";

import { cn } from "@/utils";

const alphanumericRegex = /^[A-Za-z0-9]+$/;

const currencies = [
    { label: "Доллар США", value: "USD" },
    { label: "Евро", value: "EUR" },
    { label: "Фунт стерлингов", value: "GBP" },
    { label: "Японская йена", value: "JPY" },
    { label: "Канадский доллар", value: "CAD" },
    { label: "Швейцарский франк", value: "CHF" },
    { label: "Австралийский доллар", value: "AUD" },
    { label: "Китайский юань", value: "CNY" },
    { label: "Шведская крона", value: "SEK" },
    { label: "Новозеландский доллар", value: "NZD" },
    { label: "Мексиканское песо", value: "MXN" },
    { label: "Сингапурский доллар", value: "SGD" },
    { label: "Гонконгский доллар", value: "HKD" },
    { label: "Норвежская крона", value: "NOK" },
    { label: "Южноафриканский рэнд", value: "ZAR" },
    { label: "Турецкая лира", value: "TRY" },
    { label: "Российский рубль", value: "RUB" },
    { label: "Индийская рупия", value: "INR" },
    { label: "Бразильский реал", value: "BRL" },
    { label: "Саудовский риял", value: "SAR" }
];

const formSchema = z
    .object({
        currency: z.string({
            required_error: "Поле обязательно для заполнения"
        }),
        email: z
            .string()
            .min(1, {
                message: "Поле обязательно для заполнения"
            })
            .email({ message: "Укажите корректный адрес электронной почты" }),
        username: z
            .string()
            .min(1, {
                message: "Поле обязательно для заполнения"
            })
            .regex(alphanumericRegex, {
                message: "Поле может содержать только символы A-Z и цифры"
            })
            .min(2, {
                message: "Минимальное количество символов не достигнуто"
            })
            .max(20, {
                message: "Превышено максимально допустимое количество символов"
            }),
        password: z
            .string()
            .min(1, {
                message: "Поле обязательно для заполнения"
            })
            .regex(alphanumericRegex, {
                message: "Поле может содержать только символы A-Z и цифры"
            })
            .min(8, {
                message: "Минимальное количество символов не достигнуто"
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
                message: "Минимальное количество символов не достигнуто"
            })
            .max(30, {
                message: "Превышено максимально допустимое количество символов"
            }),
        promo: z.string().optional(),
        accepted_terms: z.literal(true)
    })
    .refine(data => data.password === data.confirm_password, {
        message: "Пароли должны совпадать",
        path: ["confirm_password"]
    });

export const SignUpForm = () => {
    const [open, setOpen] = React.useState(false);
    const [promoOpen, setPromoOpen] = React.useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirm_password: "",
            promo: "",
            accepted_terms: undefined
        }
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values);
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-12"
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
                                            <ScrollArea className="h-64">
                                                {currencies.map(currency => (
                                                    <CommandItem
                                                        value={currency.label}
                                                        key={currency.value}
                                                        onSelect={() => {
                                                            form.resetField(
                                                                "currency",
                                                                {
                                                                    keepError:
                                                                        false
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
                                            </ScrollArea>
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
                    name="username"
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
                    name="confirm_password"
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
                    name="promo"
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
                                    className="w-[270px]"
                                >
                                    <form
                                        onSubmit={event => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            const code =
                                                event.currentTarget.elements
                                                    ?.code.value;
                                            form.setValue("promo", code);
                                            setPromoOpen(false);
                                        }}
                                        className="relative "
                                    >
                                        <Input name="code" />
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

                <Button
                    type="submit"
                    className="w-full bg-blue-500 py-2 text-xl font-bold text-white"
                >
                    Зарегистрироваться
                </Button>
            </form>
        </Form>
    );
};
