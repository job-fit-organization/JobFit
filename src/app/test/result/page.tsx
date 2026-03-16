"use client";

import { useState, useEffect, useRef, forwardRef } from "react";
import { useRouter } from "next/navigation";
import {
  CSS, JOBS, loadResult,
  type JobId, type Mode, type JobScores, type RadarScores,
} from "../_lib";

// ─────────────────────────────────────────
//  src/app/test/result/page.tsx
// ─────────────────────────────────────────

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

async function postTestResult(payload: {
  user_id: number;
  app_score: number;
  data_score: number;
  mlops_score: number;
}): Promise<void> {
  const res = await fetch(`${API_URL}/api/test/result/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ ...payload, completed_at: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error(`서버 오류 (${res.status})`);
}

// ── 타입 ──────────────────────────────────
type Job = (typeof JOBS)[JobId];

// ── 점수 계산 헬퍼 ────────────────────────
function calcPct(jobScores: JobScores) {
  const total = (Object.values(jobScores) as number[]).reduce((a, b) => a + b, 0) || 1;
  return Object.fromEntries(
    (Object.entries(jobScores) as [JobId, number][]).map(([k, v]) => [k, Math.round((v / total) * 100)])
  ) as Record<JobId, number>;
}

// ─────────────────────────────────────────
//  페이지 루트
// ─────────────────────────────────────────
export default function TestResultPage() {
  const router = useRouter();
  const [data, setData] = useState<{ jobScores: JobScores; radarScores: RadarScores; mode: Mode } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let tries = 0;
    const load = () => {
      const result = loadResult();
      if (!result) {
        if (++tries < 3) setTimeout(load, 100);
        else router.replace("/test");
        return;
      }
      setData(result);

      // 로그인 유저면 서버에 저장
      const uid = Number(getCookie("user_id"));
      if (!uid || isNaN(uid)) return;
      const pct = calcPct(result.jobScores);
      const appScore = pct["ai-app"];
      const dataScore = pct["data-sci"];
      const mlopsScore = pct["mlops"];
      postTestResult({
        user_id: uid,
        app_score: appScore,
        data_score: dataScore,
        mlops_score: mlopsScore,
      })
        .then(() => setSaveSuccess(true))
        .catch((e: Error) => setSaveError(e.message));
    };
    load();
  }, [router]);

  if (!data) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 13, color: "#94A3B8" }}>결과 불러오는 중...</span>
      </div>
    );
  }

  const pct = calcPct(data.jobScores);
  const sorted = (Object.entries(pct) as [JobId, number][]).sort((a, b) => b[1] - a[1]);
  const topJob = JOBS[sorted[0][0]];
  const secJob = JOBS[sorted[1][0]];

  return (
    <div data-theme="light" style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-1)", fontFamily: "'Inter',system-ui,sans-serif" }}>
      <style>{CSS}</style>

      {/* 저장 성공 토스트 */}
      {saveSuccess && (
        <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 9000, background: "#0F172A", color: "#fff", padding: "12px 20px", borderRadius: 12, fontSize: 13, fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,0.25)", animation: "fadeUp 0.25s ease both" }}>
          ✅ 결과가 저장됐어요!
        </div>
      )}

      {/* 저장 실패 배너 */}
      {saveError && (
        <div style={{ position: "sticky", top: 0, zIndex: 9000, background: "#FEF2F2", borderBottom: "1px solid #FECACA", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "#991B1B" }}>⚠️ 결과 저장 실패: {saveError}</span>
          <button onClick={() => setSaveError(null)} style={{ fontSize: 18, color: "#B91C1C", background: "none", border: "none", cursor: "pointer" }}>×</button>
        </div>
      )}

      <ResultView pct={pct} sorted={sorted} topJob={topJob} secJob={secJob} mode={data.mode} />
    </div>
  );
}

// ─────────────────────────────────────────
//  결과 화면
// ─────────────────────────────────────────
function ResultView({
  pct, sorted, topJob, secJob, mode,
}: {
  pct: Record<JobId, number>;
  sorted: [JobId, number][];
  topJob: Job;
  secJob: Job;
  mode: Mode;
}) {
  const [showShare, setShowShare] = useState(false);
  const [showKakao, setShowKakao] = useState(false);
  const [showCapture, setShowCapture] = useState(false);

  const isLoggedIn = typeof document !== "undefined" && !!getCookie("user_id");

  // 5초 후 비로그인 유저에게 카카오 유도
  useEffect(() => {
    if (isLoggedIn) return;
    const t = setTimeout(() => setShowKakao(true), 5000);
    return () => clearTimeout(t);
  }, [isLoggedIn]);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 48px 80px" }}>

      {/* 모달들 */}
      {showShare && <ShareSheet job={topJob} onClose={() => setShowShare(false)} />}
      {showKakao && <KakaoSheet job={topJob} pct={pct} onClose={() => setShowKakao(false)} />}
      {showCapture && <CaptureModal job={topJob} pct={pct} sorted={sorted} mode={mode} onClose={() => setShowCapture(false)} />}

      {/* 상단 바 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 99,
            color: mode === "expert" ? "#3B82F6" : "#10B981",
            border: `1px solid ${mode === "expert" ? "#3B82F640" : "#10B98140"}`,
            background: mode === "expert" ? "rgba(59,130,246,0.07)" : "rgba(16,185,129,0.07)",
          }}>
            {mode === "expert" ? "🔥 실전 모드" : "🌱 입문자 모드"}
          </span>
          <span style={{ fontSize: 13, color: "var(--text-3)" }}>AI 직무 적성 테스트 결과</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setShowCapture(true)}
            style={{ padding: "9px 16px", borderRadius: 10, background: "var(--bg-subtle)", border: "1px solid var(--border)", color: "var(--text-2)", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
          >
            📥 이미지 저장
          </button>
          <button
            onClick={() => setShowShare(true)}
            style={{ padding: "9px 16px", borderRadius: 10, background: `rgba(${topJob.rgb},0.08)`, border: `1px solid rgba(${topJob.rgb},0.2)`, color: topJob.color, fontWeight: 600, fontSize: 13, cursor: "pointer" }}
          >
            🔗 결과 공유
          </button>
        </div>
      </div>

      {/* 3컬럼 레이아웃 */}
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr 1fr", gap: 24, alignItems: "start" }}>

        {/* 왼쪽: 적합도 차트 + 학습 버튼 */}
        <div style={{ position: "sticky", top: 40 }}>
          <div className="card" style={{ padding: "28px 24px", marginBottom: 14 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", letterSpacing: 1.2, marginBottom: 20, textTransform: "uppercase" }}>
              직무 적합도
            </p>
            {sorted.map(([id, p]) => {
              const j = JOBS[id];
              const isTop = id === topJob.id;
              return (
                <div key={id} style={{ marginBottom: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                    <span style={{ fontSize: 14, fontWeight: isTop ? 700 : 400, color: isTop ? "var(--text-1)" : "var(--text-3)" }}>
                      {j.emoji} {j.title}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: j.color }}>{p}%</span>
                  </div>
                  <div style={{ height: 7, background: "var(--bg-subtle)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 99, background: j.color, width: `${p}%`, opacity: isTop ? 1 : 0.4, animation: "barGrow 1s" }} />
                  </div>
                </div>
              );
            })}
          </div>

          {isLoggedIn ? (
            <a
              href={topJob.nextSteps[0].url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "15px", borderRadius: 14, background: topJob.color, color: "#fff", fontWeight: 700, fontSize: 15, boxShadow: `0 4px 18px rgba(${topJob.rgb},0.3)`, textDecoration: "none" }}
            >
              📚 지금 바로 학습하기 →
            </a>
          ) : (
            <button
              onClick={() => setShowKakao(true)}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "15px", borderRadius: 14, background: topJob.color, color: "#fff", fontWeight: 700, fontSize: 15, border: "none", boxShadow: `0 4px 18px rgba(${topJob.rgb},0.3)`, cursor: "pointer" }}
            >
              📚 지금 바로 학습하기 →
            </button>
          )}
        </div>

        {/* 1순위 직무 카드 */}
        <JobCard job={topJob} pct={pct[topJob.id]} rank={1} mode={mode} />

        {/* 2순위 직무 카드 */}
        <JobCard job={secJob} pct={pct[secJob.id]} rank={2} mode={mode} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
//  직무 카드
// ─────────────────────────────────────────
function JobCard({ job, pct, rank, mode }: { job: Job; pct: number; rank: number; mode: Mode }) {
  const isFirst = rank === 1;
  return (
    <div
      className="card fu"
      style={{
        padding: "32px 28px", position: "relative", overflow: "hidden",
        border: isFirst ? `2px solid ${job.color}` : undefined,
        boxShadow: isFirst ? `0 0 0 4px rgba(${job.rgb},0.08)` : undefined,
      }}
    >
      {/* 상단 컬러 라인 */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: job.color }} />
      {/* 배경 그라데이션 */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.03, background: `radial-gradient(circle at top right, rgba(${job.rgb},1), transparent 70%)`, pointerEvents: "none" }} />

      {/* 헤더 */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: `rgba(${job.rgb},0.1)`, border: `2px solid rgba(${job.rgb},0.2)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>
            {job.emoji}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: job.color, letterSpacing: 1, marginBottom: 4 }}>
              {isFirst ? "🥇 1순위 추천 직무" : "🥈 2순위 추천 직무"}
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text-1)", letterSpacing: -0.5 }}>{job.typeTitle}</div>
            <div style={{ fontSize: 13, color: "var(--text-3)", marginTop: 2 }}>{job.title}</div>
          </div>
        </div>
        <div style={{ textAlign: "center", background: `rgba(${job.rgb},0.08)`, borderRadius: 12, padding: "10px 16px", flexShrink: 0 }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: job.color }}>{pct}%</div>
          <div style={{ fontSize: 10, color: job.color, fontWeight: 600 }}>적합도</div>
        </div>
      </div>

      {/* 적합도 바 */}
      <div style={{ height: 6, background: "var(--border)", borderRadius: 99, marginBottom: 20, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 99, background: job.color, width: `${pct}%`, animation: "barGrow 1s cubic-bezier(0.16,1,0.3,1)" }} />
      </div>

      {/* 태그 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
        {job.tags.map((t) => (
          <span key={t} style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99, background: `rgba(${job.rgb},0.1)`, color: job.color }}>
            {t}
          </span>
        ))}
      </div>

      {/* 한 줄 설명 */}
      <div style={{ padding: "14px 16px", borderRadius: 12, background: `rgba(${job.rgb},0.04)`, borderLeft: `3px solid rgba(${job.rgb},0.4)`, marginBottom: 18 }}>
        <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.8 }}>
          {mode === "beginner" ? job.hookBeginner : job.hook}
        </p>
      </div>

      {/* 특징 리스트 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {job.traits.map((t) => (
          <div key={t} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--text-2)" }}>
            <span style={{ color: job.color, fontWeight: 700, flexShrink: 0 }}>✓</span>
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
//  캡처 카드 (forwardRef — 모달 안에서 ref 받아 캡처)
// ─────────────────────────────────────────
const JL = {
  "ai-app": { color: "#10B981", rgb: "16,185,129", label: "AI App Engineer" },
  "mlops": { color: "#3B82F6", rgb: "59,130,246", label: "MLOps Engineer" },
  "data-sci": { color: "#8B5CF6", rgb: "139,92,246", label: "Data Scientist" },
} as const;

const CaptureCard = forwardRef<HTMLDivElement, {
  job: Job;
  pct: Record<JobId, number>;
  sorted: [JobId, number][];
  mode: Mode;
}>(({ job, pct, sorted, mode }, ref) => (
  <div
    ref={ref}
    style={{
      width: 340,
      background: "linear-gradient(145deg, #0D1627 0%, #111827 50%, #0D1627 100%)",
      borderRadius: 24, padding: "36px 28px 28px",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}
  >
    {/* 상단 컬러 라인 */}
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${job.color}, rgba(${job.rgb},0.4))`, borderRadius: "24px 24px 0 0" }} />

    {/* 배지 */}
    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 99, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", marginBottom: 20 }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: job.color, display: "inline-block" }} />
      <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: 1.5 }}>AI CAREER TEST</span>
    </div>

    {/* 이모지 */}
    <div style={{ width: 80, height: 80, borderRadius: 22, background: `rgba(${job.rgb},0.12)`, border: `2px solid rgba(${job.rgb},0.25)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, marginBottom: 16 }}>
      {job.emoji}
    </div>

    {/* 모드 */}
    <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", marginBottom: 8, textAlign: "center" }}>
      {mode === "expert" ? "🔥 실전 모드" : "🌱 입문자 모드"}
    </div>

    {/* 직무명 */}
    <div style={{ fontSize: 24, fontWeight: 800, color: job.color, letterSpacing: -0.5, marginBottom: 4, textAlign: "center" }}>{job.typeTitle}</div>
    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 24, textAlign: "center" }}>{job.title}</div>

    <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 20 }} />

    {/* 점수 바 */}
    <div style={{ width: "100%", marginBottom: 20 }}>
      {sorted.map(([id, p]) => {
        const j = JL[id];
        const isTop = id === job.id;
        return (
          <div key={id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 11, color: isTop ? j.color : "rgba(255,255,255,0.25)", fontWeight: isTop ? 700 : 400, width: 110, flexShrink: 0 }}>
              {j.label}
            </span>
            <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.07)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${p}%`, background: isTop ? j.color : `rgba(${j.rgb},0.3)`, borderRadius: 99 }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: isTop ? j.color : "rgba(255,255,255,0.25)", width: 32, textAlign: "right", flexShrink: 0 }}>
              {p}%
            </span>
          </div>
        );
      })}
    </div>

    {/* 태그 */}
    <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
      {job.tags.map((t) => (
        <span key={t} style={{ fontSize: 10, padding: "3px 9px", borderRadius: 6, fontWeight: 700, background: `rgba(${job.rgb},0.12)`, color: job.color, border: `1px solid rgba(${job.rgb},0.25)` }}>
          {t}
        </span>
      ))}
    </div>

    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.15)", letterSpacing: 1.5 }}>AI-CAREER-TEST.COM</div>
  </div>
));
CaptureCard.displayName = "CaptureCard";

// ─────────────────────────────────────────
//  캡처 모달
// ─────────────────────────────────────────
function CaptureModal({
  job, pct, sorted, mode, onClose,
}: {
  job: Job;
  pct: Record<JobId, number>;
  sorted: [JobId, number][];
  mode: Mode;
  onClose: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveImage = async () => {
    if (!cardRef.current || saving) return;
    setSaving(true);
    try {
      const h2c = (await import("html2canvas")).default;

      // 1. 클론 생성 (원본 스타일 유지)
      const original = cardRef.current;
      const clone = original.cloneNode(true) as HTMLElement;

      // 2. 캡처용 임시 박스 생성 (충분한 여백을 두어 테두리 잘림 방지)
      const wrapper = document.createElement("div");
      wrapper.style.cssText = `
        position: fixed; top: -9999px; left: -9999px;
        padding: 40px; background: #0D1627;
        display: flex; align-items: center; justify-content: center;
      `;
      wrapper.appendChild(clone);
      document.body.appendChild(wrapper);

      // 3. 임시 박스를 캡처
      const canvas = await h2c(wrapper, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#0D1627",
        logging: false,
        width: original.offsetWidth + 80,
        height: original.offsetHeight + 80,
      });

      // 4. 임시 박스 삭제
      document.body.removeChild(wrapper);

      if ("showSaveFilePicker" in window) {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: `ai-career-${job.id}-result.png`,
          types: [{ description: "PNG", accept: { "image/png": [".png"] } }],
        });
        const writable = await handle.createWritable();
        await new Promise<void>((res, rej) =>
          canvas.toBlob((b) =>
            b ? writable.write(b).then(() => writable.close()).then(res).catch(rej)
              : rej(new Error("변환 실패")),
            "image/png"
          )
        );
      } else {
        const a = document.createElement("a");
        a.href = canvas.toDataURL("image/png");
        a.download = `ai-career-${job.id}-result.png`;
        a.click();
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      if (e?.name !== "AbortError") alert("저장에 실패했어요.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s ease both" }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>

        {/* 미리보기 */}
        <CaptureCard ref={cardRef} job={job} pct={pct} sorted={sorted} mode={mode} />

        <button
          onClick={saveImage}
          disabled={saving}
          style={{ width: 340, padding: "15px", borderRadius: 14, background: saved ? "#10B981" : job.color, color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: saving ? "wait" : "pointer", boxShadow: `0 4px 20px rgba(${job.rgb},0.4)` }}
        >
          {saving ? "⏳ 저장 중..." : saved ? "✅ 저장 완료!" : "📥 이미지로 저장"}
        </button>

        <button
          onClick={onClose}
          style={{ width: 340, padding: "12px", borderRadius: 12, background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", fontWeight: 500, fontSize: 13, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}
        >
          닫기
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
//  카카오 로그인 유도 바텀시트
// ─────────────────────────────────────────
function KakaoSheet({
  job, pct, onClose,
}: {
  job: Job;
  pct: Record<JobId, number>;
  onClose: () => void;
}) {
  const topPct = pct[job.id];

  const handleKakao = () => {
    const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID ?? "KAKAO_CLIENT_ID";
    const redirectUri = encodeURIComponent(typeof window !== "undefined" ? window.location.href : "");
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
  };

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-end", justifyContent: "center", animation: "fadeIn 0.2s ease both" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 520, background: "var(--bg-card)", borderRadius: "24px 24px 0 0", padding: "28px 24px 44px", border: "1px solid var(--border)", borderBottom: "none", animation: "slideUp 0.32s cubic-bezier(0.16,1,0.3,1) both" }}
      >
        <div style={{ width: 40, height: 4, borderRadius: 99, background: "var(--border)", margin: "0 auto 22px" }} />

        {/* 결과 칩 */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 14, marginBottom: 22, background: `rgba(${job.rgb},0.06)`, border: `1.5px solid rgba(${job.rgb},0.18)` }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `rgba(${job.rgb},0.12)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{job.emoji}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: job.color }}>{job.typeTitle}</div>
            <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{job.title} · {topPct}% 적합</div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: job.color }}>{topPct}%</div>
        </div>

        <p style={{ fontSize: 18, fontWeight: 800, color: "var(--text-1)", marginBottom: 8, letterSpacing: -0.3, lineHeight: 1.35 }}>
          이 결과로<br />지금 바로 시작해볼까요?
        </p>
        <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 28, lineHeight: 1.65 }}>
          가입하면 내 결과가 저장되고<br />맞춤 학습 로드맵을 바로 받을 수 있어요
        </p>

        <button
          onClick={handleKakao}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, width: "100%", padding: "15px", borderRadius: 12, fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer", background: "#FEE500", color: "#191919", marginBottom: 10 }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M11 3C6.582 3 3 5.91 3 9.5c0 2.29 1.49 4.3 3.73 5.45l-.95 3.54c-.08.32.27.57.55.38L10.6 16.8c.13.01.26.02.4.02 4.418 0 8-2.91 8-6.5S15.418 3 11 3z" fill="#191919" />
          </svg>
          카카오로 계속하기
        </button>

        <button
          onClick={onClose}
          style={{ width: "100%", padding: "11px", borderRadius: 10, fontSize: 13, fontWeight: 500, color: "var(--text-3)", background: "none", border: "1px solid var(--border)", cursor: "pointer" }}
        >
          나중에 할게요
        </button>

        <p style={{ fontSize: 11, color: "var(--text-3)", textAlign: "center", marginTop: 12, lineHeight: 1.6 }}>
          가입하면 결과가 자동으로 저장돼요<br />이미 계정이 있다면 로그인으로 연결돼요
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
//  공유 바텀시트
// ─────────────────────────────────────────
function ShareSheet({ job, onClose }: { job: Job; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/test` : "";
  const shareText = `나의 AI 직무 유형은 "${job.typeTitle}" ${job.emoji}\n"${job.hook}"\n\nAI Career Test에서 나도 확인해봐!`;

  const shareKakao = () => {
    const Kakao = (window as any).Kakao;
    if (Kakao?.isInitialized()) {
      Kakao.Share.sendDefault({
        objectType: "feed",
        content: { title: `나의 AI 직무: ${job.typeTitle} ${job.emoji}`, description: job.hook, imageUrl: `${shareUrl}/og-image.png`, link: { mobileWebUrl: shareUrl, webUrl: shareUrl } },
        buttons: [{ title: "나도 테스트해보기", link: { mobileWebUrl: shareUrl, webUrl: shareUrl } }],
      });
    } else {
      window.open(`https://sharer.kakao.com/talk/friends/picker/easylink?app_key=KAKAO_JAVASCRIPT_KEY&url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, "_blank", "width=500,height=600");
    }
    onClose();
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`, "_blank");
    onClose();
  };

  const copyLink = () => {
    navigator.clipboard?.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareNative = () => {
    navigator.share?.({ title: `나의 AI 직무: ${job.typeTitle}`, text: shareText, url: shareUrl });
    onClose();
  };

  const hasNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  const items = [
    ...(hasNativeShare ? [{ icon: "📤", label: "공유하기", action: shareNative, bg: "#334155" }] : []),
    { icon: "💬", label: "카카오톡", action: shareKakao, bg: "#FEE500", iconColor: "#3A1D1D" },
    { icon: "𝕏", label: "트위터(X)", action: shareTwitter, bg: "#000000" },
    { icon: copied ? "✅" : "🔗", label: copied ? "복사 완료!" : "링크 복사", action: copyLink, bg: `rgba(${job.rgb},0.12)`, textColor: job.color },
  ];

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-end", justifyContent: "center", animation: "fadeIn 0.2s ease both" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 520, background: "var(--bg-card)", borderRadius: "24px 24px 0 0", padding: "24px 20px 36px", border: "1px solid var(--border)", borderBottom: "none", animation: "slideUp 0.32s cubic-bezier(0.16,1,0.3,1) both" }}
      >
        <div style={{ width: 40, height: 4, borderRadius: 99, background: "var(--border)", margin: "0 auto 20px" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 14, background: `rgba(${job.rgb},0.07)`, border: `1.5px solid rgba(${job.rgb},0.18)`, marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `rgba(${job.rgb},0.12)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{job.emoji}</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: job.color }}>{job.typeTitle}</div>
            <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{job.title} · AI Career Test</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: 10, marginBottom: 14 }}>
          {items.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, padding: "14px 6px 12px", borderRadius: 14, background: "var(--bg-subtle)", border: "1px solid var(--border)", cursor: "pointer" }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 13, background: (item as any).bg ?? "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: item.icon === "𝕏" ? 18 : 22, fontWeight: 900, color: (item as any).iconColor ?? "#fff" }}>
                {item.icon}
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: (item as any).textColor ?? "var(--text-2)", textAlign: "center" }}>{item.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          style={{ width: "100%", padding: "12px", borderRadius: 10, background: "none", border: "1px solid var(--border)", color: "var(--text-3)", fontWeight: 500, fontSize: 13, cursor: "pointer" }}
        >
          닫기
        </button>
      </div>
    </div>
  );
}