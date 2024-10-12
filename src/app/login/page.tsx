'use client';  // Necessary for client-side interactivity

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation'; 
import bg from '../../assets/img/thumb-1920-566560.jpg';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await signIn('credentials', { redirect: false, username, password });

        if (res?.error) {
            setError('Invalid username or password');
        } else {
            router.push('/dashboard');
        }
    };

    return (
        <main
            className="flex items-center justify-center min-h-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${bg.src})` }}>
            <div className="bg-gray-500 bg-opacity-50 shadow-md rounded-lg p-8 max-w-sm w-full">
                <h2 className="text-center text-2xl font-bold mb-6 text-white">Login</h2>
                <form className="flex flex-col" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="border border-gray-300 p-2 mb-4 rounded focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border border-gray-300 p-2 mb-4 rounded focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    <button 
                        type="submit" 
                        className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
                    >
                        Login
                    </button>
                    {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                </form>
            </div>
        </main>
    );
}
