// src/Components/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkAdminStatus } from './api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('authToken');
            const userData = localStorage.getItem('userData');

            // Set logged in state based on token presence
            setIsLoggedIn(token !== null);

            if (token && userData) {
                try {
                    // Parse and set user data
                    const parsedUser = JSON.parse(userData);
                    setUser(parsedUser);

                    // Check admin status using the updated function
                    checkAdminStatus()
                        .then(adminStatus => {
                            console.log('Admin status verified:', adminStatus);
                            setIsAdmin(adminStatus);
                        })
                        .catch(error => {
                            console.error('Failed to verify admin status:', error);
                            setIsAdmin(false);
                        });
                } catch (e) {
                    console.error('Error parsing user data:', e);
                    localStorage.removeItem('userData');
                    localStorage.removeItem('authToken');
                    setIsLoggedIn(false);
                }
            }

            setLoading(false);
        }
    }, []);

    const login = async (userData, token) => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);
        setIsLoggedIn(true);

        // Check admin status after login
        try {
            const adminStatus = await checkAdminStatus();
            setIsAdmin(adminStatus);
        } catch (error) {
            console.error('Failed to verify admin status after login:', error);
            setIsAdmin(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setUser(null);
        setIsLoggedIn(false);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoggedIn,
            isAdmin,
            login,
            logout,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined || context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};