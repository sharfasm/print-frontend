// @ts-nocheck
"use client";
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '../lib/axios';
import { io } from 'socket.io-client';

const AuthContext = createContext<any>({ user: null, isLoggedIn: false });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const socketRef = useRef(null);

    // Check boolean login status easily
    const isLoggedIn = !!user;

    // Handle Socket connection based on user state
    useEffect(() => {
        if (user && user._id) {
            // Connect to backend socket server. The token lets the server verify
            // the identity on the handshake instead of trusting the emitted id.
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            socketRef.current = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000', {
                withCredentials: true,
                auth: { token },
            });

            // Emit user connected event
            socketRef.current.emit('user_connected', user._id);
        } else if (!user && socketRef.current) {
            // Disconnect when user logs out
            socketRef.current.disconnect();
            socketRef.current = null;
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [user]);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await api.get('/auth/me');
                    setUser(res.data);
                } catch (err) {
                    console.error("Failed to fetch user session", err);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    // LOGIN FUNC
    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            setUser(res.data);
            return res.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Login failed");
        }
    };

    // REGISTER FUNC
    const register = async (userData) => {
        try {
            const res = await api.post('/auth/register', {
                name: userData.name,
                email: userData.email,
                password: userData.password,
            });
            localStorage.setItem('token', res.data.token);
            setUser(res.data);
            return res.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Registration failed");
        }
    };

    // LOGOUT FUNC
    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Logout failed on server:", error);
        }
        localStorage.removeItem('token');
        setUser(null);
    };

    // UPDATE PROFILE FUNC (Mocked for now since backend doesn't have the API yet)
    const updateProfile = async (updates) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        console.warn("Update profile is currently mocked");
        
        // 1. Validate Current Password (mocked client side)
        if (!updates.currentPassword) {
            throw new Error("Current password is required to save changes.");
        }

        const newEmail = updates.email || user.email;

        // 3. Migrate LocalStorage Cart/Orders if Email changed
        if (newEmail !== user.email) {
            const keysToMigrate = ['cart', 'wishlist', 'orders', 'addresses'];
            keysToMigrate.forEach(keySuffix => {
                const oldData = localStorage.getItem(`shop_data_${user.email}_${keySuffix}`);
                if (oldData) {
                    localStorage.setItem(`shop_data_${newEmail}_${keySuffix}`, oldData);
                    localStorage.removeItem(`shop_data_${user.email}_${keySuffix}`);
                }
            });
        }

        const updatedUser = { ...user, ...updates, email: newEmail };
        setUser(updatedUser);
        return updatedUser;
    };
    
    // FORGOT PASSWORD
    const forgotPassword = async (email) => {
        try {
            const res = await api.post('/auth/forgot-password', { email });
            return res.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Failed to send reset link");
        }
    };

    // RESET PASSWORD
    const resetPassword = async (email, newPassword) => {
        try {
            const res = await api.post('/auth/reset-password', { email, newPassword });
            return res.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Failed to reset password");
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isLoggedIn,
            login,
            register,
            logout,
            updateProfile,
            forgotPassword,
            resetPassword
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
