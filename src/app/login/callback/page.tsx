'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function KakaoCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get('code');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!code) {
            setError('카카오 로그인 코드를 찾을 수 없습니다.');
            return;
        }

        const handleLogin = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/accounts/kakao/login/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || '로그인에 실패했습니다.');
                }

                const data = await response.json();

                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                localStorage.setItem('user', JSON.stringify(data.user));

                router.push('/mypage');

            } catch (err: any) {
                console.error('Kakao login error:', err);
                setError(err.message || '서버와의 통신에 실패했습니다.');
            }
        };

        handleLogin();
    }, [code, router]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 text-center">

                {error ? (
                    <div>
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-red-500 text-2xl font-black">!</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">로그인 실패</h2>
                        <p className="text-gray-500 mb-6">{error}</p>
                        <button
                            onClick={() => router.push('/mypage/login')}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                        >
                            로그인 페이지로 돌아가기
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="mx-auto flex justify-center items-center mb-6">
                            <Loader2 size={48} className="text-indigo-600 animate-spin" />
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-2">로그인 처리 중</h1>
                        <p className="text-gray-500 font-medium">
                            카카오 계정으로 인증하고 있습니다.<br />잠시만 기다려주세요...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
