const app = document.querySelector("#app");

const state = {
  selectedJob: "data-scientist",
  selectedSkill: "React",
  currentQuestion: 0
};

const jobs = [
  {
    id: "data-scientist",
    name: "Data Scientist",
    category: "ai",
    summary: "데이터를 분석하고 모델링하여 비즈니스 의사결정과 서비스 개선에 필요한 인사이트를 도출하는 직무",
    tags: ["#DataAnalysis", "#MachineLearning", "#Statistics", "#Python", "#SQL", "#Visualization"],
    features: [
      ["데이터 기반 문제 해결", "데이터를 바탕으로 문제를 정의하고 의사결정을 지원합니다."],
      ["통계와 머신러닝 활용", "통계 분석과 머신러닝 모델링으로 패턴을 발견합니다."],
      ["비즈니스 이해 필요", "분석 결과가 실제 서비스 개선으로 연결되어야 합니다."],
      ["커뮤니케이션 중요", "분석 결과를 이해하기 쉽게 시각화하고 설명합니다."]
    ],
    tasks: [
      "비즈니스 문제를 데이터 분석 문제로 정의",
      "데이터 수집, 정제, 전처리 수행",
      "탐색적 데이터 분석, EDA 수행",
      "통계 분석과 가설 검정 수행",
      "머신러닝 모델 개발 및 성능 평가",
      "대시보드와 리포트를 통한 결과 시각화"
    ],
    techs: ["Python", "SQL", "Pandas", "NumPy", "Scikit-learn", "Matplotlib", "Tableau", "Docker"],
    pros: ["데이터 기반 의사결정에 직접 기여", "다양한 산업과 서비스에 적용 가능", "분석, 모델링, 시각화 역량을 함께 성장 가능"],
    cons: ["데이터 품질에 따라 신뢰도가 달라짐", "전처리에 많은 시간이 소요될 수 있음", "비즈니스 맥락 이해가 필요함"]
  },
  {
    id: "ai-agent",
    name: "AI Agent Developer",
    category: "ai",
    summary: "AI Agent 기반 서비스를 설계하고 구현하는 직무",
    tags: ["#LLM", "#RAG", "#LangChain", "#Backend"],
    features: [
      ["AI 서비스 구현 중심", "LLM과 도구 호출을 활용해 실제 서비스를 구현합니다."],
      ["문제 해결형 업무", "반복 업무와 의사결정 흐름을 자동화합니다."],
      ["백엔드 이해 필요", "API, DB, 인증, 배포 등 서비스 구조를 함께 다룹니다."],
      ["평가와 개선 중요", "응답 품질을 측정하고 검색 구조를 개선합니다."]
    ],
    tasks: ["사용자 요구사항 분석", "Agent workflow 설계", "LLM 및 RAG 기반 기능 구현", "API, DB, Vector DB 연동"],
    techs: ["Python", "LangChain", "FastAPI", "PostgreSQL", "Vector DB", "Docker"],
    pros: ["최신 AI 기술을 서비스에 적용", "업무 자동화 문제 해결", "기획과 개발 역량 동시 성장"],
    cons: ["기술 변화가 빠름", "모델 평가 기준 설계가 어려움", "데이터 품질 영향이 큼"]
  }
];

const skills = [
  { name: "React", category: "frontend", description: "컴포넌트 기반 UI 개발", level: "입문" },
  { name: "HTML & CSS", category: "frontend", description: "웹 화면 구조와 스타일링 기초", level: "입문" },
  { name: "Python", category: "data", description: "데이터 분석과 AI 개발 언어", level: "입문" },
  { name: "SQL", category: "data", description: "데이터 조회와 분석을 위한 질의 언어", level: "입문" },
  { name: "Pandas", category: "data", description: "Python 데이터 분석 라이브러리", level: "중급" },
  { name: "Machine Learning", category: "data", description: "예측 모델링과 패턴 학습", level: "중급" },
  { name: "Docker", category: "infra", description: "컨테이너 기반 실행 환경 관리", level: "중급" }
];

const curriculum = [
  ["Step 1", "개념 이해", "기술의 목적, 사용 맥락, 기본 용어를 학습합니다.", "학습"],
  ["Step 2", "핵심 문법", "컴포넌트, props, state, hooks 등 핵심 개념을 학습합니다.", "진행"],
  ["Step 3", "실습 프로젝트", "간단한 목록 관리 앱을 만들며 기술을 적용합니다.", "학습"],
  ["Step 4", "문제 풀이", "학습 내용을 바탕으로 객관식 문제를 풉니다.", "학습"]
];

const questions = [
  {
    question: "HTML에서 문서의 제목을 나타내는 태그는 무엇인가요?",
    options: ["<title>", "<body>", "<div>", "<span>"],
    answer: 0
  },
  {
    question: "CSS에서 요소의 바깥 여백을 설정하는 속성은 무엇인가요?",
    options: ["padding", "margin", "border", "display"],
    answer: 1
  }
];

function render(page) {
  const template = document.querySelector(`#${page}`);
  if (!template) return render("landing");

  app.innerHTML = template.innerHTML;

  if (page === "job-select") renderJobCards();
  if (page === "skill-select") renderSkillCards();
  if (page === "job-detail") renderJobDetail();
  if (page === "skill-detail") renderSkillDetail();
  if (page === "quiz") renderQuiz();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function navigate(page) {
  render(page);
}

function renderJobCards() {
  const grid = document.querySelector("#jobCards");
  grid.innerHTML = jobs.map(job => `
    <article class="card" data-job="${job.id}">
      <div class="thumb"></div>
      <h3>${job.name}</h3>
      <p>${job.summary}</p>
      <div class="tag-row">${job.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join("")}</div>
    </article>
  `).join("");

  grid.querySelectorAll("[data-job]").forEach(card => {
    card.addEventListener("click", () => {
      state.selectedJob = card.dataset.job;
      navigate("job-detail");
    });
  });
}

function renderSkillCards() {
  const grid = document.querySelector("#skillCards");
  const search = document.querySelector("#skillSearch");
  const category = document.querySelector("#skillCategory");

  const draw = () => {
    const keyword = search.value.trim().toLowerCase();
    const selectedCategory = category.value;
    const filtered = skills.filter(skill => {
      const keywordMatch = skill.name.toLowerCase().includes(keyword) || skill.description.toLowerCase().includes(keyword);
      const categoryMatch = selectedCategory === "all" || skill.category === selectedCategory;
      return keywordMatch && categoryMatch;
    });

    grid.innerHTML = filtered.map(skill => `
      <article class="card" data-skill="${skill.name}">
        <div class="thumb"></div>
        <h3>${skill.name}</h3>
        <p>${skill.description}</p>
        <div class="tag-row"><span class="tag">${skill.level}</span><span class="tag">${skill.category}</span></div>
      </article>
    `).join("");

    grid.querySelectorAll("[data-skill]").forEach(card => {
      card.addEventListener("click", () => {
        state.selectedSkill = card.dataset.skill;
        navigate("skill-detail");
      });
    });
  };

  search.addEventListener("input", draw);
  category.addEventListener("change", draw);
  draw();
}

function renderJobDetail() {
  const job = jobs.find(item => item.id === state.selectedJob) || jobs[0];

  document.querySelector("#jobTitle").textContent = job.name;
  document.querySelector("#jobSummary").textContent = job.summary;
  document.querySelector("#jobTags").innerHTML = job.tags.map(tag => `<span class="tag">${tag}</span>`).join("");
  document.querySelector("#jobFeatures").innerHTML = job.features.map(([title, desc]) => `
    <article class="info-card"><h4>${title}</h4><p>${desc}</p></article>
  `).join("");
  document.querySelector("#jobTasks").innerHTML = job.tasks.map(task => `<li>${task}</li>`).join("");
  document.querySelector("#jobTechs").innerHTML = job.techs.map(tech => `<span class="tag" data-skill="${tech}">${tech}</span>`).join("");
  document.querySelector("#jobPros").innerHTML = job.pros.map(item => `<li>${item}</li>`).join("");
  document.querySelector("#jobCons").innerHTML = job.cons.map(item => `<li>${item}</li>`).join("");
}

function renderSkillDetail() {
  document.querySelector("#skillTitle").textContent = state.selectedSkill;
  document.querySelector("#skillSummary").textContent = `${state.selectedSkill} 기술을 이해하고 실무에 적용하기 위한 단계별 커리큘럼입니다.`;
  document.querySelector("#curriculumList").innerHTML = curriculum.map(([step, title, desc, status]) => `
    <article class="curriculum-item">
      <strong>${step}</strong>
      <div><h4>${title}</h4><p>${desc}</p></div>
      <button class="outline" data-page="learning">${status}</button>
    </article>
  `).join("");
}

function renderQuiz() {
  const card = document.querySelector("#quizCard");
  const q = questions[state.currentQuestion];

  card.innerHTML = `
    <p class="eyebrow">문제 ${state.currentQuestion + 1} / ${questions.length}</p>
    <h3>${q.question}</h3>
    ${q.options.map((option, index) => `
      <label class="option">
        <input type="radio" name="answer" value="${index}" />
        <span>${option}</span>
      </label>
    `).join("")}
  `;
}

document.addEventListener("click", event => {
  const pageButton = event.target.closest("[data-page]");
  if (pageButton) navigate(pageButton.dataset.page);

  const roadmapNode = event.target.closest(".node");
  if (roadmapNode) {
    state.selectedSkill = roadmapNode.dataset.skill;
    navigate("skill-detail");
  }

  if (event.target.id === "submitAnswer") {
    if (state.currentQuestion < questions.length - 1) {
      state.currentQuestion += 1;
      renderQuiz();
    } else {
      state.currentQuestion = 0;
      navigate("result");
    }
  }

  if (event.target.id === "prevQuestion") {
    state.currentQuestion = Math.max(0, state.currentQuestion - 1);
    renderQuiz();
  }
});

render("landing");
