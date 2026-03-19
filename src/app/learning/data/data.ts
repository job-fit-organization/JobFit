// import { IconName } from './icon';
// import axios from 'axios';

// // 1. 백엔드 직접 호출을 위해 절대 경로 사용 (Next.js 프록시 우회)
// // const API_BASE_URL_TEST = 'http://localhost:8000/api/v1/jobfit';

// // export const categoryList = async (): Promise<Category[]> => {
// //     try {
// //         const response = await axios.get(`${API_BASE_URL_TEST}/categories/`);
// //         const data = response.data;
// //         // 백엔드 구조에 따라 data.categories 혹은 data 자체를 반환
// //         return data.categories || data;
// //     } catch (error: any) {
// //         if (axios.isAxiosError(error)) {
// //             console.error("Axios 에러 발생:", error.response?.status, error.message);
// //         }
// //         return [];
// //     }
// // };

// // export const fetchSubcategories = async (categoryId: number, email: string | null): Promise<SubCategory[]> => {
// //     console.log("fetchSubcategories email", email);
// //     try {
// //         const response = await axios.get(
// //             `${API_BASE_URL_TEST}/categories/${categoryId}/subcategories/`,
// //             {
// //                 headers: {
// //                     Authorization: email ? `Bearer ${email}` : ""
// //                 }
// //             }
// //         );
// //         return response.data;
// //     } catch (error) {
// //         if (axios.isAxiosError(error)) {
// //             console.error("인증 실패 또는 서버 에러:", error.response?.status);
// //         }
// //         return [];
// //     }
// // };

// // export const fetchSubcategories = async (categoryId: number): Promise<SubCategory[]> => {
// //     try {
// //         // 1. 저장된 액세스 토큰 가져오기
// //         const token = localStorage.getItem('access');

// //         const response = await axios.get(
// //             `${API_BASE_URL_TEST}/categories/${categoryId}/subcategories/`,
// //             {
// //                 // 2. 헤더에 인증 정보 추가 (Bearer 뒤에 한 칸 띄우는 것 잊지 마세요!)
// //                 headers: {
// //                     Authorization: token ? `Bearer ${token}` : ""
// //                 }
// //             }
// //         );
// //         return response.data;
// //     } catch (error) {
// //         if (axios.isAxiosError(error)) {
// //             console.error("인증 실패 또는 서버 에러:", error.response?.status);
// //         }
// //         return [];
// //     }
// // };

// // 서브카테고리(노드)별 문제 목록 조회
// // export const fetchQuestions = async (subcategoryId: number): Promise<QuizData | null> => {
// //     try {
// //         const response = await axios.get(`${API_BASE_URL_TEST}/subcategories/${subcategoryId}/questions/`,
// //             {
// //                 // 2. 헤더에 Bearer 토큰 형식으로 담아 보냅니다.
// //                 headers: {
// //                     Authorization: token ? `Bearer ${token}` : "",
// //                 },
// //             });

// //         // 서버에서 온 데이터가 배열이라고 가정할 때, 원하는 객체 형식으로 변환합니다.
// //         const formattedData: QuizData = {
// //             [subcategoryId.toString()]: {
// //                 questions: response.data // 서버에서 온 [{q: ...}, ...] 배열
// //             }
// //         };

// //         return formattedData;
// //     } catch (error) {
// //         if (axios.isAxiosError(error)) {
// //             console.error("fetchQuestions 에러:", error.response?.status, error.message);
// //         }
// //         return {};
// //     }
// // };

// export interface QuizData {
//     [key: string]: {
//         questions: Question[];
//     };
// }

// export interface Category {
//     id: number;
//     name: string;
//     subcategories?: SubCategory[]; // 진행률 계산을 위해 추가
//     currentProgress?: number; // 프론트엔드용 진행률
// }

// export interface Question {
//     q: string;
//     a: string[];
//     correct: number;
// }

// export interface Quiz {
//     questions: Question[];
// }

// export interface Difficulty {
//     id: string;
//     label: string;
//     type: 'basic' | 'challenge';
//     spReward: number;
//     title: string;
//     icon: IconName;
// }

// export interface SubCategory {
//     id: number;
//     name: string;
//     description: string;
//     order: number;
//     is_unlocked: boolean;
//     is_completed: boolean;
//     best_score: number;
//     attempt_count: number;
// }

// export interface Title {
//     id: string;
//     name: string;
//     condition: string;
//     description: string;
//     icon: IconName;
// }

// export const TITLES: Title[] = [
//     { id: 't1', name: '파이썬의 첫걸음', condition: '1-1 해결', description: '환상님의 위대한 여정이 시작되었습니다.', icon: 'Star' },
//     { id: 't2', name: '논리 마스터', condition: '2-2 해결', description: '복잡한 조건도 명쾌하게 해결하는 통찰력!', icon: 'Shield' },
//     { id: 't3', name: '코드 연구자', condition: '진척도 50% 달성', description: '끊임없이 탐구하는 환상님의 모습은 모두의 귀감입니다.', icon: 'BookOpen' },
// ];

// export const QUIZZES: Record<string, Quiz> = {
//     '1': {
//         questions: [
//             { q: "1. 파이썬에서 변수 이름을 지을 때 사용할 수 없는 것은?", a: ["숫자로 시작하는 이름", "_로 시작하는 이름", "대소문자 혼합", "숫자가 포함된 이름"], correct: 0 },
//             { q: "2. 정수(Integer)형 변수를 선언하는 올바른 방법은?", a: ["int a = 5", "a = 5", "let a = 5", "var a = 5"], correct: 1 },
//             { q: "3. 다음 중 실수형(Float) 상수는?", a: ["10", "10.0", "'10'", "True"], correct: 1 },
//             { q: "4. type(10)의 결과는?", a: ["<class 'str'>", "<class 'int'>", "<class 'float'>", "<class 'bool'>"], correct: 1 },
//             { q: "5. 불리언(Boolean) 자료형의 값이 아닌 것은?", a: ["True", "False", "None", "0 (거짓 취급되지만 타입은 다름)"], correct: 2 }
//         ]
//     },
//     '2': {
//         questions: [
//             { q: "1. 'Python'[1:4]의 슬라이싱 결과는?", a: ["Pyt", "yth", "ytho", "Pyth"], correct: 1 },
//             { q: "2. 'Hello World'[-1]은 무엇인가요?", a: ["H", "d", "!", "o"], correct: 1 },
//             { q: "3. 문자열 '123'을 숫자로 바꾸는 함수는?", a: ["str()", "int()", "float()", "bool()"], correct: 1 },
//             { q: "4. 문자열의 길이를 구하는 함수는?", a: ["len()", "size()", "count()", "length()"], correct: 0 },
//             { q: "5. 문자열을 합치는 올바른 방법은?", a: ["'A' + 'B'", "'A' . 'B'", "'A' & 'B'", "'A' plus 'B'"], correct: 0 }
//         ]
//     },
//     '3': {
//         questions: [
//             { q: "1. 다음 중 변경 불가능(Immutable)한 자료형은?", a: ["리스트", "딕셔너리", "튜플", "집합"], correct: 2 },
//             { q: "2. 리스트에 요소를 추가하는 메서드는?", a: ["add()", "push()", "append()", "insert_end()"], correct: 2 },
//             { q: "3. 리스트 [1, 2, 3]에서 2에 접근하는 인덱스는?", a: ["0", "1", "2", "-3"], correct: 1 },
//             { q: "4. 튜플을 만드는 올바른 기호는?", a: ["[]", "{}", "()", "<>"], correct: 2 },
//             { q: "5. 리스트의 모든 요소를 지우는 메서드는?", a: ["remove()", "delete()", "clear()", "pop()"], correct: 2 }
//         ]
//     }
// };


// 테스트 데이터

import { IconName } from './icon';
import axios from 'axios';

// 1. 백엔드 직접 호출을 위해 절대 경로 사용 (Next.js 프록시 우회)
// const API_BASE_URL_TEST = 'http://localhost:8000/api/v1/jobfit';

// --- Mock Data ---
export const MOCK_CATEGORIES: Category[] = [
    { id: 1, name: "Python 기초", currentProgress: 45 },
    { id: 2, name: "데이터 분석", currentProgress: 10 },
    { id: 3, name: "머신러닝 기초", currentProgress: 0 },
];

export const MOCK_SUBCATEGORIES: Record<number, SubCategory[]> = {
    1: [
        { id: 1, name: "기본 문법", description: "파이썬의 가장 기초적인 문법을 배웁니다.", order: 1, is_unlocked: true, is_completed: true, best_score: 100, attempt_count: 1 },
        { id: 2, name: "자료형과 변수", description: "다양한 데이터 타입을 다루는 방법을 배웁니다.", order: 2, is_unlocked: true, is_completed: false, best_score: 0, attempt_count: 0 },
        { id: 3, name: "함수와 모듈", description: "코드의 재사용성을 높이는 방법을 배웁니다.", order: 3, is_unlocked: false, is_completed: false, best_score: 0, attempt_count: 0, req: 2 as any },
        { id: 4, name: "함수와 모듈", description: "코드의 재사용성을 높이는 방법을 배웁니다.", order: 4, is_unlocked: false, is_completed: false, best_score: 0, attempt_count: 0, req: 3 as any },
        { id: 5, name: "함수와 모듈", description: "코드의 재사용성을 높이는 방법을 배웁니다.", order: 5, is_unlocked: false, is_completed: false, best_score: 0, attempt_count: 0, req: 4 as any },
    ],
    2: [
        { id: 4, name: "Pandas 입문", description: "표 데이터를 다루는 법을 배웁니다.", order: 1, is_unlocked: true, is_completed: false, best_score: 0, attempt_count: 0 },
        { id: 5, name: "Matplotlib 시각화", description: "데이터를 그래프로 그리는 법을 배웁니다.", order: 2, is_unlocked: false, is_completed: false, best_score: 0, attempt_count: 0, req: 4 as any },
    ],
    3: [
        { id: 6, name: "선형 회귀", description: "지도 학습의 기초를 배웁니다.", order: 1, is_unlocked: true, is_completed: false, best_score: 0, attempt_count: 0 },
    ]
};

// --- Mock Functions ---
export const categoryList = async (): Promise<Category[]> => {
    return MOCK_CATEGORIES;
};

export const fetchSubcategories = async (categoryId: number, email?: string | null): Promise<SubCategory[]> => {
    return MOCK_SUBCATEGORIES[categoryId] || [];
};

export const fetchQuestions = async (subcategoryId: number): Promise<QuizData | null> => {
    // QUIZZES 객체가 이미 하단에 정의되어 있으므로 해당 데이터를 활용해 반환 형식에 맞춤
    if (QUIZZES[subcategoryId.toString()]) {
        return {
            [subcategoryId.toString()]: QUIZZES[subcategoryId.toString()]
        };
    }
    return {};
};



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

export const TITLES: Title[] = [
    { id: 't1', name: '파이썬의 첫걸음', condition: '1-1 해결', description: '환상님의 위대한 여정이 시작되었습니다.', icon: 'Star' },
    { id: 't2', name: '논리 마스터', condition: '2-2 해결', description: '복잡한 조건도 명쾌하게 해결하는 통찰력!', icon: 'Shield' },
    { id: 't3', name: '코드 연구자', condition: '진척도 50% 달성', description: '끊임없이 탐구하는 환상님의 모습은 모두의 귀감입니다.', icon: 'BookOpen' },
];

export const QUIZZES: Record<string, Quiz> = {
    '1': {
        questions: [
            { q: "1. 파이썬에서 변수 이름을 지을 때 사용할 수 없는 것은?", a: ["숫자로 시작하는 이름", "_로 시작하는 이름", "대소문자 혼합", "숫자가 포함된 이름"], correct: 0 },
            { q: "2. 정수(Integer)형 변수를 선언하는 올바른 방법은?", a: ["int a = 5", "a = 5", "let a = 5", "var a = 5"], correct: 0 },
            { q: "3. 다음 중 실수형(Float) 상수는?", a: ["10", "10.0", "'10'", "True"], correct: 0 },
            { q: "4. type(10)의 결과는?", a: ["<class 'str'>", "<class 'int'>", "<class 'float'>", "<class 'bool'>"], correct: 0 },
            { q: "5. 불리언(Boolean) 자료형의 값이 아닌 것은?", a: ["True", "False", "None", "0 (거짓 취급되지만 타입은 다름)"], correct: 0 }
        ]
    },
    '2': {
        questions: [
            { q: "1. 'Python'[1:4]의 슬라이싱 결과는?", a: ["Pyt", "yth", "ytho", "Pyth"], correct: 1 },
            { q: "2. 'Hello World'[-1]은 무엇인가요?", a: ["H", "d", "!", "o"], correct: 1 },
            { q: "3. 문자열 '123'을 숫자로 바꾸는 함수는?", a: ["str()", "int()", "float()", "bool()"], correct: 1 },
            { q: "4. 문자열의 길이를 구하는 함수는?", a: ["len()", "size()", "count()", "length()"], correct: 0 },
            { q: "5. 문자열을 합치는 올바른 방법은?", a: ["'A' + 'B'", "'A' . 'B'", "'A' & 'B'", "'A' plus 'B'"], correct: 0 }
        ]
    },
    '3': {
        questions: [
            { q: "1. 다음 중 변경 불가능(Immutable)한 자료형은?", a: ["리스트", "딕셔너리", "튜플", "집합"], correct: 2 },
            { q: "2. 리스트에 요소를 추가하는 메서드는?", a: ["add()", "push()", "append()", "insert_end()"], correct: 2 },
            { q: "3. 리스트 [1, 2, 3]에서 2에 접근하는 인덱스는?", a: ["0", "1", "2", "-3"], correct: 1 },
            { q: "4. 튜플을 만드는 올바른 기호는?", a: ["[]", "{}", "()", "<>"], correct: 2 },
            { q: "5. 리스트의 모든 요소를 지우는 메서드는?", a: ["remove()", "delete()", "clear()", "pop()"], correct: 2 }
        ]
    }
    ,
    '4': {
        questions: [
            { q: "1. 다음 중 변경 불가능(Immutable)한 자료형은?", a: ["리스트", "딕셔너리", "튜플", "집합"], correct: 2 },
            { q: "2. 리스트에 요소를 추가하는 메서드는?", a: ["add()", "push()", "append()", "insert_end()"], correct: 2 },
            { q: "3. 리스트 [1, 2, 3]에서 2에 접근하는 인덱스는?", a: ["0", "1", "2", "-3"], correct: 1 },
            { q: "4. 튜플을 만드는 올바른 기호는?", a: ["[]", "{}", "()", "<>"], correct: 2 },
            { q: "5. 리스트의 모든 요소를 지우는 메서드는?", a: ["remove()", "delete()", "clear()", "pop()"], correct: 2 }
        ]
    }
    ,
    '5': {
        questions: [
            { q: "1. 다음 중 변경 불가능(Immutable)한 자료형은?", a: ["리스트", "딕셔너리", "튜플", "집합"], correct: 2 },
            { q: "2. 리스트에 요소를 추가하는 메서드는?", a: ["add()", "push()", "append()", "insert_end()"], correct: 2 },
            { q: "3. 리스트 [1, 2, 3]에서 2에 접근하는 인덱스는?", a: ["0", "1", "2", "-3"], correct: 1 },
            { q: "4. 튜플을 만드는 올바른 기호는?", a: ["[]", "{}", "()", "<>"], correct: 2 },
            { q: "5. 리스트의 모든 요소를 지우는 메서드는?", a: ["remove()", "delete()", "clear()", "pop()"], correct: 2 }
        ]
    }
};