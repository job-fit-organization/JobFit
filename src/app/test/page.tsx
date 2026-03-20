"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Q_BEGINNER, Q_EXPERT,
  saveResult,
  type Mode, type JobId, type JobScores, type Option,
} from "./_lib";

// ─────────────────────────────────────────
//  src/app/page.tsx
//  흐름: 랜딩 → 모드 선택 → 질문 20개 → 결과 저장 → /test/result 이동
// ─────────────────────────────────────────

const JOBFIT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  button { font-family: inherit; cursor: pointer; border: none; background: none; }
  a { text-decoration: none; color: inherit; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }

  :root {
    --primary: #E8380D;
    --primary-dark: #C42E09;
    --primary-light: #FF5A35;
    --bg: #FFFFFF;
    --bg-gray: #F6F6F6;
    --bg-subtle: #F6F6F6;
    --border: #EBEBEB;
    --border-strong: #CCCCCC;
    --text-1: #111111;
    --text-2: #555555;
    --text-3: #999999;
    --font: 'Plus Jakarta Sans', system-ui, sans-serif;
  }

  html { scroll-behavior: smooth; }
  body { background: var(--bg); color: var(--text-1); font-family: var(--font); overflow-x: hidden; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes barGrow  { from { width:0; } }
  @keyframes float    { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
  @keyframes gradMove { 0%,100% { background-position:0% 50%; } 50% { background-position:100% 50%; } }

  .fu  { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
  .fu1 { animation-delay: 0.08s; }
  .fu2 { animation-delay: 0.16s; }
  .fu3 { animation-delay: 0.24s; }
  .fi  { animation: fadeIn 0.3s ease both; }

  .reveal { opacity:0; transform:translateY(24px); transition: opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1); }
  .reveal.visible { opacity:1; transform:translateY(0); }
  .reveal-d1 { transition-delay:0.08s; } .reveal-d2 { transition-delay:0.16s; }
  .reveal-d3 { transition-delay:0.24s; } .reveal-d4 { transition-delay:0.32s; }
  .reveal-d5 { transition-delay:0.40s; } .reveal-d6 { transition-delay:0.48s; }

  /* NAV */
  .jf-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 200;
    background: rgba(255,255,255,0.93); backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 clamp(20px,5vw,60px); height: 62px;
    transition: box-shadow 0.2s;
  }
  .jf-nav.scrolled { box-shadow: 0 2px 20px rgba(0,0,0,0.07); }
  .jf-logo { display: flex; align-items: center; gap: 9px; font-weight: 800; font-size: 19px; letter-spacing: -0.6px; color: var(--text-1); cursor: pointer; }
  .jf-logo-icon { width: 34px; height: 34px; border-radius: 9px; background: var(--primary); display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(232,56,13,0.35); }
  .jf-nav-links { display: flex; align-items: center; gap: 2px; }
  .jf-nav-link { padding: 8px 15px; border-radius: 8px; font-size: 14px; font-weight: 500; color: var(--text-2); transition: all 0.15s; cursor: pointer; }
  .jf-nav-link:hover { background: var(--bg-gray); color: var(--text-1); }
  .jf-nav-btn { padding: 8px 18px; border-radius: 9px; font-size: 14px; font-weight: 600; border: 1.5px solid var(--border); color: var(--text-1); transition: all 0.15s; }
  .jf-nav-btn:hover { border-color: #bbb; background: var(--bg-gray); }

  /* HERO */
  .hero { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 120px clamp(20px,5vw,60px) 80px; position: relative; overflow: hidden; }
  .hero-bg { position: absolute; inset: 0; z-index: 0; background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(232,56,13,0.07) 0%, transparent 70%); }
  .hero-content { max-width: 820px; width: 100%; text-align: center; position: relative; z-index: 1; }
  .hero-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; letter-spacing: 1.8px; color: var(--primary); padding: 5px 14px; border-radius: 99px; border: 1px solid rgba(232,56,13,0.25); background: rgba(232,56,13,0.06); margin-bottom: 24px; animation: fadeIn 0.5s ease both; }
  .hero-badge-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--primary); animation: float 2s ease infinite; }
  .hero-title { font-size: clamp(38px,7vw,72px); font-weight: 900; line-height: 1.08; letter-spacing: -2.5px; color: var(--text-1); margin-bottom: 20px; animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
  .hero-title em { font-style: normal; color: var(--primary); }
  .hero-sub { font-size: clamp(15px,2vw,17px); color: var(--text-2); line-height: 1.75; margin-bottom: 40px; max-width: 600px; margin-left: auto; margin-right: auto; animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
  .hero-btns { display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
  .btn-primary { padding: 16px 32px; border-radius: 12px; font-size: 15px; font-weight: 700; background: var(--primary); color: #fff; box-shadow: 0 4px 20px rgba(232,56,13,0.32); transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px; font-family: var(--font); }
  .btn-primary:hover { background: var(--primary-dark); transform: translateY(-1px); box-shadow: 0 6px 28px rgba(232,56,13,0.4); }
  .btn-secondary { padding: 16px 32px; border-radius: 12px; font-size: 15px; font-weight: 600; border: 1.5px solid var(--border); color: var(--text-1); background: #fff; transition: all 0.2s; font-family: var(--font); }
  .btn-secondary:hover { border-color: #bbb; background: var(--bg-gray); transform: translateY(-1px); }

  /* SECTION */
  .section { padding: clamp(64px,8vw,100px) clamp(40px,6vw,100px); }
  .section-inner { max-width: 100%; margin: 0; }
  .section-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 2px; color: var(--primary); margin-bottom: 12px; text-transform: uppercase; }
  .section-title { font-size: clamp(26px,4vw,40px); font-weight: 900; letter-spacing: -1px; color: var(--text-1); line-height: 1.2; margin-bottom: 48px; }

  /* JOB CARDS */
  .jobs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .job-card { background: #fff; border: 1.5px solid var(--border); border-radius: 20px; padding: 28px 24px; cursor: pointer; transition: all 0.22s cubic-bezier(0.16,1,0.3,1); position: relative; overflow: hidden; }
  .job-card::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: var(--card-color, var(--primary)); transform: scaleX(0); transform-origin: left; transition: transform 0.22s cubic-bezier(0.16,1,0.3,1); }
  .job-card:hover { border-color: transparent; box-shadow: 0 8px 32px rgba(0,0,0,0.1); transform: translateY(-4px); }
  .job-card:hover::after { transform: scaleX(1); }
  .job-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 22px; margin-bottom: 18px; }
  .job-title { font-size: 16px; font-weight: 700; color: var(--text-1); margin-bottom: 6px; letter-spacing: -0.3px; display: flex; align-items: center; gap: 6px; }
  .job-title-arrow { font-size: 13px; color: var(--text-3); transition: transform 0.2s, color 0.2s; }
  .job-card:hover .job-title-arrow { transform: translateX(3px); color: var(--card-color, var(--primary)); }
  .job-desc { font-size: 13px; color: var(--text-2); line-height: 1.7; }

  /* CTA BANNER */
  .cta-section { padding: clamp(40px,6vw,80px) clamp(40px,6vw,100px); background: var(--bg-gray); }
  .cta-inner { max-width: 100%; margin: 0; background: linear-gradient(135deg, #E8380D 0%, #FF6B35 50%, #E8380D 100%); background-size: 200% 200%; animation: gradMove 6s ease infinite; border-radius: 28px; padding: clamp(48px,6vw,72px) clamp(32px,5vw,64px); text-align: center; position: relative; overflow: hidden; }
  .cta-inner::before { content: ''; position: absolute; top: -40%; left: -10%; width: 50%; height: 200%; background: rgba(255,255,255,0.06); border-radius: 50%; pointer-events: none; }
  .cta-title { font-size: clamp(26px,4vw,44px); font-weight: 900; color: #fff; letter-spacing: -1.5px; line-height: 1.2; margin-bottom: 12px; position: relative; z-index: 1; }
  .cta-sub { font-size: 15px; color: rgba(255,255,255,0.75); margin-bottom: 32px; position: relative; z-index: 1; }
  .cta-btn { display: inline-flex; align-items: center; gap: 8px; padding: 16px 36px; border-radius: 12px; font-size: 15px; font-weight: 700; background: #fff; color: var(--primary); transition: all 0.2s; box-shadow: 0 4px 20px rgba(0,0,0,0.15); position: relative; z-index: 1; font-family: var(--font); }
  .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.2); }

  /* FOOTER */
  .footer { background: #fff; border-top: 1px solid var(--border); padding: 28px clamp(40px,6vw,100px); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
  .footer-logo { display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 16px; letter-spacing: -0.4px; }
  .footer-logo-icon { width: 28px; height: 28px; border-radius: 7px; background: var(--primary); display: flex; align-items: center; justify-content: center; }
  .footer-links { display: flex; align-items: center; gap: 24px; }
  .footer-link { font-size: 13px; color: var(--text-3); transition: color 0.15s; cursor: pointer; }
  .footer-link:hover { color: var(--text-2); }
  .footer-copy { font-size: 12px; color: var(--text-3); }

  /* TEST - MODE CARD */
  .mode-card { border: 2px solid var(--border); border-radius: 20px; background: #fff; padding: 28px 24px; cursor: pointer; transition: all 0.2s; text-align: left; }
  .mode-card:hover { border-color: #ccc; transform: translateY(-2px); box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
  .mode-card.active { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(232,56,13,0.1); }

  /* TEST - OPT */
  .opt { width: 100%; padding: 16px 18px; border-radius: 14px; text-align: left; border: 1.5px solid var(--border); background: #fff; color: var(--text-2); font-size: 15px; font-family: var(--font); cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 14px; line-height: 1.55; }
  .opt:hover:not(.opt-sel) { border-color: #ccc; color: var(--text-1); background: var(--bg-gray); transform: translateX(2px); }
  .opt-sel { border-color: var(--primary) !important; border-width: 2px !important; background: rgba(232,56,13,0.04) !important; color: var(--text-1) !important; box-shadow: 0 0 0 3px rgba(232,56,13,0.08); }

  .ghost { padding: 10px 18px; border-radius: 9px; font-weight: 500; font-size: 14px; font-family: var(--font); color: var(--text-3); cursor: pointer; transition: all 0.15s; }
  .ghost:hover { background: var(--bg-gray); color: var(--text-2); }
  .card { background: #fff; border: 1px solid var(--border); border-radius: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }

  .page-wrap { max-width: 100%; margin: 0; padding: 100px clamp(40px,6vw,100px) 80px; width: 100%; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
  .col-left { position: sticky; top: 80px; }
  .col-right { display: flex; flex-direction: column; gap: 12px; }

  @media (max-width: 860px) { .jobs-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 720px) { .two-col { grid-template-columns: 1fr; gap: 28px; } .col-left { position: static; } .jf-nav-links { display: none; } }
  @media (max-width: 560px) { .jobs-grid { grid-template-columns: 1fr; } .hero-btns { flex-direction: column; align-items: stretch; } .btn-primary, .btn-secondary { text-align: center; justify-content: center; } .footer { flex-direction: column; align-items: flex-start; } }
  @media (max-width: 480px) { .page-wrap { padding-top: 80px; } .opt { font-size: 14px; padding: 14px 15px; } .mode-card { padding: 22px 18px; } }
`;

const LANDING_JOBS = [
  { icon: "🤖", color: "#E8380D", iconBg: "rgba(232,56,13,0.1)", title: "AI Application Engineer", desc: "생성형 AI 모델을 실제 프로덕트에 통합하여 혁신적인 사용자 경험을 창조합니다." },
  { icon: "✏️", color: "#F59E0B", iconBg: "rgba(245,158,11,0.1)", title: "Prompt Engineer", desc: "거대 언어 모델의 성능을 극대화하는 정교한 프롬프트 아키텍처를 설계하고 최적화합니다." },
  { icon: "⚙️", color: "#10B981", iconBg: "rgba(16,185,129,0.1)", title: "MLOps Engineer", desc: "모델 학습부터 배포까지의 전 과정을 자동화하고 지속 가능한 AI 인프라를 구축합니다." },
  { icon: "🗄️", color: "#3B82F6", iconBg: "rgba(59,130,246,0.1)", title: "Data Engineer", desc: "방대한 데이터를 안정적으로 수집, 저장, 처리하여 고성능 파이프라인을 구축합니다." },
  { icon: "📊", color: "#8B5CF6", iconBg: "rgba(139,92,246,0.1)", title: "Data Scientist", desc: "통계적 방법론과 머신러닝 모델을 활용해 복잡한 비즈니스 문제를 해결하고 성장을 견인합니다." },
  { icon: "👥", color: "#EC4899", iconBg: "rgba(236,72,153,0.1)", title: "AI Product Manager", desc: "기술과 비즈니스 사이의 가교 역할을 수행하며 AI 시장을 리드하는 AI 제품의 전략을 수립합니다." },
];

type AppStep = "landing" | "mode-select" | "test";

export default function App() {
  const router = useRouter();
  const [appStep, setAppStep] = useState<AppStep>("landing");
  const [mode, setMode] = useState<Mode | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (appStep !== "landing") return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    revealRefs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, [appStep]);

  const setRef = (i: number) => (el: HTMLElement | null) => { revealRefs.current[i] = el; };

  const handleModeSelect = (m: Mode) => { setMode(m); setAppStep("test"); };
  const handleDone = (jobScores: JobScores) => {
    if (!mode) return;
    saveResult({ jobScores, mode });
    setTimeout(() => router.push("/test/result"), 50);
  };

  const NavBar = (
    <nav className={`jf-nav${scrolled ? " scrolled" : ""}`}>
      <div className="jf-logo" onClick={() => setAppStep("landing")}>
        <div className="jf-logo-icon">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 9L7.5 13.5L15 5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        JOBFIT
      </div>
      {appStep === "landing" && (
        <div className="jf-nav-links">
          <button className="jf-nav-link">테스트</button>
          <button className="jf-nav-link">학습</button>
          <button className="jf-nav-link">설문조사</button>
        </div>
      )}
      <button className="jf-nav-btn">로그인</button>
    </nav>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-1)", fontFamily: "var(--font)" }}>
      <style>{JOBFIT_CSS}</style>
      {NavBar}

      {/* ── 랜딩 ── */}
      {appStep === "landing" && (
        <>
          <section className="hero">
            <div className="hero-bg" />
            <div className="hero-content">
              <div className="hero-badge">
                <span className="hero-badge-dot" />
                EMPOWERING YOUR AI CAREER
              </div>
              <h1 className="hero-title">나에게 딱 맞는<br /><em>AI 직무</em>는?</h1>
              <p className="hero-sub">성공적인 AI 커리어를 위한 첫 걸음. 당신의 잠재력을 데이터로 분석하여 가장 빛날 수 있는 직무와 커리어 로드맵을 제안합니다.</p>
              <div className="hero-btns">
                <button className="btn-primary" onClick={() => setAppStep("mode-select")}>직무 추천 테스트 시작 →</button>
                <button className="btn-secondary">커리어 맵 둘러보기</button>
              </div>
            </div>
          </section>

          <section className="section" style={{ background: "var(--bg-gray)" }}>
            <div className="section-inner">
              <div ref={setRef(0)} className="reveal">
                <p className="section-eyebrow">CORE PATHS</p>
                <h2 className="section-title">다루는 핵심 직무</h2>
              </div>
              <div className="jobs-grid">
                {LANDING_JOBS.map((job, i) => (
                  <div key={job.title} ref={setRef(i + 1)} className={`reveal reveal-d${i + 1} job-card`} style={{ "--card-color": job.color } as React.CSSProperties}>
                    <div className="job-icon" style={{ background: job.iconBg }}>{job.icon}</div>
                    <div className="job-title">{job.title}<span className="job-title-arrow">›</span></div>
                    <p className="job-desc">{job.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="cta-section">
            <div className="section-inner">
              <div ref={setRef(8)} className="reveal cta-inner">
                <h2 className="cta-title">당신의 미래 가치를<br />JOBFIT에서 발견하세요</h2>
                <p className="cta-sub">지금 바로 무료로 AI 직무 적성 테스트를 시작하세요</p>
                <button className="cta-btn" onClick={() => setAppStep("mode-select")}>지금 무료로 시작하기</button>
              </div>
            </div>
          </section>

          <footer className="footer">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                  <path d="M3 9L7.5 13.5L15 5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              JOBFIT
            </div>
            <div className="footer-links">
              <span className="footer-link">개인정보처리방침</span>
              <span className="footer-link">이용약관</span>
              <span className="footer-link">문의하기</span>
            </div>
            <span className="footer-copy">© 2026 JobFit Organization. All rights reserved.</span>
          </footer>
        </>
      )}

      {/* ── 모드 선택 ── */}
      {appStep === "mode-select" && <ModeSelectView onSelect={handleModeSelect} onBack={() => setAppStep("landing")} />}

      {/* ── 테스트 ── */}
      {appStep === "test" && mode && <QuestionView mode={mode} onBack={() => setAppStep("mode-select")} onDone={handleDone} />}
    </div>
  );
}

// ── 모드 선택 화면 ────────────────────────
function ModeSelectView({ onSelect, onBack }: { onSelect: (m: Mode) => void; onBack: () => void; }) {
  const [selected, setSelected] = useState<Mode | null>(null);

  const modes = [
    { id: "beginner" as Mode, icon: "🌱", badge: "BEGINNER", title: "입문자 모드", desc: "AI가 처음이에요.\n일상 언어로 된 질문들이에요.", color: "#10B981" },
    { id: "expert" as Mode, icon: "🔥", badge: "EXPERT", title: "실전 모드", desc: "개발 경험이 있어요.\n기술 용어가 포함돼 있어요.", color: "#E8380D" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px clamp(20px,4vw,48px) 60px" }}>
      <div style={{ maxWidth: 700, width: "100%" }}>
        <button className="ghost" onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 32 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          처음으로
        </button>

        <div className="fu" style={{ marginBottom: 20, display: "flex", justifyContent: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.8, color: "var(--primary)", padding: "5px 14px", borderRadius: 99, border: "1px solid rgba(232,56,13,0.25)", background: "rgba(232,56,13,0.06)" }}>
            AI CAREER TEST
          </span>
        </div>
        <div className="fu fu1" style={{ marginBottom: 12, textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(28px,5vw,42px)", fontWeight: 900, color: "var(--text-1)", letterSpacing: -1.5, lineHeight: 1.15 }}>
            테스트 모드를<br />선택해주세요
          </h1>
        </div>
        <div className="fu fu2" style={{ marginBottom: 40, textAlign: "center" }}>
          <p style={{ fontSize: 15, color: "var(--text-2)", lineHeight: 1.7 }}>나의 AI 경험 수준에 맞는 모드로 시작하면 더 정확한 결과가 나와요</p>
        </div>

        <div className="fu fu2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
          {modes.map((m) => (
            <div key={m.id} className={`mode-card${selected === m.id ? " active" : ""}`} onClick={() => setSelected(m.id)}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: selected === m.id ? m.color : "var(--text-3)", marginBottom: 16, transition: "color 0.2s" }}>{m.badge}</div>
              <div style={{ fontSize: "clamp(32px,5vw,44px)", marginBottom: 14, lineHeight: 1 }}>{m.icon}</div>
              <div style={{ fontSize: "clamp(15px,2.5vw,17px)", fontWeight: 700, color: selected === m.id ? m.color : "var(--text-1)", marginBottom: 8, transition: "color 0.2s" }}>{m.title}</div>
              <div style={{ fontSize: "clamp(12px,1.8vw,13px)", color: "var(--text-3)", lineHeight: 1.65, whiteSpace: "pre-line" }}>{m.desc}</div>
              {selected === m.id && (
                <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: m.color, fontWeight: 700 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6" fill={m.color}/>
                    <path d="M4.5 7L6.5 9L9.5 5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  선택됨
                </div>
              )}
            </div>
          ))}
        </div>

        {selected && (
          <div className="fu" style={{ padding: "14px 18px", borderRadius: 12, background: "var(--bg-gray)", border: "1px solid var(--border)", marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.7 }}>
              {selected === "beginner" ? "💡 코딩이나 AI 경험 없어도 괜찮아요. 일상적인 상황에서 나의 반응을 고르는 방식이에요." : "💡 LLM, Docker, 데이터 파이프라인 등 기술 용어가 포함돼 있어요. 개발 경험이 있다면 더 정확해요."}
            </p>
          </div>
        )}

        <button
          onClick={() => selected && onSelect(selected)}
          style={{ width: "100%", padding: "clamp(14px,2vw,16px)", borderRadius: 12, fontSize: "clamp(14px,2.5vw,15px)", fontWeight: 700, background: selected ? "var(--primary)" : "var(--bg-gray)", color: selected ? "#fff" : "var(--text-3)", border: "none", transition: "all 0.2s", cursor: selected ? "pointer" : "not-allowed", boxShadow: selected ? "0 4px 20px rgba(232,56,13,0.3)" : "none" }}
        >
          {selected ? "이 모드로 시작하기 →" : "모드를 선택해주세요"}
        </button>
      </div>
    </div>
  );
}

// ── 질문 화면 ─────────────────────────────
function QuestionView({ mode, onBack, onDone }: { mode: Mode; onBack: () => void; onDone: (j: JobScores) => void; }) {
  const QUESTIONS = mode === "expert" ? Q_EXPERT : Q_BEGINNER;
  const [step, setStep] = useState(0);
  const [jobScores, setJobScores] = useState<JobScores>({ "ai-app": 0, mlops: 0, "data-sci": 0 });
  const [selected, setSelected] = useState<Option | null>(null);
  const [animOut, setAnimOut] = useState(false);
  const [skippedAll, setSkippedAll] = useState(false);
  const answered = useRef(0);

  const q = QUESTIONS[step] ?? QUESTIONS[0];
  const progress = (step / QUESTIONS.length) * 100;
  const isExpert = mode === "expert";
  const modeColor = isExpert ? "#E8380D" : "#10B981";
  const modeLabel = isExpert ? "🔥 실전 모드" : "🌱 입문자 모드";

  const next = (skip = false) => {
    if (!skip && !selected) return;
    const nj = { ...jobScores };
    if (!skip && selected) {
      (Object.entries(selected.w) as [JobId, number][]).forEach(([k, v]) => { nj[k] += v; });
      answered.current++;
    }
    if (step + 1 >= QUESTIONS.length) {
      if (answered.current === 0) { setSkippedAll(true); return; }
      onDone(nj); return;
    }
    setAnimOut(true);
    setTimeout(() => { setJobScores(nj); setSelected(null); setAnimOut(false); setStep(s => s + 1); }, 180);
  };

  const restart = () => { setStep(0); setJobScores({ "ai-app": 0, mlops: 0, "data-sci": 0 }); setSelected(null); setSkippedAll(false); answered.current = 0; };

  if (skippedAll) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="card" style={{ padding: 48, textAlign: "center", maxWidth: 380 }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>🤔</div>
        <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10, color: "var(--text-1)", letterSpacing: -0.5 }}>답변이 부족해요</h3>
        <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.7, marginBottom: 28 }}>최소 1개 이상 답해야 결과를 볼 수 있어요.</p>
        <button onClick={restart} style={{ width: "100%", padding: "14px", borderRadius: 12, background: "var(--primary)", color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>다시 시작하기</button>
      </div>
    </div>
  );

  return (
    <div className="page-wrap">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <button className="ghost" onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          모드 선택
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: modeColor, padding: "4px 12px", borderRadius: 99, border: `1px solid ${modeColor}30`, background: `${modeColor}10` }}>{modeLabel}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-3)" }}>{step + 1} / {QUESTIONS.length}</span>
        </div>
      </div>

      <div style={{ height: 3, background: "var(--border)", borderRadius: 99, marginBottom: 48, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 99, background: `linear-gradient(90deg, var(--primary-light), var(--primary))`, width: `${progress}%`, transition: "width 0.5s cubic-bezier(0.16,1,0.3,1)" }} />
      </div>

      <div className="two-col">
        <div className="col-left">
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--primary)", letterSpacing: 2, marginBottom: 18, opacity: 0.8 }}>
            Q {String(step + 1).padStart(2, "0")} / {QUESTIONS.length}
          </div>
          <h2 style={{ fontSize: "clamp(20px,2.4vw,26px)", fontWeight: 800, color: "var(--text-1)", lineHeight: 1.5, letterSpacing: -0.5 }}>{q.q}</h2>
        </div>

        <div className="col-right" key={`q-${step}`} style={{ opacity: animOut ? 0 : 1, transform: animOut ? "translateY(-8px)" : "none", transition: "all 0.18s ease" }}>
          {q.opts.map((opt, i) => {
            const sel = selected === opt;
            return (
              <button key={i} className={`opt${sel ? " opt-sel" : ""}`} onClick={() => setSelected(opt)}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, border: sel ? "none" : "1.5px solid #ddd", background: sel ? "var(--primary)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                  {sel && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </span>
                <span style={{ flex: 1 }}>{opt.t}</span>
              </button>
            );
          })}
          <button onClick={() => next(false)} disabled={!selected} style={{ width: "100%", padding: "15px", borderRadius: 14, marginTop: 6, background: selected ? "var(--primary)" : "var(--bg-gray)", color: selected ? "#fff" : "var(--text-3)", fontWeight: 700, fontSize: 15, border: "none", transition: "all 0.18s", cursor: selected ? "pointer" : "not-allowed", boxShadow: selected ? "0 4px 16px rgba(232,56,13,0.28)" : "none" }}>
            {step + 1 === QUESTIONS.length ? "결과 보기 🎉" : "다음으로"}
          </button>
          <button className="ghost" onClick={() => next(true)} style={{ width: "100%", textAlign: "center" }}>건너뛰기</button>
        </div>
      </div>
    </div>
  );
}