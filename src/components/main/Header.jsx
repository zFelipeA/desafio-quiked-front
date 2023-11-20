import CustomLink from "./CustomLink.jsx";
import useUser from "../hooks/useUser.jsx";

export default function Header() {
    const { user, logout } = useUser();
    return (
        <header className="px-5 my-10 mx-auto w-[80.0rem] h-[7.0rem] flex items-center justify-between rounded-full bg-secondary">
            <img src="./logo.png" />

            <div className="flex items-center gap-10">
                <CustomLink link="/" name="Inicio" />
            </div>

            {user && (
                <button
                    onClick={logout}
                    className="px-20 py-4 rounded-full border-[0.2rem] border-main bg-main text-[2.0rem] text-white/90 font-semibold hover:bg-transparent hover:text-main transtion-all duration-500"
                >
                    Sair
                </button>
            )}

            {!user && (
                <a
                    href="/login"
                    className="px-20 py-4 rounded-full border-[0.2rem] border-main bg-main text-[2.0rem] text-white/90 font-semibold hover:bg-transparent hover:text-main transtion-all duration-500"
                >
                    Logar
                </a>
            )}
        </header>
    );
}
