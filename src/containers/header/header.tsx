import { BurgerMenu } from "@/components/burger-menu";
import { BalanceMenu } from "./components/modals/balance-menu";
import { SignInButton } from "./components/sign-in-button";
import { SignUpButton } from "./components/sign-up-button";
import { Logo } from "./components/logo";

export const Header = () => {
    return (
        <header>
            <div className="flex justify-end gap-4 bg-[#2c2d30] px-4 py-2">
                <SignInButton />

                <SignUpButton />
                {/* <button className=" px-4 py-3 font-bold">Регистрация</button> */}
            </div>
            <div className="flex items-center justify-between">
                <Logo />
                <div className="flex items-center gap-4 ">
                    <button className="rounded-full bg-orange-400 p-1 text-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            width="16px"
                            height="16px"
                            viewBox="0 0 16 16"
                            version="1.1"
                        >
                            <title>8586C5FE-3BCF-459C-9756-F778B2FD4524</title>
                            <desc>Created with sketchtool.</desc>
                            <defs />
                            <g
                                id="Page-1"
                                stroke="none"
                                strokeWidth="1"
                                fill="none"
                                fillRule="evenodd"
                            >
                                <g
                                    id="PF-settings"
                                    transform="translate(-991.000000, -141.000000)"
                                    fill="#965419"
                                >
                                    <g
                                        id="question"
                                        transform="translate(991.000000, 141.000000)"
                                    >
                                        <path
                                            d="M8,0 C3.58909091,0 0,3.58909091 0,8 C0,12.4109091 3.58909091,16 8,16 C12.4109091,16 16,12.4109091 16,8 C16,3.58909091 12.4109091,0 8,0 M8,0.727272727 C12.0167273,0.727272727 15.2727273,3.98327273 15.2727273,8 C15.2727273,12.0167273 12.0167273,15.2727273 8,15.2727273 C3.98327273,15.2727273 0.727272727,12.0167273 0.727272727,8 C0.727272727,3.98327273 3.98327273,0.727272727 8,0.727272727"
                                            id="Fill-256"
                                        />
                                        <path
                                            d="M7.63636364,10.9424727 C7.43563636,10.9424727 7.27272727,10.8130182 7.27272727,10.6115636 L7.27272727,10.2377455 C7.27272727,8.85010909 8.10472727,8.45738182 8.77236364,8.14247273 C9.43709091,7.82901818 9.91636364,7.60283636 9.91636364,6.56647273 C9.91636364,5.55192727 8.95927273,4.7272 7.78327273,4.7272 C6.60727273,4.7272 5.65018182,5.55192727 5.65018182,6.56647273 C5.65018182,6.7672 5.48727273,6.93010909 5.28654545,6.93010909 C5.08581818,6.93010909 4.92290909,6.7672 4.92290909,6.56647273 C4.92290909,5.1512 6.20581818,3.99992727 7.78327273,3.99992727 C9.36072727,3.99992727 10.6436364,5.1512 10.6436364,6.56647273 C10.6436364,8.06392727 9.77818182,8.47265455 9.08290909,8.79992727 C8.45454545,9.09665455 8,9.3112 8,10.2377455 L7.99418182,10.6115636 C7.96363636,10.7875636 7.81527273,10.9424727 7.63636364,10.9424727"
                                            id="Fill-258"
                                        />
                                        <path
                                            d="M7.63636364,12.7272727 C7.54181818,12.7272727 7.44727273,12.6909091 7.38181818,12.6181818 C7.30909091,12.5527273 7.27272727,12.4581818 7.27272727,12.3636364 C7.27272727,12.2690909 7.30909091,12.1745455 7.38181818,12.1090909 C7.52,11.9709091 7.75272727,11.9709091 7.89090909,12.1018182 C7.96363636,12.1745455 8,12.2690909 8,12.3636364 C8,12.4581818 7.96363636,12.5527273 7.89090909,12.6181818 C7.82545455,12.6909091 7.73090909,12.7272727 7.63636364,12.7272727"
                                            id="Fill-260"
                                        />
                                    </g>
                                </g>
                            </g>
                        </svg>
                    </button>
                    <BalanceMenu />

                    <BurgerMenu />
                </div>
            </div>
        </header>
    );
};
