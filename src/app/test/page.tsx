"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  CSS, JOBS, Q_BEGINNER, Q_EXPERT,
  saveResult,
  type Mode, type JobId, type RadarKey,
  type JobScores, type RadarScores, type Option,
} from "./_lib";

// ─────────────────────────────────────────
//  src/app/test/page.tsx
//  흐름: 모드 선택 → 질문 20개 → 결과 저장 → /test/result 이동
// ─────────────────────────────────────────

type Step = "mode-select" | "test";

/** 점수 기반 상위 2개 직무 계산 */
function calcTop2(jobScores: JobScores): [JobId, JobId] {
  const sorted = (Object.entries(jobScores) as [JobId, number][])
    .sort((a, b) => b[1] - a[1]);
  return [sorted[0][0], sorted[1][0]];
}

export default function TestPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("mode-select");
  const [mode, setMode] = useState<Mode | null>(null);

  const handleModeSelect = (m: Mode) => {
    setMode(m);
    setStep("test");
  };

  const handleDone = (jobScores: JobScores, radarScores: RadarScores) => {
    if (!mode) return;
    const top2 = calcTop2(jobScores);
    saveResult({ jobScores, radarScores, mode, top2 });
    setTimeout(() => {
      router.push("/test/result");
    }, 50);
  };

  return (
    <div data-theme="light" style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-1)", fontFamily: "'Inter',system-ui,sans-serif" }}>
      <style>{CSS}</style>
      {step === "mode-select" && (
        <ModeSelectView onSelect={handleModeSelect} />
      )}
      {step === "test" && mode && (
        <QuestionView mode={mode} onBack={() => setStep("mode-select")} onDone={handleDone} />
      )}
    </div>
  );
}

// ── 모드 선택 화면 ────────────────────────
function ModeSelectView({ onSelect }: { onSelect: (m: Mode) => void }) {
  const [selected, setSelected] = useState<Mode | null>(null);

  const modes = [
    { id: "beginner" as Mode, icon: "🌱", title: "입문자 모드", desc: "AI가 처음이에요.\n일상 언어로 된 질문들이에요.", color: "#10B981", rgb: "16,185,129" },
    { id: "expert" as Mode, icon: "🔥", title: "실전 모드", desc: "개발 경험이 있어요.\n기술 용어가 포함돼 있어요.", color: "#3B82F6", rgb: "59,130,246" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "clamp(32px,5vw,64px) clamp(18px,4vw,48px)" }}>
      <div style={{ maxWidth: 560, width: "100%" }}>
        <div className="fu" style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: "clamp(24px,4vw,34px)", fontWeight: 800, color: "var(--text-1)", letterSpacing: -1, lineHeight: 1.2, marginBottom: 12 }}>
            테스트 모드를<br />선택해주세요
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.7 }}>
            나의 AI 경험 수준에 맞는 모드로 시작하면 더 정확한 결과가 나와요
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
          {modes.map((m) => (
            <div
              key={m.id}
              className={`mode-card${selected === m.id ? " active" : ""}`}
              onClick={() => setSelected(m.id)}
              style={{ "--accent": m.color, "--accent-bg": `rgba(${m.rgb},0.07)` } as React.CSSProperties}
            >
              <div style={{ fontSize: "clamp(32px,5vw,44px)", marginBottom: 14 }}>{m.icon}</div>
              <div style={{ fontSize: "clamp(14px,2.5vw,17px)", fontWeight: 700, color: selected === m.id ? m.color : "var(--text-1)", marginBottom: 8 }}>{m.title}</div>
              <div style={{ fontSize: "clamp(11px,1.8vw,13px)", color: "var(--text-3)", lineHeight: 1.65, whiteSpace: "pre-line" }}>{m.desc}</div>
              {selected === m.id && (
                <div style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: m.color, fontWeight: 700 }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="5" fill={m.color} />
                    <path d="M4 6l1.5 1.5L8 4" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  선택됨
                </div>
              )}
            </div>
          ))}
        </div>

        {selected && (
          <div className="fu" style={{ padding: "14px 18px", borderRadius: 12, background: "var(--bg-subtle)", border: "1px solid var(--border)", marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.7 }}>
              {selected === "beginner"
                ? "💡 코딩이나 AI 경험 없어도 괜찮아요. 일상적인 상황에서 나의 반응을 고르는 방식이에요."
                : "💡 LLM, Docker, 데이터 파이프라인 등 기술 용어가 포함돼 있어요. 개발 경험이 있다면 더 정확해요."}
            </p>
          </div>
        )}

        <button
          onClick={() => selected && onSelect(selected)}
          style={{
            width: "100%", padding: "clamp(12px,2vw,15px)", borderRadius: 12,
            fontSize: "clamp(14px,2.5vw,15px)", fontWeight: 700,
            background: selected ? "#10B981" : "var(--bg-subtle)",
            color: selected ? "#fff" : "var(--text-3)",
            border: "none", transition: "all 0.2s",
            cursor: selected ? "pointer" : "not-allowed",
            boxShadow: selected ? "0 4px 16px rgba(16,185,129,0.3)" : "none",
          }}
        >
          {selected ? "이 모드로 시작하기 →" : "모드를 선택해주세요"}
        </button>
      </div>
    </div>
  );
}

// ── 질문 화면 ─────────────────────────────
function QuestionView({
  mode,
  onBack,
  onDone,
}: {
  mode: Mode;
  onBack: () => void;
  onDone: (j: JobScores, r: RadarScores) => void;
}) {
  const QUESTIONS = mode === "expert" ? Q_EXPERT : Q_BEGINNER;
  const [step, setStep] = useState(0);
  const [jobScores, setJobScores] = useState<JobScores>({ "ai-app": 0, mlops: 0, "data-sci": 0 });
  const [radarScores, setRadarScores] = useState<RadarScores>({ llm: 0, dl: 0, data: 0, service: 0, infra: 0, collab: 0 });
  const [selected, setSelected] = useState<Option | null>(null);
  const [animOut, setAnimOut] = useState(false);
  const [skippedAll, setSkippedAll] = useState(false);
  const answered = useRef(0);

  const q = QUESTIONS[step] ?? QUESTIONS[0];
  const progress = (step / QUESTIONS.length) * 100;
  const modeBadge = mode === "expert"
    ? { label: "🔥 실전 모드", color: "#3B82F6" }
    : { label: "🌱 입문자 모드", color: "#10B981" };

  const next = (skip = false) => {
    if (!skip && !selected) return;
    const nj = { ...jobScores };
    const nr = { ...radarScores };
    if (!skip && selected) {
      (Object.entries(selected.w) as [JobId, number][]).forEach(([k, v]) => { nj[k] += v; });
      answered.current++;
    }
    if (step + 1 >= QUESTIONS.length) {
      if (answered.current === 0) { setSkippedAll(true); return; }
      onDone(nj, nr);
      return;
    }
    setAnimOut(true);
    setTimeout(() => {
      setJobScores(nj);
      setRadarScores(nr);
      setSelected(null);
      setAnimOut(false);
      setStep((s) => s + 1);
    }, 180);
  };

  const restart = () => {
    setStep(0);
    setJobScores({ "ai-app": 0, mlops: 0, "data-sci": 0 });
    setRadarScores({ llm: 0, dl: 0, data: 0, service: 0, infra: 0, collab: 0 });
    setSelected(null);
    setSkippedAll(false);
    answered.current = 0;
  };

  if (skippedAll) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="card" style={{ padding: 40, textAlign: "center", maxWidth: 360 }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>🤔</div>
        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "var(--text-1)" }}>답변이 부족해요</h3>
        <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.7, marginBottom: 24 }}>최소 1개 이상 답해야 결과를 볼 수 있어요.</p>
        <button onClick={restart} style={{ width: "100%", padding: "12px", borderRadius: 10, background: "#10B981", color: "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>
          다시 시작하기
        </button>
      </div>
    </div>
  );

  return (
    <div className="page-wrap">
      {/* 상단 바 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <button className="ghost" onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          모드 선택
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: modeBadge.color, padding: "4px 12px", borderRadius: 99, border: `1px solid ${modeBadge.color}30`, background: `${modeBadge.color}10` }}>
            {modeBadge.label}
          </span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-3)" }}>{step + 1}/{QUESTIONS.length}</span>
        </div>
      </div>

      {/* 프로그레스 바 */}
      <div style={{ height: 4, background: "var(--border)", borderRadius: 99, marginBottom: 40, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 99, background: "#10B981", width: `${progress}%`, transition: "width 0.5s cubic-bezier(0.16,1,0.3,1)" }} />
      </div>

      {/* 2컬럼: 왼쪽=질문 고정, 오른쪽=선택지 */}
      <div className="two-col">
        <div className="col-left">
          <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", letterSpacing: 1.5, marginBottom: 16 }}>
            Q {String(step + 1).padStart(2, "0")} / {QUESTIONS.length}
          </div>
          <h2 style={{ fontSize: "clamp(20px,2.4vw,26px)", fontWeight: 800, color: "var(--text-1)", lineHeight: 1.5, marginBottom: 0, letterSpacing: -0.5 }}>
            {q.q}
          </h2>
        </div>

        <div className="col-right" key={`q-${step}`} style={{ opacity: animOut ? 0 : 1, transform: animOut ? "translateY(-6px)" : "none", transition: "all 0.18s ease" }}>
          {q.opts.map((opt, i) => {
            const sel = selected === opt;
            return (
              <button
                key={i}
                className={`opt${sel ? " opt-sel" : ""}`}
                onClick={() => setSelected(opt)}
              >
                {/* 왼쪽 라디오 */}
                <span style={{
                  width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                  border: sel ? "none" : "1.5px solid var(--border-strong)",
                  background: sel ? "#10B981" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s",
                }}>
                  {sel && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                {/* 선택지 텍스트 */}
                <span style={{ flex: 1 }}>{opt.t}</span>
              </button>
            );
          })}

          <button
            onClick={() => next(false)}
            disabled={!selected}
            style={{
              width: "100%", padding: "14px", borderRadius: 14, marginTop: 4,
              background: selected ? "#10B981" : "var(--bg-subtle)",
              color: selected ? "#fff" : "var(--text-3)",
              fontWeight: 700, fontSize: 15, border: "none", transition: "all 0.18s",
              cursor: selected ? "pointer" : "not-allowed",
              boxShadow: selected ? "0 4px 14px rgba(16,185,129,0.28)" : "none",
            }}
          >
            {step + 1 === QUESTIONS.length ? "결과 보기 🎉" : "다음으로"}
          </button>
          <button className="ghost" onClick={() => next(true)} style={{ width: "100%", textAlign: "center" }}>
            건너뛰기
          </button>
        </div>
      </div>
    </div>
  );
}
