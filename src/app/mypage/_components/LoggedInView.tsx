'use client';

import React, { useState, useEffect } from 'react';
import { User, CalendarDays, Award, BookOpen, Briefcase } from 'lucide-react';

import RankAnimation from '../RankAnimation';
import { INITIAL_PROFILE, INITIAL_JOB_RECOMMENDATION, INITIAL_OVERALL_STATISTICS } from '../data';
import { UserProfile, TestResult } from '../types';
import { LevelBadge, ExpBar, ScoreCard } from './common';
import { TestHistorySection } from './TestHistorySection';
import { JobReport } from './JobReport';
import { StatsSection } from './StatsSection';

export const LoggedInView = ({ currentUser }: { currentUser: any }) => {
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
                console.warn("백엔드 API 서버에 연결할 수 없습니다. 기본 데모 상태를 유지합니다:", error);
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
