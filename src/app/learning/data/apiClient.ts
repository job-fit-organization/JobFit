import axios from 'axios';
import { QUIZZES } from './data';

const API_BASE_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


export const postQuizResult = async (data: {
    learning_id: number;
    answers: {
        question_group_id: number;
        selected_question_choice_id: number;
    }[];
}) => {
    try {
        const token = localStorage.getItem('access_token');
        const response = await axios.post(`${API_BASE_URL}/quiz/submit/`, data, {
            headers: {
                Authorization: token ? `Bearer ${token}` : ""
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to post quiz result:", error);
        throw error;
    }
};

// 퀴즈 완료 후 DB 저장을 위한 헬퍼 함수
export const saveQuizResultToDb = async (sub_id: number, userAnswersIndex: number[]) => {
    const quiz = QUIZZES[sub_id.toString()];
    if (!quiz) return;

    const payload = {
        learning_id: sub_id,
        answers: userAnswersIndex.map((ans_idx, q_idx) => {
            // stable mapping logic (백엔드와 일치해야 함)
            const group_id = sub_id * 100 + q_idx;
            const choice_id = group_id * 10 + ans_idx;
            return {
                question_group_id: group_id,
                selected_question_choice_id: choice_id
            };
        })
    };
    return await postQuizResult(payload);
};

export default apiClient;