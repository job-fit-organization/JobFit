export interface UserProfile {
    name: string;
    level: number;
    exp: number;
    email: string;
    attendanceDays: number;
    
    // 분야별 학습 진행도 (완료 횟수 등)
    averageScore: {
        python: number;
        mlops: number;
        llm: number;
        deepLearning: number;
    };
}

// 시험/학습 결과 내역
export interface TestResult {
    id: string;
    date: string; // YYYY-MM-DD
    category: string; // 과목명 또는 직무명
    score: number;
    type: 'learning' | 'job'; // 학습 모의고사 vs 직무 역량 테스트 구분용
}
