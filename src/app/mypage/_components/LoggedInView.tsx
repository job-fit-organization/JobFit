'use client';

import React, { useState, useEffect } from 'react';
import { User, CalendarDays, Award, BookOpen, Briefcase } from 'lucide-react';

import RankAnimation from '../RankAnimation';
import { INITIAL_PROFILE, INITIAL_JOB_RECOMMENDATION, INITIAL_OVERALL_STATISTICS } from '../data';
import { UserProfile, TestResult } from '../types';
import { LevelBadge, ExpBar, ScoreCard, ThemeClasses } from './common';
import { TestHistorySection } from './TestHistorySection';
import { JobReport } from './JobReport';
import { StatsSection } from './StatsSection';

// 과목/도메인 별 뱃지 색상 테마 정의
const THEME_PYTHON: ThemeClasses = { text: "text-serve-4", bgLight: "bg-serve-4/10", bgHover: "hover:bg-serve-4/10", borderHover: "hover:border-serve-4/30" };
const THEME_MLOPS: ThemeClasses = { text: "text-serve-2", bgLight: "bg-serve-2/10", bgHover: "hover:bg-serve-2/10", borderHover: "hover:border-serve-2/30" };
const THEME_LLM: ThemeClasses = { text: "text-serve-6", bgLight: "bg-serve-6/10", bgHover: "hover:bg-serve-6/10", borderHover: "hover:border-serve-6/30" };
const THEME_DL: ThemeClasses = { text: "text-main-1", bgLight: "bg-main-1/10", bgHover: "hover:bg-main-1/10", borderHover: "hover:border-main-1/30" };

// 히스토리 리스트 컨테이너 전용 테마
const THEME_LEARNING: ThemeClasses = { text: "text-serve-3", bgLight: "bg-serve-3/10", bgHover: "hover:bg-serve-3/10", borderHover: "hover:border-serve-3/30" };
const THEME_JOB: ThemeClasses = { text: "text-serve-5", bgLight: "bg-serve-5/10", bgHover: "hover:bg-serve-5/10", borderHover: "hover:border-serve-5/30" };

const STYLES = {
    layout: "space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700",
    loadingView: "flex justify-center items-center py-32",
    spinner: "animate-spin rounded-full h-12 w-12 border-b-2 border-main-1",
    
    profileSection: "bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden",
    avatarWrapper: "h-24 w-24 rounded-full bg-gradient-to-br from-main-1 to-main-2 flex items-center justify-center text-white shadow-inner flex-shrink-0",
    
    infoWrapper: "flex-1 space-y-4 text-center md:text-left w-full z-10",
    nameRow: "text-2xl font-bold text-gray-900 flex items-center justify-center md:justify-start flex-wrap gap-2",
    email: "text-gray-500 text-sm mt-1",
    
    statsRow: "flex flex-col gap-4 pt-2",
    statsHeaderRow: "flex justify-center md:justify-start gap-6",
    statsHeaderItem: "flex items-center gap-2 text-gray-700",
    statsHighlight: "font-bold",
    
    scoresGrid: "grid grid-cols-2 md:grid-cols-4 gap-3 w-full",
    rankWrapper: "hidden md:block absolute top-6 right-8",
    
    // 7:3 비율의 하단 데이터 대시보드 그리드 처리
    bentoGrid: "grid grid-cols-1 lg:grid-cols-10 gap-8",
    bentoLeft: "lg:col-span-7 space-y-8",
    bentoRight: "lg:col-span-3 space-y-8"
};

// 로그인 확인 유저 전용 메인 대시보드
export const LoggedInView = ({ currentUser }: { currentUser: any }) => {
    // API 데이터 스탯, 페이지네이션 셋팅
    const [learningPage, setLearningPage] = useState(0);
    const [jobPage, setJobPage] = useState(0);
    const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
    const [history, setHistory] = useState<TestResult[]>([]);
    const [recommendation, setRecommendation] = useState(INITIAL_JOB_RECOMMENDATION);
    const [stats, setStats] = useState(INITIAL_OVERALL_STATISTICS);
    const [isLoading, setIsLoading] = useState(true);

    const ITEMS_PER_PAGE = 5;

    useEffect(() => {
        const userId = currentUser?.username || '1'; // 현재 세션 ID

        // 대시보드 로드(Mount) 시 필요한 초기 데이터 일괄 fetch
        const fetchMyPageData = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('access_token');
                const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};

                // 1. 유저 프로필 조회 (닉네임, Exp 점수 갱신용)
                const userRes = await fetch(`http://localhost:8000/api/users/${userId}/`, { headers });
                let fetchedProfile = { ...INITIAL_PROFILE };

                if (userRes.ok) {
                    const userData = await userRes.json();
                    fetchedProfile = {
                        ...fetchedProfile,
                        name: userData.name || currentUser?.nickname || fetchedProfile.name,
                        email: userData.email || currentUser?.email || fetchedProfile.email,
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

                // 2. 모의고사 이력 (type: learning) 조회
                const learnRes = await fetch(`http://localhost:8000/user/mypage/quiz-history/`, { headers });
                let newHistory: TestResult[] = [];

                if (learnRes.ok) {
                    const learnData = await learnRes.json();
                    const parsedLearn = learnData.map((item: any) => ({
                        id: `l_${item.attempt_id}`,
                        date: item.created_at.split('T')[0],
                        category: item.learning_name,
                        score: item.total > 0 ? Math.round((item.score / item.total) * 100) : 0,
                        type: 'learning'
                    }));
                    newHistory = [...newHistory, ...parsedLearn];
                }

                // 3. 직무 테스트 이력 (type: job) 조회
                const jobRes = await fetch(`http://localhost:8000/user/mypage/job-test-history/`, { headers });
                if (jobRes.ok) {
                    const jobData = await jobRes.json();
                    const parsedJob = jobData.map((item: any) => ({
                        id: `j_${item.attempt_id}`,
                        date: item.created_at.split('T')[0],
                        category: item.recommended_job_name,
                        score: 100, // 직무 테스트는 점수가 없으므로 기본값 100 설정
                        type: 'job'
                    }));
                    newHistory = [...newHistory, ...parsedJob];
                }

                setProfile(fetchedProfile);
                setHistory(newHistory);

                // 4. 직무 추천 분석 리포트 연동
                const recRes = await fetch(`http://localhost:8000/api/users/${userId}/recommendation/`, { headers });
                if (recRes.ok) {
                    const recData = await recRes.json();
                    setRecommendation(recData);
                }

                // 5. 전체 플랫폼 통계 데이터
                const statsRes = await fetch(`http://localhost:8000/api/users/stats/`, { headers });
                if (statsRes.ok) {
                    const statsData = await statsRes.json();
                    setStats(statsData);
                }

            } catch (error) {
                // 테스트 시나리오 등 API 연동 실패 시 데모 기본값(Initial Data) 유지
                console.warn("[API_ERROR] 백엔드 연결이 원활하지 않아 데모용 Mock Data로 렌더링을 시도합니다.", error);
            } finally {
                setIsLoading(false); // API 패치 종료 후 스피너 해제
            }
        };

        fetchMyPageData();
    }, [currentUser]);

    if (isLoading) {
        return (
            <div className={STYLES.loadingView}>
                <div className={STYLES.spinner}></div>
            </div>
        );
    }

    return (
        <div className={STYLES.layout}>
            {/* 상단 1단: 프로필 + Exp + 스킬상태 미니 보드 */}
            <section className={STYLES.profileSection}>
                <div className={STYLES.avatarWrapper}>
                    <User size={48} />
                </div>

                <div className={STYLES.infoWrapper}>
                    <div>
                        <h2 className={STYLES.nameRow}>
                            {profile.name}
                            <LevelBadge level={profile.level} />
                        </h2>
                        <p className={STYLES.email}>{profile.email}</p>
                    </div>

                    <ExpBar exp={profile.exp} />

                    <div className={STYLES.statsRow}>
                        <div className={STYLES.statsHeaderRow}>
                            <div className={STYLES.statsHeaderItem}>
                                <CalendarDays className="text-main-1" size={20} />
                                <span className={STYLES.statsHighlight}>출석 {profile.attendanceDays}일</span>
                            </div>
                            <div className={STYLES.statsHeaderItem}>
                                <Award className="text-serve-1" size={20} />
                                <span className={STYLES.statsHighlight}>분야별 진행 현황</span>
                            </div>
                        </div>

                        <div className={STYLES.scoresGrid}>
                            <ScoreCard label="Python" score={profile.averageScore.python} theme={THEME_PYTHON} unit="회" />
                            <ScoreCard label="MLops" score={profile.averageScore.mlops} theme={THEME_MLOPS} unit="회" />
                            <ScoreCard label="LLM" score={profile.averageScore.llm} theme={THEME_LLM} unit="회" />
                            <ScoreCard label="딥러닝" score={profile.averageScore.deepLearning} theme={THEME_DL} unit="회" />
                        </div>
                    </div>
                </div>

                <div className={STYLES.rankWrapper}>
                    <RankAnimation level={profile.level} userName={profile.name} />
                </div>
            </section>

            {/* 하단 분할 단락 (좌측 70% 리스트 뷰, 우측 30% 분석 리포트) */}
            <div className={STYLES.bentoGrid}>
                {/* 좌측 패널 (테스트 히스토리 모음) */}
                <div className={STYLES.bentoLeft}>
                    <TestHistorySection
                        title="학습 테스트 기록"
                        icon={BookOpen}
                        results={history.filter(t => t.type === 'learning')}
                        page={learningPage}
                        setPage={setLearningPage}
                        itemsPerPage={ITEMS_PER_PAGE}
                        theme={THEME_LEARNING}
                    />
                    <TestHistorySection
                        title="직무 역량 테스트 기록"
                        icon={Briefcase}
                        results={history.filter(t => t.type === 'job')}
                        page={jobPage}
                        setPage={setJobPage}
                        itemsPerPage={ITEMS_PER_PAGE}
                        theme={THEME_JOB}
                    />
                </div>

                {/* 우측 패널 (직무 추천 + 플랫폼 전체 스탯 보드) */}
                <div className={STYLES.bentoRight}>
                    <JobReport data={recommendation} />
                    <StatsSection data={stats} />
                </div>
            </div>
        </div>
    );
};
