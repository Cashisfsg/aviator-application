import { useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import PlayButtonImage from "@/assets/play-button.png";
import PauseButtonImage from "@/assets/pause-button.png";
import VideoRulesWebm from "@/assets/video/rules.webm";
import VideoRulesMP4 from "@/assets/video/rules.mp4";

import Money from "@/assets/money-rules.png";
import Propeller from "@/assets/propeller-rules.png";
import LotMoney from "@/assets/lot-money-rules.png";

import RuleImage1 from "@/assets/rule-1.png";
import RuleImage2 from "@/assets/rule-2.png";
import RuleImage3 from "@/assets/rule-3.png";

interface GameRulesDialogProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GameRulesDialog: React.FC<GameRulesDialogProps> = ({
    open,
    setOpen
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const headerRef = useRef<HTMLElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

    const mouseMoveHandler = () => {
        clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            buttonRef.current?.classList.remove("opacity-100");
            buttonRef.current?.classList.add("opacity-0");
        }, 1000);
    };

    // const onClickHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
    //     if (videoRef.current?.paused) {
    //         videoRef.current?.play();
    //     } else {
    //         videoRef.current?.pause();
    //     }
    // };

    const onPlayHandler: React.ReactEventHandler<HTMLVideoElement> = () => {
        buttonRef.current?.classList.remove("opacity-100");
        buttonRef.current?.classList.add("opacity-0");
        setTimeout(() => {
            if (!imageRef.current) return;
            imageRef.current.src = PauseButtonImage;
        }, 500);
    };

    const onPauseHandler: React.ReactEventHandler<HTMLVideoElement> = () => {
        if (!imageRef.current) return;
        clearTimeout(timerRef.current);
        buttonRef.current?.classList.remove("opacity-0");
        buttonRef.current?.classList.add("opacity-100");
        imageRef.current.src = PlayButtonImage;
    };

    const onMouseMoveHandler: React.MouseEventHandler<
        HTMLVideoElement
    > = event => {
        if (event.currentTarget.paused) return;

        buttonRef.current?.classList.remove("opacity-0");
        buttonRef.current?.classList.add("opacity-100");

        requestAnimationFrame(mouseMoveHandler);
    };

    const onEndedHandler: React.ReactEventHandler<HTMLVideoElement> = event => {
        if (!imageRef.current) return;
        event.currentTarget.currentTime = 0;
        buttonRef.current?.classList.add("opacity-100");
        imageRef.current.src = PlayButtonImage;
    };

    const viewDetails: React.MouseEventHandler<HTMLButtonElement> = event => {
        const button = event.currentTarget;
        const hidden = sectionRef.current?.classList.contains("hidden");

        if (hidden) {
            sectionRef.current?.classList.replace("hidden", "grid");
            headerRef.current?.classList.remove("hidden");
            videoRef.current?.style.setProperty("grid-area", "3 / 1");
            buttonRef.current?.style.setProperty("grid-area", "3 / 1");
            button.textContent = "Свернуть";
        } else {
            sectionRef.current?.classList.replace("grid", "hidden");
            headerRef.current?.classList.add("hidden");
            videoRef.current?.style.setProperty("grid-area", "2 / 1");
            buttonRef.current?.style.setProperty("grid-area", "2 / 1");
            button.textContent = "Подробнее";
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogContent
                route={false}
                className="flex min-h-[calc(100dvh_-_2rem)] w-[min(100%_-_2rem,_1024px)] max-w-3xl flex-col overflow-y-auto pb-0"
            >
                <header className="-mx-6 -mt-6 bg-[#2c2d30] px-6 py-3 text-xl font-bold uppercase">
                    Правила игры
                </header>

                <section className="flex flex-auto flex-col place-items-center gap-y-4">
                    <header
                        ref={headerRef}
                        className="hidden"
                    >
                        <strong>Aviator</strong> - это новое поколение
                        развлечений. Выигрывайте в разы больше, чем в
                        классических играх, за считанные секунды!
                    </header>

                    <h2 className="w-full text-xl font-bold uppercase">
                        Как играть?
                    </h2>

                    {/* <div className="relative self-start"> */}
                    <video
                        preload="metadata"
                        controls
                        // controlsList="nodownload"
                        ref={videoRef}
                        onPlay={onPlayHandler}
                        onPause={onPauseHandler}
                        onMouseMove={onMouseMoveHandler}
                        onEnded={onEndedHandler}
                        className="aspect-video w-full"
                        // style={{ gridArea: "2 / 1" }}
                    >
                        <source
                            src={VideoRulesMP4}
                            type="video/mp4"
                        />

                        <source
                            src={VideoRulesWebm}
                            type="video/webm"
                        />

                        <p>
                            Your browser doesn't support HTML video. Here is a
                            <a
                                href="@/assets/video/rules.webm"
                                download="@/assets/video/rules.webm"
                            >
                                link to the video
                            </a>
                            instead.
                        </p>
                    </video>

                    {/* <button
                        onClick={onClickHandler}
                        ref={buttonRef}
                        style={{ gridArea: "2 / 1" }}
                        className="z-10 cursor-pointer opacity-100 transition-opacity duration-500"
                    >
                        <img
                            src={PlayButtonImage}
                            alt="Play button"
                            height="64"
                            width="64"
                            ref={imageRef}
                            className="size-16"
                        />
                        <span className="sr-only">Play video</span>
                    </button> */}
                    {/* </div> */}

                    <ol className="grid flex-auto grid-cols-[auto,_minmax(min-content,_auto),_1fr] gap-y-2 text-pretty">
                        <li className="col-span-3 grid grid-cols-subgrid items-center">
                            <span className="text-xl font-bold">01</span>
                            <img
                                src={Money}
                                alt="Стопка денег"
                                height="48"
                                width="48"
                                className="ml-2 size-12"
                            />
                            <p className="ml-4">
                                Сделайте ставку или даже две сразу и дождитесь
                                начала раунда
                            </p>
                        </li>
                        <li className="col-span-3 grid grid-cols-subgrid items-center">
                            <span className="text-xl font-bold">02</span>
                            <img
                                src={Propeller}
                                alt="Пропеллер"
                                height="48"
                                width="48"
                                className="ml-2 size-12"
                            />
                            <p className="ml-4">
                                Следите за самолётом удачи. Ваш выигрыш - это
                                ставка, умноженная на множитель самолёта удачи.
                            </p>
                        </li>
                        <li className="col-span-3 grid grid-cols-subgrid items-center">
                            <span className="text-xl font-bold">03</span>
                            <img
                                src={LotMoney}
                                alt="Большая стопка денег"
                                height="48"
                                width="48"
                                className="ml-2 size-12"
                            />
                            <p className="ml-4">
                                Выведите средства до того, как самолёт улетит, и
                                деньги будут вашими
                            </p>
                        </li>
                    </ol>
                </section>

                <section
                    className="hidden gap-y-4"
                    ref={sectionRef}
                >
                    <p>Играть в авиатор легко, как 1 - 2 - 3:</p>

                    <ol className="grid gap-x-4 gap-y-6 md:grid-cols-3">
                        <li className="space-y-2">
                            <span className="text-xl font-bold">1</span>
                            <img
                                src={RuleImage1}
                                alt="Правило №1"
                                className="aspect-video w-full"
                            />
                            <p className="font-bold">
                                <img
                                    src={Money}
                                    alt=""
                                    height="24"
                                    width="24"
                                    className="inline-block aspect-square size-8"
                                />{" "}
                                <strong className="place-content-center uppercase text-[#e50539]">
                                    Ставка
                                </strong>{" "}
                                <span className="place-content-center">
                                    до взлёта
                                </span>
                            </p>
                        </li>
                        <li className="space-y-2">
                            <span className="text-xl font-bold">2</span>
                            <img
                                src={RuleImage2}
                                alt="Правило №2"
                                className="aspect-video w-full"
                            />
                            <p className="font-bold">
                                <img
                                    src={Propeller}
                                    alt=""
                                    height="24"
                                    width="24"
                                    className="inline-block aspect-square size-8"
                                />{" "}
                                <strong className="place-content-center uppercase text-[#e50539]">
                                    Следите
                                </strong>{" "}
                                <span className="place-content-center">
                                    как взлетит ваш Самолёт удачи и
                                    увеличивается ваш выигрыш.
                                </span>
                            </p>
                        </li>
                        <li className="space-y-2">
                            <span className="text-xl font-bold">3</span>
                            <img
                                src={RuleImage3}
                                alt="Правило №3"
                                className="aspect-video w-full"
                            />
                            <p className="font-bold">
                                <img
                                    src={Money}
                                    alt=""
                                    height="24"
                                    width="24"
                                    className="inline-block aspect-square size-8"
                                />{" "}
                                <strong className="place-content-center uppercase text-[#e50539]">
                                    Вывести
                                </strong>{" "}
                                <span className="place-content-center">
                                    до исчезновения самолёта и выигрыша в Х раз
                                    больше!
                                </span>
                            </p>
                        </li>
                    </ol>

                    <p>
                        Но помните, если Вы не успеете вывести средства, до того
                        как Самолёт удачи улетит, ваша ставка будет потеряна.
                        Aviator — это чистый арарт! Рисукуйте и выйигрывайте.
                        Всё в ваших руках!
                    </p>

                    <h2 className="text-xl font-bold">Подробнее:</h2>

                    <ul>
                        <li>
                            – Множитель выигрыша начинается с 1 и растёт, по
                            мере того как летит Самолёт удачи.
                        </li>
                        <li>
                            – Ваш выигрыш рассчитывается с учётом множителя, при
                            котором Вы сделали вывод средств, умноженного на
                            вашу ставку.
                        </li>
                    </ul>

                    <h2 className="text-xl font-bold uppercase">
                        Функции игры
                    </h2>
                    <h3 className="text-lg font-bold">
                        Ставка и вывод средств
                    </h3>
                    <ul>
                        <li>
                            – Чтобы сделать ставку, введите или выберите из
                            предложенных вариантов сумму и нажмите кнопку{" "}
                            <strong>«Ставка»</strong>.
                        </li>
                        <li>
                            – Вы можете делать две ставки одновременно, добавив
                            вторую панель. Чтобы добавить вторую панель ставок,
                            нажмите на значок плюса в правом верхнем углу первой
                            ставки.
                        </li>
                        <li>
                            – Чтобы вывести свой выигрыш, нажмите на кнопку{" "}
                            <strong>«Вывести»</strong>. Ваш выигрыш — это Ваша
                            ставка, умноженная на множитель вывода.
                        </li>
                        <li>
                            – Ваша ставка сгорит, если Вы не успеете вывести
                            деньги до того, как самолёт улетит.
                        </li>
                    </ul>

                    <h3 className="text-lg font-bold">
                        Автоматический вывод средств (Авто кешаут)
                    </h3>
                    <ul>
                        <li>
                            – Функция автоматического вывода средств доступна на
                            вкладке <strong>«Авто»</strong> на панели ставок.
                            После активации ваша ставка будет автоматически
                            выведена, когда Самолёт удачи достигнет указанного
                            множителя.
                        </li>
                    </ul>

                    <h3 className="text-lg font-bold">
                        Текущие ставки и статистика
                    </h3>
                    <ul>
                        <li>
                            – В нижней части под панелью ставок находиться
                            панель текущих ставок. Здесь можно увидеть все
                            ставки, сделанные в текущем раунде.
                        </li>
                        <li>
                            – На панели <strong>«Мои ставки»</strong> Вы можете
                            видеть все свои ставки и информацию о них.
                        </li>
                        <li>
                            – На панели <strong>«Топ»</strong> расположена
                            игровая статистика. Тут можно посмотреть самые
                            большие выигрыши по сумме или множителю лучших
                            игроков.
                        </li>
                    </ul>

                    <h2 className="text-xl font-bold uppercase">Бонусы</h2>

                    <ul>
                        <li>
                            – Бонусы деляться на{" "}
                            <strong>одноразовые ставки</strong> и{" "}
                            <strong>бонусы к депозиту</strong>.
                        </li>
                    </ul>

                    <h3 className="text-lg font-bold">Одноразовая ставка</h3>

                    <ul>
                        <li>
                            – Это ставка с фиксированной суммой и множителем, по
                            достижении которого Вы можете забрать свой выигрыш.
                            Забрать выигрыш невозможно, до того как самолёт не
                            набрал множитель, заданный в условиях.
                        </li>
                    </ul>

                    <h3 className="text-lg font-bold">Бонус к депозиту</h3>

                    <ul>
                        <li>
                            – Это дополнительная сумма, начисляемая при
                            пополнении баланса.
                        </li>
                    </ul>

                    <p>
                        Бонусы могут быть выданы новым пользователям при
                        регистрации, в официальной группе проекта или любым
                        пользователям по решению администрации.
                    </p>
                </section>

                <button
                    onClick={viewDetails}
                    className="-mx-6 w-[calc(100%_+_3rem)] rounded-t-none bg-[#2c2d30] py-3 text-lg"
                >
                    Подробнее
                </button>
            </DialogContent>
        </Dialog>
    );
};
