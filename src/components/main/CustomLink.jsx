import { useLocation, Link } from "react-router-dom";

export default function CustomLink({ link, name }) {
    const location = useLocation();
    if (location?.pathname === link) {
        return (
            <Link to={link} className="text-[2.0rem] text-main font-semibold hover:text-white/90 transtion-all duration-500">
                {name}
            </Link>
        );
    }

    return (
        <Link to={link} className="text-[2.0rem] text-white/90 font-semibold hover:text-main transtion-all duration-500">
            {name}
        </Link>
    );
}
