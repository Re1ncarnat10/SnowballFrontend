'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/Components/NavBar';
import { Footer } from '@/Components/Footer';
import { AdminPanel } from '@/Components/AdminPanel';
import { useAuth } from '@/Components/AuthContext';

export default function AdminPage() {
    const { user, loading, isAdmin, verifyAdminStatus } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Check admin status on page load
        const checkAccess = async () => {
            if (!user) {
                router.push('/');
                return;
            }

            const hasAdminAccess = await verifyAdminStatus();

            if (!hasAdminAccess) {
                console.log('Access denied: User is not an admin');
                router.push('/');
            }
        };

        if (!loading) {
            checkAccess();
        }
    }, [user, loading, router, verifyAdminStatus]);

    // Show loading while checking credentials
    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    // Don't render anything until we've verified access
    if (!isAdmin) {
        return <div className="flex justify-center items-center h-screen">Checking permissions...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow p-4">
                <AdminPanel />
            </main>
            <Footer />
        </div>
    );
}