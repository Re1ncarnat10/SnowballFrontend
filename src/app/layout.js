'use client';
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/Components/AuthContext";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

// Metadata needs to be in a separate file in client components
const metadata = {
    title: "Snowball Shop",
    description: "High quality snowballs for all occasions",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <AuthProvider>
            {children}
        </AuthProvider>
        </body>
        </html>
    );
}