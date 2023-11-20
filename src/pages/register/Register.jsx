import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";

export default function Register() {
    const nameRef = useRef("");
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const [loading, setLoading] = useState(null);

    async function handleSubmit(event) {
        event.preventDefault();

        if (loading) {
            return false;
        }

        setLoading(true);

        try {
            const name = nameRef.current.value;
            const email = emailRef.current.value;
            const password = passwordRef.current.value;
            const response = await fetch(`http://localhost:1337/api/user`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                }),
            });

            const result = await response.json();
            if (response.status === 201) {
                window.location.href = "/login";
                toast.success("Conta criada com sucesso, entre e seja bem-vindo(a)");
                return true;
            }

            toast.error(result.error);
            setLoading(null);
        } catch {
            toast.error("OPS! Tivemos um problema em nosso servidor, tente novamente mais!");
            setLoading(null);
        }
    }

    return (
        <section className="w-screen min-h-full flex flex-col items-center justify-center grow">
            <div className="max-w-[40.0rem]">
                <h1 className="text-[2.0rem] text-center">
                    Já possui uma conta?
                    <br />
                    Volte para o&nbsp;
                    <Link to="/login" className="text-main">
                        login agora mesmo
                    </Link>
                </h1>

                <hr className="my-10 w-full h-[0.2rem] rounded-full border-0 bg-black/10" />

                <form onSubmit={handleSubmit}>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Usuário"
                        required={true}
                        ref={nameRef}
                        className="w-full h-[4.8rem] px-[1.6rem] py-[1.1rem] rounded-xl border-[0.2rem] border-main bg-secondary text-black text-[1.3rem] focus:outline-none"
                    />

                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="E-mail"
                        autoComplete="current-email"
                        required={true}
                        ref={emailRef}
                        className="mt-[2.0rem] w-full h-[4.8rem] px-[1.6rem] py-[1.1rem] rounded-xl border-[0.2rem] border-main bg-secondary text-black text-[1.3rem] focus:outline-none"
                    />

                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Senha"
                        autoComplete="current-password"
                        required={true}
                        ref={passwordRef}
                        className="mt-[2.0rem] w-full h-[4.8rem] px-[1.6rem] py-[1.1rem] rounded-xl border-[0.2rem] border-main bg-secondary text-black text-[1.3rem] focus:outline-none"
                    />

                    {loading && (
                        <button disabled className="mt-[3.0rem] w-full h-[5.0rem] flex items-center justify-center rounded-xl border-[0.2rem] border-main bg-main text-white/90">
                            <div className="animate-spin w-[2.5rem] h-[2.5rem] border-4 border-l-white/75 border-white/25 rounded-full bg-transparent" />
                        </button>
                    )}

                    {!loading && (
                        <button className="mt-[3.0rem] w-full h-[5.0rem] rounded-xl border-[0.2rem] border-main bg-main text-[1.5rem] text-white/90 font-semibold hover:bg-transparent hover:text-main transtion-all duration-500">
                            Criar conta
                        </button>
                    )}
                </form>
            </div>
        </section>
    );
}
