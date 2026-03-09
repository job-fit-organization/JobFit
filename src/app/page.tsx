'use client';

import {
  Brain, Cpu, Database, LayoutGrid, Star, Shield,
  BookOpen, Zap, ArrowRight, ChevronRight, Binary,
  Code2, Sparkles, Target, Users
} from 'lucide-react';
import Link from 'next/link';

const JOB_ROLES = [
  { title: "AI Application Engineer", desc: "생성형 AI 모델을 활용해 실제 서비스를 개발합니다.", icon: "Sparkles", color: "text-indigo-400" },
  { title: "Prompt Engineer", desc: "AI의 능력을 극대화하는 최적의 프롬프트를 설계합니다.", icon: "Target", color: "text-emerald-400" },
  { title: "MLOps Engineer", desc: "머신러닝 모델의 배포 및 관리 인프라를 구축합니다.", icon: "Cpu", color: "text-rose-400" },
  { title: "Data Engineer", desc: "대규모 데이터 처리 인프라와 파이프라인을 설계합니다.", icon: "Database", color: "text-amber-400" },
  { title: "Data Scientist", desc: "데이터 분석을 통해 비즈니스 인사이트를 도출합니다.", icon: "Binary", color: "text-sky-400" },
  { title: "AI Product Manager", desc: "AI 기반 서비스의 기획 및 전략을 담당합니다.", icon: "Users", color: "text-violet-400" },
];

export default function Home() {
  const renderIcon = (iconName: string, className: string) => {
    const icons: Record<string, any> = { Sparkles, Target, Cpu, Database, Binary, Users };
    const Icon = icons[iconName] || Brain;
    return <Icon className={className} />;
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, var(--primary) 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <div className="animate-fade-in inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-black tracking-widest uppercase mb-8 shadow-glow">
            <Sparkles className="w-4 h-4" />
            Empowering Your AI Career
          </div>

          <h1 className="animate-scale-in text-6xl md:text-9xl font-black italic tracking-tighter text-white mb-8 leading-[0.85]">
            나에게 딱 맞는<br />
            <span className="text-primary underline underline-offset-[16px] decoration-[12px] decoration-primary/40">AI 직무</span>는?
          </h1>

          <p className="animate-fade-in text-lg md:text-xl text-muted max-w-2xl mb-12 font-medium leading-relaxed">
            복잡한 AI 커리어 시장에서 당신의 역량에 최적화된 직무를 추천해 드립니다.<br />
            맞춤 분석부터 빠른 가이드, 전문 학습까지 한 번에 시작하세요.
          </p>

          <div className="animate-fade-in flex flex-col sm:flex-row gap-4">
            <Link
              href="/test"
              className="px-8 py-5 bg-primary hover:bg-primary-hover text-white font-black text-lg rounded-[2rem] shadow-glow transition-all flex items-center gap-2 active:scale-95"
            >
              직무 추천 테스트 시작
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/learning"
              className="px-8 py-5 bg-card hover:bg-card/80 border border-border text-foreground font-black text-lg rounded-[2rem] transition-all flex items-center gap-2 active:scale-95"
            >
              커리어 맵 둘러보기
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Section: Job Roles */}
      <section className="py-24 px-6 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <div className="text-primary text-sm font-bold tracking-[0.3em] uppercase mb-4">Core Path</div>
            <h2 className="text-4xl font-black text-white italic">다루는 핵심 직무</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {JOB_ROLES.map((role, idx) => (
              <div
                key={idx}
                className="group p-8 rounded-[2rem] bg-card border border-border hover:border-primary/30 hover:bg-primary/5 transition-all cursor-default"
              >
                <div className={`w-14 h-14 rounded-2xl bg-background flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_var(--indigo-glow)] transition-all ${role.color}`}>
                  {renderIcon(role.icon, "w-8 h-8")}
                </div>
                <h3 className="text-xl font-black text-white mb-3 flex items-center gap-2">
                  {role.title}
                  <ChevronRight className="w-4 h-4 text-muted group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-muted font-medium leading-relaxed">
                  {role.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto p-12 md:p-20 rounded-[3rem] bg-primary relative overflow-hidden flex flex-col items-center text-center shadow-2xl">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <h2 className="text-4xl md:text-6xl font-black italic text-white mb-8 relative z-10 leading-tight">
            미래의 AI 커리어를<br />지금 바로 설계하세요
          </h2>
          <Link
            href="/learning"
            className="px-10 py-5 bg-white text-primary font-black text-xl rounded-[2rem] hover:bg-slate-100 transition-all relative z-10 active:scale-95 shadow-xl"
          >
            학습 시작하기
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-card border border-border rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-black tracking-tighter text-white italic">JOBFIT</span>
          </div>
          <p className="text-muted text-sm font-medium">© 2026 JobFit Organization. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
