import React from 'react';
import { Zap, Sparkles, Target } from 'lucide-react';
import { INITIAL_JOB_RECOMMENDATION } from '../data';

const STYLES = {
    section: "bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6 relative overflow-hidden",
    blur1: "absolute -top-6 -right-6 w-32 h-32 bg-main-1/10 rounded-full blur-3xl opacity-60",
    blur2: "absolute bottom-10 left-0 w-24 h-24 bg-main-2/10 rounded-full blur-2xl opacity-40",

    header: "text-xl font-bold text-gray-800 flex items-center gap-2 relative z-10",

    matchCard: "text-center py-5 bg-gradient-to-br from-main-1 to-serve-6 rounded-2xl text-white shadow-lg relative z-10 transform transition-transform hover:scale-[1.02]",
    matchLabel: "text-xs font-semibold uppercase tracking-widest opacity-90 mb-1",
    matchType: "text-3xl font-black mb-1",
    matchRate: "text-xs font-bold bg-white/20 inline-block px-3 py-1 rounded-full",

    descWrapper: "space-y-3 relative z-10",
    descTitle: "font-bold text-gray-900 text-lg flex items-center gap-2",
    descText: "text-sm text-gray-600 leading-relaxed",

    keywordWrapper: "space-y-4 relative z-10",
    keywordHeader: "text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2",
    keywordGrid: "flex flex-wrap gap-2",
    keywordBadge: "bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg hover:border-main-1/30 hover:text-main-1 transition-colors cursor-default",

    traitsWrapper: "pt-4 border-t border-gray-100 relative z-10",
    traitsHeader: "flex justify-between items-center mb-4",
    traitsTitle: "text-xs font-bold text-gray-400 uppercase tracking-wider",
    traitsGrid: "flex gap-2",
    traitBadge: "flex-1 text-center p-2 rounded-xl bg-serve-4/10 text-serve-4 text-xs font-black"
};

// 추천받은 적합(Fit) 직무 결과 리포트 위젯
export const JobReport = ({ data }: { data: typeof INITIAL_JOB_RECOMMENDATION }) => (
    <section className={STYLES.section}>
        {/* 데코레이션 딤 처리 블러 */}
        <div className={STYLES.blur1}></div>
        <div className={STYLES.blur2}></div>

        <h3 className={STYLES.header}>
            <Zap className="text-serve-1" size={24} />
            직무 추천 리포트
        </h3>

        {/* 적합도 배너 */}
        <div className={STYLES.matchCard}>
            <p className={STYLES.matchLabel}>나의 직무매칭 유형</p>
            <p className={STYLES.matchType}>{data.type}</p>
            <p className={STYLES.matchRate}>{data.matchRate}% 적합</p>
        </div>

        {/* 관련 직무 설명 세부 */}
        <div className={STYLES.descWrapper}>
            <h4 className={STYLES.descTitle}>
                <Sparkles size={18} className="text-main-2" />
                {data.title}
            </h4>
            <p className={STYLES.descText}>{data.description}</p>
        </div>

        {/* 직무 기술 및 연관 키워드 태그 칩(Chips) 렌더링 */}
        {/* 아직 태그에 대한 정보 변경 필요 ★★★ */}
        <div className={STYLES.keywordWrapper}>
            <p className={STYLES.keywordHeader}>
                <Target size={14} /> 추천 직무 키워드
            </p>
            <div className={STYLES.keywordGrid}>
                {data.recommendedJobs.map((job, idx) => (
                    <span key={idx} className={STYLES.keywordBadge}>#{job}</span>
                ))}
            </div>
        </div>

        {/* 유저 개인 성향 관련 태그 나열 구역 */}
        {/* 아직 태그에 대한 정보 변경 필요 ★★★ */}
        <div className={STYLES.traitsWrapper}>
            <div className={STYLES.traitsHeader}>
                <span className={STYLES.traitsTitle}>유형 성향</span>
            </div>
            <div className={STYLES.traitsGrid}>
                {data.traits.map((trait, idx) => (
                    <div key={idx} className={STYLES.traitBadge}>{trait}</div>
                ))}
            </div>
        </div>
    </section>
);
