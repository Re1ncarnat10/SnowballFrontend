'use client';
import React, { useEffect, useState } from 'react';
import { Header } from '@/Components/NavBar';
import { Footer } from '@/Components/Footer';
import { SnowballCard } from '@/Components/Card';
import { getSnowballs } from '@/Components/api';

const Home = () => {
    const [snowballs, setSnowballs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSnowballs = async () => {
            try {
                const data = await getSnowballs();
                setSnowballs(data);
            } catch (error) {
                console.error('Error fetching snowballs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSnowballs();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-8">
                {snowballs.map((snowball) => (
                    <SnowballCard
                        key={snowball.snowballId}
                        name={snowball.name}
                        price={snowball.price}
                        description={snowball.description}
                        image={snowball.image}
                    />
                ))}
            </main>
            <Footer />
        </div>
    );
};

export default Home;