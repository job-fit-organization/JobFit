import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터: localStorage에서 토큰을 읽어 Authorization 헤더에 추가합니다.
apiClient.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const getQuizQuestions = async (learning_id: number) => {
    try {
        const response = await apiClient.get(`learnings/${learning_id}/questions/`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch quiz questions:", error);
        throw error;
    }
};

export const postQuizResult = async (data: {
    learning_id: number;
    answers: {
        question_group_id: number;
        selected_question_choice_id: number;
    }[];
}) => {
    try {
        const response = await apiClient.post(`quiz/submit/`, data);
        return response.data;
    } catch (error) {
        console.error("Failed to post quiz result:", error);
        throw error;
    }
};

export const postSurvey = async (data: {
    rating: number;
    features: string[];
    feedback: string;
}) => {
    try {
        const response = await apiClient.post(`survey/`, data);
        return response.data;
    } catch (error) {
        console.error("Failed to post survey:", error);
        throw error;
    }
};

export default apiClient;
