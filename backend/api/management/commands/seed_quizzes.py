from django.core.management.base import BaseCommand
from api.models import Skill, Learning, QuestionChoice, Job, Roadmap

class Command(BaseCommand):
    help = 'Seed the database with initial quiz questions and associated data'

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding data...")

        # 1. Jobs
        jobs_data = [
            {'code': 'data-sci', 'name': '데이터 사이언티스트', 'desc': '데이터에서 인사이트를 추출하고 모델을 구축합니다.'},
            {'code': 'ai-app', 'name': 'AI 서비스 개발자', 'desc': 'AI 모델을 서비스에 통합하고 배포합니다.'},
            {'code': 'mlops', 'name': 'MLOps 엔지니어', 'desc': 'AI 모델의 전체 생명주기를 관리하고 인프라를 구축합니다.'},
        ]
        
        job_objs = {}
        for jd in jobs_data:
            job, _ = Job.objects.get_or_create(code=jd['code'], defaults={'name': jd['name'], 'desc': jd['desc']})
            job_objs[jd['code']] = job

        # 2. Skills & Subcategories (Learnings)
        skills_data = [
            {
                'id': 1, 'code': 'python-basic', 'name': 'Python 기초', 
                'learnings': [
                    {'id': 101, 'name': "파이썬 시작하기", 'desc': "환경 설정과 Hello World 출력을 배웁니다."},
                    {'id': 102, 'name': "변수와 연산자", 'desc': "데이터를 저장하고 계산하는 기본 원리를 배웁니다."},
                    {'id': 103, 'name': "조건문 (if)", 'desc': "상황에 따라 프로그램의 흐름을 제어합니다."},
                    {'id': 104, 'name': "반복문 (for/while)", 'desc': "효율적인 코드 작성을 위한 반복 처리를 배웁니다."},
                    {'id': 105, 'name': "기초 종합 문제", 'desc': "1~4번 과정의 내용을 복합적으로 해결합니다."}
                ]
            },
            {
                'id': 2, 'code': 'data-analysis', 'name': '데이터 분석',
                'learnings': [
                    {'id': 201, 'name': "Pandas 기초: DataFrame 마스터", 'desc': "2차원 자료구조인 DataFrame의 생성과 데이터 확인 방법을 배웁니다."},
                    {'id': 202, 'name': "데이터 시각화: Matplotlib & Seaborn", 'desc': "데이터의 추세와 분포를 그래프로 표현하는 기술을 익힙니다."},
                    {'id': 203, 'name': "데이터 전처리: 결측치와 정규화", 'desc': "학습 모델에 넣기 전 데이터를 깨끗하게 정제하는 과정을 배웁니다."},
                    {'id': 204, 'name': "데이터셋 로드와 텐서 변환", 'desc': "Pandas 데이터를 PyTorch의 Tensor로 변환하여 학습 준비를 마칩니다."},
                    {'id': 205, 'name': "데이터 분석 종합 프로젝트", 'desc': "실제 데이터를 활용해 전처리부터 시각화까지 전 과정을 수행합니다."}
                ]
            },
            {
                'id': 3, 'code': 'ml-basic', 'name': '머신러닝 기초',
                'learnings': [
                    {'id': 301, 'name': "파이토치 텐서의 기초", 'desc': "딥러닝의 기본 단위인 텐서의 개념과 생성 방법을 배웁니다."},
                    {'id': 302, 'name': "데이터 로딩과 데이터셋", 'desc': "Dataset과 DataLoader를 이용한 효율적인 데이터 처리 기법을 배웁니다."},
                    {'id': 303, 'name': "신경망 계층과 자동 미분", 'desc': "모델의 레이어 구성과 PyTorch의 핵심인 Autograd를 이해합니다."},
                    {'id': 304, 'name': "파이토치 워크플로우", 'desc': "데이터 준비부터 모델 학습, 예측까지의 전체 과정을 실습합니다."},
                    {'id': 305, 'name': "최적화 및 모듈화", 'desc': "하이퍼파라미터 튜닝, 손실 함수 및 최적화 기법을 배웁니다."}
                ]
            }
        ]

        learning_objs = {}
        for sd in skills_data:
            skill, _ = Skill.objects.get_or_create(code=sd['code'], defaults={'name': sd['name']})
            
            # Roadmap mapping (simplified)
            for job in job_objs.values():
                Roadmap.objects.get_or_create(job=job, skill=skill)

            for ld in sd['learnings']:
                learning, _ = Learning.objects.get_or_create(
                    id=ld['id'], 
                    defaults={'code': f"L{ld['id']}", 'name': ld['name'], 'desc': ld['desc'], 'skill': skill}
                )
                learning_objs[ld['id']] = learning

        # 3. Quiz Questions from data.ts
        quizzes = {
            101: [
                ("1. 파이썬의 특징으로 옳지 않은 것은?", ["배우기 쉽고 가독성이 좋다", "인터프리터 언어이다", "컴파일 과정이 필수적이다", "다양한 라이브러리를 지원한다"], 2),
                ("2. 화면에 'Hello'를 출력하는 올바른 코드는?", ["console.log('Hello')", "println('Hello')", "print('Hello')", "output('Hello')"], 2),
                ("3. 파이썬에서 주석을 작성할 때 사용하는 기호는?", ["//", "/* */", "#", "--"], 2),
                ("4. 파이썬에서 들여쓰기(Indentation)의 역할은?", ["가독성을 위해 선택사항이다", "코드 블록을 구분하는 문법적 필수 요소이다", "주석을 처리할 때 사용한다", "속도를 높이기 위해 사용한다"], 1),
                ("5. 다음 중 변수명으로 사용할 수 없는 것은?", ["_user_name", "user123", "123user", "userName"], 2)
            ],
            102: [
                ("1. 다음 중 정수형(Int) 데이터는?", ["3.14", "'10'", "10", "True"], 2),
                ("2. 10을 3으로 나눈 나머지(Remainder)를 구하는 연산자는?", ["/", "//", "%", "**"], 2),
                ("3. 2의 10제곱(Power)을 구하는 연산자는?", ["^", "**", "*", "exp"], 1),
                ("4. a = 5, b = 2 일 때 a // b의 결과는?", ["2.5", "2", "3", "7"], 1),
                ("5. 문자열 '10'을 숫자 10으로 변환하는 함수는?", ["str()", "float()", "int()", "num()"], 2)
            ],
            103: [
                ("1. 조건문의 문법으로 올바른 것은?", ["if (cond) { }", "if cond:", "if cond then", "if (cond):"], 1),
                ("2. 여러 조건을 검사할 때 사용하는 키워드는?", ["else if", "elif", "case", "switch"], 1),
                ("3. 'a가 10보다 크고 20보다 작다'를 표현하는 올바른 조건은?", ["10 < a < 20", "10 < a and a < 20", "둘 다 맞음", "둘 다 틀림"], 2),
                ("4. 불리언 연산 중 '반대'의 의미를 가지는 키워드는?", ["and", "or", "not", "xor"], 2),
                ("5. if문과 함께 사용하는 '그렇지 않으면'의 키워드는?", ["else", "then", "otherwise", "stop"], 0)
            ],
            104: [
                ("1. 0부터 4까지 반복하는 range() 함수의 사용법은?", ["range(4)", "range(5)", "range(0, 4)", "range(1, 5)"], 1),
                ("2. 반복문을 강제로 종료할 때 사용하는 키워드는?", ["exit", "continue", "break", "stop"], 2),
                ("3. 다음 루틴을 건너뛰고 다음 반복을 계속할 때 사용하는 키워드는?", ["skip", "continue", "jump", "pass"], 1),
                ("4. while문의 조건이 항상 참(True)이면 발생하는 현상은?", ["컴파일 에러", "구문 에러", "무한 루프", "정상 종료"], 2),
                ("5. 리스트의 모든 요소를 하나씩 꺼내어 반복할 때 가장 적합한 문법은?", ["while list:", "for item in list:", "for (i=0; i<len; i++):", "repeat list:"], 1)
            ],
            105: [
                ("1. 입력받은 숫자가 짝수인지 판별하는 조건은?", ["n / 2 == 0", "n % 2 == 0", "n // 2 == 0", "n ** 2 == 0"], 1),
                ("2. 리스트 scores = [80, 90, 100]의 평균을 구하는 올바른 방법은?", ["avg(scores)", "sum(scores) / len(scores)", "len(scores) / sum(scores)", "scores.mean()"], 1),
                ("3. 'Hello'를 5번 반복 출력하는 가장 간단한 방법은?", ["print('Hello' * 5)", "print('Hello' + 5)", "while i < 5: print('Hello')", "for i in range(5): print('Hello')"], 0),
                ("4. 파이썬에서 None의 의미는?", ["값이 0이다", "값이 False이다", "값이 없음을 나타낸다", "에러가 발생했다"], 2),
                ("5. [1, 2, 3] 리스트의 길이를 구하는 함수는?", ["len()", "count()", "size()", "length()"], 0)
            ],
            201: [
                ("1. Pandas에서 행과 열을 가진 2차원 자료구조는?", ["Series", "DataFrame", "Matrix", "Tensor"], 1),
                ("2. CSV 파일 로드 시 구분자(Separator)가 탭(\t)일 때 사용하는 옵션은?", ["sep='\\t'", "delimiter=','", "header=None", "index_col=0"], 0),
                ("3. DataFrame의 요약된 정보(컬럼명, 데이터 타입 등)를 한눈에 보는 메서드는?", ["describe()", "head()", "info()", "summary()"], 2),
                ("4. 인덱스 번호가 아닌 '이름'을 기준으로 행을 추출하는 속성은?", ["iloc", "loc", "index", "columns"], 1),
                ("5. 특정 컬럼의 고유값(Unique) 개수를 세어주는 메서드는?", ["count()", "unique()", "value_counts()", "sum()"], 2)
            ],
            202: [
                ("1. Matplotlib에서 데이터의 분포(밀도)를 확인하기 가장 좋은 그래프는?", ["plt.plot()", "plt.bar()", "plt.hist()", "plt.pie()"], 2),
                ("2. 그래프 내에서 여러 선을 구분하기 위해 붙이는 설명(범례) 표시 함수는?", ["plt.title()", "plt.xlabel()", "plt.legend()", "plt.grid()"], 2),
                ("3. 산점도(Scatter Plot)에서 점의 투명도를 조절하는 파라미터는?", ["size", "alpha", "color", "label"], 1),
                ("4. 하나의 화면에 여러 개의 그래프를 배치할 때 사용하는 함수는?", ["plt.figure()", "plt.subplot()", "plt.show()", "plt.save()"], 1),
                ("5. Seaborn 라이브러리에서 변수 간 상관관계를 시각화하는 대표적 함수는?", ["sns.lineplot()", "sns.heatmap()", "sns.boxplot()", "sns.countplot()"], 1)
            ],
            203: [
                ("1. 결측치(NaN)를 특정 값(예: 0)으로 채울 때 사용하는 메서드는?", ["dropna()", "fillna()", "isnull()", "replace()"], 1),
                ("2. 중복된 데이터를 제거하는 메서드는?", ["drop_duplicates()", "remove()", "clean()", "delete()"], 0),
                ("3. 데이터의 스케일을 0과 1 사이로 맞추는 전처리 기법은?", ["Standardization", "Normalization(Min-Max)", "Regularization", "Aggregation"], 1),
                ("4. 범주형(Category) 데이터를 0과 1의 이진 벡터로 바꾸는 기법은?", ["Label Encoding", "One-Hot Encoding", "Binning", "Mapping"], 1),
                ("5. 수치형 데이터의 기술 통계량(평균, 표준편차 등)을 확인하는 메서드는?", ["sum()", "mean()", "describe()", "agg()"], 2)
            ],
            204: [
                ("1. NumPy 배열을 PyTorch 텐서로 변환하는 함수는?", ["torch.tensor()", "torch.from_numpy()", "torch.as_tensor()", "모두 정답"], 3),
                ("2. 데이터 로드 시 '배치 크기(Batch Size)'를 조절하여 데이터를 묶어주는 클래스는?", ["Dataset", "DataLoader", "DataBatch", "Sampler"], 1),
                ("3. 학습 시 데이터를 무작위로 섞기 위해 DataLoader에서 설정하는 옵션은?", ["shuffle=True", "drop_last=True", "batch_size=32", "num_workers=2"], 0),
                ("4. 텐서의 차원을 변경(예: 28x28 -> 784)할 때 사용하는 메서드는?", ["reshape()", "view()", "flatten()", "모두 정답"], 3),
                ("5. 이미지 데이터를 0~1 사이로 정규화하기 위해 자주 쓰는 transform 함수는?", ["ToTensor()", "Normalize()", "Resize()", "Grayscale()"], 0)
            ],
            205: [
                ("1. 데이터 분석 프로젝트의 순서로 가장 적절한 것은?", ["수집-시각화-전처리-모델링", "수집-전처리-시각화-모델링", "모델링-수집-전처리-시각화", "전처리-모델링-수집-시각화"], 1),
                ("2. 모델의 과적합(Overfitting)을 방지하기 위해 데이터를 나누는 기준은?", ["Train / Test", "Input / Output", "Head / Tail", "Row / Column"], 0),
                ("3. 상관계수가 1에 가까울 때 두 변수의 관계는?", ["아무 관계 없음", "강한 양의 상관관계", "강한 음의 상관관계", "반비례 관계"], 1),
                ("4. 분석 결과를 파일(CSV)로 저장하는 메서드는?", ["read_csv()", "to_csv()", "save_csv()", "write_csv()"], 1),
                ("5. 데이터의 이상치(Outlier)를 파악하기 가장 좋은 시각화 도구는?", ["Pie Chart", "Box Plot", "Line Plot", "Word Cloud"], 1)
            ],
            301: [
                ("1. 파이토치에서 다차원 배열을 다루는 기본 단위는?", ["Array", "Matrix", "Tensor", "Vector"], 2),
                ("2. 텐서의 크기(Shape)를 확인하는 속성은?", ["size()", "shape", "둘 다 가능", "둘 다 불가능"], 2),
                ("3. 텐서를 GPU로 보내는 올바른 방법은?", ["tensor.to('cuda')", "tensor.gpu()", "tensor.send('gpu')", "tensor.move('cuda')"], 0),
                ("4. 요소를 모두 0으로 채운 3x3 텐서를 만드는 함수는?", ["torch.empty(3,3)", "torch.zeros(3,3)", "torch.ones(3,3)", "torch.null(3,3)"], 1),
                ("5. NumPy 배열을 텐서로 변환하는 함수는?", ["torch.from_numpy()", "torch.tensor()", "둘 다 가능", "변환 불가"], 2)
            ],
            302: [
                ("1. 데이터를 모델에 넣기 좋게 배치(Batch) 단위로 묶어주는 클래스는?", ["Dataset", "DataLoader", "DataSampler", "DataBatcher"], 1),
                ("2. 사용자 정의 데이터셋을 만들 때 상속받아야 하는 클래스는?", ["torch.utils.data.Dataset", "torch.nn.Module", "torch.optim.Optimizer", "torch.data.Manager"], 0),
                ("3. Dataset 클래스에서 반드시 구현해야 하는 메서드 2개는?", ["__init__, __call__", "__len__, __getitem__", "__start__, __end__", "__iter__, __next__"], 1),
                ("4. DataLoader의 batch_size 인자의 역할은?", ["전체 데이터 개수 설정", "한 번에 학습할 데이터 묶음의 크기", "데이터 셔플 횟수", "학습 속도 조절"], 1),
                ("5. 학습 데이터를 섞어서 모델에 넣기 위한 DataLoader의 인자는?", ["mix=True", "shuffle=True", "random=True", "sort=False"], 1)
            ],
            303: [
                ("1. 파이토치에서 신경망 모델을 정의할 때 상속받는 클래스는?", ["nn.Linear", "nn.Module", "nn.Model", "nn.NeuralNet"], 1),
                ("2. 역전파를 통해 기울기를 계산하는 메서드는?", ["loss.forward()", "loss.backward()", "optimizer.step()", "model.train()"], 1),
                ("3. 활성화 함수(Activation Function) 중 하나인 것은?", ["ReLU", "SGD", "Adam", "MSE"], 0),
                ("4. 선형 회귀에서 사용하는 선형 계층 클래스는?", ["nn.Conv2d", "nn.RNN", "nn.Linear", "nn.Flatten"], 2),
                ("5. 선형 계층 nn.Linear(10, 5)에서 10의 의미는?", ["출력 특징수", "입력 특징수", "레이어 깊이", "학습 파라미터수"], 1)
            ],
            304: [
                ("1. 모델을 학습 모드로 설정하는 메서드는?", ["model.fit()", "model.train()", "model.eval()", "model.start()"], 1),
                ("2. 가중치를 업데이트하는 옵티마이저의 메서드는?", ["optimizer.zero_grad()", "optimizer.update()", "optimizer.step()", "optimizer.run()"], 2),
                ("3. 이전 기울기를 초기화하는 메서드는?", ["optimizer.clear()", "optimizer.zero_grad()", "optimizer.reset()", "optimizer.empty()"], 1),
                ("4. 전체 데이터셋을 한 번 다 훑는 학습 단위를 무엇이라 하나요?", ["Iteration", "Batch", "Epoch", "Step"], 2),
                ("5. 모델 예측 시 기울기 계산을 비활성화하여 메모리를 아끼는 컨텍스트는?", ["torch.no_grad()", "torch.eval()", "torch.stop_grad()", "torch.freeze()"], 0)
            ],
            305: [
                ("1. 가장 기본적인 경사 하강법 옵티마이저는?", ["Adam", "SGD", "RMSprop", "Adagrad"], 1),
                ("2. 손실 함수 중 하나로, 회귀 문제에서 주로 사용되는 것은?", ["CrossEntropyLoss", "BCELoss", "MSELoss", "NLLLoss"], 2),
                ("3. 학습 속도를 결정하는 매우 중요한 하이퍼파라미터는?", ["Batch Size", "Learning Rate", "Epochs", "Hidden Layers"], 1),
                ("4. 여러 레이어를 순차적으로 쌓을 때 사용하는 컨테이너는?", ["nn.List", "nn.Stack", "nn.Sequential", "nn.Queue"], 2),
                ("5. 과적합(Overfitting)을 방지하기 위한 기법이 아닌 것은?", ["Dropout", "Batch Normalization", "Learning Rate Up", "Early Stopping"], 2)
            ]
        }
        
        # Add basic questions for all 15 learnings if not present
        next_group_id = 1
        for lid, questions in quizzes.items():
            learning = learning_objs.get(lid)
            if not learning: continue
            
            # Skip if already has quizzes
            if QuestionChoice.objects.filter(learning=learning, question_type='Quiz').exists():
                self.stdout.write(f"  -> Skipping {learning.name} (already has quizzes)")
                # Update next_group_id anyway if we were keeping track manually, 
                # but better to fetch from DB
                continue

            self.stdout.write(f"  -> Seeding quizzes for {learning.name}...")
            for q_text, choices, correct_idx in questions:
                # Find current max group_id to avoid overlap
                max_group = QuestionChoice.objects.all().order_by('-question_group_id').first()
                current_group_id = (max_group.question_group_id + 1) if max_group else 1
                
                for idx, c_text in enumerate(choices):
                    QuestionChoice.objects.create(
                        question_group_id=current_group_id,
                        question_type='Quiz',
                        learning=learning,
                        question_text=q_text,
                        choice_text=c_text,
                        is_correct=(idx == correct_idx)
                    )

        self.stdout.write(self.style.SUCCESS("Successfully seeded all 15 quiz modules!"))
