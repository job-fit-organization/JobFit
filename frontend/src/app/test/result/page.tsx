"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  JOBS, loadResult,
  type JobId, type Mode, type JobScores,
} from "../_lib";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  .result-page *, .result-page *::before, .result-page *::after { box-sizing: border-box; }
  .result-page button { font-family: inherit; cursor: pointer; }
  .result-page a { text-decoration: none; color: inherit; }

  :root {
    --primary: #E8380D;
    --primary-dark: #C42E09;
    --bg: linear-gradient(160deg, #fff 0%, #fff5f3 50%, #ffe8e2 100%);
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



  /* WRAP */
  .wrap { padding: 100px clamp(24px,5vw,72px) 80px; position: relative; z-index: 1; }

  /* TOP BAR */
  .top-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 36px; flex-wrap: wrap; gap: 12px; }
  .mode-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; padding: 5px 14px; border-radius: 99px; }
  .top-bar-right { display: flex; gap: 8px; }
  .btn-outline { padding: 9px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; border: 1.5px solid var(--border); color: var(--text-2); transition: all 0.15s; display: flex; align-items: center; gap: 6px; background: var(--bg-card); }
  .btn-outline:hover { border-color: #bbb; color: var(--text-1); }
  .btn-red { background: linear-gradient(135deg, #ea002c, #f47725); color: #fff; border-color: transparent; box-shadow: 0 4px 18px rgba(234,0,44,0.25); }
  .btn-red:hover { filter: brightness(1.1); transform: translateY(-1.5px); box-shadow: 0 8px 25px rgba(234,0,44,0.35); color: #fff; border-color: transparent; }

  /* MAIN LAYOUT: 왼쪽 직무카드 + 오른쪽 점수패널 */
  .result-layout { display: grid; grid-template-columns: 1fr 320px; gap: 24px; align-items: start; }

  /* 점수 패널 */
  .score-panel { position: sticky; top: 82px; background: rgba(255,255,255,0.8); backdrop-filter: blur(12px); border: 1.5px solid rgba(255,255,255,0.6); border-radius: 24px; padding: 28px; box-shadow: 0 2px 16px rgba(0,0,0,0.06); }
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
  .learn-btn { width: 100%; padding: 14px; border-radius: 14px; font-size: 14px; font-weight: 700; color: #fff; background: linear-gradient(135deg, #ea002c, #f47725); border: none; cursor: pointer; box-shadow: 0 4px 18px rgba(234,0,44,0.25); transition: all 0.18s; display: flex; align-items: center; justify-content: center; gap: 7px; }
  .learn-btn:hover { filter: brightness(1.1); transform: translateY(-1.5px); box-shadow: 0 8px 25px rgba(234,0,44,0.35); }

  /* 직무 카드 */
  .job-card { background: rgba(255,255,255,0.85); backdrop-filter: blur(12px); border-radius: 24px; overflow: hidden; box-shadow: 0 2px 20px rgba(0,0,0,0.07); animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
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
  .job-card-body { padding: 36px clamp(28px,4vw,56px); border-top: 1px solid rgba(0,0,0,0.06); display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
  .body-section-title { font-size: 11px; font-weight: 700; letter-spacing: 1.5px; color: var(--text-3); text-transform: uppercase; margin-bottom: 16px; }
  .hook-text { font-size: 15px; color: var(--text-2); line-height: 1.85; }
  .traits-list { display: flex; flex-direction: column; gap: 10px; }
  .trait-item { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: var(--text-2); line-height: 1.6; }
  .trait-check { font-weight: 800; flex-shrink: 0; margin-top: 2px; }

  /* MODAL */
  .modal-overlay { position: fixed; inset: 0; z-index: 99999; background: rgba(0,0,0,0.75); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.2s ease both; }
  .modal-inner { display: flex; flex-direction: column; align-items: center; gap: 16px; width: 100%; max-width: 420px; max-height: 90vh; overflow-y: auto; }

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
  "ai-app": { color: "#E8380D", rgb: "232,56,13", label: "AI App Engineer" },
  "mlops": { color: "#10B981", rgb: "16,185,129", label: "MLOps Engineer" },
  "data-sci": { color: "#8B5CF6", rgb: "139,92,246", label: "Data Scientist" },
};

function TestResultPageInner() {
  const router = useRouter();
  const [data, setData] = useState<{ jobScores: JobScores; mode: Mode } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    // 쿼리스트링으로 공유된 결과 확인
    const sharedJob = searchParams.get("job") as JobId | null;
    const sharedMode = searchParams.get("mode") as Mode | null;

    if (sharedJob && sharedMode && JOBS[sharedJob]) {
      // 공유 링크로 접근한 경우 - 쿼리스트링에서 실제 점수 복원
      const ai = parseInt(searchParams.get("ai") || "0");
      const ml = parseInt(searchParams.get("ml") || "0");
      const ds = parseInt(searchParams.get("ds") || "0");
      const total = ai + ml + ds || 1;
      // 퍼센트 → 원점수 역산 (퍼센트 그대로 jobScores에 넣으면 calcPct가 다시 계산)
      const restoredScores: JobScores = {
        "ai-app": ai,
        "mlops": ml,
        "data-sci": ds,
      };
      setData({ jobScores: restoredScores, mode: sharedMode });
      return;
    }

    // 일반 접근 - localStorage에서 읽기
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
  }, [router, searchParams]);

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
    <div className="result-page" style={{ minHeight: "100vh", background: "linear-gradient(160deg, #fff 0%, #fff5f3 50%, #ffe8e2 100%)", color: "var(--text-1)", fontFamily: "var(--font)", position: "relative" }}>
      <style>{CSS}</style>

      {saveSuccess && <div className="toast">✅ 결과가 저장됐어요!</div>}
      {saveError && (
        <div style={{ position: "sticky", top: 0, zIndex: 9000, background: "#FEF2F2", borderBottom: "1px solid #FECACA", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "#991B1B" }}>⚠️ 저장 실패: {saveError}</span>
          <button onClick={() => setSaveError(null)} style={{ fontSize: 20, color: "#B91C1C" }}>×</button>
        </div>
      )}

      <div style={{ position: "fixed", top: -160, right: -160, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,56,13,0.08) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: -100, left: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,90,53,0.06) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
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
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const loggedIn = !!getCookie("user_id");
    setIsLoggedIn(loggedIn);

    if (loggedIn) return;
    const t = setTimeout(() => setShowLogin(true), 5000);
    return () => clearTimeout(t);
  }, []);

  if (!isMounted) return null;

  const isExpert = mode === "expert";

  return (
    <div className="wrap">
      {showShare && <ShareSheet job={topJob} mode={mode} pct={pct} onClose={() => setShowShare(false)} />}
      {showLogin && <LoginSheet job={topJob} pct={pct} onClose={() => setShowLogin(false)} />}
      {showCapture && (
        <>
          <style>{`header, nav { z-index: 1 !important; }`}</style>
          <CaptureModal job={topJob} pct={pct} sorted={sorted} mode={mode} onClose={() => setShowCapture(false)} />
        </>
      )}

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
      width: 400, background: "#0F172A", borderRadius: 28,
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
            <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: -0.8, lineHeight: 1.2, wordBreak: "keep-all" }}>{job.typeTitle}</div>
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
              <span style={{ fontSize: 11, color: isTop ? j.color : "rgba(255,255,255,0.2)", fontWeight: isTop ? 700 : 400, width: 110, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{j.label}</span>
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
          style={{ width: "100%", padding: "15px", borderRadius: 14, background: saved ? "#10B981" : "#E8380D", color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: saving ? "wait" : "pointer", boxShadow: saved ? "0 4px 20px rgba(16,185,129,0.4)" : "0 4px 20px rgba(232,56,13,0.4)" }}
        >
          {saving ? "⏳ 저장 중..." : saved ? "✅ 저장 완료!" : "📥 이미지로 저장"}
        </button>
        <button
          onClick={onClose}
          style={{ width: "100%", padding: "13px", borderRadius: 12, background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 14, border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer", transition: "all 0.15s" }}
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
        <button onClick={() => router.push("/login")} style={{ width: "100%", padding: "15px", borderRadius: 14, fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer", background: "linear-gradient(135deg, #ea002c, #f47725)", color: "#fff", marginBottom: 10, boxShadow: "0 4px 18px rgba(234,0,44,0.25)" }}>
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
function ShareSheet({ job, mode, pct, onClose }: { job: Job; mode: Mode; pct: Record<JobId, number>; onClose: () => void; }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== "undefined"
    ? (() => {
      const p = pct;
      return `${window.location.origin}/test/result?job=${encodeURIComponent(job.id)}&mode=${mode}&ai=${p["ai-app"]}&ml=${p["mlops"]}&ds=${p["data-sci"]}`;
    })()
    : "";
  const shareText = `나의 AI 직무 유형은"${job.typeTitle}" ${job.emoji}\n"${job.hook}"\n\nJOBFIT에서 나도 확인해봐!`;
  const hasNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  const handleNativeShare = () => {
    navigator.share?.({ title: `나의 AI 직무: ${job.typeTitle}`, text: shareText, url: shareUrl });
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()} style={{ padding: "24px 24px 48px" }}>
        <div className="sheet-handle" />

        {/* 직무 칩 */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px", borderRadius: 16, background: `rgba(${job.rgb},0.06)`, border: `1.5px solid rgba(${job.rgb},0.18)`, marginBottom: 28 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: `rgba(${job.rgb},0.12)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{job.emoji}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: job.color }}>{job.typeTitle}</div>
            <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>{job.title}</div>
          </div>
        </div>

        <p style={{ fontSize: 16, fontWeight: 700, color: "var(--text-1)", marginBottom: 8, letterSpacing: -0.3 }}>결과를 공유해보세요</p>
        <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 24, lineHeight: 1.6 }}>
          카카오톡, 인스타그램 등 원하는 앱으로 공유할 수 있어요
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
          {/* 공유하기 - 항상 표시 */}
          <button
            onClick={handleNativeShare}
            style={{
              width: "100%", padding: "17px", borderRadius: 14,
              fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #ea002c, #f47725)",
              color: "#fff", boxShadow: "0 4px 18px rgba(234,0,44,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "all 0.18s",
            }}
            onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.1)"; e.currentTarget.style.transform = "translateY(-1.5px)"; }}
            onMouseLeave={e => { e.currentTarget.style.filter = "none"; e.currentTarget.style.transform = "none"; }}
          >
            📤 공유하기
          </button>

          {/* 링크 복사 - 항상 표시 */}
          <button
            onClick={handleCopy}
            style={{
              width: "100%", padding: "17px", borderRadius: 14,
              fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "all 0.18s",
              background: copied ? "#10B981" : "rgba(255,255,255,0.8)",
              color: copied ? "#fff" : "var(--text-1)",
              border: copied ? "none" : "1.5px solid var(--border)",
              backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: copied ? "0 4px 18px rgba(16,185,129,0.3)" : "none",
            }}
            onMouseEnter={e => { if (!copied) { e.currentTarget.style.borderColor = "#bbb"; e.currentTarget.style.transform = "translateY(-1.5px)"; } }}
            onMouseLeave={e => { if (!copied) { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; } }}
          >
            {copied ? "✅ 복사 완료!" : "🔗 링크 복사"}
          </button>
        </div>

        <button
          onClick={onClose}
          style={{ width: "100%", padding: "13px", borderRadius: 12, background: "none", border: "1px solid var(--border)", color: "var(--text-3)", fontWeight: 500, fontSize: 14, cursor: "pointer" }}
        >
          닫기
        </button>
      </div>
    </div>
  );
}

export default function TestResultPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 13, color: "#999" }}>결과 불러오는 중...</span>
      </div>
    }>
      <TestResultPageInner />
    </Suspense>
  );
}