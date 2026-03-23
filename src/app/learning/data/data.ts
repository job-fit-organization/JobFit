import { Category, SubCategory, QuizData, Title, Quiz } from './interface';

// ---------------------------------------------------------
// ------------------- Active API / Mock -------------------
// ---------------------------------------------------------


// --- Mock Functions ---
export const categoryList = async (): Promise<Category[]> => {
    return MOCK_CATEGORIES;
};

export const fetchSubcategories = async (categoryId: number, email?: string | null): Promise<SubCategory[]> => {
    return MOCK_SUBCATEGORIES[categoryId] || [];
};

export const fetchQuestions = async (subcategoryId: number): Promise<QuizData | null> => {
    if (QUIZZES[subcategoryId.toString()]) {
        return {
            [subcategoryId.toString()]: QUIZZES[subcategoryId.toString()]
        };
    }
    return {};
};

// --- Mock Data ---
export const MOCK_CATEGORIES: Category[] = [
    { id: 1, name: "Python 기초", currentProgress: 0 },
    { id: 2, name: "데이터 분석", currentProgress: 0 },
    { id: 3, name: "머신러닝 기초", currentProgress: 0 },
];

export const TITLES: Title[] = [
    { id: 't1', name: '파이썬의 첫걸음', condition: '101 해결', description: '환상님의 위대한 여정이 시작되었습니다.', icon: 'Star' },
    { id: 't2', name: '논리 마스터', condition: '103 해결', description: '복잡한 조건도 명쾌하게 해결하는 통찰력!', icon: 'Shield' },
    { id: 't3', name: '코드 연구자', condition: '진척도 50% 달성', description: '끊임없이 탐구하는 환상님의 모습은 모두의 귀감입니다.', icon: 'BookOpen' },
];

export const MOCK_SUBCATEGORIES: Record<number, SubCategory[]> = {
    1: [ // Python 기초
        {
            id: 101, name: "파이썬 시작하기", description: "환경 설정과 Hello World 출력을 배웁니다.", order: 1, is_unlocked: true, is_completed: false, best_score: 0, attempt_count: 0, req: 0
        },
        {
            id: 102, name: "변수와 연산자", description: "데이터를 저장하고 계산하는 기본 원리를 배웁니다.", order: 2, is_unlocked: false, is_completed: false, best_score: 0, attempt_count: 0, req: 101
        },
        {
            id: 103, name: "조건문 (if)", description: "상황에 따라 프로그램의 흐름을 제어합니다.", order: 3, is_unlocked: false, is_completed: false, best_score: 0, attempt_count: 0, req: 101
        },
        {
            id: 104, name: "반복문 (for/while)", description: "효율적인 코드 작성을 위한 반복 처리를 배웁니다.", order: 4, is_unlocked: false, is_completed: false, best_score: 0, attempt_count: 0, req: 102
        },
        {
            id: 105, name: "기초 종합 문제", description: "1~4번 과정의 내용을 복합적으로 해결합니다.", order: 5, is_unlocked: false, is_completed: false, best_score: 0, attempt_count: 0, req: 104
        }
    ],
    2: [
        {
            id: 201, name: "Pandas 기초: DataFrame 마스터", description: "2차원 자료구조인 DataFrame의 생성과 데이터 확인 방법을 배웁니다.", order: 1, is_unlocked: true, is_completed: false, best_score: 0, attempt_count: 0, req: 0
        },
        {
            id: 202, name: "데이터 시각화: Matplotlib & Seaborn", description: "데이터의 추세와 분포를 그래프로 표현하는 기술을 익힙니다.", order: 2, is_unlocked: false, is_completed: false, best_score: 0, attempt_count: 0, req: 201
        },
        {
            id: 203, name: "데이터 전처리: 결측치와 정규화", description: "학습 모델에 넣기 전 데이터를 깨끗하게 정제하는 과정을 배웁니다.", order: 3, is_unlocked: false, is_completed: false, best_score: 0, attempt_count: 0, req: 201
        },
        {
            id: 204, name: "데이터셋 로드와 텐서 변환", description: "Pandas 데이터를 PyTorch의 Tensor로 변환하여 학습 준비를 마칩니다.", order: 4, is_unlocked: false, is_completed: false, best_score: 0, attempt_count: 0, req: 203
        },
        {
            id: 205, name: "데이터 분석 종합 프로젝트", description: "실제 데이터를 활용해 전처리부터 시각화까지 전 과정을 수행합니다.", order: 5, is_unlocked: false, is_completed: false, best_score: 0, attempt_count: 0, req: 204
        }
    ],
    3: [ // 머신러닝 기초
        {
            id: 301, name: "파이토치 텐서의 기초", description: "딥러닝의 기본 단위인 텐서의 개념과 생성 방법을 배웁니다.", order: 1, is_unlocked: true, is_completed: false, best_score: 0, attempt_count: 0, req: 0
        },
        {
            id: 302, name: "데이터 로딩과 데이터셋", description: "Dataset과 DataLoader를 이용한 효율적인 데이터 처리 기법을 배웁니다.", order: 2, is_unlocked: false, is_completed: false, best_score: 0, attempt_count: 0, req: 301
        },
        {
            id: 303, name: "신경망 계층과 자동 미분", description: "모델의 레이어 구성과 PyTorch의 핵심인 Autograd를 이해합니다.", order: 3, is_unlocked: false, is_completed: false, best_score: 0, attempt_count: 0, req: 301
        },
        {
            id: 304, name: "파이토치 워크플로우", description: "데이터 준비부터 모델 학습, 예측까지의 전체 과정을 실습합니다.", order: 4, is_unlocked: false, is_completed: false, best_score: 0, attempt_count: 0, req: 302
        },
        {
            id: 305, name: "최적화 및 모듈화", description: "하이퍼파라미터 튜닝, 손실 함수 및 최적화 기법을 배웁니다.", order: 5, is_unlocked: false, is_completed: false, best_score: 0, attempt_count: 0, req: 304
        }
    ]
};

export const QUIZZES: Record<string, Quiz> = {
    // --- Python 기초 (101-105) ---
    '101': {
        questions: [
            { q: "1. 파이썬의 특징으로 옳지 않은 것은?", a: ["배우기 쉽고 가독성이 좋다", "인터프리터 언어이다", "컴파일 과정이 필수적이다", "다양한 라이브러리를 지원한다"], correct: 2 },
            { q: "2. 화면에 'Hello'를 출력하는 올바른 코드는?", a: ["console.log('Hello')", "println('Hello')", "print('Hello')", "output('Hello')"], correct: 2 },
            { q: "3. 파이썬에서 주석을 작성할 때 사용하는 기호는?", a: ["//", "/* */", "#", "--"], correct: 2 },
            { q: "4. 파이썬에서 들여쓰기(Indentation)의 역할은?", a: ["가독성을 위해 선택사항이다", "코드 블록을 구분하는 문법적 필수 요소이다", "주석을 처리할 때 사용한다", "속도를 높이기 위해 사용한다"], correct: 1 },
            { q: "5. 다음 중 변수명으로 사용할 수 없는 것은?", a: ["_user_name", "user123", "123user", "userName"], correct: 2 }
        ]
    },
    '102': {
        questions: [
            { q: "1. 다음 중 정수형(Int) 데이터는?", a: ["3.14", "'10'", "10", "True"], correct: 2 },
            { q: "2. 10을 3으로 나눈 나머지(Remainder)를 구하는 연산자는?", a: ["/", "//", "%", "**"], correct: 2 },
            { q: "3. 2의 10제곱(Power)을 구하는 연산자는?", a: ["^", "**", "*", "exp"], correct: 1 },
            { q: "4. a = 5, b = 2 일 때 a // b의 결과는?", a: ["2.5", "2", "3", "7"], correct: 1 },
            { q: "5. 문자열 '10'을 숫자 10으로 변환하는 함수는?", a: ["str()", "float()", "int()", "num()"], correct: 2 }
        ]
    },
    '103': {
        questions: [
            { q: "1. 조건문의 문법으로 올바른 것은?", a: ["if (cond) { }", "if cond:", "if cond then", "if (cond):"], correct: 1 },
            { q: "2. 여러 조건을 검사할 때 사용하는 키워드는?", a: ["else if", "elif", "case", "switch"], correct: 1 },
            { q: "3. 'a가 10보다 크고 20보다 작다'를 표현하는 올바른 조건은?", a: ["10 < a < 20", "10 < a and a < 20", "둘 다 맞음", "둘 다 틀림"], correct: 2 },
            { q: "4. 불리언 연산 중 '반대'의 의미를 가지는 키워드는?", a: ["and", "or", "not", "xor"], correct: 2 },
            { q: "5. if문과 함께 사용하는 '그렇지 않으면'의 키워드는?", a: ["else", "then", "otherwise", "stop"], correct: 0 }
        ]
    },
    '104': {
        questions: [
            { q: "1. 0부터 4까지 반복하는 range() 함수의 사용법은?", a: ["range(4)", "range(5)", "range(0, 4)", "range(1, 5)"], correct: 1 },
            { q: "2. 반복문을 강제로 종료할 때 사용하는 키워드는?", a: ["exit", "continue", "break", "stop"], correct: 2 },
            { q: "3. 다음 루틴을 건너뛰고 다음 반복을 계속할 때 사용하는 키워드는?", a: ["skip", "continue", "jump", "pass"], correct: 1 },
            { q: "4. while문의 조건이 항상 참(True)이면 발생하는 현상은?", a: ["컴파일 에러", "구문 에러", "무한 루프", "정상 종료"], correct: 2 },
            { q: "5. 리스트의 모든 요소를 하나씩 꺼내어 반복할 때 가장 적합한 문법은?", a: ["while list:", "for item in list:", "for (i=0; i<len; i++):", "repeat list:"], correct: 1 }
        ]
    },
    '105': {
        questions: [
            { q: "1. 입력받은 숫자가 짝수인지 판별하는 조건은?", a: ["n / 2 == 0", "n % 2 == 0", "n // 2 == 0", "n ** 2 == 0"], correct: 1 },
            { q: "2. 리스트 scores = [80, 90, 100]의 평균을 구하는 올바른 방법은?", a: ["avg(scores)", "sum(scores) / len(scores)", "len(scores) / sum(scores)", "scores.mean()"], correct: 1 },
            { q: "3. 'Hello'를 5번 반복 출력하는 가장 간단한 방법은?", a: ["print('Hello' * 5)", "print('Hello' + 5)", "while i < 5: print('Hello')", "for i in range(5): print('Hello')"], correct: 0 },
            { q: "4. 파이썬에서 None의 의미는?", a: ["값이 0이다", "값이 False이다", "값이 없음을 나타낸다", "에러가 발생했다"], correct: 2 },
            { q: "5. [1, 2, 3] 리스트의 길이를 구하는 함수는?", a: ["len()", "count()", "size()", "length()"], correct: 0 }
        ]
    },

    // --- 데이터 분석 (201-202) ---
    '201': {
        questions: [
            { q: "1. Pandas에서 행과 열을 가진 2차원 자료구조는?", a: ["Series", "DataFrame", "Matrix", "Tensor"], correct: 1 },
            { q: "2. CSV 파일 로드 시 구분자(Separator)가 탭(\t)일 때 사용하는 옵션은?", a: ["sep='\\t'", "delimiter=','", "header=None", "index_col=0"], correct: 0 },
            { q: "3. DataFrame의 요약된 정보(컬럼명, 데이터 타입 등)를 한눈에 보는 메서드는?", a: ["describe()", "head()", "info()", "summary()"], correct: 2 },
            { q: "4. 인덱스 번호가 아닌 '이름'을 기준으로 행을 추출하는 속성은?", a: ["iloc", "loc", "index", "columns"], correct: 1 },
            { q: "5. 특정 컬럼의 고유값(Unique) 개수를 세어주는 메서드는?", a: ["count()", "unique()", "value_counts()", "sum()"], correct: 2 }
        ]
    },
    '202': {
        questions: [
            { q: "1. Matplotlib에서 데이터의 분포(밀도)를 확인하기 가장 좋은 그래프는?", a: ["plt.plot()", "plt.bar()", "plt.hist()", "plt.pie()"], correct: 2 },
            { q: "2. 그래프 내에서 여러 선을 구분하기 위해 붙이는 설명(범례) 표시 함수는?", a: ["plt.title()", "plt.xlabel()", "plt.legend()", "plt.grid()"], correct: 2 },
            { q: "3. 산점도(Scatter Plot)에서 점의 투명도를 조절하는 파라미터는?", a: ["size", "alpha", "color", "label"], correct: 1 },
            { q: "4. 하나의 화면에 여러 개의 그래프를 배치할 때 사용하는 함수는?", a: ["plt.figure()", "plt.subplot()", "plt.show()", "plt.save()"], correct: 1 },
            { q: "5. Seaborn 라이브러리에서 변수 간 상관관계를 시각화하는 대표적 함수는?", a: ["sns.lineplot()", "sns.heatmap()", "sns.boxplot()", "sns.countplot()"], correct: 1 }
        ]
    },
    '203': {
        questions: [
            { q: "1. 결측치(NaN)를 특정 값(예: 0)으로 채울 때 사용하는 메서드는?", a: ["dropna()", "fillna()", "isnull()", "replace()"], correct: 1 },
            { q: "2. 중복된 데이터를 제거하는 메서드는?", a: ["drop_duplicates()", "remove()", "clean()", "delete()"], correct: 0 },
            { q: "3. 데이터의 스케일을 0과 1 사이로 맞추는 전처리 기법은?", a: ["Standardization", "Normalization(Min-Max)", "Regularization", "Aggregation"], correct: 1 },
            { q: "4. 범주형(Category) 데이터를 0과 1의 이진 벡터로 바꾸는 기법은?", a: ["Label Encoding", "One-Hot Encoding", "Binning", "Mapping"], correct: 1 },
            { q: "5. 수치형 데이터의 기술 통계량(평균, 표준편차 등)을 확인하는 메서드는?", a: ["sum()", "mean()", "describe()", "agg()"], correct: 2 }
        ]
    },
    '204': {
        questions: [
            { q: "1. NumPy 배열을 PyTorch 텐서로 변환하는 함수는?", a: ["torch.tensor()", "torch.from_numpy()", "torch.as_tensor()", "모두 정답"], correct: 3 },
            { q: "2. 데이터 로드 시 '배치 크기(Batch Size)'를 조절하여 데이터를 묶어주는 클래스는?", a: ["Dataset", "DataLoader", "DataBatch", "Sampler"], correct: 1 },
            { q: "3. 학습 시 데이터를 무작위로 섞기 위해 DataLoader에서 설정하는 옵션은?", a: ["shuffle=True", "drop_last=True", "batch_size=32", "num_workers=2"], correct: 0 },
            { q: "4. 텐서의 차원을 변경(예: 28x28 -> 784)할 때 사용하는 메서드는?", a: ["reshape()", "view()", "flatten()", "모두 정답"], correct: 3 },
            { q: "5. 이미지 데이터를 0~1 사이로 정규화하기 위해 자주 쓰는 transform 함수는?", a: ["ToTensor()", "Normalize()", "Resize()", "Grayscale()"], correct: 0 }
        ]
    },
    '205': {
        questions: [
            { q: "1. 데이터 분석 프로젝트의 순서로 가장 적절한 것은?", a: ["수집-시각화-전처리-모델링", "수집-전처리-시각화-모델링", "모델링-수집-전처리-시각화", "전처리-모델링-수집-시각화"], correct: 1 },
            { q: "2. 모델의 과적합(Overfitting)을 방지하기 위해 데이터를 나누는 기준은?", a: ["Train / Test", "Input / Output", "Head / Tail", "Row / Column"], correct: 0 },
            { q: "3. 상관계수가 1에 가까울 때 두 변수의 관계는?", a: ["아무 관계 없음", "강한 양의 상관관계", "강한 음의 상관관계", "반비례 관계"], correct: 1 },
            { q: "4. 분석 결과를 파일(CSV)로 저장하는 메서드는?", a: ["read_csv()", "to_csv()", "save_csv()", "write_csv()"], correct: 1 },
            { q: "5. 데이터의 이상치(Outlier)를 파악하기 가장 좋은 시각화 도구는?", a: ["Pie Chart", "Box Plot", "Line Plot", "Word Cloud"], correct: 1 }
        ]
    },

    // --- 머신러닝 기초 (301-305) ---
    '301': {
        questions: [
            { q: "1. 파이토치에서 다차원 배열을 다루는 기본 단위는?", a: ["Array", "Matrix", "Tensor", "Vector"], correct: 2 },
            { q: "2. 텐서의 크기(Shape)를 확인하는 속성은?", a: ["size()", "shape", "둘 다 가능", "둘 다 불가능"], correct: 2 },
            { q: "3. 텐서를 GPU로 보내는 올바른 방법은?", a: ["tensor.to('cuda')", "tensor.gpu()", "tensor.send('gpu')", "tensor.move('cuda')"], correct: 0 },
            { q: "4. 요소를 모두 0으로 채운 3x3 텐서를 만드는 함수는?", a: ["torch.empty(3,3)", "torch.zeros(3,3)", "torch.ones(3,3)", "torch.null(3,3)"], correct: 1 },
            { q: "5. NumPy 배열을 텐서로 변환하는 함수는?", a: ["torch.from_numpy()", "torch.tensor()", "둘 다 가능", "변환 불가"], correct: 2 }
        ]
    },
    '302': {
        questions: [
            { q: "1. 데이터를 모델에 넣기 좋게 배치(Batch) 단위로 묶어주는 클래스는?", a: ["Dataset", "DataLoader", "DataSampler", "DataBatcher"], correct: 1 },
            { q: "2. 사용자 정의 데이터셋을 만들 때 상속받아야 하는 클래스는?", a: ["torch.utils.data.Dataset", "torch.nn.Module", "torch.optim.Optimizer", "torch.data.Manager"], correct: 0 },
            { q: "3. Dataset 클래스에서 반드시 구현해야 하는 메서드 2개는?", a: ["__init__, __call__", "__len__, __getitem__", "__start__, __end__", "__iter__, __next__"], correct: 1 },
            { q: "4. DataLoader의 batch_size 인자의 역할은?", a: ["전체 데이터 개수 설정", "한 번에 학습할 데이터 묶음의 크기", "데이터 셔플 횟수", "학습 속도 조절"], correct: 1 },
            { q: "5. 학습 데이터를 섞어서 모델에 넣기 위한 DataLoader의 인자는?", a: ["mix=True", "shuffle=True", "random=True", "sort=False"], correct: 1 }
        ]
    },
    '303': {
        questions: [
            { q: "1. 파이토치에서 신경망 모델을 정의할 때 상속받는 클래스는?", a: ["nn.Linear", "nn.Module", "nn.Model", "nn.NeuralNet"], correct: 1 },
            { q: "2. 역전파를 통해 기울기를 계산하는 메서드는?", a: ["loss.forward()", "loss.backward()", "optimizer.step()", "model.train()"], correct: 1 },
            { q: "3. 활성화 함수(Activation Function) 중 하나인 것은?", a: ["ReLU", "SGD", "Adam", "MSE"], correct: 0 },
            { q: "4. 선형 회귀에서 사용하는 선형 계층 클래스는?", a: ["nn.Conv2d", "nn.RNN", "nn.Linear", "nn.Flatten"], correct: 2 },
            { q: "5. 선형 계층 nn.Linear(10, 5)에서 10의 의미는?", a: ["출력 특징수", "입력 특징수", "레이어 깊이", "학습 파라미터수"], correct: 1 }
        ]
    },
    '304': {
        questions: [
            { q: "1. 모델을 학습 모드로 설정하는 메서드는?", a: ["model.fit()", "model.train()", "model.eval()", "model.start()"], correct: 1 },
            { q: "2. 가중치를 업데이트하는 옵티마이저의 메서드는?", a: ["optimizer.zero_grad()", "optimizer.update()", "optimizer.step()", "optimizer.run()"], correct: 2 },
            { q: "3. 이전 기울기를 초기화하는 메서드는?", a: ["optimizer.clear()", "optimizer.zero_grad()", "optimizer.reset()", "optimizer.empty()"], correct: 1 },
            { q: "4. 전체 데이터셋을 한 번 다 훑는 학습 단위를 무엇이라 하나요?", a: ["Iteration", "Batch", "Epoch", "Step"], correct: 2 },
            { q: "5. 모델 예측 시 기울기 계산을 비활성화하여 메모리를 아끼는 컨텍스트는?", a: ["torch.no_grad()", "torch.eval()", "torch.stop_grad()", "torch.freeze()"], correct: 0 }
        ]
    },
    '305': {
        questions: [
            { q: "1. 가장 기본적인 경사 하강법 옵티마이저는?", a: ["Adam", "SGD", "RMSprop", "Adagrad"], correct: 1 },
            { q: "2. 손실 함수 중 하나로, 회귀 문제에서 주로 사용되는 것은?", a: ["CrossEntropyLoss", "BCELoss", "MSELoss", "NLLLoss"], correct: 2 },
            { q: "3. 학습 속도를 결정하는 매우 중요한 하이퍼파라미터는?", a: ["Batch Size", "Learning Rate", "Epochs", "Hidden Layers"], correct: 1 },
            { q: "4. 여러 레이어를 순차적으로 쌓을 때 사용하는 컨테이너는?", a: ["nn.List", "nn.Stack", "nn.Sequential", "nn.Queue"], correct: 2 },
            { q: "5. 과적합(Overfitting)을 방지하기 위한 기법이 아닌 것은?", a: ["Dropout", "Batch Normalization", "Learning Rate Up", "Early Stopping"], correct: 2 }
        ]
    }
};