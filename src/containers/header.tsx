export const Header = () => {
    return (
        <header>
            <div className="flex justify-end gap-4 bg-gray-700 px-4 py-2">
                <button className="bg-green-400 px-4 py-3 font-bold">
                    Вход
                </button>
                <button className="bg-red-400 px-4 py-3 font-bold">
                    Регистрация
                </button>
            </div>
            <div className="flex items-center justify-between">
                <span>Logo</span>
                <div className="flex items-center gap-4 ">
                    <span className="aspect-square h-8 w-8 rounded-full bg-orange-400">
                        ?
                    </span>
                    <button className="border-2 border-r-4 border-gray-600">
                        3000 $
                    </button>
                    <button></button>
                </div>
            </div>
        </header>
    );
};
