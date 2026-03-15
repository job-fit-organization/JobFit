// ─────────────────────────────────────────
//  JobFit — AI 직무 적성 테스트 공유 라이브러리
//  src/app/test/_lib.tsx
//
//  사용처:
//    - src/app/test/page.tsx        (테스트 페이지)
//    - src/app/test/result/page.tsx (결과 페이지)
// ─────────────────────────────────────────

"use client";

// ── Types ────────────────────────────────
export type JobId = "ai-app" | "mlops" | "data-sci";
export type RadarKey = "llm" | "dl" | "data" | "service" | "infra" | "collab";
export type Mode = "beginner" | "expert";

export type JobScores = Record<JobId, number>;
export type RadarScores = Record<RadarKey, number>;

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

export function calcTop2(jobScores: JobScores): [JobId, JobId] {
  const sorted = (Object.entries(jobScores) as [JobId, number][])
    .sort((a, b) => b[1] - a[1]);
  return [sorted[0][0], sorted[1][0]];
}

/** 직무 점수를 0~100 퍼센트로 정규화 */
export function normalizeScores(jobScores: JobScores): Record<JobId, number> {
  const total = Object.values(jobScores).reduce((s, v) => s + v, 0) || 1;
  return {
    "ai-app": Math.round((jobScores["ai-app"] / total) * 100),
    "mlops": Math.round((jobScores["mlops"] / total) * 100),
    "data-sci": Math.round((jobScores["data-sci"] / total) * 100),
  };
}

// ── localStorage 키 ──────────────────────
export const LS_KEY = "jobfit_test_result";

export interface TestResult {
  jobScores: JobScores;
  radarScores: RadarScores;
  mode: Mode;
  top2?: [JobId, JobId];
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

// ── CSS (PC 기준 + 반응형) ──
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

  /* 공통 카드 */
  .card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 20px;
    box-shadow: var(--shadow-sm);
    transition: box-shadow 0.2s, border-color 0.2s;
  }

  /* PC 기준 페이지 컨테이너 */
  .page-wrap {
    max-width: var(--content-width);
    margin: 0 auto;
    padding: 56px var(--content-pad) 80px;
    width: 100%;
  }

  /* 테스트/결과 2컬럼 레이아웃 (PC) */
  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    align-items: start;
  }
  .two-col .col-left  { position: sticky; top: 40px; }
  .two-col .col-right { display: flex; flex-direction: column; gap: 14px; }

  /* 선택지 버튼 */
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
  /* 선택 확인 체크 뱃지 (오른쪽) */
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

  /* 태블릿 */
  @media (max-width: 860px) {
    :root { --content-width: 100%; --content-pad: 28px; }
    .two-col { grid-template-columns: 1fr; gap: 20px; }
    .two-col .col-left { position: static; }
  }

  /* 모바일 */
  @media (max-width: 480px) {
    :root { --content-pad: 18px; }
    .page-wrap { padding-top: 32px; }
    .mode-card { padding: 20px 16px; border-radius: 16px; }
    .opt { padding: 13px 14px; font-size: 14px; }
    .card { border-radius: 16px; }
  }
`;

// ── JOBS 데이터 ──────────────────────────
export const JOBS: Record<JobId, Job> = {
  "ai-app": {
    id: "ai-app", title: "AI Application Engineer", emoji: "🤖",
    color: "#10B981", rgb: "16,185,129",
    tags: ["LLM", "RAG", "FastAPI", "Agent"],
    typeTitle: "서비스 빌더형", typeDesc: "아이디어를 빠르게 현실로 만드는 실행력의 소유자",
    mbti: "ENTP · ENFJ",
    hook: "아이디어가 떠오르면 자기도 모르게 손이 먼저 움직이는 사람이에요. 완벽한 계획보다 일단 돌아가는 걸 만드는 게 본능이고, 그게 AI 시대에 가장 강력한 무기예요.",
    realities: [
      "GPT API 처음 붙였을 때 응답 하나에 소름 돋았던 경험 있음 ⚡",
      "사용자 피드백 하나에 밤새 코드 뜯어고친 적 있음 🔧",
      "배포 직후 실사용자가 생겼을 때 그 짜릿함 때문에 개발하는 사람 🚀",
      "\"일단 만들어보고 고치자\"가 개발 철학인 사람 🛠️",
    ],
    hookBeginner: "뭔가 새로운 걸 보면 직접 써보지 않으면 못 배기는 사람이에요. ChatGPT를 처음 써봤을 때 \"이걸로 뭔가 만들 수 있겠다\"는 생각이 들었다면, 당신은 이미 서비스 빌더형이에요.",
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
    realities: [
      "새벽 서버 알람에도 당황 안 하고 침착하게 로그 뜯는 사람 🌃",
      "팀원 환경 충돌 고쳐주다 나도 모르게 DevOps 담당이 된 경험 😅",
      "파이프라인 자동화 완성하고 혼자 뿌듯해한 적 있음 ✅",
      "\"왜 이걸 매번 수동으로 해?\"가 입에 달린 말 🤖",
    ],
    hookBeginner: "뭔가 한 번 세팅해두면 알아서 돌아가야 직성이 풀리는 사람이에요. 폰 알림 설정부터 컴퓨터 바탕화면 정리까지, 내 주변 환경을 최적화하는 게 자연스럽게 느껴진다면 당신은 인프라 아키텍트형이에요.",
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
    realities: [
      "데이터 받자마자 분포부터 확인하는 게 본능인 사람 📊",
      "상관관계랑 인과관계 구분 못 하는 말 들으면 속으로 답답함 😤",
      "그래프 하나로 회의실 분위기 바꿔본 적 있음 💡",
      "\"이 결정, 데이터 보고 합시다\"가 입버릇인 사람 🔍",
    ],
    hookBeginner: "왜 이런 결과가 나왔는지 이유를 찾아야 직성이 풀리는 사람이에요. 통계나 코드를 몰라도 숫자나 그래프를 보면 뭔가 궁금해지고, 숨어있는 패턴을 발견했을 때 기분이 좋다면 당신은 인사이트 헌터형이에요.",
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

// ── 질문 데이터 (3개 가중치: app / data-sci / mlops) ──
// ── 질문 데이터 (3개 가중치: app / data-sci / mlops) ──
export const Q_BEGINNER: Question[] = [
  {
    q: "친구한테 '너 어떤 사람이야?' 물어보면 뭐라고 할 것 같아?", opts: [
      { t: "아이디어 생기면 일단 만들어보는 실행파 🛠️", w: { "ai-app": 3, mlops: 0, "data-sci": 0 } },
      { t: "왜 그런지 이유 찾기 전엔 못 넘어가는 탐구파 🔍", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "한 번 세팅해두면 알아서 돌아야 직성 풀리는 자동화파 ⚙️", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "상황에 따라 다르지만 팀 분위기 잘 맞추는 편 😊", w: { "ai-app": 1, mlops: 1, "data-sci": 1 } },
    ]
  },
  {
    q: "카카오톡 단톡방이 조용한 일요일 오후, 나는?", opts: [
      { t: "ChatGPT로 뭔가 만들거나 자동화 실험 중 🤖", w: { "ai-app": 3, mlops: 1, "data-sci": 0 } },
      { t: "요즘 트렌드나 데이터 관련 아티클 읽는 중 📖", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "컴퓨터·폰 설정 최적화하거나 홈서버 만지는 중 🖥️", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "넷플릭스 보거나 그냥 쉬는 중 🍿", w: { "ai-app": 1, mlops: 1, "data-sci": 1 } },
    ]
  },
  {
    q: "친구가 창업 아이디어를 들고 왔다. 내 첫 반응은?", opts: [
      { t: "\"AI 챗봇 붙이면 훨씬 잘 될 것 같은데, 내가 만들어줄게!\" 🛠️", w: { "ai-app": 3, mlops: 0, "data-sci": 0 } },
      { t: "\"비슷한 서비스 데이터 찾아봐야 해, 일단 분석해볼게\" 📊", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "\"서버랑 인프라 어떻게 굴릴 거야? 그게 제일 중요해\" 🔧", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "\"오 재밌겠다! 나 뭐 도와줄 수 있어?\" 😊", w: { "ai-app": 1, mlops: 1, "data-sci": 1 } },
    ]
  },
  {
    q: "자주 쓰는 앱이 갑자기 튕겼다. 머릿속에 드는 생각은?", opts: [
      { t: "\"내가 만들면 이것보단 잘 만들겠는데\" 😤", w: { "ai-app": 3, mlops: 0, "data-sci": 0 } },
      { t: "\"이 시간대에 왜 갑자기 트래픽이 몰렸을까\" 🤔", w: { "ai-app": 0, mlops: 1, "data-sci": 3 } },
      { t: "\"배포 실수거나 서버 설정 문제 아닐까\" 🔧", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "\"그냥 재시작하면 되지 뭐\" 😇", w: { "ai-app": 1, mlops: 1, "data-sci": 1 } },
    ]
  },
  {
    q: "어떤 뉴스 기사 제목이 가장 먼저 클릭하고 싶어?", opts: [
      { t: "\"AI 챗봇 하나로 월 500만원 버는 1인 개발자\" 💰", w: { "ai-app": 3, mlops: 0, "data-sci": 0 } },
      { t: "\"배달앱 주문 데이터로 밝혀낸 한국인 야식 패턴\" 🍕", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "\"넷플릭스가 서버 비용을 60% 줄인 방법\" ⚡", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "\"AI가 만든 예술 작품, 저작권은 누구 것?\" ⚖️", w: { "ai-app": 1, mlops: 0, "data-sci": 2 } },
    ]
  },
  {
    q: "팀 발표 전날 밤, 나는 주로 뭘 하고 있어?", opts: [
      { t: "작동하는 데모나 프로토타입 밤새 완성하는 중 🌙", w: { "ai-app": 3, mlops: 0, "data-sci": 0 } },
      { t: "데이터 한 번 더 뜯어보면서 인사이트 보강하는 중 📊", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "발표 환경 세팅이랑 기술 부분 마지막 점검하는 중 🔧", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "PPT 슬라이드 디자인 다듬고 발표 연습하는 중 🎨", w: { "ai-app": 1, mlops: 1, "data-sci": 1 } },
    ]
  },
  {
    q: "AI로 내 하루를 자동화할 수 있다면, 뭐가 제일 먼저 하고 싶어?", opts: [
      { t: "나만의 AI 비서 앱 직접 만들어서 쓰기 🤖", w: { "ai-app": 3, mlops: 0, "data-sci": 0 } },
      { t: "내 하루 패턴 데이터 모아서 생산성 분석하기 📊", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "집 기기 연동해서 전부 자동화 파이프라인으로 묶기 🏠", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "일단 AI 구독 서비스 하나 써보면서 익히기 💳", w: { "ai-app": 2, mlops: 0, "data-sci": 1 } },
    ]
  },
  {
    q: "첫 AI 관련 포트폴리오, 무엇을 만들고 싶어?", opts: [
      { t: "실제로 사람들이 쓸 수 있는 AI 서비스 앱 📱", w: { "ai-app": 3, mlops: 0, "data-sci": 0 } },
      { t: "데이터로 실제 문제를 해결한 분석 보고서 📑", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "자동으로 돌아가는 데이터·AI 파이프라인 시스템 ⚙️", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "아직 방향을 못 잡겠어서 일단 이 테스트 중 🤷", w: { "ai-app": 1, mlops: 1, "data-sci": 1 } },
    ]
  },
  {
    q: "10년 후 커리어, 어떤 모습이 가장 설레?", opts: [
      { t: "내가 만든 AI 앱을 100만 명이 쓰는 창업가 🚀", w: { "ai-app": 3, mlops: 0, "data-sci": 0 } },
      { t: "데이터로 세상 문제를 해결하는 분석가·연구자 🌍", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "수백만 명이 쓰는 AI 시스템 인프라를 책임지는 엔지니어 👑", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "AI 분야에서 뭐든 잘 아는 제너럴리스트 전문가 🧠", w: { "ai-app": 1, mlops: 1, "data-sci": 1 } },
    ]
  },
  {
    q: "주말 오후 유튜브를 켰다. 어떤 영상에 손이 가?", opts: [
      { t: "\"AI 서비스 혼자 만들기\" 튜토리얼 🎬", w: { "ai-app": 3, mlops: 0, "data-sci": 0 } },
      { t: "\"데이터로 인사이트 찾는 법\" 강의 📊", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "\"홈서버 구축 완전 정복\" 브이로그 🖥️", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "알고리즘 추천 그냥 보는 편 😌", w: { "ai-app": 1, mlops: 1, "data-sci": 1 } },
    ]
  },
  {
    q: "AI 서비스를 처음 써봤을 때 머릿속에 든 생각은?", opts: [
      { t: "\"나도 이런 거 만들 수 있을 것 같은데?\" 🛠️", w: { "ai-app": 3, mlops: 0, "data-sci": 0 } },
      { t: "\"이게 도대체 어떤 데이터로 학습된 거지?\" 🔍", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "\"이걸 수백만 명한테 동시에 서빙하는 구조가 어떻게 돼있을까\" 🤔", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "\"신기하다! 근데 나랑 직접 관련은 없겠지\" 😅", w: { "ai-app": 1, mlops: 1, "data-sci": 1 } },
    ]
  },
  {
    q: "발표 자료를 만들 때 내 스타일은?", opts: [
      { t: "실제 작동하는 데모나 프로토타입을 직접 보여주는 편 🎥", w: { "ai-app": 3, mlops: 0, "data-sci": 0 } },
      { t: "데이터 그래프와 수치로 근거를 빼곡히 채우는 편 📊", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "구조도·플로우차트로 전체 흐름을 설명하는 편 🗺️", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "디자인 예쁘게 다듬고 전달력에 집중하는 편 🎨", w: { "ai-app": 1, mlops: 1, "data-sci": 1 } },
    ]
  },
  {
    q: "새 취미를 시작한다면 어떤 쪽이 더 끌려?", opts: [
      { t: "직접 만든 앱·웹사이트를 사람들에게 써보게 하기 📱", w: { "ai-app": 3, mlops: 0, "data-sci": 0 } },
      { t: "내 생활 데이터를 모아서 패턴과 인사이트 찾기 📊", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "집 기기들을 자동화해서 스마트홈 구축하기 🏠", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "유튜브 보면서 쉬는 게 최고야 😴", w: { "ai-app": 1, mlops: 1, "data-sci": 1 } },
    ]
  },
  {
    q: "친구들이랑 온라인 게임할 때 나는 주로 어떤 역할?", opts: [
      { t: "새로운 전략·빌드 아이디어 계속 제안하는 사람 💡", w: { "ai-app": 3, mlops: 0, "data-sci": 0 } },
      { t: "상대방 플레이 패턴 분석해서 약점 찾는 사람 📈", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "게임 설정·환경 최적화 담당하는 사람 ⚙️", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "승패보다 같이 즐기는 게 목적인 사람 😊", w: { "ai-app": 1, mlops: 1, "data-sci": 1 } },
    ]
  },
  {
    q: "나에게 가장 어울리는 한 마디는?", opts: [
      { t: "\"만드는 사람\" - 아이디어를 직접 서비스로 구현한다 🛠️", w: { "ai-app": 3, mlops: 0, "data-sci": 0 } },
      { t: "\"파헤치는 사람\" - 데이터 속 진실을 찾아낸다 🔍", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "\"굴리는 사람\" - 시스템이 끊임없이 돌아가게 만든다 ⚙️", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "\"연결하는 사람\" - 사람과 기술 사이를 잇는다 🤝", w: { "ai-app": 1, mlops: 1, "data-sci": 1 } },
    ]
  },
  {
    q: "문제가 생겼을 때 나의 첫 번째 반응은?", opts: [
      { t: "일단 뭔가 만들어서 해결해보려 한다 🔨", w: { "ai-app": 3, mlops: 0, "data-sci": 0 } },
      { t: "데이터와 수치로 원인을 먼저 파악한다 📊", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "재발 방지를 위한 시스템을 구축한다 ⚙️", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "팀원들과 먼저 의논한다 🤝", w: { "ai-app": 1, mlops: 1, "data-sci": 1 } },
    ]
  },
  {
    q: "가장 뿌듯함을 느끼는 순간은?", opts: [
      { t: "내가 만든 것을 다른 사람이 실제로 쓸 때 🎉", w: { "ai-app": 3, mlops: 0, "data-sci": 0 } },
      { t: "데이터에서 숨겨진 패턴이나 인사이트를 발견할 때 💡", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "복잡한 시스템이 자동으로 안정적으로 돌아갈 때 ✅", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "어려운 개념을 쉽게 설명해서 팀이 이해할 때 📢", w: { "ai-app": 1, mlops: 1, "data-sci": 1 } },
    ]
  },
  {
    q: "AI를 배운다면 가장 먼저 해보고 싶은 건?", opts: [
      { t: "ChatGPT API로 나만의 챗봇 서비스 만들기 🤖", w: { "ai-app": 3, mlops: 0, "data-sci": 0 } },
      { t: "데이터 분석해서 재미있는 인사이트 찾기 📊", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "클라우드 서버에 내 프로그램 자동 배포하기 ☁️", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "아직 뭘 배워야 할지 모르겠어 🤔", w: { "ai-app": 1, mlops: 1, "data-sci": 1 } },
    ]
  },
  {
    q: "팀 프로젝트에서 내가 자연스럽게 맡는 역할은?", opts: [
      { t: "기능 구현과 빠른 프로토타이핑 🛠️", w: { "ai-app": 3, mlops: 0, "data-sci": 0 } },
      { t: "데이터 수집, 분석, 인사이트 도출 📈", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "개발 환경 세팅과 배포 파이프라인 구축 ⚙️", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "전체 조율과 문서화 📋", w: { "ai-app": 1, mlops: 1, "data-sci": 1 } },
    ]
  },
  {
    q: "이 테스트를 하는 이유가 뭐야?", opts: [
      { t: "AI 서비스 개발 커리어 방향을 잡으려고 🗺️", w: { "ai-app": 3, mlops: 0, "data-sci": 0 } },
      { t: "데이터 분석·AI 연구 방향이 맞는지 확인하려고 📈", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "MLOps·인프라 엔지니어링이 나한테 맞는지 궁금해서 ⚙️", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "그냥 재미있어 보여서, 아니면 지인이 추천해줘서 😄", w: { "ai-app": 1, mlops: 1, "data-sci": 1 } },
    ]
  },
];

export const Q_EXPERT: Question[] = [
  {
    q: "새로운 LLM 프레임워크 릴리즈 소식을 들었다. 나는?", opts: [
      { t: "바로 설치해서 RAG 파이프라인에 붙여본다 🛠️", w: { "ai-app": 3, mlops: 1, "data-sci": 0 } },
      { t: "벤치마크 데이터 보고 기존 모델이랑 성능 비교한다 📊", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "서빙 레이턴시·GPU 비용 구조부터 파악한다 📉", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "개발자 커뮤니티 후기랑 트위터 반응 먼저 훑는다 🐦", w: { "ai-app": 1, mlops: 1, "data-sci": 1 } },
    ]
  },
  {
    q: "AI 팀에서 자연스럽게 맡게 되는 역할은?", opts: [
      { t: "LLM 프롬프트 엔지니어링 + API 연동 구현 🤖", w: { "ai-app": 3, mlops: 0, "data-sci": 0 } },
      { t: "데이터 EDA + 가설 검증 + 인사이트 리포팅 📊", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "ML 파이프라인 자동화 + 모델 서빙·모니터링 ⚙️", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "전체 아키텍처 설계 + 팀 기술 의사결정 리드 🏗️", w: { "ai-app": 1, mlops: 2, "data-sci": 1 } },
    ]
  },
  {
    q: "운영 중인 AI 모델 성능이 갑자기 떨어졌다. 어떻게 접근해?", opts: [
      { t: "프롬프트 재설계 + 임시 fallback 로직 먼저 만든다 🔄", w: { "ai-app": 3, mlops: 1, "data-sci": 0 } },
      { t: "입력 데이터 분포 변화 + 피처 중요도 분석부터 한다 📈", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "모니터링 로그 → 데이터 드리프트 확인 → 재학습 파이프라인 ⚙️", w: { "ai-app": 0, mlops: 3, "data-sci": 1 } },
      { t: "모델 아키텍처나 학습 설정 자체를 재검토한다 🧠", w: { "ai-app": 1, mlops: 1, "data-sci": 2 } },
    ]
  },
  {
    q: "6개월 후 이력서에 넣고 싶은 프로젝트는?", opts: [
      { t: "실사용자가 있는 LLM 기반 SaaS 서비스 🚀", w: { "ai-app": 3, mlops: 0, "data-sci": 0 } },
      { t: "비즈니스 임팩트를 수치로 증명한 데이터 분석 프로젝트 📊", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "자동화된 ML 파이프라인 + 실시간 모니터링 대시보드 ⚙️", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "최신 논문 구현 + 체계적인 실험 기록과 성능 개선 📝", w: { "ai-app": 1, mlops: 1, "data-sci": 2 } },
    ]
  },
  {
    q: "LLM을 프로덕션에 배포할 때 가장 신경 쓰는 부분은?", opts: [
      { t: "프롬프트 품질 + Hallucination 방지 + 응답 일관성 확보 ✍️", w: { "ai-app": 3, mlops: 0, "data-sci": 1 } },
      { t: "응답 품질 자동 평가 지표 설계 + A/B 테스트 프레임워크 📊", w: { "ai-app": 1, mlops: 0, "data-sci": 3 } },
      { t: "레이턴시 최적화 / GPU 비용 절감 / 오토스케일링 설계 💸", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "파인튜닝 vs RAG 트레이드오프 분석 및 최적 선택 🔬", w: { "ai-app": 2, mlops: 1, "data-sci": 1 } },
    ]
  },
  {
    q: "스터디 카페에서 옆 사람 화면이 보인다. 어떤 걸 보면 말 걸고 싶어?", opts: [
      { t: "LangGraph나 AI Agent 코드 짜고 있을 때 👀", w: { "ai-app": 3, mlops: 0, "data-sci": 0 } },
      { t: "Pandas·Polars로 데이터 전처리하고 있을 때 📊", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "K8s YAML이나 Terraform 파일이랑 씨름 중일 때 🐳", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "이어폰 끼고 내 거 집중하는 게 최고야 🎧", w: { "ai-app": 1, mlops: 1, "data-sci": 1 } },
    ]
  },
  {
    q: "해커톤에서 팀 합류 시 자연스럽게 맡는 역할은?", opts: [
      { t: "LLM + FastAPI 백엔드 핵심 기능 밤새 구현 🔨", w: { "ai-app": 3, mlops: 0, "data-sci": 0 } },
      { t: "데이터 분석 + 가설 검증으로 아이디어 방향 결정 💡", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "Docker + GitHub Actions + 배포 파이프라인 세팅 🔧", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "전체 아키텍처 설계 + 팀 기술 스택 의사결정 🎤", w: { "ai-app": 1, mlops: 2, "data-sci": 1 } },
    ]
  },
  {
    q: "개발하면서 가장 짜릿한 순간은?", opts: [
      { t: "내가 만든 AI 서비스에 첫 실사용자가 생겼을 때 🎉", w: { "ai-app": 3, mlops: 0, "data-sci": 0 } },
      { t: "데이터에서 아무도 발견 못 했던 패턴을 찾아냈을 때 💡", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "ML 파이프라인이 에러 없이 처음으로 완전 자동 실행됐을 때 ✅", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "복잡한 문제를 깔끔한 코드 몇 줄로 해결했을 때 🎯", w: { "ai-app": 1, mlops: 1, "data-sci": 1 } },
    ]
  },
  {
    q: "코드 리뷰할 때 내가 가장 먼저 집중해서 보는 부분은?", opts: [
      { t: "사용자 입장에서 UX 흐름이 자연스럽고 직관적인지 👤", w: { "ai-app": 3, mlops: 0, "data-sci": 0 } },
      { t: "데이터 처리 로직이 정확하고 엣지 케이스 처리됐는지 📊", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "실제 배포 환경에서 장애 없이 안정적으로 돌아갈지 ⚙️", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "코드 가독성·재사용성·테스트 커버리지 📝", w: { "ai-app": 1, mlops: 1, "data-sci": 1 } },
    ]
  },
  {
    q: "사이드 프로젝트 아이디어가 떠올랐다. 가장 먼저 하는 행동은?", opts: [
      { t: "바로 Claude·GPT로 MVP 코드 초안 뽑아보기 ⚡", w: { "ai-app": 3, mlops: 0, "data-sci": 0 } },
      { t: "관련 공개 데이터셋 먼저 찾아보기 🔍", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "기술 스택 선정 + 인프라 아키텍처 설계부터 하기 🏗️", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "경쟁 서비스 조사하고 차별점 먼저 정의하기 📑", w: { "ai-app": 1, mlops: 0, "data-sci": 2 } },
    ]
  },
  {
    q: "AI 프로젝트 진행 중 가장 스트레스받는 상황은?", opts: [
      { t: "LLM 응답이 매번 달라서 재현이 안 되고 디버깅이 안 될 때 😤", w: { "ai-app": 3, mlops: 0, "data-sci": 0 } },
      { t: "데이터 품질이 엉망이라 분석 신뢰도 자체가 흔들릴 때 🗃️", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "운영 중 모델 성능이 조용히 저하되고 있는데 감지가 늦을 때 📉", w: { "ai-app": 0, mlops: 3, "data-sci": 1 } },
      { t: "내 기술적 판단을 팀원들이 이해 못 하고 설득이 안 될 때 🤝", w: { "ai-app": 1, mlops: 1, "data-sci": 1 } },
    ]
  },
  {
    q: "팀에서 기술 스택을 결정할 때 내가 가장 중시하는 기준은?", opts: [
      { t: "개발 속도 — 빠르게 배포하고 피드백 받을 수 있는가 ⚡", w: { "ai-app": 3, mlops: 0, "data-sci": 0 } },
      { t: "분석력 — 데이터에서 인사이트를 잘 뽑아낼 수 있는가 🔍", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "확장성·안정성 — 트래픽이 10배 늘어도 버티는가 📈", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "팀 숙련도 — 팀원 모두가 사용 가능한가 🤝", w: { "ai-app": 1, mlops: 1, "data-sci": 1 } },
    ]
  },
  {
    q: "지금 이 테스트를 하는 이유가 뭐야?", opts: [
      { t: "LLM 서비스 개발 방향성을 잡으려고 🗺️", w: { "ai-app": 3, mlops: 0, "data-sci": 0 } },
      { t: "데이터 분석·사이언티스트 커리어 가능성을 확인하려고 📈", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "MLOps·인프라 방향이 나한테 맞는지 확신이 필요해서 ⚙️", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "그냥 재미있어 보여서, 아니면 지인이 추천해줘서 😄", w: { "ai-app": 1, mlops: 1, "data-sci": 1 } },
    ]
  },
  {
    q: "커리어 성장을 위해 지금 당장 시작하고 싶은 것은?", opts: [
      { t: "실사용자가 생길 때까지 LLM 앱 하나 끝까지 완성하기 🚀", w: { "ai-app": 3, mlops: 0, "data-sci": 0 } },
      { t: "Kaggle 대회 입상 또는 논문 재현으로 실력 증명 📄", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "클라우드 자격증 취득 + 인프라 포트폴리오 구축 ☁️", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "오픈소스 기여로 커뮤니티 내 존재감과 네트워크 키우기 🌐", w: { "ai-app": 1, mlops: 1, "data-sci": 1 } },
    ]
  },
  {
    q: "AI 기술 뉴스 중 가장 먼저 읽고 싶은 기사는?", opts: [
      { t: "\"LLM Agent로 만든 1인 SaaS, 월 ARR $10K 달성기\" 💰", w: { "ai-app": 3, mlops: 0, "data-sci": 0 } },
      { t: "\"Feature Store 도입 후 모델 정확도 15% 향상된 사례\" 📈", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "\"K8s + vLLM으로 LLM 서빙 비용 70% 절감한 방법\" ⚡", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "\"Transformer 아키텍처를 뒤집는 새 논문 공개\" 📄", w: { "ai-app": 1, mlops: 1, "data-sci": 2 } },
    ]
  },
  {
    q: "프로덕션 장애 상황에서 나의 역할은?", opts: [
      { t: "사용자 영향 최소화를 위한 빠른 임시 수정 🚑", w: { "ai-app": 3, mlops: 0, "data-sci": 0 } },
      { t: "로그 분석과 지표를 통한 근본 원인 파악 📊", w: { "ai-app": 0, mlops: 1, "data-sci": 3 } },
      { t: "인프라 복구 및 재발 방지 시스템 구축 🔧", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "팀 간 커뮤니케이션과 상황 공유 📢", w: { "ai-app": 1, mlops: 1, "data-sci": 1 } },
    ]
  },
  {
    q: "AI 모델 평가 시 가장 중요하게 보는 지표는?", opts: [
      { t: "사용자 만족도와 실제 서비스 지표 (CTR, 체류시간 등) 📱", w: { "ai-app": 3, mlops: 0, "data-sci": 0 } },
      { t: "통계적 유의성과 비즈니스 임팩트 측정 📈", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "레이턴시·처리량·가용성 등 시스템 성능 지표 ⚡", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "정확도·F1·AUC 등 ML 표준 평가 지표 🎯", w: { "ai-app": 1, mlops: 1, "data-sci": 2 } },
    ]
  },
  {
    q: "다음 중 가장 관심 있는 기술 주제는?", opts: [
      { t: "LangChain·LlamaIndex 등 LLM 앱 프레임워크 🤖", w: { "ai-app": 3, mlops: 0, "data-sci": 0 } },
      { t: "Feature Engineering·AutoML·실험 설계 📊", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "Kubernetes·Airflow·MLflow 등 MLOps 도구 ⚙️", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "모두 다 관심 있어서 뭘 골라야 할지 모르겠어 🧠", w: { "ai-app": 1, mlops: 1, "data-sci": 1 } },
    ]
  },
  {
    q: "이상적인 하루 업무 루틴은?", opts: [
      { t: "아이디어 스케치 → 빠른 프로토타입 → 사용자 피드백 반영 🔄", w: { "ai-app": 3, mlops: 0, "data-sci": 0 } },
      { t: "데이터 탐색 → 가설 수립 → 분석 → 인사이트 도출 📊", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "모니터링 확인 → 파이프라인 개선 → 배포 및 검증 ⚙️", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "코드 리뷰 → 팀 미팅 → 기술 문서 작성 📝", w: { "ai-app": 1, mlops: 1, "data-sci": 1 } },
    ]
  },
  {
    q: "5년 후 나의 전문성은?", opts: [
      { t: "LLM 기반 프로덕트를 혼자 기획하고 출시할 수 있는 AI 빌더 🚀", w: { "ai-app": 3, mlops: 0, "data-sci": 0 } },
      { t: "비즈니스 문제를 데이터로 풀어내는 AI 분석 전문가 📊", w: { "ai-app": 0, mlops: 0, "data-sci": 3 } },
      { t: "대규모 AI 시스템을 안정적으로 운영하는 인프라 전문가 🏗️", w: { "ai-app": 0, mlops: 3, "data-sci": 0 } },
      { t: "AI 전반을 아우르는 테크 리드 🧠", w: { "ai-app": 1, mlops: 1, "data-sci": 1 } },
    ]
  },
];

// ── 상위 2개 직무 결과 카드 컴포넌트 ──────
export function Top2JobsCard({
  jobScores,
  mode,
}: {
  jobScores: JobScores;
  mode: Mode;
}) {
  const [first, second] = calcTop2(jobScores);
  const norm = normalizeScores(jobScores);
  const jobs = [JOBS[first], JOBS[second]];
  const ranks = ["🥇 1위 추천 직무", "🥈 2위 추천 직무"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {jobs.map((job, idx) => {
        const pct = norm[job.id];
        const isFirst = idx === 0;
        return (
          <div
            key={job.id}
            className="card"
            style={{
              padding: "24px 28px",
              border: isFirst ? `2px solid ${job.color}` : undefined,
              boxShadow: isFirst ? `0 0 0 4px ${job.color}18` : undefined,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* 배경 그라데이션 힌트 */}
            <div style={{
              position: "absolute", inset: 0, opacity: 0.04,
              background: `radial-gradient(circle at top right, rgba(${job.rgb},1) 0%, transparent 70%)`,
              pointerEvents: "none",
            }} />

            {/* 헤더 */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 36 }}>{job.emoji}</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: job.color, letterSpacing: 1, marginBottom: 3 }}>
                    {ranks[idx]}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text-1)", letterSpacing: -0.5 }}>
                    {job.title}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-2)", marginTop: 2 }}>
                    {job.typeTitle} · {job.typeDesc}
                  </div>
                </div>
              </div>
              {/* 적합도 퍼센트 */}
              <div style={{
                flexShrink: 0, textAlign: "center",
                background: `rgba(${job.rgb},0.1)`,
                borderRadius: 12, padding: "8px 14px",
              }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: job.color }}>{pct}%</div>
                <div style={{ fontSize: 10, color: job.color, fontWeight: 600, marginTop: 1 }}>적합도</div>
              </div>
            </div>

            {/* 적합도 바 */}
            <div style={{ height: 6, background: "var(--border)", borderRadius: 99, marginBottom: 16, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 99,
                background: job.color,
                width: `${pct}%`,
                animation: "barGrow 0.9s cubic-bezier(0.16,1,0.3,1) both",
              }} />
            </div>

            {/* 태그 */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
              {job.tags.map((tag) => (
                <span key={tag} style={{
                  fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99,
                  background: `rgba(${job.rgb},0.1)`, color: job.color,
                }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* 직무 설명 hook */}
            <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.75 }}>
              {mode === "beginner" ? job.hookBeginner : job.hook}
            </p>

            {/* 특징 리스트 */}
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
              {job.traits.map((t) => (
                <div key={t} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--text-2)" }}>
                  <span style={{ color: job.color, marginTop: 1 }}>✓</span>
                  {t}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
