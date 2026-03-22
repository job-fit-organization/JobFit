import React from 'react';
import { Star, Shield, Medal, Trophy, Crown } from 'lucide-react';

const HEADER_STYLES = {
    container: "text-center md:text-left mb-10",
    title: "text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight",
    subtitle: "mt-2 text-gray-500"
};

const EXPBAR_STYLES = {
    container: "w-full max-w-sm mx-auto md:mx-0",
    textWrapper: "flex justify-between text-[11px] font-bold text-gray-600 mb-1.5 uppercase tracking-wider",
    expValue: "text-main-1 font-black",
    track: "w-full bg-gray-100 rounded-full h-3 border border-gray-200 shadow-inner overflow-hidden flex items-stretch",
    fill: "bg-gradient-to-r from-main-1 to-main-2 rounded-full transition-all duration-1000 ease-out"
};

const SCORECARD_STYLES = {
    container: "bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm transition-all hover:shadow-md relative overflow-hidden group cursor-default block",
    badgeWrapper: "absolute top-0 right-0",
    label: "text-[15px] font-bold mb-1 mt-2 text-gray-500 transition-colors duration-300",
    score: "text-[20px] font-extrabold text-gray-900 transition-colors duration-300"
};

// 페이지 공통 레이아웃 헤더
export const Header = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <header className={HEADER_STYLES.container}>
        <h1 className={HEADER_STYLES.title}>{title}</h1>
        <p className={HEADER_STYLES.subtitle}>{subtitle}</p>
    </header>
);

// 레벨 정보 기반 아이콘/라벨 뱃지 반환 (클래스 1~15 등급 체계 기준)
export const LevelBadge = ({ level }: { level: number }) => {
    const getBadge = (lvl: number) => {
        if (lvl < 4) return { icon: <Star size={20} className="text-serve-1" />, label: '뉴비', bgColor: 'bg-serve-1/10', textColor: 'text-serve-1' };
        if (lvl < 7) return { icon: <Shield size={20} className="text-serve-4" />, label: '루키', bgColor: 'bg-serve-4/10', textColor: 'text-serve-4' };
        if (lvl < 10) return { icon: <Medal size={20} className="text-serve-3" />, label: '주니어', bgColor: 'bg-serve-3/10', textColor: 'text-serve-3' };
        if (lvl < 15) return { icon: <Trophy size={20} className="text-main-2" />, label: '시니어', bgColor: 'bg-main-2/10', textColor: 'text-main-2' };
        return { icon: <Crown size={20} className="text-main-1" />, label: '엑스퍼트', bgColor: 'bg-main-1/10', textColor: 'text-main-1' };
    };
    const badge = getBadge(level);
    return (
        <span className={`flex items-center gap-1 text-sm font-bold px-3 py-1 rounded-full ${badge.bgColor} ${badge.textColor}`}>
            {badge.icon} {badge.label}
        </span>
    );
};

// 절대평가 점수에 따라 A~D급 뱃지 맵핑
export const CategoryBadge = ({ score }: { score: number }) => {
    const getBadge = (s: number) => {
        // 문제수에 맞춰서 s 값 변경 필요 ★★★
        if (s >= 5) return { label: 'S', colorClass: 'bg-main-1/10 text-main-1 border-main-1/20' };
        if (s >= 4) return { label: 'A', colorClass: 'bg-serve-4/10 text-serve-4 border-serve-4/20' };
        if (s >= 3) return { label: 'B', colorClass: 'bg-serve-3/10 text-serve-3 border-serve-3/20' };
        if (s >= 2) return { label: 'C', colorClass: 'bg-serve-1/10 text-serve-1 border-serve-1/20' };
        return { label: 'D', colorClass: 'bg-gray-100 text-gray-700 border-gray-200' };
    };
    const badge = getBadge(score);
    return (
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-bl-lg border-b border-l absolute top-0 right-0 ${badge.colorClass}`}>
            Class {badge.label}
        </span>
    );
};

// 상단 유저 경험치 게이지 바
// 아직 경험치 부분이 어떻게 추가될지에대한 논의가 필요함 ★★★
export const ExpBar = ({ exp }: { exp: number }) => (
    <div className={EXPBAR_STYLES.container}>
        <div className={EXPBAR_STYLES.textWrapper}>
            <span>경험치 (EXP)</span>
            <span className={EXPBAR_STYLES.expValue}>{exp} / 100</span>
        </div>
        <div className={EXPBAR_STYLES.track}>
            <div
                className={EXPBAR_STYLES.fill}
                style={{ width: `${exp}%` }}
            ></div>
        </div>
    </div>
);

// 컴포넌트별 보조 색상 테마 타입
export type ThemeClasses = { text: string; bgLight: string; bgHover: string; borderHover: string };

// 개별 과목 진행 수치/점수를 출력하는 소형 통계 카드
export const ScoreCard = ({ label, score, theme, unit = "회" }: { label: string; score: number; theme: ThemeClasses; unit?: string }) => {
    return (
        <div className={`${SCORECARD_STYLES.container} ${theme.borderHover}`}>
            {/* 상단 모서리 라벨 구역 */}
            <div className={SCORECARD_STYLES.badgeWrapper}>
                <CategoryBadge score={score} />
            </div>
            {/* 호버 시 텍스트 컬러 반전 이벤트 적용 */}
            <p className={`${SCORECARD_STYLES.label} group-hover:${theme.text}`}>{label}</p>
            <p className={`${SCORECARD_STYLES.score} group-hover:${theme.text}`}>{score}{unit}</p>
        </div>
    );
};
