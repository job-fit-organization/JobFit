// ─────────────────────────────────────────
//  JobFit — AI 직무 적성 테스트 공유 라이브러리
//  src/app/test/_lib.tsx
// ─────────────────────────────────────────

"use client";

// ── Types ────────────────────────────────
export type JobId = "ai-app" | "mlops" | "data-sci";
export type Mode = "beginner" | "expert";
export type JobScores = Record<JobId, number>;

export interface NextStep { num: string; text: string; url: string; }
export interface StackItem { name: string; desc: string; level: "필수" | "추천" | "심화"; }

export interface Job {
  id: JobId;
  title: string;
  emoji: string;
  color: string;
  rgb: string;
  tags: string[];
  typeTitle: string;
  typeDesc: string;
  mbti: string;
  hook: string;
  hookBeginner: string;
  realities: string[];
  realitiesBeginner: string[];
  traits: string[];
  hardPoints: string[];
  demand: number;
  growth: string;
  stacks: StackItem[];
  nextSteps: NextStep[];
}

export interface Option {
  t: string;
  w: Partial<Record<JobId, number>>;
}

export interface Question { q: string; opts: Option[]; }

// ── localStorage ──────────────────────────
export const LS_KEY = "jobfit_test_result";

export interface TestResult {
  jobScores: JobScores;
  mode: Mode;
}

export function saveResult(result: TestResult) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(result));
}

export function loadResult(): TestResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

// ── CSS ──────────────────────────────────
export const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  button { font-family: inherit; cursor: pointer; border: none; background: none; }
  a { text-decoration: none; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

  :root {
    --bg:            #F8FAFB;
    --bg-card:       #FFFFFF;
    --bg-subtle:     #F1F5F9;
    --border:        #E2E8F0;
    --border-strong: #CBD5E1;
    --text-1: #0F172A;
    --text-2: #475569;
    --text-3: #94A3B8;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04);
    --shadow:    0 4px 12px rgba(0,0,0,0.07), 0 12px 28px rgba(0,0,0,0.05);
    --content-width: 820px;
    --content-pad:   48px;
  }
  [data-theme="dark"] {
    --bg:            #0B0F18;
    --bg-card:       #131929;
    --bg-subtle:     #1A2236;
    --border:        #1E2D45;
    --border-strong: #2A3D58;
    --text-1: #F0F6FF;
    --text-2: #8BA3C4;
    --text-3: #3D5470;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2);
    --shadow:    0 4px 12px rgba(0,0,0,0.4), 0 12px 28px rgba(0,0,0,0.3);
  }

  body { background: var(--bg); color: var(--text-1); transition: background 0.2s, color 0.2s; font-family: 'Inter', system-ui, sans-serif; }

  @keyframes fadeUp  { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
  @keyframes slideUp { from { opacity:0; transform:translateY(100%); } to { opacity:1; transform:translateY(0); } }
  @keyframes barGrow { from{width:0} }

  .fu  { animation: fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) both; }
  .fu1 { animation-delay:0.06s; }
  .fu2 { animation-delay:0.12s; }

  .card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 20px;
    box-shadow: var(--shadow-sm);
    transition: box-shadow 0.2s, border-color 0.2s;
  }

  .page-wrap {
    max-width: var(--content-width);
    margin: 0 auto;
    padding: 56px var(--content-pad) 80px;
    width: 100%;
  }

  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    align-items: start;
  }
  .two-col .col-left  { position: sticky; top: 40px; }
  .two-col .col-right { display: flex; flex-direction: column; gap: 14px; }

  .opt {
    width:100%; padding:16px 18px; border-radius:14px; text-align:left;
    border: 1.5px solid var(--border); background: var(--bg-card);
    color: var(--text-2); font-size:15px; font-family:inherit;
    cursor:pointer; transition:all 0.15s;
    display:flex; align-items:center; gap:14px; line-height:1.55;
    position:relative;
  }
  .opt:hover:not(.opt-sel) {
    border-color: var(--border-strong);
    color: var(--text-1);
    background: var(--bg-subtle);
    transform: translateX(3px);
  }
  .opt-sel {
    border-color: var(--accent,#10B981) !important;
    border-width: 2px !important;
    background: var(--accent-bg,rgba(16,185,129,0.08)) !important;
    color: var(--text-1) !important;
    box-shadow: 0 0 0 3px rgba(16,185,129,0.12);
    transform: translateX(4px);
  }
  .opt-check {
    margin-left: auto; flex-shrink: 0;
    width: 22px; height: 22px; border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: all 0.15s; background: #10B981;
  }
  .opt-sel .opt-check { opacity: 1; }

  .ghost { padding:9px 18px; border-radius:9px; font-weight:500; font-size:14px;
    font-family:inherit; color:var(--text-2); cursor:pointer; transition:all 0.15s; }
  .ghost:hover { background:var(--bg-subtle); color:var(--text-1); }

  .mode-card { cursor:pointer; padding:28px 24px; border-radius:20px; border:2px solid var(--border);
    background:var(--bg-card); transition:all 0.2s; text-align:center; }
  .mode-card:hover { transform:translateY(-4px); box-shadow:var(--shadow); }
  .mode-card.active { border-color:var(--accent,#10B981); background:var(--accent-bg,rgba(16,185,129,0.06)); }

  @media (max-width: 860px) {
    :root { --content-width: 100%; --content-pad: 28px; }
    .two-col { grid-template-columns: 1fr; gap: 20px; }
    .two-col .col-left { position: static; }
  }

  @media (max-width: 480px) {
    :root { --content-pad: 18px; }
    .page-wrap { padding-top: 32px; }
    .mode-card { padding: 20px 16px; border-radius: 16px; }
    .opt { padding: 13px 14px; font-size: 14px; }
    .card { border-radius: 16px; }
  }
`;

// ── JOBS ──────────────────────────────────
export const JOBS: Record<JobId, Job> = {
  "ai-app": {
    id: "ai-app", title: "AI Application Engineer", emoji: "🤖",
    color: "#10B981", rgb: "16,185,129",
    tags: ["LLM", "RAG", "FastAPI", "Agent"],
    typeTitle: "서비스 빌더형", typeDesc: "아이디어를 빠르게 현실로 만드는 실행력의 소유자",
    mbti: "ENTP · ENFJ",
    hook: "아이디어가 떠오르면 자기도 모르게 손이 먼저 움직이는 사람이에요. 완벽한 계획보다 일단 돌아가는 걸 만드는 게 본능이고, 그게 AI 시대에 가장 강력한 무기예요.",
    hookBeginner: "뭔가 새로운 걸 보면 직접 써보지 않으면 못 배기는 사람이에요. ChatGPT를 처음 써봤을 때 \"이걸로 뭔가 만들 수 있겠다\"는 생각이 들었다면, 당신은 이미 서비스 빌더형이에요.",
    realities: [
      "GPT API 처음 붙였을 때 응답 하나에 소름 돋았던 경험 있음 ⚡",
      "사용자 피드백 하나에 밤새 코드 뜯어고친 적 있음 🔧",
      "배포 직후 실사용자가 생겼을 때 그 짜릿함 때문에 개발하는 사람 🚀",
      "\"일단 만들어보고 고치자\"가 개발 철학인 사람 🛠️",
    ],
    realitiesBeginner: [
      "ChatGPT 써보고 \"이걸로 뭔가 만들 수 있겠다\" 생각한 적 있음 💡",
      "아이디어 생각나면 메모장에 바로 적어두는 습관 있음 📝",
      "유튜브에서 \"ChatGPT로 앱 만들기\" 같은 영상 클릭한 적 있음 🎬",
      "완벽하게 배우고 시작하기보다 일단 해보는 스타일 🙋",
    ],
    traits: ["빠른 프로토타이핑을 즐긴다", "사용자 반응에서 에너지를 얻는다", "새로운 AI 툴을 바로 써본다", "완벽보다 동작하는 것을 먼저 만든다"],
    hardPoints: ["LLM 응답 품질이 불안정할 때", "요구사항이 빠르게 바뀌는 환경"],
    demand: 92, growth: "+38%",
    stacks: [
      { name: "Python", desc: "AI 앱 개발의 기본 언어", level: "필수" },
      { name: "OpenAI API", desc: "GPT 모델 연동 및 프롬프트 설계", level: "필수" },
      { name: "LangChain", desc: "LLM 체인·에이전트 빠른 구현", level: "필수" },
      { name: "FastAPI", desc: "AI 백엔드 API 서버 구축", level: "추천" },
      { name: "RAG", desc: "문서 기반 검색 증강 생성", level: "추천" },
      { name: "LangGraph", desc: "복잡한 AI 에이전트 워크플로우", level: "심화" },
      { name: "Vector DB", desc: "Pinecone·Chroma 등 임베딩 저장소", level: "심화" },
    ],
    nextSteps: [
      { num: "01", text: "OpenAI API로 간단한 챗봇 만들기", url: "https://platform.openai.com" },
      { num: "02", text: "LangChain 공식 튜토리얼 따라하기", url: "https://python.langchain.com" },
      { num: "03", text: "Streamlit으로 AI 앱 배포해보기", url: "https://streamlit.io" },
      { num: "04", text: "RAG 파이프라인 직접 구축해보기", url: "https://docs.llamaindex.ai" },
    ],
  },
  mlops: {
    id: "mlops", title: "MLOps Engineer", emoji: "⚙️",
    color: "#3B82F6", rgb: "59,130,246",
    tags: ["Docker", "K8s", "CI/CD", "MLflow"],
    typeTitle: "인프라 아키텍트형", typeDesc: "시스템이 혼자 돌아가게 만드는 자동화의 장인",
    mbti: "ISTJ · INTJ",
    hook: "한 번 만든 건 영원히 자동으로 돌아야 한다고 생각하는 사람이에요. 남들이 귀찮아하는 환경 세팅과 자동화를 오히려 즐기고, 시스템이 안정적으로 돌아갈 때 말로 표현 못할 뿌듯함을 느껴요.",
    hookBeginner: "뭔가 한 번 세팅해두면 알아서 돌아가야 직성이 풀리는 사람이에요. 폰 알림 설정부터 컴퓨터 바탕화면 정리까지, 내 주변 환경을 최적화하는 게 자연스럽게 느껴진다면 당신은 인프라 아키텍트형이에요.",
    realities: [
      "새벽 서버 알람에도 당황 안 하고 침착하게 로그 뜯는 사람 🌃",
      "팀원 환경 충돌 고쳐주다 나도 모르게 DevOps 담당이 된 경험 😅",
      "파이프라인 자동화 완성하고 혼자 뿌듯해한 적 있음 ✅",
      "\"왜 이걸 매번 수동으로 해?\"가 입에 달린 말 🤖",
    ],
    realitiesBeginner: [
      "한 번 만든 건 계속 자동으로 돌았으면 하는 마음 있음 🔄",
      "스마트폰 앱 자동화나 단축키 세팅에 시간 투자해본 적 있음 ⚙️",
      "\"왜 이걸 매번 손으로 해?\" 라는 생각 자주 드는 편 🤔",
      "뭔가 구조를 그려놓고 일하면 더 편한 스타일 📐",
    ],
    traits: ["자동화되지 않은 걸 보면 자동화하고 싶다", "안정성과 재현성을 중요하게 여긴다", "인프라 구조 다이어그램 그리는 걸 좋아한다", "장애 원인 추적에서 쾌감을 느낀다"],
    hardPoints: ["모델 팀과 인프라 팀 사이 조율 역할", "클라우드 비용 폭탄 경보"],
    demand: 88, growth: "+31%",
    stacks: [
      { name: "Docker", desc: "컨테이너 환경 구성 및 배포", level: "필수" },
      { name: "Linux / Bash", desc: "서버 운영 및 자동화 스크립트", level: "필수" },
      { name: "GitHub Actions", desc: "CI/CD 파이프라인 자동화", level: "필수" },
      { name: "MLflow", desc: "ML 실험 추적 및 모델 관리", level: "추천" },
      { name: "Prometheus / Grafana", desc: "서비스 모니터링 대시보드", level: "추천" },
      { name: "Kubernetes", desc: "대규모 컨테이너 오케스트레이션", level: "심화" },
      { name: "Terraform", desc: "인프라를 코드로 관리 (IaC)", level: "심화" },
    ],
    nextSteps: [
      { num: "01", text: "Docker 기초 익히고 컨테이너 만들기", url: "https://docs.docker.com/get-started" },
      { num: "02", text: "MLflow로 실험 추적 파이프라인 구축", url: "https://mlflow.org" },
      { num: "03", text: "GitHub Actions로 CI/CD 자동화 경험", url: "https://docs.github.com/actions" },
      { num: "04", text: "Kubernetes 기초 튜토리얼 완주하기", url: "https://kubernetes.io/docs/tutorials" },
    ],
  },
  "data-sci": {
    id: "data-sci", title: "Data Scientist", emoji: "📊",
    color: "#8B5CF6", rgb: "139,92,246",
    tags: ["Python", "통계", "ML", "시각화"],
    typeTitle: "인사이트 헌터형", typeDesc: "숫자 속에서 스토리를 발견하는 데이터 탐정",
    mbti: "INTP · INFJ",
    hook: "숫자 뒤에 숨어있는 이야기가 보이는 사람이에요. 남들이 그냥 지나치는 데이터에서 패턴을 찾아내고, 그걸 사람들이 이해할 수 있는 언어로 바꾸는 게 당신의 진짜 능력이에요.",
    hookBeginner: "왜 이런 결과가 나왔는지 이유를 찾아야 직성이 풀리는 사람이에요. 통계나 코드를 몰라도 숫자나 그래프를 보면 뭔가 궁금해지고, 숨어있는 패턴을 발견했을 때 기분이 좋다면 당신은 인사이트 헌터형이에요.",
    realities: [
      "데이터 받자마자 분포부터 확인하는 게 본능인 사람 📊",
      "상관관계랑 인과관계 구분 못 하는 말 들으면 속으로 답답함 😤",
      "그래프 하나로 회의실 분위기 바꿔본 적 있음 💡",
      "\"이 결정, 데이터 보고 합시다\"가 입버릇인 사람 🔍",
    ],
    realitiesBeginner: [
      "뉴스나 기사에서 통계 그래프 보면 자세히 들여다보게 됨 📈",
      "\"왜 이게 인기가 많지?\" 같은 이유를 찾고 싶어하는 스타일 🤔",
      "엑셀로 뭔가 정리하거나 비교표 만들어본 경험 있음 📋",
      "결론보다 근거가 중요하다고 생각하는 편 🎯",
    ],
    traits: ["데이터를 보면 왜?라고 먼저 묻는다", "가설 설정과 검증 과정이 재미있다", "시각화로 설득하는 걸 즐긴다", "통계적 근거 없는 주장에 불편함을 느낀다"],
    hardPoints: ["분석 결과가 실제 의사결정에 반영 안 될 때", "데이터 품질이 엉망인 환경"],
    demand: 85, growth: "+24%",
    stacks: [
      { name: "Python", desc: "데이터 분석의 표준 언어", level: "필수" },
      { name: "Pandas / NumPy", desc: "데이터 전처리 및 수치 연산", level: "필수" },
      { name: "SQL", desc: "DB에서 데이터 추출 및 집계", level: "필수" },
      { name: "Matplotlib / Seaborn", desc: "데이터 시각화 및 EDA", level: "추천" },
      { name: "Scikit-learn", desc: "머신러닝 모델 학습 및 평가", level: "추천" },
      { name: "PyTorch / TensorFlow", desc: "딥러닝 모델 직접 구현", level: "심화" },
      { name: "A/B Testing", desc: "실험 설계 및 통계적 검증", level: "심화" },
    ],
    nextSteps: [
      { num: "01", text: "Pandas + Matplotlib으로 EDA 프로젝트", url: "https://pandas.pydata.org" },
      { num: "02", text: "Kaggle 입문 대회 참가해보기", url: "https://kaggle.com/competitions" },
      { num: "03", text: "Scikit-learn으로 첫 ML 모델 만들기", url: "https://scikit-learn.org" },
      { num: "04", text: "SQL 기초 익히고 데이터 뽑아보기", url: "https://sqlzoo.net" },
    ],
  },
};

// ── 질문 데이터 ───────────────────────────
export const Q_BEGINNER: Question[] = [
  {
    q: "새로운 카페에 갔을 때 나는?", opts: [
      { t: "메뉴판 보고 뭐가 제일 잘 팔리는지 궁금해진다", w: { "data-sci": 3 } },
      { t: "분위기 보고 여기서 뭘 만들면 잘 팔릴지 상상해본다", w: { "ai-app": 3 } },
      { t: "동선이랑 좌석 배치가 효율적인지 자연스럽게 살펴본다", w: { "mlops": 3 } },
      { t: "그냥 커피 한 잔 마시고 쉰다", w: {} },
    ]
  },
  {
    q: "무언가를 배울 때 더 재미있는 건?", opts: [
      { t: "화면에 그림이나 글자가 짠! 하고 나타나는 것", w: { "ai-app": 3 } },
      { t: "복잡한 데이터를 정리해서 깔끔한 표로 만드는 것", w: { "data-sci": 3 } },
      { t: "뒤에서 시스템이 돌아가는 원리를 이해하는 것", w: { "mlops": 3, "data-sci": 1 } },
      { t: "왜 이런지 이유를 찾는 것", w: { "data-sci": 2, "mlops": 1 } },
    ]
  },
  {
    q: "오늘 뭐 할지 아무 계획 없을 때 자연스럽게 하게 되는 게 뭐야?", opts: [
      { t: "머릿속에 있던 아이디어 하나 꺼내서 만들어보기", w: { "ai-app": 3, "mlops": 1 } },
      { t: "요즘 내 패턴이나 데이터 들여다보기", w: { "data-sci": 3, "ai-app": 1 } },
      { t: "정리 안 된 것들 싹 정돈하고 자동화해두기", w: { "mlops": 3, "data-sci": 1 } },
      { t: "유튜브 틀어놓고 그냥 쉬기", w: {} },
    ]
  },
  {
    q: "단체 카톡방에서 자연스럽게 맡는 역할은?", opts: [
      { t: "일정·장소 공지하고 취합하는 총무형", w: { "mlops": 3, "data-sci": 1 } },
      { t: "분위기 띄우고 아이디어 제안하는 활력소형", w: { "ai-app": 3 } },
      { t: "조용히 읽다가 필요할 때 정확한 정보 던지는 팩트형", w: { "data-sci": 3, "mlops": 1 } },
      { t: "읽씹하다가 중요한 것만 답하는 관찰자형", w: {} },
    ]
  },
  {
    q: "자주 쓰는 앱에서 불편한 점을 발견했을 때?", opts: [
      { t: "\"이런 기능 넣으면 대박 나겠는데\" 상상해본다", w: { "ai-app": 3, "mlops": 1 } },
      { t: "이게 왜 이러지? 하고 원인을 찾아본다", w: { "mlops": 2, "data-sci": 2 } },
      { t: "불편한 사람이 나만인지 리뷰 찾아본다", w: { "data-sci": 3, "ai-app": 1 } },
      { t: "그냥 참고 쓴다", w: {} },
    ]
  },
  {
    q: "IT 뉴스에서 가장 눈길이 가는 제목은?", opts: [
      { t: "\"AI가 그린 그림이 미술 대회 우승\"", w: { "ai-app": 3, "data-sci": 1 } },
      { t: "\"카카오톡 서버가 멈춘 이유와 해결 과정\"", w: { "mlops": 3, "data-sci": 1 } },
      { t: "\"새로운 AI 기술 논문 발표\"", w: { "data-sci": 3, "mlops": 1 } },
      { t: "\"올해 가장 많이 팔린 IT 서비스 트렌드\"", w: { "ai-app": 2, "data-sci": 2 } },
    ]
  },
  {
    q: "조별 과제를 할 때 내가 주로 하는 말은?", opts: [
      { t: "\"자, 역할 나누고 언제까지 하자\"", w: { "mlops": 3, "ai-app": 1 } },
      { t: "\"내가 자료 조사랑 정리 싹 다 할게\"", w: { "data-sci": 3, "mlops": 1 } },
      { t: "\"어려운 부분 있으면 내가 할게\"", w: { "ai-app": 3, "mlops": 1 } },
      { t: "\"PPT 디자인이랑 발표는 내가 할게\"", w: {} },
    ]
  },
  {
    q: "마감 D-1, 진행률 50%. 당신의 선택은?", opts: [
      { t: "잠 포기하고 끝날 때까지 한다", w: { "ai-app": 3, "mlops": 1 } },
      { t: "핵심만 빠르게 채워서 제출한다", w: { "ai-app": 2, "mlops": 1 } },
      { t: "우선순위 정하고 중요한 것부터 채운다", w: { "mlops": 3, "data-sci": 1 } },
      { t: "어느 정도 하다가 내일 일찍 일어나서 마저 한다", w: { "data-sci": 2, "mlops": 1 } },
    ]
  },
  {
    q: "유명 맛집 웨이팅이 2시간이라는 걸 알았을 때?", opts: [
      { t: "기다리는 동안 이 가게 하루 매출이 얼마일지 계산해본다", w: { "data-sci": 3 } },
      { t: "기다리는 동안 할 거 찾아서 근처 카페 간다", w: { "ai-app": 2, "mlops": 1 } },
      { t: "다음엔 오픈런 해야겠다고 메모해둔다", w: { "mlops": 3, "data-sci": 1 } },
      { t: "그냥 근처 다른 맛집 검색한다", w: {} },
    ]
  },
  {
    q: "새로운 핸드폰이나 기계를 샀을 때?", opts: [
      { t: "설명서부터 꼼꼼히 읽어본다", w: { "data-sci": 3, "mlops": 1 } },
      { t: "일단 이것저것 눌러보면서 기능을 익힌다", w: { "ai-app": 3 } },
      { t: "유튜브 리뷰 영상을 찾아본다", w: { "ai-app": 1, "data-sci": 2 } },
      { t: "세팅이랑 최적화부터 한다", w: { "mlops": 3, "ai-app": 1 } },
    ]
  },
  {
    q: "나중에 어떤 사람으로 불리고 싶어?", opts: [
      { t: "저 사람한테 맡기면 무조건 해결돼", w: { "ai-app": 3, "mlops": 1 } },
      { t: "진짜 창의적이고 아이디어가 좋아", w: { "ai-app": 2, "data-sci": 1 } },
      { t: "아는 게 정말 많고 깊이가 있어", w: { "data-sci": 3, "mlops": 1 } },
      { t: "일 처리가 깔끔하고 정리를 잘해", w: { "mlops": 3, "data-sci": 1 } },
    ]
  },
  {
    q: "주변 사람들이 나를 어떻게 기억했으면 해?", opts: [
      { t: "저 사람 덕분에 뭔가 생겨났어", w: { "ai-app": 3 } },
      { t: "저 사람 말은 믿을 수 있어, 근거가 있으니까", w: { "data-sci": 3, "mlops": 1 } },
      { t: "저 사람 있으면 뭐든 안정적으로 돌아가", w: { "mlops": 3, "ai-app": 1 } },
      { t: "저 사람이랑 있으면 항상 재밌어", w: {} },
    ]
  },
  {
    q: "블로그나 SNS를 한다면?", opts: [
      { t: "사람들이 좋아할 만한 꿀팁 정보를 올린다", w: { "ai-app": 3, "data-sci": 1 } },
      { t: "내가 공부한 내용을 기록용으로 정리한다", w: { "data-sci": 3, "mlops": 1 } },
      { t: "감성적인 사진과 짧은 글을 올린다", w: {} },
      { t: "구축한 시스템이나 자동화 경험을 공유한다", w: { "mlops": 3, "ai-app": 1 } },
    ]
  },
  {
    q: "꽉 막힌 도로에서 차가 안 움직인다면?", opts: [
      { t: "내가 아는 지름길로 빠져나간다", w: { "ai-app": 3, "mlops": 1 } },
      { t: "네비게이션 도착 시간을 믿고 기다린다", w: { "mlops": 3 } },
      { t: "왜 막혔는지 교통 정보 앱으로 분석한다", w: { "data-sci": 3, "mlops": 1 } },
      { t: "동승자와 수다 떨며 시간을 보낸다", w: {} },
    ]
  },
  {
    q: "게임을 한다면 어떤 장르?", opts: [
      { t: "심시티·문명 같은 건설·경영 시뮬레이션", w: { "mlops": 3, "data-sci": 1 } },
      { t: "롤·오버워치 같은 팀플레이 경쟁", w: { "ai-app": 2, "data-sci": 1 } },
      { t: "혼자서 스토리를 즐기는 RPG", w: { "data-sci": 3 } },
      { t: "게임 안 하는 편", w: {} },
    ]
  },
  {
    q: "요리할 때 어떤 스타일이야?", opts: [
      { t: "레시피 보면서 정확하게 계량해서 만든다", w: { "data-sci": 3, "mlops": 1 } },
      { t: "일단 냉장고 열고 있는 재료로 즉흥으로 만든다", w: { "ai-app": 3 } },
      { t: "레시피는 참고만 하고 내 방식대로 바꿔서 만든다", w: { "ai-app": 2, "data-sci": 1 } },
      { t: "요리 안 하고 시켜먹는다", w: {} },
    ]
  },
  {
    q: "자격증 공부할 때 내 스타일은?", opts: [
      { t: "기초부터 차근차근 원리를 이해해야 한다", w: { "data-sci": 3, "mlops": 1 } },
      { t: "기출문제 위주로 빠르게 훑는다", w: { "ai-app": 3 } },
      { t: "나만의 요약 노트를 정성껏 만든다", w: { "mlops": 3, "data-sci": 1 } },
      { t: "합격 후기 찾아보고 최단 기간 루틴 짠다", w: { "mlops": 2, "ai-app": 1 } },
    ]
  },
  {
    q: "어려운 개념을 남에게 설명해야 한다면?", opts: [
      { t: "예시와 비유로 최대한 쉽게 풀어서 설명한다", w: { "ai-app": 3, "data-sci": 1 } },
      { t: "정확한 용어와 구조로 체계적으로 설명한다", w: { "data-sci": 3, "mlops": 1 } },
      { t: "그림이나 도식으로 그려서 보여준다", w: { "mlops": 3, "data-sci": 1 } },
      { t: "검색해보라고 링크 보내준다", w: {} },
    ]
  },
  {
    q: "택배가 예상보다 늦게 올 때 나는?", opts: [
      { t: "배송 조회해서 현재 위치 파악한다", w: { "data-sci": 3, "mlops": 1 } },
      { t: "언제 올지 계산해보고 그냥 기다린다", w: { "mlops": 3, "data-sci": 1 } },
      { t: "고객센터 바로 연락해서 따진다", w: { "ai-app": 3 } },
      { t: "신경 끄고 있다가 알림 오면 받는다", w: {} },
    ]
  },
  {
    q: "모임에서 장소를 정해야 할 때?", opts: [
      { t: "맛집, 위치, 가격 비교해서 엑셀로 정리해 공유한다", w: { "data-sci": 3, "mlops": 1 } },
      { t: "\"어디 가고 싶어?\" 의견을 듣고 결정한다", w: { "ai-app": 2, "mlops": 1 } },
      { t: "\"그냥 아무 데나 가자\" (따라가는 편)", w: {} },
      { t: "동선 최적화해서 이동 시간 제일 적은 곳으로 정한다", w: { "mlops": 3, "data-sci": 1 } },
    ]
  },
];

export const Q_EXPERT: Question[] = [
  {
    q: "코드가 에러가 났을 때?", opts: [
      { t: "로그를 한 줄 한 줄 뜯어보며 원인을 찾는다", w: { "data-sci": 3, "mlops": 1 } },
      { t: "에러 메시지 복사해서 AI한테 물어본다", w: { "ai-app": 3 } },
      { t: "구조적으로 어디가 잘못됐는지 전체 그림을 본다", w: { "mlops": 3, "data-sci": 1 } },
      { t: "검색해서 비슷한 케이스 찾아본다", w: { "ai-app": 2, "data-sci": 1 } },
    ]
  },
  {
    q: "AI 모델을 다룰 때 어떤 점이 즐거워?", opts: [
      { t: "최신 모델을 API로 가져와서 바로 서비스로 만드는 것", w: { "ai-app": 3 } },
      { t: "어떤 프롬프트를 써야 원하는 답이 나오는지 실험하는 것", w: { "ai-app": 2, "data-sci": 1 } },
      { t: "모델의 내부 구조를 뜯어보고 이해하는 것", w: { "data-sci": 3, "ai-app": 1 } },
      { t: "모델이 하루 100만 번 호출되어도 안 죽게 만드는 것", w: { "mlops": 3 } },
    ]
  },
  {
    q: "AI 팀에서 기술 스택 결정할 때 내가 가장 중시하는 기준은?", opts: [
      { t: "개발 속도 — 빠르게 배포하고 피드백 받을 수 있는가", w: { "ai-app": 3 } },
      { t: "분석력 — 데이터에서 인사이트를 잘 뽑아낼 수 있는가", w: { "data-sci": 3 } },
      { t: "확장성·안정성 — 트래픽 10배에도 버티는가", w: { "mlops": 3 } },
      { t: "유지보수성 — 6개월 후에도 누구든 바로 이해할 수 있는가", w: { "mlops": 2, "data-sci": 1 } },
    ]
  },
  {
    q: "프로덕션에서 갑자기 에러가 터졌을 때", opts: [
      { t: "일단 빠르게 롤백하고 원인을 찾는다", w: { "ai-app": 3, "mlops": 1 } },
      { t: "로그 뜯어보면서 근본 원인부터 찾는다", w: { "data-sci": 3, "mlops": 1 } },
      { t: "인프라 복구하고 재발 방지 시스템 구축한다", w: { "mlops": 3 } },
      { t: "팀원들한테 상황 공유하고 같이 파악한다", w: {} },
    ]
  },
  {
    q: "다음 중 가장 배워보고 싶은 기술은?", opts: [
      { t: "Kubernetes, Docker, CI/CD", w: { "mlops": 3 } },
      { t: "React, Next.js, FastAPI", w: { "ai-app": 3, "mlops": 1 } },
      { t: "PyTorch, TensorFlow, Hugging Face", w: { "data-sci": 3, "ai-app": 1 } },
      { t: "Tableau, SQL, Pandas", w: { "data-sci": 3 } },
    ]
  },
  {
    q: "RAG vs 파인튜닝 논쟁이 붙었을 때 나는?", opts: [
      { t: "일단 RAG로 빠르게 MVP 만들고 유저 반응 본다", w: { "ai-app": 3 } },
      { t: "두 방식의 품질·비용 데이터 먼저 뽑아본다", w: { "data-sci": 3, "ai-app": 1 } },
      { t: "서빙 비용·레이턴시 시뮬레이션 먼저 돌린다", w: { "mlops": 3, "data-sci": 1 } },
      { t: "도메인 특성·데이터 규모 기준으로 케이스 나눠본다", w: { "data-sci": 2, "mlops": 1 } },
    ]
  },
  {
    q: "이력서에 넣고 싶은 최종 프로젝트는?", opts: [
      { t: "실사용자가 있는 LLM 기반 SaaS 서비스", w: { "ai-app": 3 } },
      { t: "비즈니스 임팩트를 수치로 증명한 데이터 분석 프로젝트", w: { "data-sci": 3 } },
      { t: "자동화된 ML 파이프라인 + 실시간 모니터링 대시보드", w: { "mlops": 3 } },
      { t: "최신 논문 재현 + 체계적인 실험 기록", w: { "data-sci": 2, "mlops": 1 } },
    ]
  },
  {
    q: "내가 만든 결과물, 어떤 형태일 때 가장 뿌듯해?", opts: [
      { t: "실제 사용자가 쓰고 있는 서비스", w: { "ai-app": 3 } },
      { t: "정확도가 올라간 모델", w: { "data-sci": 3, "ai-app": 1 } },
      { t: "24시간 안정적으로 돌아가는 시스템", w: { "mlops": 3 } },
      { t: "깔끔하게 정리된 분석 보고서", w: { "data-sci": 3, "mlops": 1 } },
    ]
  },
  {
    q: "AI 팀에서 자연스럽게 맡게 되는 역할은?", opts: [
      { t: "LLM 프롬프트 엔지니어링 + API 연동 구현", w: { "ai-app": 3 } },
      { t: "데이터 EDA + 가설 검증 + 인사이트 리포팅", w: { "data-sci": 3 } },
      { t: "ML 파이프라인 자동화 + 모델 서빙·모니터링", w: { "mlops": 3 } },
      { t: "전체 아키텍처 설계 + 기술 의사결정 리드", w: { "mlops": 2, "ai-app": 1 } },
    ]
  },
  {
    q: "막히는 문제가 생겼을 때 해결 방식은?", opts: [
      { t: "최신 논문이나 해외 기술 블로그를 깊이 파본다", w: { "data-sci": 3, "mlops": 1 } },
      { t: "공식 문서 찾아서 빠르게 적용한다", w: { "ai-app": 3 } },
      { t: "여러 가지 입력값을 바꿔가며 될 때까지 실험해본다", w: { "ai-app": 2, "data-sci": 2 } },
      { t: "동료나 전문가에게 물어보고 구조적인 해결책을 찾는다", w: { "mlops": 2, "data-sci": 1 } },
    ]
  },
  {
    q: "새로운 AI 툴이 나오면?", opts: [
      { t: "이걸로 어떤 서비스를 만들 수 있을지 구상한다", w: { "ai-app": 3 } },
      { t: "어떻게 프롬프트를 써야 잘 나오는지 연구한다", w: { "ai-app": 2, "data-sci": 1 } },
      { t: "API 문서부터 찾아서 연동해본다", w: { "ai-app": 2, "mlops": 2 } },
      { t: "어떤 원리로 돌아가는지 기술 블로그를 찾아본다", w: { "data-sci": 3, "mlops": 1 } },
    ]
  },
  {
    q: "코드 리뷰할 때 가장 먼저 집중해서 보는 부분은?", opts: [
      { t: "사용자 입장에서 UX 흐름이 자연스럽고 직관적인지", w: { "ai-app": 3 } },
      { t: "데이터 처리 로직의 정확성과 엣지 케이스 핸들링", w: { "data-sci": 3, "mlops": 1 } },
      { t: "실제 배포 환경에서 장애 없이 안정적으로 돌아갈지", w: { "mlops": 3 } },
      { t: "코드 가독성·재사용성·테스트 커버리지", w: { "mlops": 2, "data-sci": 1 } },
    ]
  },
  {
    q: "가장 중요하게 생각하는 가치는?", opts: [
      { t: "혁신과 새로운 발견", w: { "ai-app": 3, "data-sci": 1 } },
      { t: "안정성과 신뢰", w: { "mlops": 3 } },
      { t: "실용성과 사용자 가치", w: { "ai-app": 2, "mlops": 2 } },
      { t: "데이터 기반 의사결정", w: { "data-sci": 3 } },
    ]
  },
  {
    q: "팀 프로젝트에서 갈등이 생기면 주로 어떤 역할을 해?", opts: [
      { t: "내 의견을 논리적으로 설득해서 관철시킨다", w: { "data-sci": 2, "ai-app": 1 } },
      { t: "상대방 의견을 듣고 절충안을 제안한다", w: { "mlops": 2, "ai-app": 1 } },
      { t: "말보다는 묵묵히 내 할 일을 해서 기여한다", w: { "mlops": 3 } },
      { t: "팀 분위기 파악하고 중재한다", w: {} },
    ]
  },
  {
    q: "커리어 성장을 위해 지금 당장 집중하고 있는 것은?", opts: [
      { t: "LLM 기반 서비스 완성도 높여서 실사용자 늘리기", w: { "ai-app": 3 } },
      { t: "도메인 특화 데이터 파이프라인 구축하고 인사이트 뽑기", w: { "data-sci": 3, "mlops": 1 } },
      { t: "MLOps 자동화 수준 높이고 모니터링 고도화하기", w: { "mlops": 3 } },
      { t: "AI 전반 기술 스택 넓히면서 아키텍처 설계 역량 키우기", w: { "mlops": 2, "ai-app": 1 } },
    ]
  },
  {
    q: "사이드 프로젝트 아이디어가 떠올랐을 때 제일 먼저 하는 행동은?", opts: [
      { t: "바로 Claude·GPT로 MVP 코드 초안 뽑아보기", w: { "ai-app": 3 } },
      { t: "관련 공개 데이터셋 먼저 찾아보기", w: { "data-sci": 3 } },
      { t: "기술 스택 선정 + 인프라 아키텍처 설계부터 하기", w: { "mlops": 3 } },
      { t: "경쟁 서비스 조사하고 차별점 먼저 정의하기", w: { "ai-app": 2, "data-sci": 1 } },
    ]
  },
  {
    q: "5년 후 나의 전문성은?", opts: [
      { t: "LLM 기반 프로덕트를 혼자 기획하고 출시하는 AI 빌더", w: { "ai-app": 3 } },
      { t: "비즈니스 문제를 데이터로 풀어내는 AI 분석 전문가", w: { "data-sci": 3 } },
      { t: "대규모 AI 시스템을 안정적으로 운영하는 인프라 전문가", w: { "mlops": 3 } },
      { t: "AI 전반을 아우르는 테크 리드", w: { "mlops": 2, "ai-app": 1 } },
    ]
  },
  {
    q: "새로운 AI 프레임워크나 라이브러리가 나왔을 때?", opts: [
      { t: "바로 설치해서 기존 프로젝트에 붙여본다", w: { "ai-app": 3 } },
      { t: "벤치마크랑 기존 대비 성능 차이부터 확인한다", w: { "data-sci": 3, "mlops": 1 } },
      { t: "서빙 환경에서 호환성이랑 리소스 사용량부터 파악한다", w: { "mlops": 3, "data-sci": 1 } },
      { t: "커뮤니티 후기 먼저 훑고 나서 결정한다", w: {} },
    ]
  },
  {
    q: "AI 프로젝트에서 가장 스트레스받는 상황은?", opts: [
      { t: "LLM 응답이 매번 달라서 재현이 안 되고 디버깅이 막힐 때", w: { "ai-app": 3 } },
      { t: "데이터 품질이 엉망이라 분석 신뢰도 자체가 흔들릴 때", w: { "data-sci": 3 } },
      { t: "모델 성능이 조용히 저하되는데 모니터링이 늦게 감지할 때", w: { "mlops": 3, "data-sci": 1 } },
      { t: "내 기술적 판단을 팀원이 이해 못 하고 설득이 안 될 때", w: {} },
    ]
  },
  {
    q: "LLM 서비스 운영 중 토큰 비용이 예상의 3배가 나왔을 때?", opts: [
      { t: "프롬프트 압축하고 캐싱 레이어 바로 붙인다", w: { "ai-app": 3, "mlops": 1 } },
      { t: "어떤 요청 패턴이 비용을 올렸는지 로그 분석부터 한다", w: { "data-sci": 3, "mlops": 1 } },
      { t: "오토스케일링 정책이랑 모델 라우팅 구조 전체를 재설계한다", w: { "mlops": 3 } },
      { t: "더 저렴한 모델로 교체 가능한지 성능 비교한다", w: { "data-sci": 2, "ai-app": 1 } },
    ]
  },
];