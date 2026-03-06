'use client';

import React, { useState } from 'react';
import { User, LogIn, LogOut, CheckCircle, BarChart3, TrendingUp, CalendarDays, Award, ChevronDown, Shield, Medal, Trophy, Crown, Star } from 'lucide-react';

// --- Mock Data & Types ---
type UserProfile = {
    name: string;
    email: string;
    level: number;
    exp: number; // 0 to 100
    attendanceDays: number;
    totalTestsTaken: number;
    averageScore: {
        python: number;
        mlops: number;
        llm: number;
        deepLearning: number;
    };
};

type TestResult = {
    id: string;
    date: string;
    category: string;
    score: number;
};

const MOCK_USER_PROFILE: UserProfile = {
    name: '김잡핏',
    email: 'jobfit@example.com',
    level: 15,
    exp: 65,
    attendanceDays: 12,
    totalTestsTaken: 8,
    averageScore: {
        python: 85,
        mlops: 78,
        llm: 92,
        deepLearning: 88,
    },
};

const MOCK_TEST_HISTORY: TestResult[] = [
    { id: '1', date: '2024-03-05', category: '프론트엔드 개발자', score: 85 },
    { id: '2', date: '2024-03-01', category: '백엔드 개발자', score: 78 },
    { id: '3', date: '2024-02-25', category: 'UI/UX 디자이너', score: 92 },
    { id: '4', date: '2024-02-20', category: '데이터 분석가', score: 88 },
    { id: '5', date: '2024-02-15', category: '프론트엔드 개발자', score: 71 },
    { id: '6', date: '2024-02-10', category: '마케터', score: 65 },
    { id: '7', date: '2024-02-05', category: '기획자', score: 80 },
    { id: '8', date: '2024-01-28', category: '풀스택 개발자', score: 95 },
    { id: '9', date: '2024-01-20', category: 'DevOps 엔지니어', score: 75 },
    { id: '10', date: '2024-01-15', category: '보안 전문가', score: 82 },
];

const OVERALL_STATISTICS = {
    totalParticipants: 12543,
    averagePlatformScore: 76.5,
    popularCategory: '백엔드 개발자',
};
// -------------------------

export default function MyPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [visibleTestCount, setVisibleTestCount] = useState(5);

    // Toggle for demonstration purposes
    const toggleLogin = () => setIsLoggedIn(!isLoggedIn);

    const handleShowMore = () => {
        setVisibleTestCount(prev => prev + 5);
    };

    // Helper to get badge based on level
    const getLevelBadge = (level: number) => {
        if (level < 4) return { icon: <Star size={20} className="text-amber-700" />, label: '브론즈', bgColor: 'bg-amber-100', textColor: 'text-amber-800' };
        if (level < 7) return { icon: <Shield size={20} className="text-gray-500" />, label: '실버', bgColor: 'bg-gray-200', textColor: 'text-gray-700' };
        if (level < 10) return { icon: <Medal size={20} className="text-yellow-600" />, label: '골드', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' };
        if (level < 15) return { icon: <Trophy size={20} className="text-emerald-500" />, label: '플래티넘', bgColor: 'bg-emerald-100', textColor: 'text-emerald-800' };
        return { icon: <Crown size={20} className="text-purple-500" />, label: '다이아몬드', bgColor: 'bg-purple-100', textColor: 'text-purple-800' };
    };

    // Helper to get category badge based on score
    const getCategoryBadge = (score: number) => {
        if (score >= 90) return { label: 'S', colorClass: 'bg-pink-100 text-pink-700 border-pink-200' };
        if (score >= 80) return { label: 'A', colorClass: 'bg-blue-100 text-blue-700 border-blue-200' };
        if (score >= 70) return { label: 'B', colorClass: 'bg-green-100 text-green-700 border-green-200' };
        if (score >= 60) return { label: 'C', colorClass: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
        return { label: 'D', colorClass: 'bg-gray-100 text-gray-700 border-gray-200' };
    };

    const levelBadge = getLevelBadge(MOCK_USER_PROFILE.level);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            {/* Test Toggle Button */}
            <div className="fixed top-4 right-4 z-50">
                <button
                    onClick={toggleLogin}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition-all duration-300"
                >
                    {isLoggedIn ? (
                        <><LogOut size={18} /> 로그아웃 테스트</>
                    ) : (
                        <><LogIn size={18} /> 로그인 테스트</>
                    )}
                </button>
            </div>

            <div className="w-full max-w-5xl space-y-8">
                {/* Header */}
                <header className="text-center md:text-left mb-10">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">마이페이지</h1>
                    <p className="mt-2 text-gray-500">내 학습 정보와 테스트 결과를 확인하세요.</p>
                </header>

                {isLoggedIn ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* --- 1. Profile & Level/Attendance Section --- */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
                            {/* Avatar */}
                            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-inner flex-shrink-0">
                                <User size={48} />
                            </div>

                            {/* Info */}
                            <div className="flex-1 space-y-4 text-center md:text-left w-full">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 flex items-center flex-wrap gap-2">
                                        {MOCK_USER_PROFILE.name}
                                        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">LV.{MOCK_USER_PROFILE.level}</span>
                                        <span className={`flex items-center gap-1 text-sm font-bold px-3 py-1 rounded-full ${levelBadge.bgColor} ${levelBadge.textColor}`}>
                                            {levelBadge.icon} {levelBadge.label}
                                        </span>
                                    </h2>
                                    <p className="text-gray-500 text-sm mt-1">{MOCK_USER_PROFILE.email}</p>
                                </div>

                                {/* EXP Bar */}
                                <div className="w-full max-w-md mx-auto md:mx-0">
                                    <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                                        <span>경험치 (EXP)</span>
                                        <span>{MOCK_USER_PROFILE.exp} / 100</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-indigo-500 h-3 rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${MOCK_USER_PROFILE.exp}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Attendance & Quick Stats */}
                                <div className="flex flex-col gap-4 pt-2">
                                    <div className="flex justify-center md:justify-start gap-6">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <CalendarDays className="text-indigo-500" size={20} />
                                            <span className="font-medium">출석 {MOCK_USER_PROFILE.attendanceDays}일</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <Award className="text-yellow-500" size={20} />
                                            <span className="font-medium">분야별 평균 점수</span>
                                        </div>
                                    </div>

                                    {/* Detailed Scores */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
                                        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm transition-all hover:border-blue-300 hover:shadow-md relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-2">
                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-bl-lg border-b border-l absolute top-0 right-0 ${getCategoryBadge(MOCK_USER_PROFILE.averageScore.python).colorClass}`}>
                                                    Class {getCategoryBadge(MOCK_USER_PROFILE.averageScore.python).label}
                                                </span>
                                            </div>
                                            <p className="text-xs text-blue-600 font-bold mb-1 mt-2">Python</p>
                                            <p className="text-xl font-extrabold text-gray-900 group-hover:text-blue-700 transition-colors">{MOCK_USER_PROFILE.averageScore.python}점</p>
                                        </div>
                                        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm transition-all hover:border-emerald-300 hover:shadow-md relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-2">
                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-bl-lg border-b border-l absolute top-0 right-0 ${getCategoryBadge(MOCK_USER_PROFILE.averageScore.mlops).colorClass}`}>
                                                    Class {getCategoryBadge(MOCK_USER_PROFILE.averageScore.mlops).label}
                                                </span>
                                            </div>
                                            <p className="text-xs text-emerald-600 font-bold mb-1 mt-2">MLops</p>
                                            <p className="text-xl font-extrabold text-gray-900 group-hover:text-emerald-700 transition-colors">{MOCK_USER_PROFILE.averageScore.mlops}점</p>
                                        </div>
                                        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm transition-all hover:border-purple-300 hover:shadow-md relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-2">
                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-bl-lg border-b border-l absolute top-0 right-0 ${getCategoryBadge(MOCK_USER_PROFILE.averageScore.llm).colorClass}`}>
                                                    Class {getCategoryBadge(MOCK_USER_PROFILE.averageScore.llm).label}
                                                </span>
                                            </div>
                                            <p className="text-xs text-purple-600 font-bold mb-1 mt-2">LLM</p>
                                            <p className="text-xl font-extrabold text-gray-900 group-hover:text-purple-700 transition-colors">{MOCK_USER_PROFILE.averageScore.llm}점</p>
                                        </div>
                                        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm transition-all hover:border-rose-300 hover:shadow-md relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-2">
                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-bl-lg border-b border-l absolute top-0 right-0 ${getCategoryBadge(MOCK_USER_PROFILE.averageScore.deepLearning).colorClass}`}>
                                                    Class {getCategoryBadge(MOCK_USER_PROFILE.averageScore.deepLearning).label}
                                                </span>
                                            </div>
                                            <p className="text-xs text-rose-600 font-bold mb-1 mt-2">딥러닝</p>
                                            <p className="text-xl font-extrabold text-gray-900 group-hover:text-rose-700 transition-colors">{MOCK_USER_PROFILE.averageScore.deepLearning}점</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* --- 2. Test Result History --- */}
                            <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                        <CheckCircle className="text-indigo-600" size={24} />
                                        내 테스트 기록
                                    </h3>
                                </div>

                                <div className="space-y-4">
                                    {MOCK_TEST_HISTORY.slice(0, visibleTestCount).map((result) => (
                                        <div key={result.id} className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition-colors">
                                            <div>
                                                <p className="font-semibold text-gray-900 group-hover:text-indigo-900">{result.category}</p>
                                                <p className="text-sm text-gray-500">{result.date}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${result.score >= 80 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                    {result.score}점
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Show More Button */}
                                {visibleTestCount < MOCK_TEST_HISTORY.length && (
                                    <button
                                        onClick={handleShowMore}
                                        className="w-full mt-6 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
                                    >
                                        더보기 <ChevronDown size={18} />
                                    </button>
                                )}
                            </section>

                            {/* --- 3. Overall Statistics --- */}
                            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <TrendingUp className="text-indigo-600" size={24} />
                                    전체 통계
                                </h3>

                                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-5 text-white shadow-md relative overflow-hidden">
                                    <BarChart3 className="absolute -bottom-4 -right-4 text-white/10" size={100} />
                                    <p className="text-gray-300 text-sm font-medium mb-1">총 참여자 수</p>
                                    <p className="text-3xl font-bold">{OVERALL_STATISTICS.totalParticipants.toLocaleString()}명</p>
                                </div>

                                <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100">
                                    <p className="text-indigo-600 text-sm font-semibold mb-1">플랫폼 평균 점수</p>
                                    <p className="text-2xl font-bold text-indigo-900">{OVERALL_STATISTICS.averagePlatformScore}점</p>
                                </div>

                                <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
                                    <p className="text-purple-600 text-sm font-semibold mb-1">가장 인기있는 직무</p>
                                    <p className="text-lg font-bold text-purple-900">{OVERALL_STATISTICS.popularCategory}</p>
                                </div>
                            </section>
                        </div>
                    </div>
                ) : (
                    /* --- Not Logged In State --- */
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <LogIn className="text-gray-400" size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">로그인이 필요합니다</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            테스트 결과 히스토리, 출석 일수, 경험치 등 맞춤형 통계를 확인하려면 먼저 로그인해주세요.
                        </p>
                        <button
                            onClick={toggleLogin}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
                        >
                            로그인하기
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
