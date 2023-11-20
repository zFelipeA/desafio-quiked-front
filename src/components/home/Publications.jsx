import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { IoSettings } from "react-icons/io5";
import { VscEmptyWindow } from "react-icons/vsc";
import { FaRegEye, FaTrash } from "react-icons/fa6";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";

import Comments from "./Comments.jsx";
import useUser from "../hooks/useUser.jsx";
import EditPublication from "./EditPublication.jsx";

export default function Publications() {
    const { user } = useUser();
    const [page, setPage] = useState(1);
    const [publications, setPublications] = useState([]);
    const [editPublication, setEditPublication] = useState(null);
    const [totalPublication, setTotalPublication] = useState(null);

    useEffect(() => {
        const fetchAPI = async () => {
            try {
                const result = await fetch(`http://localhost:1337/api/post?page=${page}`, {
                    credentials: "include",
                });

                if (result.status === 200) {
                    const json = await result.json();
                    setPublications(json.publications);
                    setTotalPublication(json.total_publications);
                }
            } catch {
                toast.error("Não foi possivel obter o feed de postagens. Tivemos um problema em nosso servidor, tente novamente mais tarde!");
            }
        };

        fetchAPI();
    }, [page]);

    function updatePublication(value) {
        setPublications(value);
    }

    function nextPage() {
        if (page < totalPublication / 3) {
            setPage((value) => value + 1);
        }
    }

    function backPage() {
        if (page > 1) {
            setPage((value) => value - 1);
        }
    }

    function handleEditPublication(postID) {
        if (editPublication) {
            return setEditPublication(null);
        }

        setEditPublication(postID);
    }

    function formatElapsedTime(createdAt) {
        const now = new Date();
        const dateCreated = new Date(createdAt);
        const timeDifferenceMS = now - dateCreated;
        const seconds = Math.floor(timeDifferenceMS / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        switch (true) {
            case days > 0:
                return `${days} ${days === 1 ? "day" : `days`}` + " atrás";
            case hours > 0:
                return `${hours} ${hours === 1 ? "hora" : `horas`}` + " atrás";
            case minutes > 0:
                return `${minutes} ${minutes === 1 ? "minuto" : `minutos`}` + " atrás";
            default:
                return "agora mesmo";
        }
    }

    async function handleReaction(postID, type) {
        try {
            const request = await fetch("http://localhost:1337/api/feedback", {
                method: "POST",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    post_id: postID,
                    reaction: type,
                }),
            });

            const result = await request.json();
            if (request.status === 201) {
                const newPublications = [...publications];
                const indexPublication = newPublications.findIndex((object) => object.id === result.publication.id);
                newPublications[indexPublication] = result.publication;

                setPublications(newPublications);
                return toast.success("Você reagiu nessa publicação com sucesso.");
            }

            toast.error(result.error);
        } catch {
            toast.error("OPS! Tivemos um problema em nosso servidor, tente novamente mais tarde!");
        }
    }

    async function handleDeletePublication(postID) {
        try {
            const request = await fetch("http://localhost:1337/api/post", {
                method: "DELETE",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    post_id: postID,
                }),
            });

            const result = await request.json();
            if (request.status === 200) {
                const newPublications = publications.filter((object) => object.id !== result.post_id);
                setPublications(newPublications);
                return toast.success("Você excluiu essa publicação com sucesso.");
            }

            toast.error(result.error);
        } catch {
            toast.error("OPS! Tivemos um problema em nosso servidor, tente novamente mais!");
        }
    }

    return (
        <>
            {publications.length <= 0 && (
                <div className="mt-10 text-black/70 flex flex-col items-center gap-10">
                    <h2 className="text-[2.5rem] text-black font-semibold">Parece que ninguém criou uma postagem</h2>

                    <p className="text-[1.5rem] text-main font-medium">Seja o primeiro, clicando no botão "Criar postagem"</p>

                    <VscEmptyWindow size={100} />
                </div>
            )}

            {publications.map((value, index) => (
                <div key={index}>
                    <div className="p-7 w-full rounded-xl border-[0.2rem] bg-black/5 bg-secondary relative group">
                        <div className="max-w-fit">
                            <p className="text-[1.5rem] font-semibold">{value.user.name}</p>

                            <hr className="mt-[1.0rem] w-full h-[0.1rem] rounded-full border-0 bg-black/50" />
                        </div>

                        <p className="mt-[1.0rem] text-[1.4rem] text-black/60 font-medium">{value.title}</p>

                        <p className="mt-[0.5rem] text-[1.3rem] text-black">• {value.description}</p>

                        {value.image_url !== "none" && <img className="mt-[1.0rem] rounded-xl overflow-hidden object-contain" width={300} height={100} src={value.image_url} />}

                        <div className="mt-[1.0rem] flex items-center justify-between">
                            <p className="text-black font-semibold">{formatElapsedTime(value.created_at)}</p>

                            <div className="flex items-center justify-center gap-5">
                                <div className="flex gap-2 text-black/60">
                                    <FaRegEye size={20} />

                                    <p className="text-[1.1rem] font-bold">{value.views_count}</p>
                                </div>

                                <div
                                    onClick={() => handleReaction(value.id, "liked")}
                                    className="flex gap-2 text-black/60 hover:text-main cursor-pointer transtion-all duration-500 select-none"
                                >
                                    <AiOutlineLike size={20} />

                                    <p className="text-[1.1rem] text-black/60 font-bold">{value._count.likeds}</p>
                                </div>

                                <div
                                    onClick={() => handleReaction(value.id, "disliked")}
                                    className="flex gap-2 text-black/60 hover:text-red-500 cursor-pointer transtion-all duration-500 select-none"
                                >
                                    <AiOutlineDislike size={20} />

                                    <p className="text-[1.1rem] text-black/60 font-bold">{value._count.dislikeds}</p>
                                </div>
                            </div>
                        </div>

                        {value.user_id === user.user_id && (
                            <>
                                <button
                                    onClick={() => handleDeletePublication(value.id)}
                                    className="absolute top-10 right-10 text-black/50 hidden group-hover:block hover:text-red-400"
                                >
                                    <FaTrash size={15} />
                                </button>

                                <button onClick={() => handleEditPublication(value.id)} className="absolute top-10 right-20 text-black/50 hidden group-hover:block hover:text-main">
                                    <IoSettings size={15} />
                                </button>
                            </>
                        )}
                    </div>

                    <div className="mt-[1.5rem]">
                        <Comments postID={value.id} cache={publications} comments={value.comments} update={updatePublication} />
                    </div>
                </div>
            ))}

            <div className="my-[3.0rem] flex items-center justify-center gap-10">
                {page <= 1 && (
                    <div className="flex items-center justify-center gap-3 text-black/30">
                        <MdArrowBackIosNew size={15} />

                        <button disabled={true} className="pb-[0.4rem] text-[2.0rem] font-semibold">
                            Anterior
                        </button>
                    </div>
                )}

                {page > 1 && (
                    <div className="flex items-center justify-center gap-3 text-black hover:text-main transtion-all duration-500">
                        <MdArrowBackIosNew size={15} />

                        <button onClick={backPage} className="pb-[0.4rem] text-[2.0rem] font-semibold">
                            Anterior
                        </button>
                    </div>
                )}

                {page >= totalPublication / 3 && (
                    <div className="flex items-center justify-center gap-3 text-black/30">
                        <button disabled={true} className="pb-[0.4rem] text-[2.0rem] font-semibold">
                            Próximo
                        </button>

                        <MdArrowForwardIos size={15} />
                    </div>
                )}

                {page < totalPublication / 3 && (
                    <div className="flex items-center justify-center gap-3 text-black hover:text-main transtion-all duration-500">
                        <button onClick={nextPage} className="pb-[0.4rem] text-[2.0rem] font-semibold">
                            Próximo
                        </button>

                        <MdArrowForwardIos size={15} />
                    </div>
                )}
            </div>

            {editPublication && <EditPublication postID={editPublication} cache={publications} update={updatePublication} close={handleEditPublication} />}
        </>
    );
}
