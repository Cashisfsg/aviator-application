import { useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import PlayButtonImage from "@/assets/play-button.png";
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
    const sectionRef = useRef<HTMLElement>(null);

    const onClickHandler: React.MouseEventHandler<
        HTMLButtonElement
    > = event => {
        videoRef.current?.play();
        event.currentTarget.classList.add("hidden");
    };

    const onEndedHandler: React.ReactEventHandler<HTMLVideoElement> = event => {
        buttonRef.current?.classList.remove("hidden");
        event.currentTarget.currentTime = 0;
    };

    const viewDetails: React.MouseEventHandler<HTMLButtonElement> = event => {
        const button = event.currentTarget;
        const hidden = sectionRef.current?.classList.contains("hidden");

        if (hidden) {
            sectionRef.current?.classList.replace("hidden", "grid");
            button.textContent = "Свернуть";
        } else {
            sectionRef.current?.classList.replace("grid", "hidden");
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
                className="w-[calc(75%_-_2rem)] max-w-3xl overflow-y-auto pb-0"
            >
                <header className="-mx-6 -mt-6 bg-[#2c2d30] px-6 py-3 text-xl font-semibold uppercase">
                    Правила игры
                </header>
                <section className="grid place-items-center gap-y-4">
                    <header>
                        Aviator - это новое поколение развлечений. Выигрывайте в
                        разы больше, чем в классических играх, за считанные
                        секунды!
                    </header>
                    <h2 className="w-full text-xl font-semibold">
                        Как играть?
                    </h2>
                    <video
                        preload="metadata"
                        ref={videoRef}
                        onEnded={onEndedHandler}
                        className="aspect-video w-full"
                        style={{ gridArea: "3 / 1" }}
                    >
                        <source
                            src={VideoRulesWebm}
                            type="video/webm"
                        />

                        <source
                            src={VideoRulesMP4}
                            type="video/mp4"
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

                    <ol className="grid grid-cols-[auto,_minmax(min-content,_auto),_1fr] gap-y-2 text-pretty">
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

                    <button
                        onClick={onClickHandler}
                        ref={buttonRef}
                        style={{ gridArea: "3 / 1" }}
                        className="z-10 cursor-pointer"
                    >
                        <img
                            src={PlayButtonImage}
                            alt="Play button"
                            height="64"
                            width="64"
                            className="size-16"
                        />
                        <span className="sr-only">Play video</span>
                    </button>
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

                    <h2 className="text-xl font-semibold">Подробнее:</h2>

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

                    <h2 className="text-xl font-semibold">Функции игры</h2>
                    <h3 className="text-lg font-semibold">
                        Ставка и вывод средств
                    </h3>
                    <ul>
                        <li>
                            – Чтобы сделать ставку, введите или выберите из
                            предложенных вариантов сумму и нажмите кнопку
                            «Ставка».
                        </li>
                        <li>
                            – Вы можете делать две ставки одновременно, добавив
                            вторую панель. Чтобы добавить вторую панель ставок,
                            нажмите на значок плюса в правом верхнем углу первой
                            ставки.
                        </li>
                        <li>
                            – Чтобы вывести свой выигрыш, нажмите на кнопку
                            «Вывести». Ваш выигрыш — это Ваша ставка, умноженная
                            на множитель вывода.
                        </li>
                        <li>
                            – Ваша ставка сгорит, если Вы не успеете вывести
                            деньги до того, как самолёт улетит.
                        </li>
                    </ul>

                    <h3 className="text-lg font-semibold">
                        Автоматический вывод средств (Авто кешаут)
                    </h3>
                    <ul>
                        <li>
                            – Функция автоматического вывода средств доступна на
                            вкладке «Авто» на панели ставок. После активации
                            ваша ставка будет автоматически выведена, когда
                            Самолёт удачи достигнет указанного множителя.
                        </li>
                    </ul>

                    <h3 className="text-lg font-semibold">
                        Текущие ставки и статистика
                    </h3>
                    <ul>
                        <li>
                            – В нижней части под панелью ставок находиться
                            панель текущих ставок. Здесь можно увидеть все
                            ставки, сделанные в текущем раунде.
                        </li>
                        <li>
                            – На панели «Мои ставки» Вы можете видеть все свои
                            ставки и информацию о них.
                        </li>
                        <li>
                            – На панели «Топ» расположена игровая статистика.
                            Тут можно посмотреть самые большие выигрыши по сумме
                            или множителю лучших игроков.
                        </li>
                    </ul>

                    <h3 className="text-lg font-semibold">Бонусы</h3>

                    <ul>
                        <li>
                            – Бонусы деляться на одноразовые ставки и бонусы к
                            депозиту.
                        </li>
                    </ul>

                    <h3 className="text-lg font-semibold">
                        Одноразовая ставка
                    </h3>

                    <ul>
                        <li>
                            – Это ставка с фиксированной суммой и множителем, по
                            достижении которого Вы можете забрать свой выигрыш.
                            Забрать выигрыш невозможно, до того как самолёт не
                            набрал множитель, заданный в условиях.
                        </li>
                    </ul>

                    <h3 className="text-lg font-semibold">Бонус к депозиту</h3>

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
