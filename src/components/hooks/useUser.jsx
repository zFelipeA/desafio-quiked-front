import { createContext, useCallback, useContext, useEffect, useState } from "react";

const UserContext = createContext({
    user: null,
    isLoading: true,
    fetchUser: () => {},
    logout: () => {},
    login: () => {},
});

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        const response = await fetch("http://localhost:1337/api/auth", {
            credentials: "include",
        });

        if (response.status === 200) {
            return true;
        }

        setUser(null);
        localStorage.removeItem("user");
        window.location.href = "/login";
    }, []);

    const logout = useCallback(async () => {
        const response = await fetch("http://localhost:1337/api/auth", {
            method: "DELETE",
            credentials: "include",
        });

        if (response.status === 200) {
            localStorage.removeItem("user");
            setUser(null);
            window.location.href = "/login";
        }
    }, []);

    const login = useCallback((data) => {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
    }, []);

    useEffect(() => {
        const fecthAPI = async () => {
            const storedUser = localStorage.getItem("user");
            if (storedUser && isLoading) {
                const json = JSON.parse(storedUser);
                setUser(json);
                await fetchUser();
            }

            setIsLoading(false);
        };

        fecthAPI();
    }, []);

    const userContextValue = {
        user,
        isLoading,
        fetchUser,
        logout,
        login,
    };

    return <UserContext.Provider value={userContextValue}>{children}</UserContext.Provider>;
}

export default function useUser() {
    return useContext(UserContext);
}
