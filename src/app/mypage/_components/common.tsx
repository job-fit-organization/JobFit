import React from 'react';
import { Star, Shield, Medal, Trophy, Crown } from 'lucide-react';

export const Header = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <header className="text-center md:text-left mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{title}</h1>
        <p className="mt-2 text-gray-500">{subtitle}</p>
    </header>
);

export const LevelBadge = ({ level }: { level: number }) => {
    const getBadge = (lvl: number) => {
        if (lvl < 4) return { icon: <Star size={20} className="text-amber-700" />, label: '브론즈', bgColor: 'bg-amber-100', textColor: 'text-amber-800' };
        if (lvl < 7) return { icon: <Shield size={20} className="text-gray-500" />, label: '실버', bgColor: 'bg-gray-200', textColor: 'text-gray-700' };
        if (lvl < 10) return { icon: <Medal size={20} className="text-yellow-600" />, label: '골드', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' };
        if (lvl < 15) return { icon: <Trophy size={20} className="text-emerald-500" />, label: '플래티넘', bgColor: 'bg-emerald-100', textColor: 'text-emerald-800' };
        return { icon: <Crown size={20} className="text-purple-500" />, label: '다이아몬드', bgColor: 'bg-purple-100', textColor: 'text-purple-800' };
    };
    const badge = getBadge(level);
    return (
        <span className={`flex items-center gap-1 text-sm font-bold px-3 py-1 rounded-full ${badge.bgColor} ${badge.textColor}`}>
            {badge.icon} {badge.label}
        </span>
    );
};

export const CategoryBadge = ({ score }: { score: number }) => {
    const getBadge = (s: number) => {
        if (s >= 90) return { label: 'S', colorClass: 'bg-pink-100 text-pink-700 border-pink-200' };
        if (s >= 80) return { label: 'A', colorClass: 'bg-blue-100 text-blue-700 border-blue-200' };
        if (s >= 70) return { label: 'B', colorClass: 'bg-green-100 text-green-700 border-green-200' };
        if (s >= 60) return { label: 'C', colorClass: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
        return { label: 'D', colorClass: 'bg-gray-100 text-gray-700 border-gray-200' };
    };
    const badge = getBadge(score);
    return (
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-bl-lg border-b border-l absolute top-0 right-0 ${badge.colorClass}`}>
            Class {badge.label}
        </span>
    );
};

export const ExpBar = ({ exp }: { exp: number }) => (
    <div className="w-full max-w-sm mx-auto md:mx-0">
        <div className="flex justify-between text-[11px] font-bold text-gray-600 mb-1.5 uppercase tracking-wider">
            <span>경험치 (EXP)</span>
            <span className="text-indigo-600 font-black">{exp} / 100</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 border border-gray-200 shadow-inner">
            <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full transition-all duration-1000 ease-out m-[1px]"
                style={{ width: `calc(${exp}% - 2px)` }}
            ></div>
        </div>
    </div>
);

export const ScoreCard = ({ label, score, color, unit = "점" }: { label: string; score: number; color: string; unit?: string }) => {
    const colorMap: Record<string, string> = {
        blue: 'hover:border-blue-300 text-blue-600 group-hover:text-blue-700',
        emerald: 'hover:border-emerald-300 text-emerald-600 group-hover:text-emerald-700',
        purple: 'hover:border-purple-300 text-purple-600 group-hover:text-purple-700',
        rose: 'hover:border-rose-300 text-rose-600 group-hover:text-rose-700',
    };
    const colorClasses = colorMap[color] || '';

    return (
        <div className={`bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm transition-all ${colorClasses.split(' ')[0]} hover:shadow-md relative overflow-hidden group`}>
            <div className="absolute top-0 right-0">
                <CategoryBadge score={score} />
            </div>
            <p className={`text-xs font-bold mb-1 mt-2 ${colorClasses.split(' ')[1]}`}>{label}</p>
            <p className={`text-xl font-extrabold text-gray-900 ${colorClasses.split(' ')[2]} transition-colors`}>{score}{unit}</p>
        </div>
    );
};
