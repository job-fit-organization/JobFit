'use client';

import {
  ArrowRight,
  ChevronRight,
  Zap,
  GitBranch,
  Sparkles,
  Server,
  Database,
  Microscope,
  Users
} from 'lucide-react';
import Link from 'next/link';

const JOB_ROLES = [
  {
    title: "AI Application Engineer",
    desc: "생성형 AI 모델을 실제 프로덕트에 통합하여 혁신적인 사용자 경험을 창조합니다.",
    icon: GitBranch,
    iconColor: "text-white",
    bgColor: "bg-[#ea002c]",
    shadowColor: "shadow-[#ea002c33]",
  },
  {
    title: "Prompt Engineer",
    desc: "거대 언어 모델의 성능을 극대화하는 정교한 프롬프트 아키텍처를 설계하고 최적화합니다.",
    icon: Sparkles,
    iconColor: "text-white",
    bgColor: "bg-[#fbbc05]",
    shadowColor: "shadow-[#fbbc0533]",
  },
  {
    title: "MLOps Engineer",
    desc: "모델 학습부터 배포까지의 전 과정을 자동화하고 지속 가능한 AI 인프라를 구축합니다.",
    icon: Server,
    iconColor: "text-white",
    bgColor: "bg-[#009a93]",
    shadowColor: "shadow-[#009a9333]",
  },
  {
    title: "Data Engineer",
    desc: "방대한 데이터를 안정적으로 수집, 저장, 처리할 수 있는 고성능 파이프라인을 구축합니다.",
    icon: Database,
    iconColor: "text-white",
    bgColor: "bg-[#f47725]",
    shadowColor: "shadow-[#f4772533]",
  },
  {
    title: "Data Scientist",
    desc: "통계적 방법론과 머신러닝 모델을 활용해 복잡한 비즈니스 문제를 해결하고 성장을 견인합니다.",
    icon: Microscope,
    iconColor: "text-white",
    bgColor: "bg-[#b3cf0a]",
    shadowColor: "shadow-[#b3cf0a33]",
  },
  {
    title: "AI Product Manager",
    desc: "기술과 비즈니스 사이의 가교 역할을 수행하며 시장을 리드하는 AI 제품의 전략을 수립합니다.",
    icon: Users,
    iconColor: "text-white",
    bgColor: "bg-black",
    shadowColor: "shadow-gray-200",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] overflow-x-hidden font-sans">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto text-center pt-24 pb-32 px-4">
        <div className="inline-block px-6 py-2 rounded-full bg-[#f47725]/10 text-[#f47725] text-xs font-bold mb-6 tracking-widest animate-up no-italic">
          EMPOWERING YOUR AI CAREER
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight text-black animate-up no-italic" style={{ animationDelay: '0.1s' }}>
          나에게 딱 맞는<br />
          <span className="text-gradient no-italic">AI 직무</span>는?
        </h1>
        <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed animate-up" style={{ animationDelay: '0.2s' }}>
          성공적인 AI 커리어를 위한 첫 걸음. 당신의 잠재력을 데이터로 분석하여<br />
          가장 빛날 수 있는 직무와 커리어 로드맵을 제안합니다.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-up" style={{ animationDelay: '0.3s' }}>
          <Link href="/test" className="px-10 py-4 btn-primary rounded-2xl font-bold text-lg flex items-center justify-center gap-2">
            직무 추천 테스트 시작 <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/learning" className="px-10 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition flex items-center justify-center">
            커리어 맵 둘러보기
          </Link>
        </div>
      </section>

      {/* Core Paths Section */}
      <section className="bg-[#f8f9fa] py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-16 text-center md:text-left">
            <span className="text-[#009a93] font-mono text-sm tracking-[0.3em] font-bold no-italic">CORE PATHS</span>
            <h2 className="text-4xl font-black mt-3 text-black no-italic">다루는 핵심 직무</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {JOB_ROLES.map((role, idx) => (
              <div key={idx} className="white-card p-10 rounded-[2.5rem]">
                <div className={`w-14 h-14 flex items-center justify-center rounded-2xl ${role.bgColor} ${role.iconColor} mb-8 shadow-lg ${role.shadowColor}`}>
                  <role.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold mb-4 text-black no-italic flex items-center gap-2">
                  {role.title}
                  <ChevronRight className="w-3 h-3 opacity-20" />
                </h3>
                <p className="text-gray-500 text-sm leading-loose font-medium">
                  {role.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-8 py-24">
        <div className="bg-gradient-primary rounded-[4rem] p-16 text-center text-white relative overflow-hidden shadow-2xl">
          {/* Decorative circle */}
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white opacity-10 rounded-full"></div>

          <h2 className="text-4xl md:text-5xl font-black mb-10 leading-tight no-italic">
            당신의 미래 가치를<br />JOBFIT에서 발견하세요
          </h2>
          <Link href="/test" className="inline-block px-12 py-5 bg-white text-[#ea002c] font-black rounded-2xl hover:bg-gray-100 transition shadow-xl transform hover:-translate-y-1 text-lg">
            지금 무료로 시작하기
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-16 px-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-gray-400 text-xs">
          <div className="flex items-center space-x-2 mb-6 md:mb-0">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-black">
              JOB<span className="text-gradient no-italic">FIT</span>
            </span>
          </div>
          <div className="flex space-x-8 mb-6 md:mb-0 font-medium">
            <a href="#" className="hover:text-black transition">개인정보처리방침</a>
            <a href="#" className="hover:text-black transition">이용약관</a>
            <a href="#" className="hover:text-black transition">문의하기</a>
          </div>
          <p className="font-medium">© 2026 JobFit Organization. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
