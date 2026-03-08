'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, LogIn, LogOut, BarChart3, TrendingUp, CalendarDays, Award, ChevronLeft, ChevronRight, Shield, Medal, Trophy, Crown, Star, BookOpen, Briefcase, Zap, Target, Sparkles } from 'lucide-react';

import RankAnimation from './RankAnimation';

// --- Types ---
type UserProfile = {
    name: string;
    email: string;
    level: number;
    exp: number;
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
    type: 'learning' | 'job';
};

// --- Mock Data ---
const MOCK_USER_PROFILE: UserProfile = {
    name: '김잡핏',
    email: 'jobfit@example.com',
    level: 15,
    exp: 65,
    attendanceDays: 12,
    totalTestsTaken: 15,
    averageScore: {
        python: 85,
        mlops: 78,
        llm: 92,
        deepLearning: 88,
    },
};

const MOCK_TEST_HISTORY: TestResult[] = [
    { id: 'l1', date: '2024-03-05', category: 'Python 고급 문법', score: 85, type: 'learning' },
    { id: 'l2', date: '2024-03-01', category: 'MLOps 파이프라인 구축', score: 78, type: 'learning' },
    { id: 'l3', date: '2024-02-25', category: 'LLM 프롬프트 엔지니어링', score: 92, type: 'learning' },
    { id: 'l4', date: '2024-02-20', category: '딥러닝 최적화 기법', score: 88, type: 'learning' },
    { id: 'l5', date: '2024-02-15', category: '데이터 전처리 실무', score: 71, type: 'learning' },
    { id: 'j1', date: '2024-03-06', category: '프론트엔드 실무 역량', score: 82, type: 'job' },
    { id: 'j2', date: '2024-03-02', category: '백엔드 시스템 아키텍처', score: 88, type: 'job' },
    { id: 'j3', date: '2024-02-26', category: '데이터 엔지니어링 실무', score: 75, type: 'job' },
    { id: 'j4', date: '2024-02-18', category: 'AI 모델 배포 실무', score: 90, type: 'job' },
    { id: 'j5', date: '2024-02-10', category: '클라우드 인프라 활용', score: 68, type: 'job' },
];

const JOB_RECOMMENDATION = {
    type: 'AI BackEnd',
    title: '철저한 계획가형 백엔드 엔지니어',
    description: '안정적인 시스템 설계와 꼼꼼한 코드 리뷰에 탁월한 재능을 보이시네요. 데이터의 정합성을 중요시하는 대규모 트래픽 처리 백엔드 직무를 추천합니다.',
    matchRate: 98,
    recommendedJobs: ['백엔드 엔지니어', '클라우드 아키텍트', 'DBA'],
    traits: ['분석적', '체계적', '책임감'],
};

const OVERALL_STATISTICS = {
    totalParticipants: 12543,
    averagePlatformScore: 76.5,
    popularCategory: '백엔드 개발자',
};

// --- Sub-Components ---

const Header = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <header className="text-center md:text-left mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{title}</h1>
        <p className="mt-2 text-gray-500">{subtitle}</p>
    </header>
);

const LevelBadge = ({ level }: { level: number }) => {
    const getBadge = (lvl: number) => {
        if (lvl < 4) return { icon: <Star size={20} className="text-amber-700" />, label: '브론즈', bgColor: 'bg-amber-100', textColor: 'text-amber-800' };
        if (lvl < 7) return { icon: <Shield size={20} className="text-gray-500" />, label: '실버', bgColor: 'bg-gray-200', textColor: 'text-gray-700' };
        if (lvl < 10) return { icon: <Medal size={20} className="text-yellow-600" />, label: '골드', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' };
        if (lvl < 15) return { icon: <Trophy size={20} className="text-emerald-500" />, label: '플래티넘', bgColor: 'bg-emerald-100', textColor: 'text-emerald-800' };
        return { icon: <Crown size={20} className="text-purple-500" />, label: '다이아몬드', bgColor: 'bg-purple-100', textColor: 'text-purple-800' };
    };
    const badge = getBadge(level);
    return (
        <span className={`flex items-center gap-1 text-sm font-bold px-3 py-1 rounded-full ${badge.bgColor} ${badge.textColor}`}>
            {badge.icon} {badge.label}
        </span>
    );
};

const CategoryBadge = ({ score }: { score: number }) => {
    const getBadge = (s: number) => {
        if (s >= 90) return { label: 'S', colorClass: 'bg-pink-100 text-pink-700 border-pink-200' };
        if (s >= 80) return { label: 'A', colorClass: 'bg-blue-100 text-blue-700 border-blue-200' };
        if (s >= 70) return { label: 'B', colorClass: 'bg-green-100 text-green-700 border-green-200' };
        if (s >= 60) return { label: 'C', colorClass: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
        return { label: 'D', colorClass: 'bg-gray-100 text-gray-700 border-gray-200' };
    };
    const badge = getBadge(score);
    return (
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-bl-lg border-b border-l absolute top-0 right-0 ${badge.colorClass}`}>
            Class {badge.label}
        </span>
    );
};

const ExpBar = ({ exp }: { exp: number }) => (
    <div className="w-full max-w-sm mx-auto md:mx-0">
        <div className="flex justify-between text-[11px] font-bold text-gray-600 mb-1.5 uppercase tracking-wider">
            <span>경험치 (EXP)</span>
            <span className="text-indigo-600 font-black">{exp} / 100</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 border border-gray-200 shadow-inner">
            <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full transition-all duration-1000 ease-out m-[1px]"
                style={{ width: `calc(${exp}% - 2px)` }}
            ></div>
        </div>
    </div>
);

const ScoreCard = ({ label, score, color }: { label: string; score: number; color: string }) => {
    const colorMap: Record<string, string> = {
        blue: 'hover:border-blue-300 text-blue-600 group-hover:text-blue-700',
        emerald: 'hover:border-emerald-300 text-emerald-600 group-hover:text-emerald-700',
        purple: 'hover:border-purple-300 text-purple-600 group-hover:text-purple-700',
        rose: 'hover:border-rose-300 text-rose-600 group-hover:text-rose-700',
    };
    const colorClasses = colorMap[color] || '';

    return (
        <div className={`bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm transition-all ${colorClasses.split(' ')[0]} hover:shadow-md relative overflow-hidden group`}>
            <div className="absolute top-0 right-0">
                <CategoryBadge score={score} />
            </div>
            <p className={`text-xs font-bold mb-1 mt-2 ${colorClasses.split(' ')[1]}`}>{label}</p>
            <p className={`text-xl font-extrabold text-gray-900 ${colorClasses.split(' ')[2]} transition-colors`}>{score}점</p>
        </div>
    );
};

const TestHistorySection = ({ title, icon: Icon, results, page, setPage, itemsPerPage, color }: any) => (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Icon className={`text-${color}-600`} size={24} />
                {title}
            </h3>
            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-full border border-gray-100">
                <button
                    onClick={() => setPage((prev: number) => Math.max(0, prev - 1))}
                    disabled={page === 0}
                    className="p-1.5 rounded-full hover:bg-white hover:shadow-sm disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronLeft size={18} className="text-gray-600" />
                </button>
                <span className={`text-xs font-black text-${color}-600 w-6 text-center`}>{page + 1}</span>
                <button
                    onClick={() => setPage((prev: number) => prev + 1)}
                    disabled={(page + 1) * itemsPerPage >= results.length}
                    className="p-1.5 rounded-full hover:bg-white hover:shadow-sm disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronRight size={18} className="text-gray-600" />
                </button>
            </div>
        </div>
        <div className="grid grid-cols-1 gap-3">
            {results.slice(page * itemsPerPage, (page + 1) * itemsPerPage).map((result: any) => (
                <div key={result.id} className={`group flex items-center justify-between p-4 rounded-xl border border-gray-50 bg-gray-50/30 hover:border-${color}-100 hover:bg-${color}-50/50 transition-all hover:translate-x-1`}>
                    <div>
                        <p className={`font-bold text-gray-900 group-hover:text-${color}-900`}>{result.category}</p>
                        <p className="text-[11px] font-medium text-gray-400 mt-0.5">{result.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-black shadow-sm bg-white border border-gray-100 ${result.score >= 80 ? 'text-green-600' : 'text-gray-500'}`}>
                        {result.score}점
                    </span>
                </div>
            ))}
        </div>
    </section>
);

const JobReport = ({ data }: { data: typeof JOB_RECOMMENDATION }) => (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6 relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-50 rounded-full blur-2xl opacity-50"></div>
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Zap className="text-amber-500" size={24} />
            직무 추천 리포트
        </h3>

        <div className="text-center py-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-widest opacity-80 mb-1">나의 직매칭 유형</p>
            <p className="text-4xl font-black mb-1">{data.type}</p>
            <p className="text-sm font-bold bg-white/20 inline-block px-3 py-1 rounded-full">{data.matchRate}% 적합</p>
        </div>

        <div className="space-y-3">
            <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <Sparkles size={18} className="text-indigo-500" />
                {data.title}
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">{data.description}</p>
        </div>

        <div className="space-y-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Target size={14} /> 추천 직무 키워드
            </p>
            <div className="flex flex-wrap gap-2">
                {data.recommendedJobs.map((job, idx) => (
                    <span key={idx} className="bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg">#{job}</span>
                ))}
            </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">유형 성향</span>
            </div>
            <div className="flex gap-2">
                {data.traits.map((trait, idx) => (
                    <div key={idx} className="flex-1 text-center p-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-black">{trait}</div>
                ))}
            </div>
        </div>
    </section>
);

const StatsSection = ({ data }: { data: typeof OVERALL_STATISTICS }) => (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className="text-indigo-600" size={24} />
            전체 통계 차트
        </h3>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-5 text-white shadow-md relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
            <BarChart3 className="absolute -bottom-4 -right-4 text-white/10 group-hover:scale-110 transition-transform" size={100} />
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">플랫폼 전체 참여</p>
            <p className="text-3xl font-black">{data.totalParticipants.toLocaleString()}명</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
            <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100 flex items-center justify-between">
                <div>
                    <p className="text-indigo-600 text-[10px] font-black uppercase tracking-wider">평균 점수</p>
                    <p className="text-xl font-black text-indigo-900">{data.averagePlatformScore}점</p>
                </div>
                <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Award size={20} className="text-indigo-600" />
                </div>
            </div>
            <div className="bg-purple-50/50 rounded-xl p-4 border border-purple-100 flex items-center justify-between">
                <div>
                    <p className="text-purple-600 text-[10px] font-black uppercase tracking-wider">인기 직무</p>
                    <p className="text-lg font-black text-purple-900">{data.popularCategory}</p>
                </div>
                <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Target size={20} className="text-purple-600" />
                </div>
            </div>
        </div>
    </section>
);

const LoggedInView = () => {
    const [learningPage, setLearningPage] = useState(0);
    const [jobPage, setJobPage] = useState(0);
    const ITEMS_PER_PAGE = 5;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Profile Section */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-inner flex-shrink-0">
                    <User size={48} />
                </div>

                <div className="flex-1 space-y-4 text-center md:text-left w-full z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center flex-wrap gap-2">
                            {MOCK_USER_PROFILE.name}
                            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">LV.{MOCK_USER_PROFILE.level}</span>
                            <LevelBadge level={MOCK_USER_PROFILE.level} />
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">{MOCK_USER_PROFILE.email}</p>
                    </div>

                    <ExpBar exp={MOCK_USER_PROFILE.exp} />

                    <div className="flex flex-col gap-4 pt-2">
                        <div className="flex justify-center md:justify-start gap-6">
                            <div className="flex items-center gap-2 text-gray-700">
                                <CalendarDays className="text-indigo-500" size={20} />
                                <span className="font-bold">출석 {MOCK_USER_PROFILE.attendanceDays}일</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                                <Award className="text-yellow-500" size={20} />
                                <span className="font-bold">분야별 평균 점수</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
                            <ScoreCard label="Python" score={MOCK_USER_PROFILE.averageScore.python} color="blue" />
                            <ScoreCard label="MLops" score={MOCK_USER_PROFILE.averageScore.mlops} color="emerald" />
                            <ScoreCard label="LLM" score={MOCK_USER_PROFILE.averageScore.llm} color="purple" />
                            <ScoreCard label="딥러닝" score={MOCK_USER_PROFILE.averageScore.deepLearning} color="rose" />
                        </div>
                    </div>
                </div>

                <div className="hidden md:block absolute top-6 right-8">
                    <RankAnimation level={MOCK_USER_PROFILE.level} userName={MOCK_USER_PROFILE.name} />
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
                <div className="lg:col-span-7 space-y-8">
                    <TestHistorySection
                        title="학습 테스트 기록"
                        icon={BookOpen}
                        results={MOCK_TEST_HISTORY.filter(t => t.type === 'learning')}
                        page={learningPage}
                        setPage={setLearningPage}
                        itemsPerPage={ITEMS_PER_PAGE}
                        color="indigo"
                    />
                    <TestHistorySection
                        title="직무 역량 테스트 기록"
                        icon={Briefcase}
                        results={MOCK_TEST_HISTORY.filter(t => t.type === 'job')}
                        page={jobPage}
                        setPage={setJobPage}
                        itemsPerPage={ITEMS_PER_PAGE}
                        color="blue"
                    />
                </div>

                <div className="lg:col-span-3 space-y-8">
                    <JobReport data={JOB_RECOMMENDATION} />
                    <StatsSection data={OVERALL_STATISTICS} />
                </div>
            </div>
        </div>
    );
};

const LoggedOutView = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogIn className="text-gray-400" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">로그인이 필요합니다</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
            테스트 결과 히스토리, 출석 일수, 경험치 등 맞춤형 통계를 확인하려면 먼저 로그인해주세요.
        </p>
        <Link
            href="/mypage/login"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
        >
            로그인하기
        </Link>
    </div>
);

// --- Main Page ---

export default function MyPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const toggleLogin = () => setIsLoggedIn(!isLoggedIn);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="fixed top-4 right-4 z-50">
                <button
                    onClick={toggleLogin}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition-all duration-300 active:scale-95"
                >
                    {isLoggedIn ? <><LogOut size={18} /> 로그아웃 테스트</> : <><LogIn size={18} /> 로그인 테스트</>}
                </button>
            </div>

            <div className="w-full max-w-5xl space-y-8">
                <Header title="마이페이지" subtitle="내 학습 정보와 테스트 결과를 확인하세요." />
                {isLoggedIn ? <LoggedInView /> : <LoggedOutView />}
            </div>
        </div>
    );
}
