'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

const INITIAL_PROFILE: UserProfile = {
    name: '신규 유저',
    email: '-',
    level: 1,
    exp: 0,
    attendanceDays: 0,
    totalTestsTaken: 0,
    averageScore: {
        python: 0,
        mlops: 0,
        llm: 0,
        deepLearning: 0,
    },
};

const INITIAL_JOB_RECOMMENDATION = {
    type: '탐색 중',
    title: '데이터 로딩 중...',
    description: '추천 데이터를 불러오고 있습니다.',
    matchRate: 0,
    recommendedJobs: ['-'],
    traits: ['-'],
};

const INITIAL_OVERALL_STATISTICS = {
    totalParticipants: 0,
    averagePlatformScore: 0,
    popularCategory: '-',
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

const ScoreCard = ({ label, score, color, unit = "점" }: { label: string; score: number; color: string; unit?: string }) => {
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
            <p className={`text-xl font-extrabold text-gray-900 ${colorClasses.split(' ')[2]} transition-colors`}>{score}{unit}</p>
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
            {results.length > 0 && (
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
            )}
        </div>

        {results.length === 0 ? (
            <div className={`text-center py-10 bg-gray-50/50 rounded-xl border border-dashed border-gray-200`}>
                <p className="text-gray-400 text-sm font-bold">아직 기록이 없습니다.</p>
                <p className="text-gray-400 text-xs mt-1">테스트를 진행하여 나만의 스탯을 채워보세요!</p>
            </div>
        ) : (
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
        )}
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

const LoggedInView = ({ currentUser }: { currentUser: any }) => {
    const [learningPage, setLearningPage] = useState(0);
    const [jobPage, setJobPage] = useState(0);
    const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
    const [history, setHistory] = useState<TestResult[]>([]);
    const [recommendation, setRecommendation] = useState(INITIAL_JOB_RECOMMENDATION);
    const [stats, setStats] = useState(INITIAL_OVERALL_STATISTICS);
    const [isLoading, setIsLoading] = useState(true);

    const ITEMS_PER_PAGE = 5;

    useEffect(() => {
        // 실제 로그인된 사용자의 Kakao ID를 사용합니다.
        // 현재 DB에 저장된 user.username (kakao_id)을 사용합니다.
        const userId = currentUser?.username || '1';

        const fetchMyPageData = async () => {
            setIsLoading(true);
            try {
                // 1. 유저 정보 API 호출
                const userRes = await fetch(`http://localhost:8000/api/users/${userId}/`);
                let fetchedProfile = { ...INITIAL_PROFILE };

                if (userRes.ok) {
                    const userData = await userRes.json();
                    fetchedProfile = {
                        ...fetchedProfile,
                        name: currentUser?.nickname || fetchedProfile.name,
                        level: userData.level || fetchedProfile.level,
                        exp: userData.exp || fetchedProfile.exp,
                        averageScore: {
                            python: userData.progress?.python_cnt || 0,
                            mlops: userData.progress?.mlops_cnt || 0,
                            llm: userData.progress?.llm_cnt || 0,
                            deepLearning: userData.progress?.deeplearning_cnt || 0,
                        }
                    };
                }

                // 2. 학습 이력 API 호출
                const learnRes = await fetch(`http://localhost:8000/api/users/${userId}/histories/learning/`);
                let newHistory: TestResult[] = [];

                if (learnRes.ok) {
                    const learnData = await learnRes.json();
                    const parsedLearn = learnData.map((item: any, idx: number) => ({
                        id: `l_${idx}`,
                        date: item.completion_time.split('T')[0],
                        category: item.skill,
                        score: item.score,
                        type: 'learning'
                    }));
                    newHistory = [...newHistory, ...parsedLearn];
                }

                // 3. 직무 테스트 이력 API 호출
                const jobRes = await fetch(`http://localhost:8000/api/users/${userId}/histories/job/`);
                if (jobRes.ok) {
                    const jobData = await jobRes.json();
                    const parsedJob = jobData.map((item: any, idx: number) => ({
                        id: `j_${idx}`,
                        date: item.completion_time.split('T')[0],
                        category: item.test_result,
                        score: item.score,
                        type: 'job'
                    }));
                    newHistory = [...newHistory, ...parsedJob];
                }

                setProfile(fetchedProfile);
                setHistory(newHistory);

                // 4. 직무 추천 리포트 호출
                const recRes = await fetch(`http://localhost:8000/api/users/${userId}/recommendation/`);
                if (recRes.ok) {
                    const recData = await recRes.json();
                    setRecommendation(recData);
                }

                // 5. 전체 플랫폼 통계 호출
                const statsRes = await fetch(`http://localhost:8000/api/users/stats/`);
                if (statsRes.ok) {
                    const statsData = await statsRes.json();
                    setStats(statsData);
                }

            } catch (error) {
                console.error("데이터 불러오기 에러:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyPageData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-32">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

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
                            {profile.name}
                            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">LV.{profile.level}</span>
                            <LevelBadge level={profile.level} />
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">{profile.email}</p>
                    </div>

                    <ExpBar exp={profile.exp} />

                    <div className="flex flex-col gap-4 pt-2">
                        <div className="flex justify-center md:justify-start gap-6">
                            <div className="flex items-center gap-2 text-gray-700">
                                <CalendarDays className="text-indigo-500" size={20} />
                                <span className="font-bold">출석 {profile.attendanceDays}일</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                                <Award className="text-yellow-500" size={20} />
                                <span className="font-bold">분야별 진행 현황</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
                            <ScoreCard label="Python" score={profile.averageScore.python} color="blue" unit="회" />
                            <ScoreCard label="MLops" score={profile.averageScore.mlops} color="emerald" unit="회" />
                            <ScoreCard label="LLM" score={profile.averageScore.llm} color="purple" unit="회" />
                            <ScoreCard label="딥러닝" score={profile.averageScore.deepLearning} color="rose" unit="회" />
                        </div>
                    </div>
                </div>

                <div className="hidden md:block absolute top-6 right-8">
                    <RankAnimation level={profile.level} userName={profile.name} />
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
                <div className="lg:col-span-7 space-y-8">
                    <TestHistorySection
                        title="학습 테스트 기록"
                        icon={BookOpen}
                        results={history.filter(t => t.type === 'learning')}
                        page={learningPage}
                        setPage={setLearningPage}
                        itemsPerPage={ITEMS_PER_PAGE}
                        color="indigo"
                    />
                    <TestHistorySection
                        title="직무 역량 테스트 기록"
                        icon={Briefcase}
                        results={history.filter(t => t.type === 'job')}
                        page={jobPage}
                        setPage={setJobPage}
                        itemsPerPage={ITEMS_PER_PAGE}
                        color="blue"
                    />
                </div>

                <div className="lg:col-span-3 space-y-8">
                    <JobReport data={recommendation} />
                    <StatsSection data={stats} />
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
    const [currentUser, setCurrentUser] = useState<any>(null);
    const router = useRouter();

    // 컴포넌트 마운트 시 localStorage에서 로그인 정보 확인
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
            }
        }
    }, []);

    const toggleLogin = () => {
        if (isLoggedIn) {
            // 로그아웃 처리
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            setCurrentUser(null);
            setIsLoggedIn(false);
        } else {
            setIsLoggedIn(true);
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

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="fixed top-4 right-4 z-50">
                <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md p-1.5 rounded-full shadow-sm border border-gray-100">
                    {isLoggedIn && (
                        <button
                            onClick={handleWithdraw}
                            className="text-xs font-bold text-gray-500 hover:text-red-600 transition-colors ml-2 mr-1 underline underline-offset-4 decoration-gray-300 hover:decoration-red-300"
                        >
                            회원 탈퇴
                        </button>
                    )}
                    <button
                        onClick={toggleLogin}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-all duration-300 active:scale-95 text-sm"
                    >
                        {isLoggedIn ? <><LogOut size={16} /> 로그아웃</> : <><LogIn size={16} /> 로그인하기</>}
                    </button>
                </div>
            </div>

            <div className="w-full max-w-5xl space-y-8">
                <Header title="마이페이지" subtitle="내 학습 정보와 테스트 결과를 확인하세요." />
                {isLoggedIn ? <LoggedInView currentUser={currentUser} /> : <LoggedOutView />}
            </div>
        </div>
    );
}
