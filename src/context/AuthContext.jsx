import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // Initialize mock state from localStorage
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('auth_user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (e) {
            return null;
        }
    });

    const [registeredUsers, setRegisteredUsers] = useState(() => {
        try {
            const savedUsers = localStorage.getItem('auth_registered_users');
            return savedUsers ? JSON.parse(savedUsers) : [];
        } catch (e) {
            return [];
        }
    });

    // Check boolean login status easily
    const isLoggedIn = !!user;

    // Sync to localStorage
    useEffect(() => {
        if (user) {
            localStorage.setItem('auth_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('auth_user');
        }
    }, [user]);

    useEffect(() => {
        localStorage.setItem('auth_registered_users', JSON.stringify(registeredUsers));
    }, [registeredUsers]);

    // LOGIN FUNC
    const login = async (email, password) => {
        await new Promise(resolve => setTimeout(resolve, 800)); // Sim delay
        
        const existingUser = registeredUsers.find(u => u.email === email && u.password === password);
        
        if (existingUser) {
            setUser(existingUser);
            return existingUser;
        } else {
            throw new Error("Invalid credentials or user not registered");
        }
    };

    // REGISTER FUNC
    const register = async (userData) => {
        await new Promise(resolve => setTimeout(resolve, 800));

        // Check if email already exists
        const exists = registeredUsers.find(u => u.email === userData.email);
        if (exists) {
            throw new Error("Email already registered!");
        }
        
        const mockUser = {
            _id: `user_${Date.now()}`,
            name: userData.name,
            email: userData.email,
            password: userData.password, // storing for basic client validation
            phone: userData.phone,
            role: "customer",
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name.replace(/\s/g, '')}`
        };
        
        setRegisteredUsers(prev => [...prev, mockUser]);
        setUser(mockUser); // auto login on register
        return mockUser;
    };

    // LOGOUT FUNC
    const logout = () => {
        setUser(null);
    };

    // UPDATE PROFILE FUNC
    const updateProfile = async (updates) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 1. Validate Current Password
        if (!updates.currentPassword) {
            throw new Error("Current password is required to save changes.");
        }
        if (updates.currentPassword !== user.password) {
            throw new Error("Incorrect current password.");
        }

        const oldEmail = user.email;
        const newEmail = updates.email || user.email;
        const newPassword = updates.newPassword || user.password;

        // 2. Check if new email is taken by someone else
        if (newEmail !== oldEmail) {
            const emailExists = registeredUsers.find(u => u.email === newEmail && u._id !== user._id);
            if (emailExists) {
                throw new Error("This email is already in use by another account.");
            }
        }

        // 3. Migrate LocalStorage Cart/Orders if Email changed
        if (newEmail !== oldEmail) {
            const keysToMigrate = ['cart', 'wishlist', 'orders', 'addresses'];
            keysToMigrate.forEach(keySuffix => {
                const oldData = localStorage.getItem(`shop_data_${oldEmail}_${keySuffix}`);
                if (oldData) {
                    localStorage.setItem(`shop_data_${newEmail}_${keySuffix}`, oldData);
                    localStorage.removeItem(`shop_data_${oldEmail}_${keySuffix}`);
                }
            });
        }

        // 4. Create updated user object
        const updatedUser = { 
            ...user, 
            name: updates.name || user.name,
            email: newEmail,
            phone: updates.phone || user.phone,
            password: newPassword
        };
        
        // Update user in DB list too
        setRegisteredUsers(prev => prev.map(u => u._id === user._id ? updatedUser : u));
        setUser(updatedUser);
        
        // Return updated user to force trigger re-renders natively via Context
        return updatedUser;
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoggedIn,
            login,
            register,
            logout,
            updateProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};
