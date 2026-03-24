'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap } from 'lucide-react';
// import axios from 'axios';

// const API_BASE_URL_TEST = 'http://localhost:8000/api/v1';
// export const login = async (email: string, password: string): Promise<any> => {
//     try {
//         const response = await axios.post(`${API_BASE_URL_TEST}/accounts/login/`, {
//             email,
//             password
//         });
//         return response.data;
//     } catch (error) {
//         if (axios.isAxiosError(error)) {
//             console.error("login 에러:", error.response?.status, error.message);
//         }
//         return null;
//     }
// };

// const handleLogin = async () => {
//     const res = await login('dlworjs@example.com', 'test1234!');
//     console.log(res);
//     if (res) {
//         localStorage.setItem('email', res.email);
//         localStorage.setItem('access', res.access);
//         localStorage.setItem('refresh', res.refresh);
//     }
// };

import { useAuth } from '@/context/AuthContext';

export default function Header() {
    const { isLoggedIn, logout } = useAuth();

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        logout();
        window.location.href = '/';
    };

    return (
        <header className="flex justify-between items-center px-8 py-6 mx-auto sticky top-0 bg-white/80 backdrop-blur-md z-50">
            <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-2xl font-black tracking-tighter text-black">
                    JOB<span className="text-gradient no-italic">FIT</span>
                </span>
            </Link>
            <div className="flex items-center space-x-8">
                <nav className="hidden md:flex space-x-10 text-sm font-semibold">
                    <Link href="/test" className="text-black hover:text-[#ea002c] transition">테스트</Link>
                    <Link href="/learning" className="text-black hover:text-[#ea002c] transition">학습</Link>
                    <Link href="/survey" className="text-black hover:text-[#ea002c] transition">설문조사</Link>
                    {isLoggedIn ? (
                        <Link href="/mypage" className="text-black hover:text-[#ea002c] transition">마이페이지</Link>
                    ) : ''
                    }
                </nav>

                {isLoggedIn ? (
                    <Link href="/" onClick={handleLogout} className="px-6 py-2 border-2 border-black text-black text-sm font-bold rounded-full hover:bg-black hover:text-white transition">
                        로그아웃
                    </Link>
                ) : (
                    <Link href="/login" className="px-6 py-2 border-2 border-black text-black text-sm font-bold rounded-full hover:bg-black hover:text-white transition">
                        로그인
                    </Link>
                )}
            </div>
        </header>
    );
}
