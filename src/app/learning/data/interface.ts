import { IconName } from './icon';

export interface QuizData {
    [key: string]: {
        questions: Question[];
    };
}

export interface Category {
    id: number;
    name: string;
    subcategories?: SubCategory[]; // 진행률 계산을 위해 추가
    currentProgress?: number; // 프론트엔드용 진행률
}

export interface Question {
    q: string;
    a: string[];
    correct: number;
}

export interface Quiz {
    questions: Question[];
}

export interface Difficulty {
    id: string;
    label: string;
    type: 'basic' | 'challenge';
    spReward: number;
    title: string;
    icon: IconName;
}

export interface SubCategory {
    id: number;
    name: string;
    description: string;
    order: number;
    is_unlocked: boolean;
    is_completed: boolean;
    best_score: number;
    attempt_count: number;
    req?: number; // 선행 노드 ID 추가
}

export interface Title {
    id: string;
    name: string;
    condition: string;
    description: string;
    icon: IconName;
}