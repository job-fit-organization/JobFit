import { getQuizQuestions } from './apiClient';

export interface QuizQuestion {
    q: string;
    a: string[];
    correct: number;
    question_group_id: number;
    choices: { id: number; choice_text: string }[];
}

export interface QuizData {
    [key: string]: {
        questions: QuizQuestion[];
    };
}

/**
 * 백엔드 API에서 퀴즈 질문 목록을 가져와 프론트엔드 형식으로 변환합니다.
 */
export const fetchQuestions = async (subcategoryId: number): Promise<QuizData> => {
    try {
        const data = await getQuizQuestions(subcategoryId);
        
        // 백엔드 응답 형식을 프론트엔드 QuizData 형식으로 매핑
        const questions: QuizQuestion[] = data.questions.map((q: any) => ({
            q: q.question_text,
            a: q.choices.map((c: any) => c.choice_text),
            correct: -1, // 프론트엔드에서 채점하지 않고 백엔드 결과를 사용하므로 초기값은 -1
            question_group_id: q.question_group_id,
            choices: q.choices 
        }));

        return {
            [subcategoryId.toString()]: { questions }
        };
    } catch (error) {
        console.error(`Error fetching questions for subcategory ${subcategoryId}:`, error);
        throw error;
    }
};

// 상위 컴포넌트에서 import해서 사용하는 빈 객체 (초기화용)
export const QUIZZES: QuizData = {};
