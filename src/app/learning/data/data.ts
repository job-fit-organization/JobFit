import { IconName } from './icon';
import axios from 'axios';

// 1. 백엔드 직접 호출을 위해 절대 경로 사용 (Next.js 프록시 우회)
const API_BASE_URL_TEST = 'http://localhost:8000/api/jobfit';

export const categoryList = async (): Promise<Category[]> => {
    try {
        // 2. axios.get 사용 (끝에 슬래시는 백엔드 규칙에 맞춰 유지)
        const response = await axios.get(`${API_BASE_URL_TEST}/categories/`);

        // axios는 응답 데이터를 response.data 안에 담아줍니다.
        const data = response.data;

        // 백엔드 구조에 따라 data.categories 혹은 data 자체를 반환
        return data.categories || data;

    } catch (error: any) {
        // 3. 에러 처리 (네트워크 에러, 4xx, 5xx 에러 등이 모두 여기로 옵니다)
        if (axios.isAxiosError(error)) {
            console.error("Axios 에러 발생:", error.response?.status, error.message);
        }
        // 에러 발생 시 빈 배열을 반환하여 UI가 깨지거나 Error Overlay가 뜨는 것을 방지합니다.
        return [];
    }
};

// DB(API)로부터 데이터를 가져오는 함수
export const fetchSubcategories = async (): Promise<SkillStage[]> => {
    try {
        const response = await fetch(API_BASE_URL_TEST + '/subcategories/1/attempts/start/'); // DB API 주소
        if (!response.ok) throw new Error('데이터를 불러오는데 실패했습니다.');

        const data = await response.json();
        console.log(data);
        return data.subcategories;
    } catch (error) {
        console.error("Data Fetch Error:", error);
        return []; // 에러 발생 시 빈 배열 반환
    }
};

export interface Category {
    id: number;
    name: string;
    stages: SkillStage[];
}

export interface Question {
    q: string;
    a: string[];
    correct: number;
}

export interface Difficulty {
    id: string;
    label: string;
    type: 'basic' | 'challenge';
    spReward: number;
    title: string;
    icon: IconName;
    questions: Question[];
}

export interface SkillStage {
    id: number;
    name: string;
    theme: string;
    icon: IconName;
    nodes: SkillNode[];
}

export interface SkillNode {
    id: string;
    name: string;
    x: number;
    y: number;
    type?: 'essential' | 'sub';
    req?: string;
}

export interface Quiz {
    questions: Question[];
}

export interface Title {
    id: string;
    name: string;
    condition: string;
    description: string;
    icon: IconName;
}

// --- Data Configuration ---

export const SKILL_STAGES: SkillStage[] = [
    {
        id: 1, name: '1차 전직: 입문자 (Novice)', theme: 'Python Core Basics', icon: 'Binary',
        nodes: [
            { id: '1-1', name: '변수와 자료형', x: 0.5, y: 0, type: 'essential' },
            { id: '1-2', name: '문자열 슬라이싱', x: 1.5, y: 0, type: 'sub' },
            { id: '1-3', name: '리스트 & 튜플', x: 0.5, y: 1, req: '1-1' },
            { id: '1-4', name: '딕셔너리 & 집합', x: 1.5, y: 1, req: '1-3' },
            { id: '1-5', name: '기본 입출력', x: 0.5, y: 2, req: '1-3' },
        ]
    },
    {
        id: 2, name: '2차 전직: 숙련자 (Adept)', theme: 'Flow Control & Logic', icon: 'Cpu',
        nodes: [
            { id: '2-1', name: '조건문 (if/else)', x: 0.5, y: 0, type: 'essential' },
            { id: '2-2', name: '논리 연산자', x: 1.5, y: 0, type: 'sub' },
            { id: '2-3', name: '반복문 (for/while)', x: 0.5, y: 1, req: '2-1' },
            { id: '2-4', name: '리스트 컴프리헨션', x: 1.5, y: 1, req: '2-3' },
            { id: '2-5', name: '예외 처리', x: 0.5, y: 2, req: '2-3' },
        ]
    },
    {
        id: 3, name: '3차 전직: 전문가 (Expert)', theme: 'Data Structures & Algorithms', icon: 'Database',
        nodes: [
            { id: '3-1', name: '리스트', x: 0.5, y: 0, type: 'essential' },
            { id: '3-2', name: '딕셔너리', x: 1.5, y: 0, type: 'sub' },
            { id: '3-3', name: '집합', x: 0.5, y: 1, req: '3-1' },
            { id: '3-4', name: '스택 & 큐', x: 1.5, y: 1, req: '3-3' },
            { id: '3-5', name: '트리', x: 0.5, y: 2, req: '3-3' },
        ]
    },
    {
        id: 4, name: '4차 전직: 마스터 (Master)', theme: 'Advanced Topics', icon: 'Database',
        nodes: [
            { id: '4-1', name: '리스트', x: 0.5, y: 0, type: 'essential' },
            { id: '4-2', name: '딕셔너리', x: 1.5, y: 0, type: 'sub' },
            { id: '4-3', name: '집합', x: 0.5, y: 1, req: '4-1' },
            { id: '4-4', name: '스택 & 큐', x: 1.5, y: 1, req: '4-3' },
            { id: '4-5', name: '트리', x: 0.5, y: 2, req: '4-3' },
        ]
    }
];

export const TITLES: Title[] = [
    { id: 't1', name: '파이썬의 첫걸음', condition: '1-1 해결', description: '환상님의 위대한 여정이 시작되었습니다.', icon: 'Star' },
    { id: 't2', name: '논리 마스터', condition: '2-2 해결', description: '복잡한 조건도 명쾌하게 해결하는 통찰력!', icon: 'Shield' },
    { id: 't3', name: '코드 연구자', condition: '진척도 50% 달성', description: '끊임없이 탐구하는 환상님의 모습은 모두의 귀감입니다.', icon: 'BookOpen' },
];

export const QUIZZES: Record<string, Quiz> = {
    '1-1': {
        questions: [
            { q: "1. 파이썬에서 변수 이름을 지을 때 사용할 수 없는 것은?", a: ["숫자로 시작하는 이름", "_로 시작하는 이름", "대소문자 혼합", "숫자가 포함된 이름"], correct: 0 },
            { q: "2. 정수(Integer)형 변수를 선언하는 올바른 방법은?", a: ["int a = 5", "a = 5", "let a = 5", "var a = 5"], correct: 1 },
            { q: "3. 다음 중 실수형(Float) 상수는?", a: ["10", "10.0", "'10'", "True"], correct: 1 },
            { q: "4. type(10)의 결과는?", a: ["<class 'str'>", "<class 'int'>", "<class 'float'>", "<class 'bool'>"], correct: 1 },
            { q: "5. 불리언(Boolean) 자료형의 값이 아닌 것은?", a: ["True", "False", "None", "0 (거짓 취급되지만 타입은 다름)"], correct: 2 }
        ]
    },
    '1-2': {
        questions: [
            { q: "1. 'Python'[1:4]의 슬라이싱 결과는?", a: ["Pyt", "yth", "ytho", "Pyth"], correct: 1 },
            { q: "2. 'Hello World'[-1]은 무엇인가요?", a: ["H", "d", "!", "o"], correct: 1 },
            { q: "3. 문자열 '123'을 숫자로 바꾸는 함수는?", a: ["str()", "int()", "float()", "bool()"], correct: 1 },
            { q: "4. 문자열의 길이를 구하는 함수는?", a: ["len()", "size()", "count()", "length()"], correct: 0 },
            { q: "5. 문자열을 합치는 올바른 방법은?", a: ["'A' + 'B'", "'A' . 'B'", "'A' & 'B'", "'A' plus 'B'"], correct: 0 }
        ]
    },
    '1-3': {
        questions: [
            { q: "1. 다음 중 변경 불가능(Immutable)한 자료형은?", a: ["리스트", "딕셔너리", "튜플", "집합"], correct: 2 },
            { q: "2. 리스트에 요소를 추가하는 메서드는?", a: ["add()", "push()", "append()", "insert_end()"], correct: 2 },
            { q: "3. 리스트 [1, 2, 3]에서 2에 접근하는 인덱스는?", a: ["0", "1", "2", "-3"], correct: 1 },
            { q: "4. 튜플을 만드는 올바른 기호는?", a: ["[]", "{}", "()", "<>"], correct: 2 },
            { q: "5. 리스트의 모든 요소를 지우는 메서드는?", a: ["remove()", "delete()", "clear()", "pop()"], correct: 2 }
        ]
    },
    '1-4': {
        questions: [
            { q: "1. 딕셔너리에서 데이터를 저장하는 방식은?", a: ["Index-Value", "Key-Value", "Node-Link", "Head-Tail"], correct: 1 },
            { q: "2. 집합(Set)의 특징이 아닌 것은?", a: ["순서가 없다", "중복을 허용하지 않는다", "인덱스로 접근 가능하다", "가변(Mutable)적이다"], correct: 2 },
            { q: "3. 딕셔너리 d = {'a': 1}에서 1을 가져오는 방법은?", a: ["d[0]", "d['a']", "d.get(0)", "d.val('a')"], correct: 1 },
            { q: "4. 두 집합의 공통 요소를 찾는 연산은?", a: ["합집합", "교집합", "차집합", "대칭차집합"], correct: 1 },
            { q: "5. 집합을 선언하는 기호는?", a: ["[]", "{}", "()", "set() (또는 {})"], correct: 3 }
        ]
    },
    '1-5': {
        questions: [
            { q: "1. 사용자로부터 입력을 받는 함수는?", a: ["print()", "get()", "input()", "read()"], correct: 2 },
            { q: "2. 화면에 출력하는 함수는?", a: ["show()", "out()", "print()", "echo()"], correct: 2 },
            { q: "3. input()으로 입력받은 값의 기본 타입은?", a: ["int", "float", "str", "bool"], correct: 2 },
            { q: "4. print('A', 'B')의 출력 결과 파라미터 사이 구분값의 기본은?", a: ["콤마", "공백", "줄바꿈", "없음"], correct: 1 },
            { q: "5. 여러 줄을 한 번에 출력할 때 사용하는 기호는?", a: ["' '", "\" \"", "\"\"\" \"\"\"", "( )"], correct: 2 }
        ]
    },
    '2-1': {
        questions: [
            { q: "1. if 문 뒤에 반드시 와야 하는 기호는?", a: [";", ":", ".", ","], correct: 1 },
            { q: "2. 여러 조건을 차례대로 검사할 때 사용하는 키워드는?", a: ["else if", "elif", "elsif", "other"], correct: 1 },
            { q: "3. 파이썬에서 코드 블록을 구분하는 방법은?", a: ["{}", "괄호()", "들여쓰기(Indentation)", ";"], correct: 2 },
            { q: "4. if 0: 과 같은 조건문은 어떻게 처리되나요?", a: ["참으로 처리", "거짓으로 처리", "에러 발생", "무시됨"], correct: 1 },
            { q: "5. 나머지가 0인지 확인하는 올바른 조건식은?", a: ["x % 2 = 0", "x % 2 == 0", "x / 2 == 0", "x // 2 == 0"], correct: 1 }
        ]
    },
    '2-2': {
        questions: [
            { q: "1. 두 조건이 모두 참일 때 참이 되는 연산자는?", a: ["or", "and", "not", "xor"], correct: 1 },
            { q: "2. 조건을 반전시키는 연산자는?", a: ["!", "rev", "not", "~"], correct: 2 },
            { q: "3. A가 참이거나 B가 참일 때 참이 되는 연산자는?", a: ["and", "or", "&&", "||"], correct: 1 },
            { q: "4. False or True 의 결과값은?", a: ["True", "False", "None", "Error"], correct: 0 },
            { q: "5. not (5 > 3) 의 결과값은?", a: ["True", "False", "5", "3"], correct: 1 }
        ]
    },
    '2-3': {
        questions: [
            { q: "1. 리스트의 요소를 하나씩 꺼내어 반복하는 문법은?", a: ["while loop", "for loop", "loop repeat", "foreach"], correct: 1 },
            { q: "2. 조건이 참인 동안 계속 반복하는 문법은?", a: ["for loop", "while loop", "infinite loop", "until loop"], correct: 1 },
            { q: "3. 0부터 4까지 숫자를 생성하는 함수는?", a: ["range(4)", "range(5)", "list(5)", "count(5)"], correct: 1 },
            { q: "4. 반복문을 즉시 빠져나가는 키워드는?", a: ["stop", "exit", "break", "continue"], correct: 2 },
            { q: "5. 현재 반복을 건너뛰고 다음 반복으로 넘어가는 키워드는?", a: ["skip", "pass", "break", "continue"], correct: 3 }
        ]
    },
    '2-4': {
        questions: [
            { q: "1. [x for x in range(5)]의 결과는?", a: ["[0,1,2,3,4,5]", "[1,2,3,4,5]", "[0,1,2,3,4]", "{0,1,2,3,4}"], correct: 2 },
            { q: "2. 리스트 컴프리헨션의 장점은?", a: ["코드의 간결성", "메모리 무제한 사용", "무조건적인 속도 향상", "에러 방지"], correct: 0 },
            { q: "3. 조건을 포함한 컴프리헨션의 올바른 형태는?", a: ["[x if x > 0]", "[x for x in range(5) if x % 2 == 0]", "[if x % 2 == 0 for x]", "for x in range(5) [x]"], correct: 1 },
            { q: "4. [x**2 for x in range(3)]의 결과는?", a: ["[0, 1, 4]", "[1, 4, 9]", "[0, 1, 2]", "[1, 2, 4]"], correct: 0 },
            { q: "5. 리스트 컴프리헨션은 어떤 괄호를 쓰나요?", a: ["( )", "{ }", "[ ]", "< >"], correct: 2 }
        ]
    },
    '2-5': {
        questions: [
            { q: "1. 예외가 발생할 가능성이 있는 코드를 감싸는 블록은?", a: ["try", "except", "finally", "catch"], correct: 0 },
            { q: "2. 에러를 직접 발생시킬 때 사용하는 키워드는?", a: ["throw", "error", "raise", "make"], correct: 2 },
            { q: "3. 에러 발생 여부와 상관없이 무조건 실행되는 블록은?", a: ["else", "finally", "always", "end"], correct: 1 },
            { q: "4. ZeroDivisionError는 언제 발생하나요?", a: ["0으로 나눌 때", "문자열을 더할 때", "파일이 없을 때", "인덱스가 없을 때"], correct: 0 },
            { q: "5. try 블록에서 에러가 없을 때 실행되는 블록은?", a: ["except", "else", "finally", "success"], correct: 1 }
        ]
    }
};