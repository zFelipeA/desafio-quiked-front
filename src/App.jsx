import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/home/Home.jsx";
import Login from "./pages/login/Login.jsx";
import Register from "./pages/register/Register.jsx";

import Header from "./components/main/Header.jsx";
import Notification from "./components/main/Notification.jsx";
import ProtectedRoute from "./components/main/ProtectedRoute.jsx";

import { UserProvider } from "./components/hooks/useUser.jsx";

function App() {
    return (
        <UserProvider>
            <Router>
                <Header />

                <Routes>
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="/login" element={<Login />} />

                    <Route path="/register" element={<Register />} />
                </Routes>

                <Notification />
            </Router>
        </UserProvider>
    );
}

export default App;
