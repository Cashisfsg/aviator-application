import { useId } from "react";

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

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="bg-white">
                <FiMenu />
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-60 bg-red-400 text-red-400"
            >
                <DropdownMenuLabel className="text-black-150 text-base">
                    <ul>
                        <li className="flex justify-between">
                            <Label
                                htmlFor={soundId}
                                className="flex items-center gap-1"
                            >
                                <HiOutlineSpeakerWave />
                                <span>Звук</span>
                            </Label>
                            <Switch id={soundId} />
                        </li>
                        <li className="flex justify-between">
                            <Label
                                htmlFor={musicId}
                                className="flex items-center gap-1"
                            >
                                <IoMusicalNotesOutline />
                                <span>Музыка</span>
                            </Label>
                            <Switch id={musicId} />
                        </li>
                        <li className="flex justify-between">
                            <Label
                                htmlFor={animationId}
                                className="flex items-center gap-1"
                            >
                                <LiaAsymmetrik />
                                <span>Анимация</span>
                            </Label>
                            <Switch id={animationId} />
                        </li>
                    </ul>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        Безопасность
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem>Привязать email</DropdownMenuItem>
                            <DropdownMenuItem>Изменить пароль</DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
