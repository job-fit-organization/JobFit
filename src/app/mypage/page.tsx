'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

import { Header } from './_components/common';
import { LoggedInView } from './_components/LoggedInView';

const STYLES = {
    layout: "min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 overflow-x-hidden",
    loadingView: "min-h-screen bg-gray-50 flex justify-center items-center",
    spinner: "animate-spin rounded-full h-12 w-12 border-b-2 border-main-1",
    floatingNav: "fixed top-4 right-4 z-50",
    navCard: "flex items-center gap-3 bg-white/50 backdrop-blur-md p-1.5 rounded-full shadow-sm border border-gray-100",
    withdrawBtn: "text-xs font-bold text-gray-500 hover:text-main-1 transition-colors ml-2 mr-1 underline underline-offset-4 decoration-gray-300 hover:decoration-main-1/50",
    logoutBtn: "flex items-center gap-2 bg-gradient-to-r from-main-1 to-main-2 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 text-sm",
    contentWrapper: "w-full max-w-5xl space-y-8"
};

export default function MyPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
            try {
                const userObj = JSON.parse(userStr);
                setCurrentUser(userObj);
                setIsLoggedIn(true);
            } catch (e) {
                console.error("유저 정보 파싱 오류", e);
                router.push('/login');
            }
        } else {
            router.push('/login');
        }
        
        setIsCheckingAuth(false);
    }, [router]);

    const handleLogout = () => {
        if (window.confirm("로그아웃 하시겠습니까?")) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            setCurrentUser(null);
            setIsLoggedIn(false);
            router.push('/');
        }
    };

    const handleWithdraw = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        if (!window.confirm("정말 회원 탈퇴를 진행하시겠습니까?\n(이 작업은 되돌릴 수 없으며, 모든 데이터가 삭제됩니다.)")) {
            return;
        }

        try {
            const res = await fetch("http://localhost:8000/api/accounts/withdraw/", {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.ok) {
                alert("회원 탈퇴가 안전하게 처리되었습니다. 이용해 주셔서 감사합니다.");
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                setCurrentUser(null);
                setIsLoggedIn(false);
                router.push('/');
            } else {
                const errorData = await res.json();
                alert(`탈퇴 실패: ${errorData.error || '접근 권한이 없거나 서버 오류입니다.'}`);
            }
        } catch (error) {
            console.error("회원 탈퇴 중 오류 발생", error);
            alert("탈퇴 요청 중 에러가 발생했습니다.");
        }
    };

    if (isCheckingAuth) {
        return (
            <div className={STYLES.loadingView}>
                <div className={STYLES.spinner}></div>
            </div>
        );
    }

    if (!isLoggedIn) {
        return null;
    }

    return (
        <div className={STYLES.layout}>
            <div className={STYLES.floatingNav}>
                <div className={STYLES.navCard}>
                    <button onClick={handleWithdraw} className={STYLES.withdrawBtn}>
                        회원 탈퇴
                    </button>
                    <button onClick={handleLogout} className={STYLES.logoutBtn}>
                        <LogOut size={16} /> 로그아웃
                    </button>
                </div>
            </div>

            <div className={STYLES.contentWrapper}>
                <Header title="마이페이지" subtitle="내 학습 정보와 테스트 결과를 확인하세요." />
                <LoggedInView currentUser={currentUser} />
            </div>
        </div>
    );
}
