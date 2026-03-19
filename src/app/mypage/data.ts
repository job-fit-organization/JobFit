import { UserProfile } from './types';

export const INITIAL_PROFILE: UserProfile = {
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

export const INITIAL_JOB_RECOMMENDATION = {
    type: '탐색 중',
    title: '데이터 로딩 중...',
    description: '추천 데이터를 불러오고 있습니다.',
    matchRate: 0,
    recommendedJobs: ['-'],
    traits: ['-'],
};

export const INITIAL_OVERALL_STATISTICS = {
    totalParticipants: 0,
    averagePlatformScore: 0,
    popularCategory: '-',
};
