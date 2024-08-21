import { useState, useRef, Suspense } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { useStateSelector } from "@/store/hooks";
import { useAuth } from "@/store/hooks/useAuth";
import { selectCurrentGameTab } from "@/store/slices/gameSlice";

import { BetTab } from "./bet/bet-tab";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AutoBetTab } from "./bet/auto-bet-tab";

import WinSound from "@/assets/sound/win.mp3";

interface BetProps {
    betNumber: 1 | 2;
}

export const Bet: React.FC<BetProps> = ({ betNumber }) => {
    const [open, setOpen] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const currentGameTab = useStateSelector(state =>
        selectCurrentGameTab(state, betNumber)
    );
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const onClickHandler: React.MouseEventHandler<HTMLDivElement> = event => {
        if (isAuthenticated) return;

        event.stopPropagation();
        setOpen(true);
        navigate("/main/sign-in");
    };

    return (
        <>
            <Tabs
                defaultValue="bet"
                onClickCapture={onClickHandler}
                className="group rounded-2.5xl border-2 border-transparent bg-black-50 px-1.5 pb-8 pt-4 has-[fieldset[data-state=bet]:disabled]:border-[#cb011a] has-[fieldset[data-state=cash]:disabled]:border-[#d07206] has-[fieldset[data-state=start]:disabled]:border-[#cb011a] sm:px-6 xs:px-3"
            >
                <TabsList className="has-[button:disabled]:pointer-events-none has-[button:disabled]:opacity-75">
                    <TabsTrigger
                        value="bet"
                        disabled={currentGameTab.autoModeOn || !isAuthenticated}
                    >
                        Ставка
                    </TabsTrigger>
                    <TabsTrigger
                        value="auto"
                        disabled={currentGameTab.autoModeOn || !isAuthenticated}
                    >
                        Авто
                    </TabsTrigger>
                </TabsList>
                <BetTab
                    betNumber={betNumber}
                    audioRef={audioRef}
                />
                <TabsContent
                    value="auto"
                    className="flex items-center justify-around"
                >
                    <AutoBetTab
                        betNumber={betNumber}
                        audioRef={audioRef}
                    />
                </TabsContent>
            </Tabs>

            <audio
                preload="auto"
                ref={audioRef}
            >
                <source
                    src={WinSound}
                    type="audio/mpeg"
                />
                Ваш браузер не поддерживает элемент <code>audio</code>.
            </audio>

            <Dialog
                open={open}
                onOpenChange={() => {
                    if (open) sessionStorage.removeItem("email");
                    setOpen(open => !open);
                }}
            >
                <Suspense>
                    <DialogContent className="w-80">
                        <Outlet />
                    </DialogContent>
                </Suspense>
            </Dialog>
        </>
    );
};
