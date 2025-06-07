import React, { useState } from 'react';
import { loginUser, registerUser } from './api';
import { useAuth } from './AuthContext';

export const AuthModal = () => {
    const { user, login, logout } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        try {
            if (isLogin) {
                const loginData = {
                    email: formData.email,
                    password: formData.password
                };

                const response = await loginUser(loginData);
                if (response && response.token) {
                    console.log('Login response:', response);

                    const userData = {
                        email: formData.email,
                        name: response.user?.name || formData.email,
                        roles: response.roles || response.user?.roles || [],
                        role: response.role || response.user?.role || ''
                    };

                    login(userData, response.token);
                    setMessage({ type: 'success', text: 'Login successful!' });
                    setTimeout(() => setShowModal(false), 1500);
                }
            } else {
                if (formData.password !== formData.confirmPassword) {
                    setMessage({ type: 'error', text: 'Passwords do not match' });
                    return;
                }

                const registerData = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword
                };

                await registerUser(registerData);
                setMessage({ type: 'success', text: 'Registration successful! Please log in.' });
                setTimeout(() => {
                    setIsLogin(true);
                    setFormData(prev => ({
                        ...prev,
                        name: '',
                        confirmPassword: ''
                    }));
                }, 1500);
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Authentication failed' });
        }
    };

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        setMessage(null);
        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
    };

    const openLoginModal = () => {
        setIsLogin(true);
        setShowModal(true);
        console.log("Opening login modal");
    };

    const openRegisterModal = () => {
        setIsLogin(false);
        setShowModal(true);
        console.log("Opening register modal");
    };

    const handleLogout = () => {
        logout();
        console.log("User logged out");
    };

    // If user is logged in, show logout button
    if (user) {
        return (
            <div className="flex items-center gap-3">
                <span className="text-sm font-medium hidden md:inline">
                    {user.name || user.email}
                </span>
                <button className="btn btn-ghost" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        );
    }

    return (
        <>
            <button className="btn btn-ghost" onClick={openLoginModal}>
                Login
            </button>
            <button className="btn btn-ghost" onClick={openRegisterModal}>
                Register
            </button>

            {showModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(0,0,0,0.7)]"
                     onClick={() => setShowModal(false)}>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md"
                         onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">
                                {isLogin ? 'Login' : 'Register'}
                            </h3>
                            <button
                                className="btn btn-sm btn-circle"
                                onClick={() => setShowModal(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div>
                                    <label className="label">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="input input-bordered w-full"
                                        required={!isLogin}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            {!isLogin && (
                                <div>
                                    <label className="label">Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="input input-bordered w-full"
                                        required={!isLogin}
                                    />
                                </div>
                            )}

                            {message && (
                                <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                                    <span>{message.text}</span>
                                </div>
                            )}

                            <div className="flex flex-col gap-2">
                                <button type="submit" className="btn btn-primary w-full">
                                    {isLogin ? 'Login' : 'Register'}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-link"
                                    onClick={toggleAuthMode}
                                >
                                    {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};