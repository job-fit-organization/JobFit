import { UserProfile } from './types';

// API 응답 전 기본 프로필 상태
export const INITIAL_PROFILE: UserProfile = {
    name: "로딩 중",
    level: 1,
    exp: 0,
    email: "loading@jobfit.com",
    attendanceDays: 0,
    averageScore: {
        python: 0,
        mlops: 0,
        llm: 0,
        deepLearning: 0
    }
};

// 추천 데이터가 없을 때 표시할 기본값
export const INITIAL_JOB_RECOMMENDATION = {
    type: "탐색 중",
    matchRate: 0,
    title: "성향에 맞는 맞춤형 직무를 분석하고 있습니다.",
    description: "테스트와 학습을 진행하시면 데이터를 기반으로 추천해 드립니다.",
    recommendedJobs: ["미정", "탐구 중"],
    traits: ["미확인", "테스트 필요"]
};

// 플랫폼 전체 통계 초기값
export const INITIAL_OVERALL_STATISTICS = {
    totalParticipants: 0,
    averagePlatformScore: 0,
    popularCategory: "집계 중"
};
