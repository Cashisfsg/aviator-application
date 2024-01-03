import { useState, useId } from "react";
import { Link } from "react-router-dom";

import {
    MyBetsHistoryDialog,
    SignOutAlertDialog,
    BonusAndPromoDialog,
    DailyStatisticsDialog
} from "@/components/dialogs";

import {
    GameLimitsPopover,
    PartnershipProgramPopover
} from "@/components/popovers";

import { SecurityPopover } from "../popovers/security-popover";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent
} from "@/components/ui/collapsible";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { FiMenu } from "react-icons/fi";
import { BiSupport } from "react-icons/bi";
import { HiOutlineChatBubbleBottomCenterText } from "react-icons/hi2";
import { ImNewspaper } from "react-icons/im";
import { SlPeople } from "react-icons/sl";
import { IoExitOutline } from "react-icons/io5";
import { BsStars } from "react-icons/bs";
import { useAuth } from "@/store/hooks/useAuth";
import { useGetUserQuery, useChangeProfileImageMutation } from "@/store";

export const BurgerMenu = () => {
    const soundId = useId();
    const musicId = useId();
    const animationId = useId();

    const [alertDialogOpen, setAlertDialogOpen] = useState(false);
    const [myBetsHistoryDialogOpen, setMyBetsHistoryDialogOpen] =
        useState(false);
    const [bonusAndPromoDialogOpen, setBonusAndPromoDialogOpen] =
        useState(false);
    const [dailyStatisticsDialogOpen, setDailyStatisticsDialogOpen] =
        useState(false);
    const [partnershipProgramPopoverOpen, setPartnershipProgramPopoverOpen] =
        useState(false);
    const [gameLimitsPopoverOpen, setGameLimitsPopoverOpen] = useState(false);
    const [securityPopoverOpen, setSecurityPopoverOpen] = useState(false);

    const { isAuthenticated } = useAuth();
    const { data: user } = useGetUserQuery();
    const [updateImage] = useChangeProfileImageMutation();

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger className="rounded-full border border-[#414148] bg-[#252528] px-3 py-0.5">
                    <FiMenu />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    sideOffset={10}
                    className="z-50 w-72 bg-[#2c2d30]"
                >
                    <DropdownMenuLabel className="p-0 text-sm">
                        <div className="flex items-center justify-between p-2.5">
                            <div className="grid w-max grid-cols-[auto_auto] grid-rows-2 items-center gap-x-2.5 leading-none">
                                <img
                                    src={
                                        user?.profileImage ||
                                        "https://c0.klipartz.com/pngpicture/85/114/gratis-png-avatar-usuario-perfil-masculino-logo-icono-de-perfil.png"
                                    }
                                    alt="Profile image"
                                    width="40"
                                    height="40"
                                    className="row-span-2 rounded-full"
                                />
                                <p>{user?.login || "Username"}</p>
                                <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs">
                                    {user?.telegramId || "user ID"}
                                </p>
                            </div>
                            {isAuthenticated ? (
                                <label className="flex cursor-pointer items-center gap-x-1.5 rounded-full border border-[#414148] bg-[#252528] px-2.5 py-1.5 text-[#83878e]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                    >
                                        <g
                                            fill="#767b85"
                                            fillRule="nonzero"
                                        >
                                            <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10a10.047 10.047 0 0 0 1.726-.151l.105-.019A10 10 0 0 0 10 0zm-.803 19.298h-.024a9.245 9.245 0 0 1-.772-.102l-.043-.007c-.25-.045-.496-.1-.74-.165l-.06-.015a9.302 9.302 0 0 1-.706-.223l-.072-.025a9.156 9.156 0 0 1-.672-.279l-.082-.037a8.437 8.437 0 0 1-.635-.33l-.089-.05a9.451 9.451 0 0 1-.6-.383l-.089-.061a9.374 9.374 0 0 1-.563-.433L4 17.144v-2.81a3.671 3.671 0 0 1 3.667-3.667h4.666A3.671 3.671 0 0 1 16 14.333v2.811l-.044.037a9.06 9.06 0 0 1-.574.442l-.079.053a9.32 9.32 0 0 1-.609.39l-.079.044a9.014 9.014 0 0 1-1.396.65l-.067.023a9.37 9.37 0 0 1-.71.224l-.057.015a9.39 9.39 0 0 1-.741.165l-.043.006c-.255.045-.513.08-.772.103h-.024a9.345 9.345 0 0 1-1.608.002zm7.47-2.772v-2.193A4.338 4.338 0 0 0 12.333 10H7.667a4.338 4.338 0 0 0-4.334 4.333v2.193a9.333 9.333 0 1 1 13.334 0z" />
                                            <path d="M10 2.667a3.333 3.333 0 1 0 0 6.666 3.333 3.333 0 0 0 0-6.666zm0 6a2.667 2.667 0 1 1 0-5.334 2.667 2.667 0 0 1 0 5.334z" />
                                        </g>
                                    </svg>
                                    <p className="grow-0 text-center text-xs leading-none">
                                        <span>Изменить</span>
                                        <br />
                                        <span>аватар</span>
                                    </p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        multiple={false}
                                        onChange={event => {
                                            if (!event.currentTarget.files)
                                                return;
                                            const file =
                                                event.currentTarget.files[0];

                                            updateImage(file);
                                            console.log(
                                                "Image loaded successfully"
                                            );
                                        }}
                                    />
                                </label>
                            ) : null}
                        </div>
                        <ul>
                            <li className="flex justify-between bg-[#1b1c1d] px-2.5 py-2">
                                <Label
                                    htmlFor={soundId}
                                    direction="row"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="15"
                                        height="16"
                                        viewBox="0 0 15 16"
                                    >
                                        <g
                                            fill="#767B85"
                                            fillRule="nonzero"
                                        >
                                            <path d="M9.836.137A1.031 1.031 0 0 0 8.74.183L4.127 4.086H.507a.34.34 0 0 0-.34.34v6.468a.339.339 0 0 0 .34.34l3.612-.001 4.61 4.235c.017.016.036.03.055.04a1.04 1.04 0 0 0 1.052.016c.34-.192.543-.543.543-.938V1.076c0-.396-.203-.747-.543-.94zm-.138 14.449a.39.39 0 0 1-.197.345.357.357 0 0 1-.34.009l-4.569-4.197V9.192a.34.34 0 1 0-.68 0v1.36l-3.065.002V4.766h3.064v1.362a.34.34 0 1 0 .681 0V4.584L9.155.724a.356.356 0 0 1 .346.006.39.39 0 0 1 .197.345v13.51zM11.495 3.248a.34.34 0 0 0-.189.654 3.931 3.931 0 0 1 2.827 3.758 3.931 3.931 0 0 1-2.827 3.759.34.34 0 0 0 .189.654 4.616 4.616 0 0 0 3.319-4.413 4.616 4.616 0 0 0-3.32-4.412z" />
                                        </g>
                                    </svg>
                                    <span>Звук</span>
                                </Label>
                                <Switch id={soundId} />
                            </li>
                            <DropdownMenuSeparator />

                            <li className="flex justify-between bg-[#1b1c1d] px-2.5 py-2">
                                <Label
                                    htmlFor={musicId}
                                    direction="row"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="18"
                                        viewBox="0 0 16 18"
                                    >
                                        <path
                                            fill="#767B85"
                                            fillRule="nonzero"
                                            d="M15.864 3.87V.498a.502.502 0 0 0-.202-.402.506.506 0 0 0-.446-.073L5.168 3.215a.498.498 0 0 0-.346.475v9.835c-.527-.365-1.2-.564-1.907-.564-.748 0-1.458.225-2 .63-.581.438-.902 1.03-.902 1.675s.32 1.237.902 1.676c.542.405 1.248.63 2 .63.75 0 1.458-.225 1.999-.63.582-.439.902-1.031.902-1.676V7.431l9.054-2.88v5.767c-.526-.365-1.2-.564-1.907-.564-.748 0-1.458.225-2 .63-.581.438-.902 1.03-.902 1.675s.32 1.237.902 1.675c.542.406 1.249.63 2 .63.75 0 1.458-.224 2-.63.58-.438.901-1.03.901-1.675V3.874 3.87zM2.914 16.577c-1.034 0-1.907-.6-1.907-1.31 0-.711.873-1.312 1.908-1.312 1.034 0 1.907.6 1.907 1.311 0 .715-.873 1.311-1.907 1.311zM5.817 6.385V4.051l9.054-2.876V3.51L5.816 6.385zm7.15 6.985c-1.034 0-1.907-.6-1.907-1.31 0-.711.873-1.312 1.907-1.312 1.035 0 1.908.6 1.908 1.311-.004.71-.877 1.311-1.908 1.311z"
                                        />
                                    </svg>
                                    <span>Музыка</span>
                                </Label>
                                <Switch id={musicId} />
                            </li>
                            <DropdownMenuSeparator />

                            <li className="flex justify-between bg-[#1b1c1d] px-2.5 py-2">
                                <Label
                                    htmlFor={animationId}
                                    direction="row"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="16"
                                        viewBox="0 0 18 16"
                                    >
                                        <path
                                            fill="#767B85"
                                            fillRule="nonzero"
                                            d="M17.337 13.35c-.46-.654-1.362-1.38-2.608-2.1-1.226-.708-2.681-1.307-3.784-1.568a2.161 2.161 0 0 0-.85-1.473c.324-1.085.534-2.645.534-4.061 0-1.44-.178-2.584-.515-3.309A1.454 1.454 0 0 0 8.8 0c-.562 0-1.078.33-1.314.84-.337.724-.515 1.868-.515 3.308 0 1.416.21 2.976.534 4.061-.46.346-.779.872-.85 1.473-1.103.261-2.558.86-3.784 1.568-1.246.72-2.148 1.446-2.608 2.1a1.454 1.454 0 0 0-.07 1.558 1.454 1.454 0 0 0 1.384.718c.796-.071 1.876-.49 3.123-1.209 1.226-.708 2.472-1.669 3.25-2.493a2.148 2.148 0 0 0 1.7 0c.778.824 2.024 1.785 3.25 2.493 1.247.72 2.327 1.138 3.123 1.209a1.454 1.454 0 0 0 1.384-.718 1.454 1.454 0 0 0-.07-1.558zM8.06 4.148c0-1.705.26-2.518.413-2.85a.361.361 0 0 1 .327-.21c.14 0 .268.083.327.21.154.332.413 1.145.413 2.85 0 1.26-.183 2.674-.459 3.648a2.169 2.169 0 0 0-.562 0c-.276-.974-.459-2.389-.459-3.648zm-3.905 9.326c-1.477.853-2.31 1.035-2.675 1.068a.361.361 0 0 1-.326-.566c.21-.3.785-.93 2.261-1.783 1.09-.63 2.407-1.179 3.39-1.427.072.175.167.338.281.486-.706.727-1.84 1.592-2.93 2.222zm3.573-3.536a1.073 1.073 0 0 1 2.144 0 1.073 1.073 0 0 1-2.144 0zm8.736 4.425a.362.362 0 0 1-.344.179c-.365-.033-1.198-.215-2.675-1.068-1.09-.63-2.225-1.495-2.931-2.222a2.16 2.16 0 0 0 .282-.486c.982.248 2.298.797 3.389 1.427 1.476.853 2.05 1.483 2.261 1.783.08.114.088.266.018.387z"
                                        />
                                    </svg>
                                    <span>Анимация</span>
                                </Label>
                                <Switch id={animationId} />
                            </li>
                        </ul>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="h-3" />

                    {isAuthenticated ? (
                        <DropdownMenuItem
                            onPointerUp={() =>
                                setTimeout(() => {
                                    setBonusAndPromoDialogOpen(true);
                                }, 200)
                            }
                        >
                            <BsStars className="text-base text-[#313131]" />
                            <span>Бонусы и промокоды</span>
                        </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuSeparator />

                    <DropdownMenuItem>
                        <BiSupport className="text-base text-[#767b85]" />
                        <span>Поддержка</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="15"
                            viewBox="0 0 16 15"
                        >
                            <g
                                fill="#767B85"
                                fillRule="nonzero"
                            >
                                <path d="M4.1.02A1.83 1.83 0 0 0 2.274 1.85l-.067 9.48.996.007.067-9.483c0-.454.372-.824.83-.824h10.008V.021H4.1z" />
                                <path d="M14.108.02c-1.043 0-1.892.86-1.892 1.917v10.639c0 .769-.618 1.395-1.378 1.395-.76 0-1.377-.626-1.377-1.395v-1.227a.501.501 0 0 0-.498-.504H.498a.501.501 0 0 0-.498.504v1.227c0 1.325 1.065 2.403 2.373 2.403v-1.008c-.76 0-1.377-.626-1.377-1.395v-.723h7.469v.723c0 1.325 1.064 2.403 2.373 2.403 1.309 0 2.374-1.078 2.374-2.403V4.693h2.29A.501.501 0 0 0 16 4.19V1.937C16 .88 15.151.02 14.108.02zm.896 3.665h-1.792V1.937c0-.5.402-.908.896-.908s.896.407.896.908v1.748z" />
                                <path d="M2.274 13.971h8.448v1.008H2.274zM7.402 2.828H4.83a.501.501 0 0 0-.498.504c0 .278.223.504.498.504h2.572a.501.501 0 0 0 .498-.504.501.501 0 0 0-.498-.504zM10.39 4.844H4.83a.501.501 0 0 0-.498.505c0 .278.223.504.498.504h5.56a.501.501 0 0 0 .498-.504.501.501 0 0 0-.498-.505zM10.39 6.861H4.83a.501.501 0 0 0-.498.505c0 .278.223.504.498.504h5.56a.501.501 0 0 0 .498-.504.501.501 0 0 0-.498-.505zM10.39 8.878H4.83a.501.501 0 0 0-.498.504c0 .279.223.505.498.505h5.56a.501.501 0 0 0 .498-.505.501.501 0 0 0-.498-.504z" />
                            </g>
                        </svg>
                        <span>Правила игры</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    {isAuthenticated ? (
                        <DropdownMenuItem
                            onPointerUp={() =>
                                setTimeout(() => {
                                    setMyBetsHistoryDialogOpen(true);
                                }, 200)
                            }
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="15"
                                height="14"
                                viewBox="0 0 15 14"
                            >
                                <path
                                    fill="#767B85"
                                    fillRule="nonzero"
                                    d="M7.993.669c-2.45 0-4.62 1.33-5.74 3.36l-1.61-1.61v4.55h4.55l-1.96-1.96c.91-1.75 2.66-2.94 4.76-2.94 2.87 0 5.25 2.38 5.25 5.25s-2.38 5.25-5.25 5.25c-2.31 0-4.2-1.47-4.97-3.5h-1.47c.77 2.8 3.36 4.9 6.44 4.9 3.71 0 6.65-3.01 6.65-6.65 0-3.64-3.01-6.65-6.65-6.65zm-1.05 3.5v3.57l3.29 1.96.56-.91-2.8-1.68v-2.94h-1.05z"
                                />
                            </svg>
                            <span>История моих ставок</span>
                        </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuSeparator />

                    {isAuthenticated ? (
                        <DropdownMenuItem
                            onPointerUp={() =>
                                setTimeout(() => {
                                    setGameLimitsPopoverOpen(true);
                                }, 200)
                            }
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="10"
                                viewBox="0 0 16 10"
                            >
                                <g
                                    fill="#767B85"
                                    fillRule="nonzero"
                                >
                                    <path d="M14.796.027H1.204C.54.027 0 .567 0 1.23v7.226C0 9.12.54 9.66 1.204 9.66h13.592c.664 0 1.204-.54 1.204-1.204V1.23c0-.664-.54-1.204-1.204-1.204zm.172 8.43a.174.174 0 0 1-.172.172H1.204a.174.174 0 0 1-.172-.172V1.23c0-.093.08-.172.172-.172h13.592c.093 0 .172.079.172.172v7.226z" />
                                    <path d="M1.824.37v.775a.68.68 0 0 1-.689.688H.38v1.032h.756c.95 0 1.72-.772 1.72-1.72V.37H1.825zM14.882 1.833a.68.68 0 0 1-.688-.688V.37H13.16v.774c0 .948.772 1.72 1.72 1.72h.775V1.833h-.774zM1.153 6.822H.379v1.032h.774a.68.68 0 0 1 .688.689v.774h1.032v-.774c0-.949-.772-1.72-1.72-1.72zM14.882 6.822c-.949 0-1.72.772-1.72 1.72v.775h1.032v-.774a.68.68 0 0 1 .688-.688h.774V6.822h-.774zM10.137 2.793a2.88 2.88 0 0 0-2.051-.848 2.88 2.88 0 0 0-2.05.848 2.88 2.88 0 0 0-.849 2.05c0 .777.301 1.505.848 2.052a2.88 2.88 0 0 0 2.051.848 2.88 2.88 0 0 0 2.05-.848 2.88 2.88 0 0 0 .85-2.051 2.88 2.88 0 0 0-.85-2.051zm-.73 3.372a1.856 1.856 0 0 1-1.321.546c-.5 0-.97-.194-1.321-.546a1.855 1.855 0 0 1-.546-1.321c0-.5.194-.97.546-1.321a1.855 1.855 0 0 1 1.321-.546c.5 0 .97.194 1.321.546.352.352.546.82.546 1.32 0 .5-.194.97-.546 1.322z" />
                                </g>
                            </svg>
                            <span>Игровые лимиты</span>
                        </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuSeparator />

                    <DropdownMenuItem>
                        <ImNewspaper className="text-base text-[#767B85]" />
                        <span>Новости</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem>
                        <HiOutlineChatBubbleBottomCenterText className="text-base text-[#767B85]" />
                        <span>Чат</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    {isAuthenticated ? (
                        <DropdownMenuItem
                            onPointerUp={() =>
                                setTimeout(() => {
                                    setPartnershipProgramPopoverOpen(true);
                                }, 200)
                            }
                        >
                            <SlPeople className="text-base text-[#767B85]" />
                            <span>Партнёрская программа</span>
                        </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuSeparator />

                    {isAuthenticated ? (
                        <DropdownMenuItem
                            asChild
                            onPointerUp={() =>
                                setTimeout(() => {
                                    setSecurityPopoverOpen(true);
                                }, 200)
                            }
                        >
                            <Link to="/aviator_front/main/security">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="13"
                                    height="16"
                                    viewBox="0 0 13 16"
                                >
                                    <g
                                        fill="#767B85"
                                        fillRule="nonzero"
                                    >
                                        <path d="M5.85 8.935L3.894 7.008l-.834.906 2.86 2.814 4.358-5.016-.9-.835z" />
                                        <path d="M11.473 2.037C10.007 1.766 8.657.937 7.983.47A2.585 2.585 0 0 0 6.5 0c-.529 0-1.041.162-1.482.469-.674.469-2.025 1.297-3.491 1.568-.869.161-1.499.938-1.499 1.847v3.772c0 1.246.337 2.461 1.003 3.61.52.9 1.241 1.76 2.143 2.556 1.516 1.338 3.017 2.036 3.08 2.065L6.5 16l.246-.113c.063-.03 1.564-.727 3.08-2.065.902-.796 1.623-1.656 2.143-2.555.666-1.15 1.003-2.365 1.003-3.61V3.883c0-.91-.63-1.686-1.499-1.847zm.29 5.62c0 1.857-.909 3.605-2.7 5.194A13.388 13.388 0 0 1 6.5 14.62c-1.07-.562-5.262-3.017-5.262-6.965V3.884c0-.303.211-.562.502-.616 1.685-.312 3.2-1.238 3.953-1.762a1.407 1.407 0 0 1 1.614 0c.753.524 2.268 1.45 3.953 1.762a.622.622 0 0 1 .502.616v3.772z" />
                                    </g>
                                </svg>
                                <span>Безопасность</span>
                            </Link>
                        </DropdownMenuItem>
                    ) : // <Collapsible>
                    //     <CollapsibleTrigger
                    //         asChild
                    //         className="flex select-none items-center gap-x-2 rounded-sm bg-[#1b1c1d] px-2.5 py-2 text-sm outline-none transition-colors hover:bg-slate-100 hover:text-slate-900"
                    //     >
                    //         <DropdownMenuLabel>
                    //             <svg
                    //                 xmlns="http://www.w3.org/2000/svg"
                    //                 width="13"
                    //                 height="16"
                    //                 viewBox="0 0 13 16"
                    //             >
                    //                 <g
                    //                     fill="#767B85"
                    //                     fillRule="nonzero"
                    //                 >
                    //                     <path d="M5.85 8.935L3.894 7.008l-.834.906 2.86 2.814 4.358-5.016-.9-.835z" />
                    //                     <path d="M11.473 2.037C10.007 1.766 8.657.937 7.983.47A2.585 2.585 0 0 0 6.5 0c-.529 0-1.041.162-1.482.469-.674.469-2.025 1.297-3.491 1.568-.869.161-1.499.938-1.499 1.847v3.772c0 1.246.337 2.461 1.003 3.61.52.9 1.241 1.76 2.143 2.556 1.516 1.338 3.017 2.036 3.08 2.065L6.5 16l.246-.113c.063-.03 1.564-.727 3.08-2.065.902-.796 1.623-1.656 2.143-2.555.666-1.15 1.003-2.365 1.003-3.61V3.883c0-.91-.63-1.686-1.499-1.847zm.29 5.62c0 1.857-.909 3.605-2.7 5.194A13.388 13.388 0 0 1 6.5 14.62c-1.07-.562-5.262-3.017-5.262-6.965V3.884c0-.303.211-.562.502-.616 1.685-.312 3.2-1.238 3.953-1.762a1.407 1.407 0 0 1 1.614 0c.753.524 2.268 1.45 3.953 1.762a.622.622 0 0 1 .502.616v3.772z" />
                    //                 </g>
                    //             </svg>
                    //             <span>Безопасность</span>
                    //         </DropdownMenuLabel>
                    //     </CollapsibleTrigger>
                    //     <CollapsibleContent>
                    //         <DropdownMenuSeparator />
                    //         <DropdownMenuItem
                    //             asChild
                    //             className="text-[#767b85]"
                    //         >
                    //             <Link
                    //                 to="/aviator_front/main/security"
                    //                 onClick={() => {
                    //                     setSecurityPopoverOpen(true);
                    //                 }}
                    //             >
                    //                 Привязать эмейл
                    //             </Link>
                    //         </DropdownMenuItem>
                    //         <DropdownMenuSeparator />
                    //         <DropdownMenuItem className="text-[#767b85]">
                    //             <span>Изменить пароль</span>
                    //         </DropdownMenuItem>
                    //         <DropdownMenuSeparator />
                    //     </CollapsibleContent>
                    // </Collapsible>
                    null}
                    <DropdownMenuSeparator />

                    {isAuthenticated ? (
                        <DropdownMenuItem
                            onClick={() => {
                                setAlertDialogOpen(true);
                            }}
                        >
                            <IoExitOutline className="text-base text-[#767B85]" />
                            <span>Выйти</span>
                        </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuSeparator className="h-3" />
                </DropdownMenuContent>
            </DropdownMenu>
            {isAuthenticated ? (
                <>
                    <MyBetsHistoryDialog
                        open={myBetsHistoryDialogOpen}
                        setOpen={setMyBetsHistoryDialogOpen}
                    />
                    <SignOutAlertDialog
                        open={alertDialogOpen}
                        setOpen={setAlertDialogOpen}
                    />
                    <BonusAndPromoDialog
                        open={bonusAndPromoDialogOpen}
                        setOpen={setBonusAndPromoDialogOpen}
                    />
                    <DailyStatisticsDialog
                        open={dailyStatisticsDialogOpen}
                        setOpen={setDailyStatisticsDialogOpen}
                    />
                    <GameLimitsPopover
                        open={gameLimitsPopoverOpen}
                        setOpen={setGameLimitsPopoverOpen}
                    />
                    <PartnershipProgramPopover
                        open={partnershipProgramPopoverOpen}
                        setPopoverOpen={setPartnershipProgramPopoverOpen}
                        setDailyStatisticsDialogOpen={
                            setDailyStatisticsDialogOpen
                        }
                    />
                    <SecurityPopover
                        open={securityPopoverOpen}
                        setPopoverOpen={setSecurityPopoverOpen}
                    />
                </>
            ) : null}
        </>
    );
};
