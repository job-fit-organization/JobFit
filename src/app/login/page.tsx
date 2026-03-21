'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Github, Chrome, Zap, Loader2 } from 'lucide-react';

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
    demoBtn: "bg-serve-3/10 border border-serve-3/20 text-serve-3 hover:bg-serve-3/20 hover:border-serve-3/30 disabled:opacity-50",
    loadingOverlay: "absolute inset-0 z-50 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-3xl animate-in fade-in duration-300",
    footerText: "mt-10 text-center relative z-10",
    footerLinks: "text-xs text-gray-400 leading-relaxed",
    linkText: "underline cursor-pointer hover:text-main-2",
    orgText: "mt-8 text-sm font-black text-gray-300 tracking-[0.2em] uppercase"
};

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // 소셜 로그인 도입 전 사용할 테스트 계정 자동 로그인 처리
    const handleTestLogin = async () => {
        setIsLoading(true);
        try {
            let success = false;
            let currentN = Math.floor(Math.random() * 999) + 1; // 1~999 사이 랜덤 시작
            let attempts = 0;

            // 최대 20번 시도 (사용 가능한 슬롯을 찾을 때까지)
            while (!success && attempts < 20) {
                const email = `demo${currentN}@jobfit.com`;
                const password = `password123`;
                const name = `데모 유저 ${currentN}`;

                // 1. 가입 시도
                const regRes = await fetch('http://localhost:8000/api/register/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });

                // 가입 성공(201) 혹은 이미 있을 경우 가입 실패(400)할 수도 있음
                // 하지만 우리는 "새로 만드는 것"이 목적이므로 가입 성공 시만 진행
                if (regRes.ok) {
                    // 가입 성공 -> 로그인 시도
                    const loginRes = await fetch('http://localhost:8000/api/login/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username: email, password })
                    });

                    if (loginRes.ok) {
                        const data = await loginRes.json();
                        const userData = {
                            id: data.user_id || currentN,
                            username: email,
                            nickname: name,
                            email: email
                        };
                        localStorage.setItem('access_token', data.token);
                        localStorage.setItem('user', JSON.stringify(userData));

                        // 2. 가짜 데이터 시딩 (마이페이지 풍성하게 보이게 하기)
                        await fetch('http://localhost:8000/api/seed-demo-data/', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${data.token}`
                            }
                        });

                        success = true;
                    }
                } else {
                    // 가입 실패 시 다음 번호 시도
                    currentN = (currentN % 999) + 1;
                    attempts++;
                }
            }

            if (success) {
                alert("성공적으로 데모 계정이 생성되었습니다.");
                router.push('/mypage');
            } else {
                alert("데모 계정 생성에 실패했습니다 (모든 슬롯이 차있거나 서버 오류).");
            }
        } catch (e) {
            console.error("Login Error:", e);
            alert("서버 연결에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
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
                        {/* 로고 이미지 수정 필요.*/}
                        <Zap size={32} fill="currentColor" />
                    </div>
                    <h1 className={STYLES.title}>로그인</h1>
                    <p className={STYLES.subtitle}>JobFit과 함께 학습을 시작하세요</p>
                </div>

                <div className={STYLES.buttonsWrapper}>
                    <button className={`${STYLES.baseBtn} ${STYLES.googleBtn}`}>
                        {/* 구글 이미지 수정 필요. 기능 미구현*/}
                        <Chrome size={20} className="text-serve-4" />
                        Google로 시작하기
                    </button>

                    {/* 카카오 OAuth 인증 시작 링크 */}
                    {/* 구현이후 장고 연결후 오류생김 수정 필요. */}
                    <Link href={`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}`}
                        className={`${STYLES.baseBtn} ${STYLES.kakaoBtn}`}>
                        <div className="w-5 h-5 bg-[#191919] rounded-full flex items-center justify-center">
                            <span className="text-[10px] text-[#FEE500] font-black">K</span>
                        </div>
                        카카오로 시작하기
                    </Link>

                    <button className={`${STYLES.baseBtn} ${STYLES.naverBtn}`}>
                        {/*기능 미구현*/}
                        <span className="text-lg font-black mr-1">N</span>
                        네이버로 시작하기
                    </button>

                    <button className={`${STYLES.baseBtn} ${STYLES.githubBtn}`}>
                        {/*기능 미구현*/}
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

                    <button
                        onClick={handleTestLogin}
                        className={`${STYLES.baseBtn} ${STYLES.demoBtn}`}
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={18} fill="currentColor" />}
                        {isLoading ? "생성 중..." : "⚡ 데모 계정 로그인"}
                    </button>
                </div>

                {isLoading && (
                    <div className={STYLES.loadingOverlay}>
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="w-10 h-10 text-main-1 animate-spin" />
                            <p className="text-sm font-bold text-gray-500">데모 유저를 구성하고 있습니다...</p>
                        </div>
                    </div>
                )}
                {/*이용약관 부분 추가 필요 ★★★*/}
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
