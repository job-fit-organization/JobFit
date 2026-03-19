'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Github, Chrome, Zap } from 'lucide-react';

const STYLES = {
    container: "min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4",
    card: "w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 relative overflow-hidden",
    bgBlur1: "absolute top-0 right-0 w-40 h-40 bg-main-1/10 rounded-full -mr-16 -mt-16 blur-3xl opacity-60",
    bgBlur2: "absolute bottom-0 left-0 w-40 h-40 bg-serve-4/10 rounded-full -ml-16 -mb-16 blur-3xl opacity-60",
    backLink: "inline-flex items-center text-sm font-bold text-gray-500 hover:text-main-1 transition-colors mb-8 group relative z-10",
    headerContainer: "text-center mb-10 relative z-10",
    iconWrapper: "w-16 h-16 bg-gradient-to-br from-main-1 to-main-2 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg rotate-3 transition-transform hover:rotate-6",
    title: "text-3xl font-black text-gray-900 tracking-tight",
    subtitle: "text-gray-500 mt-2 font-medium",
    buttonsWrapper: "space-y-4 relative z-10",
    baseBtn: "w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-bold transition-all shadow-sm active:scale-[0.98]",
    googleBtn: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-main-1/30",
    kakaoBtn: "bg-[#FEE500] text-[#191919] hover:bg-[#FCE51E]",
    naverBtn: "bg-[#03C75A] text-white hover:bg-[#02b351]",
    githubBtn: "bg-[#24292F] text-white hover:bg-[#1c2126]",
    dividerWrapper: "relative py-4",
    dividerLine: "w-full border-t border-gray-200",
    dividerText: "bg-white px-3 text-xs font-semibold text-gray-400 uppercase tracking-widest",
    demoBtn: "bg-serve-3/10 border border-serve-3/20 text-serve-3 hover:bg-serve-3/20 hover:border-serve-3/30",
    footerText: "mt-10 text-center relative z-10",
    footerLinks: "text-xs text-gray-400 leading-relaxed",
    linkText: "underline cursor-pointer hover:text-main-2",
    orgText: "mt-8 text-sm font-black text-gray-300 tracking-[0.2em] uppercase"
};

export default function LoginPage() {
    const router = useRouter();

    // 소셜 로그인 도입 전 사용할 테스트 계정 자동 로그인 처리
    const handleTestLogin = () => {
        const dummyUser = {
            id: 1, 
            username: "1", 
            nickname: "데모 유저",
            email: "demo@jobfit.com"
        };
        
        // localStorage에 임시 토큰 셋업
        localStorage.setItem('access_token', 'demo_test_token_12345');
        localStorage.setItem('refresh_token', 'demo_refresh_token_67890');
        localStorage.setItem('user', JSON.stringify(dummyUser));
        
        alert("데모 계정으로 로그인되었습니다.");
        router.push('/mypage');
        router.refresh();
    };

    return (
        <div className={STYLES.container}>
            <div className={STYLES.card}>
                {/* 배경 블러 효과 */}
                <div className={STYLES.bgBlur1}></div>
                <div className={STYLES.bgBlur2}></div>

                <Link href="/" className={STYLES.backLink}>
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    홈으로 이동
                </Link>

                <div className={STYLES.headerContainer}>
                    <div className={STYLES.iconWrapper}>
                        <Zap size={32} fill="currentColor" />
                    </div>
                    <h1 className={STYLES.title}>로그인</h1>
                    <p className={STYLES.subtitle}>JobFit과 함께 학습을 시작하세요</p>
                </div>

                <div className={STYLES.buttonsWrapper}>
                    <button className={`${STYLES.baseBtn} ${STYLES.googleBtn}`}>
                        <Chrome size={20} className="text-serve-4" />
                        Google로 시작하기
                    </button>

                    {/* 카카오 OAuth 인증 시작 링크 */}
                    <Link href={`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}`}
                        className={`${STYLES.baseBtn} ${STYLES.kakaoBtn}`}>
                        <div className="w-5 h-5 bg-[#191919] rounded-full flex items-center justify-center">
                            <span className="text-[10px] text-[#FEE500] font-black">K</span>
                        </div>
                        카카오로 시작하기
                    </Link>

                    <button className={`${STYLES.baseBtn} ${STYLES.naverBtn}`}>
                        <span className="text-lg font-black mr-1">N</span>
                        네이버로 시작하기
                    </button>

                    <button className={`${STYLES.baseBtn} ${STYLES.githubBtn}`}>
                        <Github size={20} />
                        GitHub으로 시작하기
                    </button>

                    <div className={STYLES.dividerWrapper}>
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className={STYLES.dividerLine} />
                        </div>
                        <div className="relative flex justify-center">
                            <span className={STYLES.dividerText}>or</span>
                        </div>
                    </div>

                    <button onClick={handleTestLogin} className={`${STYLES.baseBtn} ${STYLES.demoBtn}`}>
                        ⚡ 데모 계정 로그인
                    </button>
                </div>

                <div className={STYLES.footerText}>
                    <p className={STYLES.footerLinks}>
                        계속 진행하면 <span className={STYLES.linkText}>이용약관</span> 및 <br />
                        <span className={STYLES.linkText}>개인정보처리방침</span>에 동의하게 됩니다.
                    </p>
                </div>
            </div>

            <p className={STYLES.orgText}>JobFit Organization</p>
        </div>
    );
}
