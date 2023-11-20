import { Navigate } from "react-router-dom";

import useUser from "../hooks/useUser.jsx";

export default function ProtectedRoute({ children }) {
    const { user, isLoading } = useUser();
    if (!user && !isLoading) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
