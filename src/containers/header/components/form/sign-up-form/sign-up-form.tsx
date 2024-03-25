import { useRef, useId } from "react";
import { useNavigate } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    useForm,
    SubmitHandler,
    // UseFormReturn,
    ControllerRenderProps
} from "react-hook-form";
import {
    registrationCredentialsSchema as formSchema,
    RegistrationCredentialsFormSchema as FormSchema
} from "@/utils/schemas";

import { useCreateNewUserAccountMutation } from "@/store/api/authApi";
import { TelegramClient } from "@/store/api/types";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { DialogClose } from "@/components/ui/dialog";
// import {
//     Command,
//     CommandEmpty,
//     CommandGroup,
//     CommandInput,
//     CommandItem
// } from "@/components/ui/command";
// import {
//     Popover,
//     PopoverContent,
//     PopoverTrigger
// } from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { Input, Password, ErrorMessage } from "@/components/ui/input";

// import { ChevronsUpDown } from "lucide-react";
import { ImSpinner9 } from "react-icons/im";

import { CurrenciesCombobox } from "./currencies-combobox";

// import KZIcon from "@/assets/kz-flag.png";
// import RUIcon from "@/assets/ru-flag.png";
// import UAIcon from "@/assets/ua-flag.png";
// import UZIcon from "@/assets/uz-flag.png";

// import { cn } from "@/utils";
import { Accordion } from "@/components/ui/accordion/accordion";
import { RiArrowDownSLine } from "react-icons/ri";

// const currencies = [
//     { id: 1, label: "Казахстанский тенге", value: "KZT", icon: KZIcon },
//     { id: 2, label: "Российский рубль", value: "RUB", icon: RUIcon },
//     { id: 3, label: "Узбекистанский сум", value: "UZS", icon: UZIcon },
//     { id: 4, label: "Украинская гривна", value: "UAH", icon: UAIcon }
// ];

export const SignUpForm = () => {
    const tg = (
        window as Window & typeof globalThis & { Telegram: TelegramClient }
    ).Telegram.WebApp;
    const dialogCloseRef = useRef<HTMLButtonElement>(null);

    const [createNewUser, { isLoading, isError, error }] =
        useCreateNewUserAccountMutation();
    const navigate = useNavigate();

    // const { telegramId } = useStateSelector(state => selectInitData(state));

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            login: "",
            password: "",
            passwordConfirm: "",
            email: undefined,
            promocode: undefined,
            // from: sessionStorage.getItem("referral"),
            // telegramId,
            accepted_terms: undefined
        }
    });

    const onSubmit: SubmitHandler<FormSchema> = async ({
        currency,
        login,
        password,
        passwordConfirm,
        email,
        promocode
        // from,
        // telegramId
    }) => {
        try {
            await createNewUser({
                currency,
                login,
                password,
                passwordConfirm,
                email,
                promocode,
                from:
                    JSON.parse(sessionStorage.getItem("referral") || "{}")
                        ?.uid || undefined,
                telegramId: tg?.initDataUnsafe?.user?.id
            }).unwrap();

            sessionStorage.removeItem("referral");
            navigate("/main");
            dialogCloseRef?.current?.click();
        } catch (error) {}
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
                            <CurrenciesCombobox
                                form={form}
                                field={field}
                            />

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
                            <FormLabel>
                                Введите Email (не обязательно)
                            </FormLabel>
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
                                <Password {...field} />
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
                                <Password {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="promocode"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <PromoCode
                                    form={form}
                                    field={field}
                                />
                            </FormControl>
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
                                    className="cursor-pointer text-blue-500 underline-offset-2 mh:hover:underline"
                                >
                                    Условиями пользовательского соглашения
                                </a>
                            </p>
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

// interface FormProps
//     extends UseFormReturn<
//         {
//             password: string;
//             passwordConfirm: string;
//             currency: string;
//             login: string;
//             accepted_terms: true;
//             email?: string | undefined;
//             promocode?: string | undefined;
//             telegramId?: number | undefined;
//         },
//         any,
//         undefined
//     > {}

// interface Currency
//     extends ControllerRenderProps<
//         {
//             currency: string;
//             login: string;
//             password: string;
//             passwordConfirm: string;
//             accepted_terms: true;
//             email?: string | undefined;
//             promocode?: string | undefined;
//             telegramId?: number | undefined;
//         },
//         "currency"
//     > {}

// interface CurrenciesPopoverProps {
//     form: FormProps;
//     field: Currency;
// }

// const CurrenciesPopover: React.FC<CurrenciesPopoverProps> = ({
//     form,
//     field
// }) => {
//     const [open, setOpen] = useState(false);

//     return (
//         <Popover
//             open={open}
//             onOpenChange={setOpen}
//         >
//             <PopoverTrigger asChild>
//                 <FormControl>
//                     <Button
//                         role="combobox"
//                         className={cn(
//                             "w-full justify-between border-2 border-gray-500 bg-none py-4 text-base aria-[invalid=true]:border-red-750 focus:aria-[invalid=true]:outline focus:aria-[invalid=true]:-outline-offset-2",
//                             !field.value && "text-muted-foreground"
//                         )}
//                         {...field}
//                     >
//                         {field.value
//                             ? currencies.find(
//                                   currency => currency.value === field.value
//                               )?.label
//                             : "Выберите валюту"}
//                         <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                     </Button>
//                 </FormControl>
//             </PopoverTrigger>
//             <PopoverContent className="w-[270px] p-0">
//                 <Command>
//                     <CommandInput placeholder="Поиск валюты..." />
//                     <CommandEmpty>Валюта не найдена</CommandEmpty>
//                     <CommandGroup>
//                         {currencies.map(currency => (
//                             <CommandItem
//                                 value={currency.label}
//                                 key={currency.value}
//                                 onSelect={() => {
//                                     form.resetField("currency", {
//                                         keepError: false
//                                     });
//                                     form.setValue("currency", currency.value);

//                                     setOpen(false);
//                                 }}
//                             >
//                                 <img
//                                     src={currency.icon}
//                                     alt={currency.label}
//                                     className="mr-2 h-6 w-6"
//                                 />{" "}
//                                 {currency.label}
//                             </CommandItem>
//                         ))}
//                     </CommandGroup>
//                 </Command>
//             </PopoverContent>
//         </Popover>
//     );
// };

interface PromoCode
    extends ControllerRenderProps<
        {
            currency: string;
            login: string;
            password: string;
            passwordConfirm: string;
            accepted_terms: true;
            email?: string | undefined;
            promocode?: string | undefined;
            telegramId?: number | undefined;
        },
        "promocode"
    > {}

interface PromoCodeProps {
    form: FormProps;
    field: PromoCode;
}

const PromoCode: React.FC<PromoCodeProps> = ({ form, field }) => {
    const promocodeId = useId();

    return (
        <Accordion className="-m-0.5 space-y-2">
            <Accordion.Trigger className="accordion flex justify-between pb-1 text-blue-500 transition-all duration-300">
                <label htmlFor={promocodeId}>Введите промокод</label>
                <RiArrowDownSLine className="text-2xl text-white duration-500 group-aria-[expanded=true]:rotate-180" />
            </Accordion.Trigger>

            <Accordion.Content>
                <div className="min-h-0 p-0.5">
                    <Input
                        id={promocodeId}
                        {...field}
                    />
                </div>
            </Accordion.Content>
        </Accordion>
    );
};
