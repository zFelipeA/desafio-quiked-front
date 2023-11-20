import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import toast from "react-hot-toast";

import useUser from "../hooks/useUser.jsx";
import EditComment from "./EditComment.jsx";
import CreateComment from "./CreateComment.jsx";

export default function Comments({ postID, cache, comments, update }) {
    const { user } = useUser();
    const [editComment, setEditComment] = useState(null);
    const [createComment, setCreateComment] = useState(null);

    function handleEditComment(id) {
        if (editComment) {
            return setEditComment(null);
        }

        setEditComment(id);
    }

    function handleCreateComment() {
        if (createComment) {
            return setCreateComment(null);
        }

        setCreateComment(postID);
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

    async function handleDeleteComment(id) {
        try {
            const request = await fetch("http://localhost:1337/api/comment", {
                method: "DELETE",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: id,
                    post_id: postID,
                }),
            });

            const result = await request.json();
            if (request.status === 200) {
                const newPublications = [...cache];
                const indexPublication = newPublications.findIndex((object) => object.id === result.publication.id);
                newPublications[indexPublication] = result.publication;

                update(newPublications);
                return toast.success("Você deleteu esse comentário com sucesso.");
            }

            toast.error(result.error);
        } catch {
            toast.error("OPS! Tivemos um problema em nosso servidor, tente novamente mais!");
        }
    }

    return (
        <>
            {comments.map((value, index) => {
                if (value.deleted) {
                    return (
                        <div key={index} className="mb-[1.5rem] relative group">
                            <div className="flex items-center justify-start gap-3">
                                <p className="max-w-fit px-5 py-2 rounded-xl bg-red-400/10 text-[1.4rem] text-red-400 font-semibold">{value.user.name}</p>

                                <p className="text-[1.2rem] text-black/50 font-medium">{formatElapsedTime(value.created_at)}</p>
                            </div>

                            <p className="mt-[0.5rem] text-[1.3rem]">{value.description}</p>
                        </div>
                    );
                }

                if (value.user_id === user.user_id) {
                    return (
                        <div key={index} className="mb-[1.5rem] relative group">
                            <div className="flex items-center justify-start gap-3">
                                <p className="max-w-fit px-5 py-2 rounded-xl bg-main/10 text-[1.4rem] text-main/90 font-semibold">{value.user.name}</p>

                                <p className="text-[1.2rem] text-black/50 font-medium">{formatElapsedTime(value.created_at)}</p>
                            </div>

                            <p className="mt-[0.5rem] text-[1.3rem]">{value.description}</p>

                            <button onClick={() => handleDeleteComment(value.id)} className="absolute top-10 right-10 text-black/50 hidden group-hover:block hover:text-red-400">
                                <FaTrash size={15} />
                            </button>

                            <button onClick={() => handleEditComment(value.id)} className="absolute top-10 right-20 text-black/50 hidden group-hover:block hover:text-main">
                                <IoSettings size={15} />
                            </button>
                        </div>
                    );
                }

                return (
                    <div key={index} className="mb-[1.5rem] relative group">
                        <div className="flex items-center justify-start gap-3">
                            <p className="max-w-fit px-5 py-2 rounded-xl bg-main/40 text-[1.4rem] text-main font-semibold">{value.user.name}</p>

                            <p className="text-[1.2rem] text-black/50 font-medium">{formatElapsedTime(value.created_at)}</p>
                        </div>

                        <p className="mt-[0.5rem] text-[1.3rem]">{value.description}</p>
                    </div>
                );
            })}

            <button
                onClick={handleCreateComment}
                className="w-full h-[4.0rem] rounded-xl border-[0.2rem] bg-black/5 bg-secondary text-[1.5rem] font-semibold hover:text-main transtion-all duration-500"
            >
                Comentar
            </button>

            {createComment && <CreateComment postID={createComment} close={handleCreateComment} cache={cache} update={update} />}

            {editComment && <EditComment postID={editComment} close={handleEditComment} cache={cache} update={update} />}
        </>
    );
}
