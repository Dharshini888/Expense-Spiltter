import React, { createContext, useState, useContext, useEffect } from "react";
import { login as apiLogin, register as apiRegister, getCurrentUser } from "../utils/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            getCurrentUser()
                .then(userData => {
                    setUser({ id: userData.id, name: userData.name, email: userData.email, role: userData.role });
                })
                .catch(() => {
                    localStorage.removeItem("authToken");
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    // Register
    const register = async (userData) => {
        try {
            return await apiRegister(userData);
        } catch (err) {
            const errMsg = err.response?.data?.error || "Failed to register";
            throw new Error(errMsg);
        }
    };

    // Login
    const login = async (credentials) => {
        try {
            const data = await apiLogin(credentials);
            localStorage.setItem("authToken", data.token);
            setUser({ id: data.id, name: data.name, email: data.email, role: data.role });
            return data;
        } catch (err) {
            const errMsg = err.response?.data?.error || "Invalid email or password";
            throw new Error(errMsg);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("authToken");
    };

    return (
        <AuthContext.Provider value={{ user, register, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);