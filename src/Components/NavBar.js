import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { AuthModal } from './AuthModal';
import { useAuth } from './AuthContext';

export const Header = () => {
    const { user, isAdmin } = useAuth();
    const drawerToggleRef = useRef(null);

    useEffect(() => {
        const handleDrawerChange = (e) => {
            const isChecked = e.target.checked;
            document.documentElement.classList.toggle('drawer-open', isChecked);
        };

        const toggle = drawerToggleRef.current;
        if (toggle) {
            toggle.addEventListener('change', handleDrawerChange);
        }

        return () => {
            if (toggle) {
                toggle.removeEventListener('change', handleDrawerChange);
            }
            document.documentElement.classList.remove('drawer-open');
        };
    }, []);

    return (
        <div className="drawer drawer-end">
            <input ref={drawerToggleRef} id="my-drawer" type="checkbox" className="drawer-toggle" />

            <div className="drawer-content">
                <header className="navbar bg-base-200">
                    <div className="navbar-start">
                        <Link href="/" className="btn btn-ghost text-xl">SnowBall</Link>
                    </div>
                    <div className="navbar-end">
                        <AuthModal />
                        {isAdmin && (
                            <Link href="/Admin" className="btn btn-ghost text-xl">Admin</Link>
                        )}

                        <label htmlFor="my-drawer" className="btn btn-ghost drawer-button">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 className="inline-block w-5 h-5 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </label>
                    </div>
                </header>
            </div>

            <div className="drawer-side">
                <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu p-4 w-80 h-full bg-base-200 text-base-content overflow-y-auto">
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/products">Products</Link></li>
                    <li><Link href="/cart">Cart</Link></li>
                    <li><Link href="/account">Account</Link></li>
                    {isAdmin && (
                        <li><Link href="/Admin">Admin Panel</Link></li>
                    )}
                </ul>
            </div>
        </div>
    );
};