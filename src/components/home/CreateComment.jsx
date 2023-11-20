import toast from "react-hot-toast";
import { useRef, useState } from "react";

export default function CreateComment({ postID, close, cache, update }) {
    const descriptionRef = useRef("");
    const [loading, setLoading] = useState(null);

    async function handleSubmit(event) {
        event.preventDefault();

        if (loading) {
            return false;
        }

        setLoading(true);

        try {
            const description = descriptionRef.current.value;
            const request = await fetch("http://localhost:1337/api/comment", {
                method: "POST",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    post_id: postID,
                    text: description,
                }),
            });

            const result = await request.json();
            if (request.status === 201) {
                const newPublications = [...cache];
                const indexPublication = newPublications.findIndex((object) => object.id === result.publication.id);
                newPublications[indexPublication] = result.publication;

                close();
                update(newPublications);
                return toast.success("Comentário criado com sucesso!");
            }

            toast.error(result.error);
            setLoading(null);
        } catch {
            setLoading(null);
            toast.error("OPS! Tivemos um problema em nosso servidor, tente novamente mais!");
        }
    }

    return (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/80 z-30">
            <div className="p-7 max-w-[40.0rem] w-full rounded-xl border-[0.1rem] border-black/10 bg-white">
                <p className="text-[2.0rem] text-bold font-semibold">Publicar comentário</p>

                <hr className="mt-[1.0rem] w-full h-[0.2rem] border-0 bg-black/10" />

                <form onSubmit={handleSubmit} className="mt-[1.0rem]">
                    <div>
                        <label className="text-[1.8rem] text-black/70 font-semibold">Descrição</label>
                        <input
                            id="description"
                            name="description"
                            type="text"
                            placeholder="Descrição do comentário..."
                            required={true}
                            ref={descriptionRef}
                            className="pl-5 w-full h-[4.0rem] rounded-xl border-[0.2rem] border-black/30 bg-transparent text-[1.2rem] focus:outline-main"
                        />
                    </div>

                    <div className="mt-5 flex justify-end gap-5">
                        <button
                            onClick={close}
                            disabled={loading}
                            type="button"
                            className="px-10 py-3 rounded-xl border-[0.2rem] border-black/40 text-[1.4rem] text-black/40 font-semibold hover:border-red-400 hover:text-red-400 transtion-all duration-500"
                        >
                            Cancelar
                        </button>

                        {loading && (
                            <button disabled={true} type="submit" className="px-10 py-3 rounded-xl border-[0.2rem] border-main bg-main text-[1.4rem] text-white/90 font-semibold">
                                <div className="animate-spin w-[2.0rem] h-[2.0rem] border-4 border-l-white/75 border-white/25 rounded-full bg-transparent" />
                            </button>
                        )}

                        {!loading && (
                            <button
                                type="submit"
                                className="px-10 py-3 rounded-xl border-[0.2rem] border-main bg-main text-[1.4rem] text-white/90 font-semibold hover:bg-transparent hover:text-main transtion-all duration-500"
                            >
                                Publicar
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
