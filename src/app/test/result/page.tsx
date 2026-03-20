"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  JOBS, loadResult,
  type JobId, type Mode, type JobScores,
} from "../_lib";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  button { font-family: inherit; cursor: pointer; border: none; background: none; }
  a { text-decoration: none; color: inherit; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: #e5e5e5; border-radius: 4px; }

  :root {
    --primary: #E8380D;
    --primary-dark: #C42E09;
    --bg: #F6F6F6;
    --bg-card: #FFFFFF;
    --border: #EBEBEB;
    --text-1: #111111;
    --text-2: #555555;
    --text-3: #999999;
    --font: 'Plus Jakarta Sans', system-ui, sans-serif;
  }

  body { background: var(--bg); color: var(--text-1); font-family: var(--font); }

  @keyframes fadeUp  { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
  @keyframes barGrow { from { width:0; } }
  @keyframes slideUp { from { opacity:0; transform:translateY(100%); } to { opacity:1; transform:translateY(0); } }

  .fu  { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
  .fu1 { animation-delay:0.08s; }
  .fu2 { animation-delay:0.16s; }
  .fu3 { animation-delay:0.24s; }

  /* NAV */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: rgba(255,255,255,0.94); backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 clamp(24px,5vw,72px); height: 62px;
  }
  .nav-logo { display: flex; align-items: center; gap: 9px; font-weight: 800; font-size: 19px; letter-spacing: -0.6px; }
  .nav-logo-icon { width: 34px; height: 34px; border-radius: 9px; background: var(--primary); display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(232,56,13,0.35); }

  /* WRAP */
  .wrap { padding: 82px clamp(24px,5vw,72px) 80px; }

  /* TOP BAR */
  .top-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 36px; flex-wrap: wrap; gap: 12px; }
  .mode-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; padding: 5px 14px; border-radius: 99px; }
  .top-bar-right { display: flex; gap: 8px; }
  .btn-outline { padding: 9px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; border: 1.5px solid var(--border); color: var(--text-2); transition: all 0.15s; display: flex; align-items: center; gap: 6px; background: var(--bg-card); }
  .btn-outline:hover { border-color: #bbb; color: var(--text-1); }
  .btn-red { background: var(--primary); color: #fff; border-color: var(--primary); box-shadow: 0 3px 12px rgba(232,56,13,0.25); }
  .btn-red:hover { background: var(--primary-dark); border-color: var(--primary-dark); color: #fff; }

  /* MAIN LAYOUT: 왼쪽 점수패널 + 오른쪽 직무카드 */
  .result-layout { display: grid; grid-template-columns: 320px 1fr; gap: 24px; align-items: start; }

  /* 점수 패널 */
  .score-panel { position: sticky; top: 82px; background: var(--bg-card); border: 1.5px solid var(--border); border-radius: 24px; padding: 28px; box-shadow: 0 2px 16px rgba(0,0,0,0.05); }
  .score-panel-eyebrow { font-size: 10px; font-weight: 700; letter-spacing: 1.8px; color: var(--text-3); text-transform: uppercase; margin-bottom: 22px; }
  .score-item { margin-bottom: 18px; }
  .score-item-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .score-label { font-size: 13px; font-weight: 600; color: var(--text-2); display: flex; align-items: center; gap: 7px; }
  .score-label.is-top { font-weight: 800; color: var(--text-1); }
  .score-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .score-pct { font-size: 13px; font-weight: 800; }
  .score-bar-bg { height: 6px; background: #F0F0F0; border-radius: 99px; overflow: hidden; }
  .score-bar { height: 100%; border-radius: 99px; animation: barGrow 1.2s cubic-bezier(0.16,1,0.3,1) both; }
  .divider { height: 1px; background: var(--border); margin: 22px 0; }
  .learn-btn { width: 100%; padding: 14px; border-radius: 14px; font-size: 14px; font-weight: 700; color: #fff; background: var(--primary); border: none; cursor: pointer; box-shadow: 0 3px 14px rgba(232,56,13,0.28); transition: all 0.15s; display: flex; align-items: center; justify-content: center; gap: 7px; }
  .learn-btn:hover { background: var(--primary-dark); transform: translateY(-1px); }

  /* 직무 카드 */
  .job-card { background: var(--bg-card); border-radius: 24px; overflow: hidden; box-shadow: 0 2px 16px rgba(0,0,0,0.06); animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
  .job-card-hero { padding: 48px clamp(28px,4vw,56px); position: relative; overflow: hidden; }
  .job-card-hero-bg { position: absolute; inset: 0; opacity: 0.04; pointer-events: none; }
  .job-card-hero-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 32px; gap: 20px; flex-wrap: wrap; }
  .job-card-hero-left { display: flex; align-items: center; gap: 20px; }
  .job-emoji-box { width: 72px; height: 72px; border-radius: 22px; display: flex; align-items: center; justify-content: center; font-size: 36px; flex-shrink: 0; }
  .job-rank-badge { font-size: 11px; font-weight: 700; letter-spacing: 0.8px; margin-bottom: 6px; }
  .job-type-title { font-size: clamp(22px,3vw,30px); font-weight: 900; color: var(--text-1); letter-spacing: -1px; line-height: 1.15; }
  .job-title-sub { font-size: 13px; color: var(--text-3); margin-top: 5px; }
  .job-pct-box { text-align: center; padding: 14px 22px; border-radius: 16px; flex-shrink: 0; }
  .job-pct-num { font-size: 36px; font-weight: 900; line-height: 1; }
  .job-pct-label { font-size: 11px; font-weight: 700; margin-top: 3px; }
  .job-progress-wrap { height: 6px; background: rgba(0,0,0,0.06); border-radius: 99px; overflow: hidden; margin-bottom: 28px; }
  .job-progress-fill { height: 100%; border-radius: 99px; animation: barGrow 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
  .job-tags { display: flex; flex-wrap: wrap; gap: 7px; }
  .job-tag { font-size: 12px; font-weight: 700; padding: 5px 14px; border-radius: 99px; }

  /* 카드 바디 */
  .job-card-body { padding: 36px clamp(28px,4vw,56px); border-top: 1px solid var(--border); display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
  .body-section-title { font-size: 11px; font-weight: 700; letter-spacing: 1.5px; color: var(--text-3); text-transform: uppercase; margin-bottom: 16px; }
  .hook-text { font-size: 15px; color: var(--text-2); line-height: 1.85; }
  .traits-list { display: flex; flex-direction: column; gap: 10px; }
  .trait-item { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: var(--text-2); line-height: 1.6; }
  .trait-check { font-weight: 800; flex-shrink: 0; margin-top: 2px; }

  /* MODAL */
  .modal-overlay { position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.2s ease both; }
  .modal-inner { display: flex; flex-direction: column; align-items: center; gap: 16px; width: 100%; max-width: 400px; }

  /* SHEET */
  .sheet-overlay { position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: flex-end; justify-content: center; animation: fadeIn 0.2s ease both; }
  .sheet { width: 100%; max-width: 520px; background: var(--bg-card); border-radius: 24px 24px 0 0; padding: 24px 24px 48px; animation: slideUp 0.32s cubic-bezier(0.16,1,0.3,1) both; }
  .sheet-handle { width: 40px; height: 4px; border-radius: 99px; background: var(--border); margin: 0 auto 24px; }

  /* TOAST */
  .toast { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 9000; background: #111; color: #fff; padding: 13px 22px; border-radius: 14px; font-size: 13px; font-weight: 600; box-shadow: 0 8px 24px rgba(0,0,0,0.25); animation: fadeUp 0.25s ease both; white-space: nowrap; }

  @media (max-width: 960px) { .result-layout { grid-template-columns: 1fr; } .score-panel { position: static; } }
  @media (max-width: 680px) { .job-card-body { grid-template-columns: 1fr; gap: 24px; } .top-bar-right { flex-wrap: wrap; } }
`;

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

async function postTestResult(payload: { app_score: number; data_score: number; mlops_score: number }): Promise<void> {
  const res = await fetch(`${API_URL}/api/test/result/`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    credentials: "include", body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`서버 오류 (${res.status})`);
}

type Job = (typeof JOBS)[JobId];

function calcPct(jobScores: JobScores) {
  const total = (Object.values(jobScores) as number[]).reduce((a, b) => a + b, 0) || 1;
  return Object.fromEntries(
    (Object.entries(jobScores) as [JobId, number][]).map(([k, v]) => [k, Math.round((v / total) * 100)])
  ) as Record<JobId, number>;
}

const JL: Record<JobId, { color: string; rgb: string; label: string }> = {
  "ai-app":   { color: "#E8380D", rgb: "232,56,13",  label: "AI App Engineer" },
  "mlops":    { color: "#10B981", rgb: "16,185,129",  label: "MLOps Engineer" },
  "data-sci": { color: "#8B5CF6", rgb: "139,92,246",  label: "Data Scientist" },
};

export default function TestResultPage() {
  const router = useRouter();
  const [data, setData] = useState<{ jobScores: JobScores; mode: Mode } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let tries = 0;
    const load = () => {
      const result = loadResult();
      if (!result) {
        if (++tries < 3) setTimeout(load, 100);
        else router.replace("/");
        return;
      }
      setData(result);
      const uid = getCookie("user_id");
      if (!uid) return;
      const pct = calcPct(result.jobScores);
      postTestResult({ app_score: pct["ai-app"], data_score: pct["data-sci"], mlops_score: pct["mlops"] })
        .then(() => setSaveSuccess(true))
        .catch((e: Error) => setSaveError(e.message));
    };
    load();
  }, [router]);

  if (!data) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{CSS}</style>
      <span style={{ fontSize: 13, color: "var(--text-3)" }}>결과 불러오는 중...</span>
    </div>
  );

  const pct = calcPct(data.jobScores);
  const sorted = (Object.entries(pct) as [JobId, number][]).sort((a, b) => b[1] - a[1]);
  const topJob = JOBS[sorted[0][0]];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-1)", fontFamily: "var(--font)" }}>
      <style>{CSS}</style>

      {saveSuccess && <div className="toast">✅ 결과가 저장됐어요!</div>}
      {saveError && (
        <div style={{ position: "sticky", top: 0, zIndex: 9000, background: "#FEF2F2", borderBottom: "1px solid #FECACA", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "#991B1B" }}>⚠️ 저장 실패: {saveError}</span>
          <button onClick={() => setSaveError(null)} style={{ fontSize: 20, color: "#B91C1C" }}>×</button>
        </div>
      )}

      <nav className="nav">
        <div className="nav-logo">
          <div className="nav-logo-icon">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 9L7.5 13.5L15 5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          JOBFIT
        </div>
      </nav>

      <ResultView pct={pct} sorted={sorted} topJob={topJob} mode={data.mode} />
    </div>
  );
}

function ResultView({ pct, sorted, topJob, mode }: {
  pct: Record<JobId, number>;
  sorted: [JobId, number][];
  topJob: Job;
  mode: Mode;
}) {
  const [showShare, setShowShare] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showCapture, setShowCapture] = useState(false);
  const isLoggedIn = typeof document !== "undefined" && !!getCookie("user_id");
  const isExpert = mode === "expert";

  useEffect(() => {
    if (isLoggedIn) return;
    const t = setTimeout(() => setShowLogin(true), 5000);
    return () => clearTimeout(t);
  }, [isLoggedIn]);

  return (
    <div className="wrap">
      {showShare   && <ShareSheet   job={topJob} onClose={() => setShowShare(false)} />}
      {showLogin   && <LoginSheet   job={topJob} pct={pct} onClose={() => setShowLogin(false)} />}
      {showCapture && <CaptureModal job={topJob} pct={pct} sorted={sorted} mode={mode} onClose={() => setShowCapture(false)} />}

      {/* TOP BAR */}
      <div className="top-bar fu">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="mode-badge" style={{
            color: isExpert ? "#E8380D" : "#10B981",
            border: `1px solid ${isExpert ? "rgba(232,56,13,0.3)" : "rgba(16,185,129,0.3)"}`,
            background: isExpert ? "rgba(232,56,13,0.07)" : "rgba(16,185,129,0.07)",
          }}>
            {isExpert ? "🔥 실전 모드" : "🌱 입문자 모드"}
          </span>
          <span style={{ fontSize: 13, color: "var(--text-3)" }}>AI 직무 적성 테스트 결과</span>
        </div>
        <div className="top-bar-right">
          <button className="btn-outline" onClick={() => setShowCapture(true)}>📥 이미지 저장</button>
          <button className="btn-outline btn-red" onClick={() => setShowShare(true)}>🔗 결과 공유</button>
        </div>
      </div>

      {/* LAYOUT */}
      <div className="result-layout">

        {/* 점수 패널 */}
        <div className="score-panel fu fu1">
          <p className="score-panel-eyebrow">직무 적합도</p>
          {sorted.map(([id, p]) => {
            const j = JL[id];
            const isTop = id === topJob.id;
            return (
              <div key={id} className="score-item">
                <div className="score-item-top">
                  <span className={`score-label${isTop ? " is-top" : ""}`}>
                    <span className="score-dot" style={{ background: j.color }} />
                    {j.label}
                  </span>
                  <span className="score-pct" style={{ color: j.color }}>{p}%</span>
                </div>
                <div className="score-bar-bg">
                  <div className="score-bar" style={{ width: `${p}%`, background: j.color, opacity: isTop ? 1 : 0.3 }} />
                </div>
              </div>
            );
          })}

          <div className="divider" />

          {isLoggedIn ? (
            <a href={topJob.nextSteps[0].url} target="_blank" rel="noopener noreferrer" className="learn-btn">
              📚 지금 바로 학습하기 →
            </a>
          ) : (
            <button className="learn-btn" onClick={() => setShowLogin(true)}>
              📚 지금 바로 학습하기 →
            </button>
          )}
        </div>

        {/* 직무 카드 */}
        <div className="job-card fu fu2">
          {/* 히어로 영역 */}
          <div className="job-card-hero" style={{ background: `rgba(${topJob.rgb},0.04)` }}>
            <div className="job-card-hero-bg" style={{ background: `radial-gradient(circle at top right, rgba(${topJob.rgb},1), transparent 65%)` }} />

            <div className="job-card-hero-top">
              <div className="job-card-hero-left">
                <div className="job-emoji-box" style={{ background: `rgba(${topJob.rgb},0.12)`, border: `2px solid rgba(${topJob.rgb},0.2)` }}>
                  {topJob.emoji}
                </div>
                <div>
                  <div className="job-rank-badge" style={{ color: topJob.color }}>🥇 1순위 추천 직무</div>
                  <div className="job-type-title">{topJob.typeTitle}</div>
                  <div className="job-title-sub">{topJob.title}</div>
                </div>
              </div>
              <div className="job-pct-box" style={{ background: `rgba(${topJob.rgb},0.1)` }}>
                <div className="job-pct-num" style={{ color: topJob.color }}>{pct[topJob.id]}%</div>
                <div className="job-pct-label" style={{ color: topJob.color }}>적합도</div>
              </div>
            </div>

            <div className="job-progress-wrap">
              <div className="job-progress-fill" style={{ width: `${pct[topJob.id]}%`, background: `linear-gradient(90deg, rgba(${topJob.rgb},0.6), ${topJob.color})` }} />
            </div>

            <div className="job-tags">
              {topJob.tags.map(t => (
                <span key={t} className="job-tag" style={{ background: `rgba(${topJob.rgb},0.12)`, color: topJob.color }}>{t}</span>
              ))}
            </div>
          </div>

          {/* 바디 영역 */}
          <div className="job-card-body">
            <div>
              <p className="body-section-title">직무 소개</p>
              <p className="hook-text">{mode === "beginner" ? topJob.hookBeginner : topJob.hook}</p>
            </div>
            <div>
              <p className="body-section-title">이런 특징이 있어요</p>
              <div className="traits-list">
                {topJob.traits.map(t => (
                  <div key={t} className="trait-item">
                    <span className="trait-check" style={{ color: topJob.color }}>✓</span>
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 캡처 카드 ─────────────────────────────
function CaptureCard({ job, pct, sorted, mode }: {
  job: Job;
  pct: Record<JobId, number>;
  sorted: [JobId, number][];
  mode: Mode;
}) {
  return (
    <div style={{
      width: 380, background: "#0F172A", borderRadius: 28,
      overflow: "hidden", fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
      position: "relative",
    }}>
      {/* 상단 컬러 그라디언트 */}
      <div style={{ height: 5, background: `linear-gradient(90deg, ${job.color}, rgba(${job.rgb},0.3))` }} />

      {/* 히어로 */}
      <div style={{ padding: "32px 28px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: `rgba(${job.rgb},0.08)`, pointerEvents: "none" }} />

        {/* 배지 */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 99, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", marginBottom: 24 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: job.color, display: "inline-block" }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: 1.8 }}>JOBFIT · AI CAREER TEST</span>
        </div>

        {/* 이모지 + 정보 */}
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 24 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: `rgba(${job.rgb},0.15)`, border: `2px solid rgba(${job.rgb},0.3)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, flexShrink: 0 }}>
            {job.emoji}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: job.color, letterSpacing: 0.8, marginBottom: 5 }}>🥇 1순위 추천 직무</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: -0.8, lineHeight: 1.2 }}>{job.typeTitle}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>{job.title}</div>
          </div>
        </div>

        {/* 적합도 바 */}
        <div style={{ marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>적합도</span>
          <span style={{ fontSize: 22, fontWeight: 900, color: job.color }}>{pct[job.id]}%</span>
        </div>
        <div style={{ height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 99, overflow: "hidden", marginBottom: 24 }}>
          <div style={{ height: "100%", width: `${pct[job.id]}%`, background: `linear-gradient(90deg, rgba(${job.rgb},0.7), ${job.color})`, borderRadius: 99 }} />
        </div>

        {/* 태그 */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {job.tags.map(t => (
            <span key={t} style={{ fontSize: 11, fontWeight: 700, padding: "4px 11px", borderRadius: 99, background: `rgba(${job.rgb},0.14)`, color: job.color, border: `1px solid rgba(${job.rgb},0.25)` }}>{t}</span>
          ))}
        </div>
      </div>

      {/* 구분선 */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "0 28px" }} />

      {/* 점수 비교 */}
      <div style={{ padding: "20px 28px 28px" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 1.5, marginBottom: 14 }}>전체 직무 비교</div>
        {sorted.map(([id, p]) => {
          const j = JL[id];
          const isTop = id === job.id;
          return (
            <div key={id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: isTop ? j.color : "rgba(255,255,255,0.2)", fontWeight: isTop ? 700 : 400, width: 120, flexShrink: 0 }}>{j.label}</span>
              <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${p}%`, background: isTop ? j.color : `rgba(${j.rgb},0.25)`, borderRadius: 99 }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: isTop ? j.color : "rgba(255,255,255,0.2)", width: 34, textAlign: "right", flexShrink: 0 }}>{p}%</span>
            </div>
          );
        })}
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: 1.5 }}>{mode === "expert" ? "🔥 실전 모드" : "🌱 입문자 모드"}</span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: 1 }}>JOBFIT.COM</span>
        </div>
      </div>
    </div>
  );
}

// ── 캡처 모달 ─────────────────────────────
function CaptureModal({ job, pct, sorted, mode, onClose }: {
  job: Job; pct: Record<JobId, number>; sorted: [JobId, number][]; mode: Mode; onClose: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveImage = async () => {
    if (!cardRef.current || saving) return;
    setSaving(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2.5 });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `jobfit-${job.id}-result.png`;
      a.click();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("저장에 실패했어요.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-inner" onClick={e => e.stopPropagation()}>
        <div ref={cardRef}>
          <CaptureCard job={job} pct={pct} sorted={sorted} mode={mode} />
        </div>
        <button
          onClick={saveImage}
          disabled={saving}
          style={{ width: "100%", padding: "15px", borderRadius: 14, background: saved ? "#10B981" : job.color, color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: saving ? "wait" : "pointer", boxShadow: `0 4px 20px rgba(${job.rgb},0.4)` }}
        >
          {saving ? "⏳ 저장 중..." : saved ? "✅ 저장 완료!" : "📥 이미지로 저장"}
        </button>
        <button
          onClick={onClose}
          style={{ width: "100%", padding: "12px", borderRadius: 12, background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", fontWeight: 500, fontSize: 13, border: "1px solid rgba(255,255,255,0.12)", cursor: "pointer" }}
        >
          닫기
        </button>
      </div>
    </div>
  );
}

// ── 로그인 시트 ────────────────────────────
function LoginSheet({ job, pct, onClose }: { job: Job; pct: Record<JobId, number>; onClose: () => void; }) {
  const router = useRouter();
  const topPct = pct[job.id];
  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px", borderRadius: 16, marginBottom: 24, background: `rgba(${job.rgb},0.06)`, border: `1.5px solid rgba(${job.rgb},0.18)` }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: `rgba(${job.rgb},0.12)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{job.emoji}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: job.color }}>{job.typeTitle}</div>
            <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>{job.title} · {topPct}% 적합</div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: job.color }}>{topPct}%</div>
        </div>
        <p style={{ fontSize: 19, fontWeight: 800, color: "var(--text-1)", marginBottom: 8, letterSpacing: -0.3, lineHeight: 1.35 }}>이 결과를<br />저장하고 싶으신가요?</p>
        <p style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 28, lineHeight: 1.7 }}>로그인하면 내 결과가 저장되고<br />맞춤 학습 로드맵을 바로 받을 수 있어요</p>
        <button onClick={() => router.push("/login")} style={{ width: "100%", padding: "15px", borderRadius: 14, fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer", background: job.color, color: "#fff", marginBottom: 10, boxShadow: `0 4px 14px rgba(${job.rgb},0.3)` }}>
          🔐 로그인 / 회원가입
        </button>
        <button onClick={onClose} style={{ width: "100%", padding: "12px", borderRadius: 12, fontSize: 14, fontWeight: 500, color: "var(--text-3)", background: "none", border: "1px solid var(--border)", cursor: "pointer" }}>
          나중에 할게요
        </button>
      </div>
    </div>
  );
}

// ── 공유 시트 ──────────────────────────────
function ShareSheet({ job, onClose }: { job: Job; onClose: () => void; }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/` : "";
  const shareText = `나의 AI 직무 유형은 "${job.typeTitle}" ${job.emoji}\n"${job.hook}"\n\nJOBFIT에서 나도 확인해봐!`;

  const shareTwitter = () => { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`, "_blank"); onClose(); };
  const copyLink = () => { navigator.clipboard?.writeText(shareUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); };
  const shareNative = () => { navigator.share?.({ title: `나의 AI 직무: ${job.typeTitle}`, text: shareText, url: shareUrl }); onClose(); };
  const hasNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  const items = [
    ...(hasNativeShare ? [{ icon: "📤", label: "공유하기", action: shareNative, bg: "#334155", color: "#fff" }] : []),
    { icon: "𝕏", label: "트위터(X)", action: shareTwitter, bg: "#000", color: "#fff" },
    { icon: copied ? "✅" : "🔗", label: copied ? "복사 완료!" : "링크 복사", action: copyLink, bg: `rgba(${job.rgb},0.1)`, color: job.color },
  ];

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px", borderRadius: 16, background: `rgba(${job.rgb},0.06)`, border: `1.5px solid rgba(${job.rgb},0.18)`, marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: `rgba(${job.rgb},0.12)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{job.emoji}</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: job.color }}>{job.typeTitle}</div>
            <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>{job.title} · JOBFIT</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: 10, marginBottom: 16 }}>
          {items.map(item => (
            <button key={item.label} onClick={item.action} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "16px 8px 14px", borderRadius: 16, background: "#F8F8F8", border: "1px solid var(--border)", cursor: "pointer" }}>
              <div style={{ width: 46, height: 46, borderRadius: 14, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: item.icon === "𝕏" ? 18 : 22, fontWeight: 900, color: item.color }}>
                {item.icon}
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: item.color, textAlign: "center" }}>{item.label}</span>
            </button>
          ))}
        </div>
        <button onClick={onClose} style={{ width: "100%", padding: "13px", borderRadius: 12, background: "none", border: "1px solid var(--border)", color: "var(--text-3)", fontWeight: 500, fontSize: 14, cursor: "pointer" }}>
          닫기
        </button>
      </div>
    </div>
  );
}