export type UserProfile = {
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

export type TestResult = {
    id: string;
    date: string;
    category: string;
    score: number;
    type: 'learning' | 'job';
};
