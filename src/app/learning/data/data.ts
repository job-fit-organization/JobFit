import { IconName } from './icon';

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

export interface StoreItem {
    id: string;
    category: string;
    title: string;
    desc: string;
    price: number;
    icon: IconName;
    color: string;
}

export const DIFFICULTIES: Difficulty[] = [
    // ... 올려주신 difficulties 배열 데이터 입력
    {
        id: 'beginner', label: '초보', type: 'basic', spReward: 200, title: "논리의 싹", icon: "CodeXml", questions: [
            { q: "JavaScript에서 변수를 선언하는 키워드가 아닌 것은?", a: ["let", "const", "var", "set"], correct: 3 },
            { q: "배열의 맨 뒤에 요소를 추가하는 메서드는?", a: ["pop()", "push()", "shift()", "unshift()"], correct: 1 },
            { q: "2 + '2'의 결과값은?", a: ["4", "22", "NaN", "Error"], correct: 1 },
            { q: "조건문에서 '값이 같음'을 비교하는 연산자는?", a: ["=", "==", "===", "Both 2 & 3"], correct: 3 },
            { q: "반복문을 중단할 때 사용하는 키워드는?", a: ["stop", "exit", "break", "return"], correct: 2 }
        ]
    },
    {
        id: 'intermediate', label: '중급', type: 'basic', spReward: 400, title: "구조의 설계자", icon: "ChartBar", questions: [
            { q: "LIFO 구조를 가진 자료구조는?", a: ["Queue", "Stack", "Tree", "Graph"], correct: 1 },
            { q: "해시 테이블의 평균 시간 복잡도는?", a: ["O(1)", "O(n)", "O(log n)", "O(n^2)"], correct: 0 },
            { q: "완전 이진 트리의 높이가 h일 때 최대 노드 수는?", a: ["2h", "2^h", "2^(h+1)-1", "h^2"], correct: 2 },
            { q: "정렬된 배열에서 이진 탐색의 시간 복잡도는?", a: ["O(1)", "O(n)", "O(log n)", "O(n^2)"], correct: 2 },
            { q: "그래프의 최단 경로를 찾는 알고리즘은?", a: ["Dijkstra", "Kruskal", "Prim", "Hanoi"], correct: 0 }
        ]
    },
    {
        id: 'advanced', label: '고급', type: 'basic', spReward: 600, title: "효율의 마술사", icon: "fa-bolt", questions: [
            { q: "Dynamic Programming의 핵심 원리는?", a: ["Recursion", "Memoization", "Brute Force", "Randomness"], correct: 1 },
            { q: "분할 정복 알고리즘의 예시가 아닌 것은?", a: ["Merge Sort", "Quick Sort", "Binary Search", "Bubble Sort"], correct: 3 },
            { q: "탐욕 알고리즘(Greedy)이 항상 최적해를 보장하나요?", a: ["예", "아니오", "데이터가 적을때만", "정렬되어 있을때만"], correct: 1 },
            { q: "A* 알고리즘의 휴리스틱 함수는 무엇을 추정하나?", a: ["과거 비용", "남은 비용", "전체 노드 수", "메모리 사용량"], correct: 1 },
            { q: "O(n log n)을 가지는 정렬은?", a: ["Selection Sort", "Insertion Sort", "Heap Sort", "Quick Sort(Worst)"], correct: 2 }
        ]
    },
    {
        id: 'veteran', label: '베테랑', type: 'challenge', spReward: 1000, title: "코드의 거장", icon: "fa-shield-halved", questions: [
            { q: "분산 시스템 일관성 보장 모델은?", a: ["CAP 이론", "ACID", "BASE", "모두 정답"], correct: 3 },
            { q: "마이크로서비스 아키텍처의 장점이 아닌 것은?", a: ["독립적 배포", "기술 다양성", "단순한 데이터 관리", "확장성"], correct: 2 },
            { q: "Docker 컨테이너와 가상 머신의 차이는?", a: ["커널 공유 여부", "네트워크 속도", "GUI 지원", "저장 장치"], correct: 0 },
            { q: "REST API의 Stateless 특성이 의미하는 바는?", a: ["쿠키 사용 금지", "서버가 상태 보관 안함", "DB 사용 안함", "인증 불필요"], correct: 1 },
            { q: "CI/CD의 주요 목적은?", a: ["코드 보안", "지속적 통합 및 배포", "백업 생성", "문서 자동화"], correct: 1 }
        ]
    },
    {
        id: 'hidden', label: '히든', type: 'challenge', spReward: 2000, title: "심연의 정복자", icon: "fa-ghost", questions: [
            { q: "양자 컴퓨팅에서 정보의 기본 단위는?", a: ["Bit", "Byte", "Qubit", "Packet"], correct: 2 },
            { q: "P vs NP 문제에서 NP가 의미하는 것은?", a: ["Non-Polynomial", "Non-deterministic Polynomial", "Normal", "Not Possible"], correct: 1 },
            { q: "블록체인의 '51% 공격' 타겟은?", a: ["프라이버시", "합의 메커니즘", "스마트 컨트랙트", "지갑 주소"], correct: 1 },
            { q: "완전 동형 암호(FHE)의 특징은?", a: ["암호화된 상태로 연산 가능", "가장 빠른 암호화", "수동 암호화", "정부 주도"], correct: 0 },
            { q: "Zero-Knowledge Proof의 핵심은?", a: ["정보 공개 없이 증명", "비밀번호 생성", "해킹 탐지", "익명 게시판"], correct: 0 }
        ]
    },
    {
        id: 'job', label: '직군', type: 'challenge', spReward: 3000, title: "전설적 AI 아키텍트", icon: "fa-microchip", questions: [
            { q: "Transformer 모델의 핵심 메커니즘은?", a: ["RNN", "CNN", "Attention", "Pooling"], correct: 2 },
            { q: "LLM에서 'Hallucination' 현상은?", a: ["빠른 응답", "잘못된 정보 생성", "학습 중단", "메모리 부족"], correct: 1 },
            { q: "RLHF의 약자 의미는?", a: ["Real Human Feedback", "Reinforcement Learning from Human Feedback", "Rapid Learning", "Robust Learning"], correct: 1 },
            { q: "Quantization을 수행하는 이유는?", a: ["정확도 향상", "경량화 및 속도 향상", "데이터 증강", "보안 강화"], correct: 1 },
            { q: "벡터 데이터베이스의 주요 용도는?", a: ["이미지 저장", "임베딩 검색(RAG)", "로그 기록", "사용자 계정"], correct: 1 }
        ]
    }
];

export const STORE_ITEMS: StoreItem[] = [
    { id: 's1', category: '전문성', title: '시니어의 비밀 노트', desc: '전문가의 설계 철학이 담긴 비밀 해설지.', price: 300, icon: 'fa-book-bookmark', color: 'text-indigo-400' },
    { id: 's2', category: '학습', title: '스마트 힌트 열람권', desc: '막막한 순간, 정답에 접근할 수 있는 실마리.', price: 100, icon: 'fa-lightbulb', color: 'text-amber-400' },
    { id: 's3', category: '커스텀', title: '사이버펑크 테마', desc: '환경을 몽환적인 네온 컬러로 교체.', price: 800, icon: 'fa-palette', color: 'text-purple-400' },
    { id: 's4', category: '명예', title: '0.1% 천재 배지', desc: '프로필 옆에 빛나는 고유한 명예 타이틀.', price: 1500, icon: 'fa-award', color: 'text-yellow-400' },
    { id: 's5', category: '보조', title: '부활권 (Life)', desc: '챌린지 실패 시 연속 기록 유지.', price: 200, icon: 'fa-heart-pulse', color: 'text-rose-400' }

];