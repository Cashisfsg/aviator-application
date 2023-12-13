import { useState, useId } from "react";

import {
    DropdownMenu,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuPortal,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    // DropdownMenuCheckboxItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FiMenu } from "react-icons/fi";
import { HiOutlineSpeakerWave } from "react-icons/hi2";
import { IoMusicalNotesOutline } from "react-icons/io5";
import { LiaAsymmetrik } from "react-icons/lia";

export const BurgerMenu = () => {
    const soundId = useId();
    const musicId = useId();
    const animationId = useId();

    const [open, setOpen] = useState(false);

    return (
        <>
            <Popover open={open}>
                <PopoverTrigger className="invisible"></PopoverTrigger>
                <PopoverContent>Popover content</PopoverContent>
            </Popover>
            <DropdownMenu>
                <DropdownMenuTrigger className="bg-white">
                    <FiMenu />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="w-60 bg-slate-300/90 text-black-150"
                >
                    <DropdownMenuLabel className="text-sm">
                        <ul>
                            <li className="flex justify-between">
                                <Label
                                    htmlFor={soundId}
                                    direction="row"
                                >
                                    <HiOutlineSpeakerWave />
                                    <span>Звук</span>
                                </Label>
                                <Switch id={soundId} />
                            </li>
                            <li className="flex justify-between">
                                <Label
                                    htmlFor={musicId}
                                    direction="row"
                                >
                                    <IoMusicalNotesOutline />
                                    <span>Музыка</span>
                                </Label>
                                <Switch id={musicId} />
                            </li>
                            <li className="flex justify-between">
                                <Label
                                    htmlFor={animationId}
                                    direction="row"
                                >
                                    <LiaAsymmetrik />
                                    <span>Анимация</span>
                                </Label>
                                <Switch id={animationId} />
                            </li>
                        </ul>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem>Поддержка</DropdownMenuItem>
                    <DropdownMenuItem>Правила игры</DropdownMenuItem>
                    <DropdownMenuItem>Мои ставки</DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            Игровые лимиты
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent
                                className="bg-slate-300/90 shadow-md shadow-slate-100/90"
                                sideOffset={6}
                                alignOffset={-4}
                                avoidCollisions={true}
                            >
                                <DropdownMenuItem>
                                    Минимальная ставка 1000
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Максимальная ставка 10000
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Максимальный выигрыш за одну ставку 1000000
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem>Новости</DropdownMenuItem>
                    <DropdownMenuItem>Чат</DropdownMenuItem>
                    <DropdownMenuItem>Партнёрская программа</DropdownMenuItem>

                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            Безопасность
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent
                                className="bg-slate-300/90 shadow-md shadow-slate-100/90"
                                sideOffset={6}
                                alignOffset={-4}
                                avoidCollisions={true}
                            >
                                <DropdownMenuItem onClick={() => setOpen(true)}>
                                    Привязать email
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Изменить пароль
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>

                    <DropdownMenuItem>Выйти</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
