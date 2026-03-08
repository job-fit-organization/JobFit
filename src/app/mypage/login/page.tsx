'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Github, Chrome, MessageCircle, Mail } from 'lucide-react';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 relative overflow-hidden">

                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-50 rounded-full -ml-16 -mb-16 blur-3xl opacity-50"></div>

                <Link
                    href="/mypage"
                    className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors mb-8 group"
                >
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    돌아가기
                </Link>

                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg rotate-3">
                        <Zap size={32} fill="currentColor" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">로그인</h1>
                    <p className="text-gray-500 mt-2 font-medium">JobFit과 함께 학습을 시작해보세요</p>
                </div>

                <div className="space-y-4">
                    <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 py-3.5 rounded-xl font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-[0.98]">
                        <Chrome size={20} className="text-red-500" />
                        Google로 시작하기
                    </button>

                    <Link href={`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}`}
                        className="w-full flex items-center justify-center gap-3 bg-[#FEE500] py-3.5 rounded-xl font-bold text-[#191919] hover:bg-[#FADA0A] transition-all shadow-sm active:scale-[0.98]">
                        <div className="w-5 h-5 bg-[#191919] rounded-full flex items-center justify-center">
                            <span className="text-[10px] text-[#FEE500] font-black">K</span>
                        </div>
                        카카오로 시작하기
                    </Link>

                    <button className="w-full flex items-center justify-center gap-3 bg-[#03C75A] py-3.5 rounded-xl font-bold text-white hover:bg-[#02b351] transition-all shadow-sm active:scale-[0.98]">
                        <span className="text-lg font-black mr-1">N</span>
                        네이버로 시작하기
                    </button>

                    <button className="w-full flex items-center justify-center gap-3 bg-[#24292F] py-3.5 rounded-xl font-bold text-white hover:bg-[#1c2126] transition-all shadow-sm active:scale-[0.98]">
                        <Github size={20} />
                        GitHub으로 시작하기
                    </button>
                </div>

                <div className="mt-10 text-center">
                    <p className="text-xs text-gray-400 leading-relaxed">
                        계속 진행하면 JobFit의 <span className="underline cursor-pointer hover:text-gray-600">이용약관</span> 및 <br />
                        <span className="underline cursor-pointer hover:text-gray-600">개인정보처리방침</span>에 동의하게 됩니다.
                    </p>
                </div>
            </div>

            <p className="mt-8 text-sm font-black text-gray-300 tracking-[0.2em] uppercase">
                JobFit Organization
            </p>
        </div>
    );
}

function Zap({ size, fill }: { size: number, fill: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={fill} />
        </svg>
    )
}
