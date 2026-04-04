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
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await axios.post(`${API_BASE_URL}/quiz/submit/`, data, {
            headers
        });
        return response.data;
    } catch (error) {
        console.error("Failed to post quiz result:", error);
        throw error;
    }
};

export const fetchQuizQuestions = async (learning_id: number) => {
    try {
        const response = await apiClient.get(`/learnings/${learning_id}/questions/`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch quiz questions:", error);
        throw error;
    }
};


// 퀴즈 완료 후 DB 저장을 위한 헬퍼 함수
export const saveQuizResultToDb = async (learning_id: number, answers: {
    question_group_id: number;
    selected_question_choice_id: number;
}[]) => {
    const payload = {
        learning_id,
        answers
    };
    return await postQuizResult(payload);
};


export default apiClient;