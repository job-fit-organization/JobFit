"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Q_BEGINNER, Q_EXPERT,
  saveResult,
  type Mode, type JobId, type JobScores, type Option,
} from "./_lib";

// ─────────────────────────────────────────
//  src/app/page.tsx
//  흐름: 모드 선택 → 질문 20개 → 결과 저장 → /test/result 이동
// ─────────────────────────────────────────

const JOBFIT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@0,400;0,500;0,600;0,700;0,800;0,900&display=swap');

  /* SCOPED RESET for Test Page */
  .jf-test-content, .jf-test-content *, .jf-test-content *::before, .jf-test-content *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .jf-test-content button { font-family: inherit; cursor: pointer; border: none; background: none; }
  .jf-test-content a { text-decoration: none; color: inherit; }
  .jf-test-content::-webkit-scrollbar { width: 4px; }
  .jf-test-content::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }

  :root {
    --primary: #E8380D;
    --primary-dark: #C42E09;
    --primary-light: #FF5A35;
    --bg: #FFFFFF;
    --bg-gray: #F6F6F6;
    --border: #EBEBEB;
    --border-strong: #CCCCCC;
    --text-1: #111111;
    --text-2: #555555;
    --text-3: #999999;
    --font: 'Plus Jakarta Sans', system-ui, sans-serif;
  }

  /* SCOPED BODY */
  .jf-test-content { background: var(--bg); color: var(--text-1); font-family: var(--font); }

  @keyframes fadeUp  { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
  @keyframes barGrow { from { width:0; } }

  .fu  { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
  .fu1 { animation-delay: 0.08s; }
  .fu2 { animation-delay: 0.16s; }
  .fu3 { animation-delay: 0.24s; }

  /* MODE CARD */
  .mode-card { border: 2px solid var(--border); border-radius: 20px; background: #fff; padding: 28px 24px; cursor: pointer; transition: all 0.2s; text-align: left; }
  .mode-card:hover { border-color: #ccc; transform: translateY(-2px); box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
  .mode-card.active { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(232,56,13,0.1); }

  /* OPT */
  .opt { width: 100%; padding: 16px 18px; border-radius: 14px; text-align: left; border: 1.5px solid var(--border); background: #fff; color: var(--text-2); font-size: 15px; font-family: var(--font); cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 14px; line-height: 1.55; }
  .opt:hover:not(.opt-sel) { border-color: #ccc; color: var(--text-1); background: var(--bg-gray); transform: translateX(2px); }
  .opt-sel { border-color: var(--primary) !important; border-width: 2px !important; background: rgba(232,56,13,0.04) !important; color: var(--text-1) !important; box-shadow: 0 0 0 3px rgba(232,56,13,0.08); }

  .ghost { padding: 10px 18px; border-radius: 9px; font-weight: 500; font-size: 14px; font-family: var(--font); color: var(--text-3); cursor: pointer; transition: all 0.15s; }
  .ghost:hover { background: var(--bg-gray); color: var(--text-2); }
  .card { background: #fff; border: 1px solid var(--border); border-radius: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }

  .page-wrap { max-width: 760px; margin: 0 auto; padding: 100px clamp(20px,4vw,48px) 80px; width: 100%; }
  .two-col { display: flex; flex-direction: column; gap: 32px; }
  .col-left { }
  .col-right { display: flex; flex-direction: column; gap: 12px; }

  /* QUESTION PAGE */
  .q-wrap {
    min-height: 100vh; display: flex; flex-direction: column;
    background: linear-gradient(160deg, #fff 0%, #fff5f3 50%, #ffe8e2 100%);
    position: relative; overflow: hidden;
  }
  .q-bg-circle-1 { position: fixed; top: -160px; right: -160px; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(232,56,13,0.1) 0%, transparent 65%); pointer-events: none; }
  .q-bg-circle-2 { position: fixed; bottom: -100px; left: -100px; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(255,90,53,0.08) 0%, transparent 65%); pointer-events: none; }
  .q-bg-circle-3 { position: fixed; top: 40%; left: 50%; transform: translateX(-50%); width: 800px; height: 800px; border-radius: 50%; background: radial-gradient(circle, rgba(232,56,13,0.03) 0%, transparent 60%); pointer-events: none; }
  .q-inner { flex: 1; display: flex; flex-direction: column; width: 100%; max-width: 1200px; margin: 0 auto; padding: 80px clamp(40px,7vw,120px) 60px; }
  .q-top-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; }
  .q-progress-wrap { margin-bottom: 44px; }
  .q-progress-info { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .q-progress-label { font-size: 11px; font-weight: 700; color: var(--primary); letter-spacing: 2px; opacity: 0.8; }
  .q-progress-count { font-size: 12px; font-weight: 600; color: var(--text-3); }
  .q-progress-track { height: 6px; background: rgba(232,56,13,0.1); border-radius: 99px; overflow: hidden; }
  .q-progress-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, #FF5A35, var(--primary)); transition: width 0.5s cubic-bezier(0.16,1,0.3,1); box-shadow: 0 0 8px rgba(232,56,13,0.4); }
  .q-question { font-size: clamp(18px,1.8vw,24px); font-weight: 800; color: var(--text-1); line-height: 1.6; letter-spacing: -0.4px; margin-bottom: 32px; max-width: 800px; }
  .q-opts { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 28px; }
  .q-opt { width: 100%; padding: 20px 22px; border-radius: 16px; text-align: left; border: 1.5px solid rgba(0,0,0,0.07); background: rgba(255,255,255,0.8); backdrop-filter: blur(10px); color: var(--text-2); font-size: 15px; font-family: var(--font); cursor: pointer; transition: all 0.18s cubic-bezier(0.16,1,0.3,1); display: flex; align-items: center; gap: 14px; line-height: 1.6; box-shadow: 0 1px 6px rgba(0,0,0,0.05); }
  .q-opt:hover:not(.q-opt-sel) { border-color: rgba(232,56,13,0.25); background: rgba(255,255,255,0.95); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(232,56,13,0.08); }
  .q-opt-sel { border-color: var(--primary) !important; background: rgba(255,255,255,0.95) !important; color: var(--text-1) !important; box-shadow: 0 0 0 3px rgba(232,56,13,0.1), 0 4px 16px rgba(232,56,13,0.12) !important; transform: translateY(-2px); }
  .q-radio { width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0; border: 2px solid #D0CCC8; background: transparent; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
  .q-radio-sel { border-color: var(--primary); background: var(--primary); }
  .q-next { width: auto; min-width: 200px; padding: 15px 40px; border-radius: 14px; font-size: 15px; font-weight: 700; border: none; transition: all 0.18s; cursor: pointer; font-family: var(--font); align-self: flex-start; }
  .q-next-active { background: linear-gradient(135deg, #ea002c, #f47725) !important; color: #fff; box-shadow: 0 4px 18px rgba(234,0,44,0.25); }
  .q-next-active:hover { transform: translateY(-1.5px); box-shadow: 0 8px 25px rgba(234,0,44,0.35); filter: brightness(1.1); }
  .q-next-inactive { background: #EDECEA; color: #B0ABA7; cursor: not-allowed; }
  .q-skip { width: 100%; padding: 12px; border-radius: 10px; font-weight: 500; font-size: 13px; font-family: var(--font); color: #B0ABA7; cursor: pointer; transition: all 0.15s; background: none; border: none; margin-top: 4px; }
  .q-skip:hover { color: var(--text-3); }

  @media (max-width: 768px) { .q-opts { grid-template-columns: 1fr; } .q-inner { padding: 80px clamp(20px,5vw,40px) 60px; } }
  @media (max-width: 480px) { .page-wrap { padding-top: 80px; } .mode-card { padding: 22px 18px; } .q-question { font-size: 20px; } .q-opt { font-size: 14px; padding: 16px 16px; } }

`;

type AppStep = "mode-select" | "test";

export default function App() {
  const router = useRouter();
  const [appStep, setAppStep] = useState<AppStep>("mode-select");
  const [mode, setMode] = useState<Mode | null>(null);

  const handleModeSelect = (m: Mode) => { setMode(m); setAppStep("test"); };
  const handleDone = (jobScores: JobScores) => {
    if (!mode) return;
    saveResult({ jobScores, mode });
    setTimeout(() => router.push("/test/result"), 50);
  };

  return (
    <div className="jf-test-content" style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-1)", fontFamily: "var(--font)" }}>
      <style>{JOBFIT_CSS}</style>



      {appStep === "mode-select" && <ModeSelectView onSelect={handleModeSelect} />}
      {appStep === "test" && mode && <QuestionView mode={mode} onBack={() => setAppStep("mode-select")} onDone={handleDone} />}
    </div>
  );
}

// ── 모드 선택 화면 ────────────────────────
function ModeSelectView({ onSelect }: { onSelect: (m: Mode) => void }) {
  const [selected, setSelected] = useState<Mode | null>(null);

  const modes = [
    { id: "beginner" as Mode, icon: "🌱", badge: "BEGINNER", title: "입문자 모드", desc: "AI가 처음이에요.\n일상 언어로 된 질문들이에요.", color: "#10B981" },
    { id: "expert" as Mode, icon: "🔥", badge: "EXPERT", title: "실전 모드", desc: "개발 경험이 있어요.\n기술 용어가 포함돼 있어요.", color: "#E8380D" },
  ];

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "linear-gradient(160deg, #fff 0%, #fff5f3 50%, #ffe8e2 100%)",
      padding: "80px clamp(20px,4vw,48px) 60px",
      position: "relative", overflow: "hidden",
    }}>
      {/* 배경 글로우 */}
      <div style={{ position: "fixed", top: -160, right: -160, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,56,13,0.1) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -100, left: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,90,53,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 860, width: "100%", position: "relative", zIndex: 1 }}>

        <div className="fu" style={{ marginBottom: 20, display: "flex", justifyContent: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.8, color: "var(--primary)", padding: "5px 14px", borderRadius: 99, border: "1px solid rgba(232,56,13,0.25)", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)" }}>
            AI CAREER TEST
          </span>
        </div>

        <div className="fu fu1" style={{ marginBottom: 12, textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(28px,3.8vw,52px)", fontWeight: 800, color: "var(--text-1)", letterSpacing: -1.5, lineHeight: 1.15 }}>
            테스트 모드를 선택해주세요
          </h1>
        </div>

        <div className="fu fu2" style={{ marginBottom: 40, textAlign: "center" }}>
          <p style={{ fontSize: 15, color: "var(--text-2)", lineHeight: 1.7 }}>나의 AI 경험 수준에 맞는 모드로 시작하면 더 정확한 결과가 나와요</p>
        </div>

        <div className="fu fu2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
          {modes.map((m) => (
            <div
              key={m.id}
              onClick={() => setSelected(m.id)}
              style={{
                border: selected === m.id ? `2px solid ${m.color}` : "1.5px solid rgba(0,0,0,0.07)",
                borderRadius: 20, padding: "24px 22px", cursor: "pointer",
                background: selected === m.id ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.7)",
                backdropFilter: "blur(10px)",
                boxShadow: selected === m.id ? `0 0 0 3px rgba(232,56,13,0.1), 0 8px 32px rgba(0,0,0,0.08)` : "0 2px 12px rgba(0,0,0,0.05)",
                transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
                transform: selected === m.id ? "translateY(-3px)" : "none",
              }}
            >
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
          <div className="fu" style={{ padding: "14px 18px", borderRadius: 12, background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)", border: "1px solid rgba(232,56,13,0.12)", marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.7 }}>
              {selected === "beginner" ? "💡 코딩이나 AI 경험 없어도 괜찮아요. 일상적인 상황에서 나의 반응을 고르는 방식이에요." : "💡 LLM, Docker, 데이터 파이프라인 등 기술 용어가 포함돼 있어요. 개발 경험이 있다면 더 정확해요."}
            </p>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            onClick={() => selected && onSelect(selected)}
            style={{
              padding: "15px 48px", borderRadius: 14,
              fontSize: 15, fontWeight: 700,
              background: selected ? "linear-gradient(135deg, #ea002c, #f47725)" : "rgba(255,255,255,0.6)",
              color: selected ? "#fff" : "var(--text-3)",
              border: selected ? "none" : "1.5px solid rgba(0,0,0,0.08)",
              backdropFilter: "blur(8px)",
              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)", cursor: selected ? "pointer" : "not-allowed",
              boxShadow: selected ? "0 4px 18px rgba(234,0,44,0.25)" : "none",
              minWidth: 240,
            }}
            onMouseEnter={e => {
              if (selected) {
                e.currentTarget.style.transform = "translateY(-1.5px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(234,0,44,0.35)";
                e.currentTarget.style.filter = "brightness(1.1)";
              }
            }}
            onMouseLeave={e => {
              if (selected) {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 4px 18px rgba(234,0,44,0.25)";
                e.currentTarget.style.filter = "none";
              }
            }}
          >
            {selected ? "이 모드로 시작하기 →" : "모드를 선택해주세요"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 질문 화면 ─────────────────────────────
function QuestionView({ mode, onBack, onDone }: { mode: Mode; onBack: () => void; onDone: (j: JobScores) => void }) {
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

  const restart = () => {
    setStep(0);
    setJobScores({ "ai-app": 0, mlops: 0, "data-sci": 0 });
    setSelected(null);
    setSkippedAll(false);
    answered.current = 0;
  };

  if (skippedAll) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="card" style={{ padding: 48, textAlign: "center", maxWidth: 380 }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>🤔</div>
        <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10, color: "var(--text-1)", letterSpacing: -0.5 }}>답변이 부족해요</h3>
        <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.7, marginBottom: 28 }}>최소 1개 이상 답해야 결과를 볼 수 있어요.</p>
        <button
          onClick={restart}
          style={{ width: "100%", padding: "14px", borderRadius: 12, background: "linear-gradient(135deg, #ea002c, #f47725)", color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(234,0,44,0.2)", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.filter = "brightness(1.1)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.filter = "none"; }}
        >
          다시 시작하기
        </button>
      </div>
    </div>
  );

  return (
    <div className="q-wrap">
      <div className="q-bg-circle-1" />
      <div className="q-bg-circle-2" />
      <div className="q-bg-circle-3" />

      <div className="q-inner">
        <div className="q-top-bar">
          <button className="ghost" onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            모드 선택
          </button>
          <span style={{ fontSize: 12, fontWeight: 700, color: modeColor, padding: "5px 14px", borderRadius: 99, border: `1px solid ${modeColor}30`, background: `${modeColor}10` }}>
            {modeLabel}
          </span>
        </div>

        <div className="q-progress-wrap">
          <div className="q-progress-info">
            <span className="q-progress-label">Q {String(step + 1).padStart(2, "0")} / {QUESTIONS.length}</span>
            <span className="q-progress-count">{Math.round(progress)}% 완료</span>
          </div>
          <div className="q-progress-track">
            <div className="q-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <h2 className="q-question">{q.q}</h2>

        <div className="q-opts" key={`q-${step}`} style={{ opacity: animOut ? 0 : 1, transform: animOut ? "translateY(-10px)" : "none", transition: "all 0.18s ease" }}>
          {q.opts.map((opt, i) => {
            const sel = selected === opt;
            return (
              <button key={i} className={`q-opt${sel ? " q-opt-sel" : ""}`} onClick={() => setSelected(opt)}>
                <span className={`q-radio${sel ? " q-radio-sel" : ""}`}>
                  {sel && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                <span style={{ flex: 1 }}>{opt.t}</span>
              </button>
            );
          })}
        </div>

        <button onClick={() => next(false)} disabled={!selected} className={`q-next ${selected ? "q-next-active" : "q-next-inactive"}`}>
          {step + 1 === QUESTIONS.length ? "결과 보기 🎉" : "다음으로 →"}
        </button>
        <button className="q-skip" onClick={() => next(true)}>건너뛰기</button>
      </div>
    </div>
  );
}