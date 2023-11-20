import { useState } from "react";

import Publications from "../../components/home/Publications.jsx";
import CreatePublication from "../../components/home/CreatePublication.jsx";

export default function Home() {
    const [createPulication, setCreatePublication] = useState(null);

    function toggleModalCreatePublication() {
        setCreatePublication(!createPulication);
    }

    return (
        <section className="w-screen min-h-full grow">
            <div className="mt-[5.0rem] mx-auto max-w-[70.0rem]">
                <div className="w-full flex items-center justify-between gap-10">
                    <h1 className="text-[2.0rem] text-black font-semibold">Postagens recentes</h1>

                    <button
                        onClick={toggleModalCreatePublication}
                        className="px-10 py-5 rounded-xl border-[0.2rem] border-main bg-main text-[1.5rem] text-white/90 font-semibold hover:bg-transparent hover:text-main transtion-all duration-500"
                    >
                        Criar postagem
                    </button>
                </div>

                <hr className="mt-[2.0rem] w-full h-[0.2rem] border-0 bg-black/10" />

                <div className="my-[2.0rem] w-full grid grid-cols gap-10">
                    <Publications />
                </div>
            </div>

            {createPulication && <CreatePublication close={toggleModalCreatePublication} />}
        </section>
    );
}
