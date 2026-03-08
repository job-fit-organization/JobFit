'use client';

import React from 'react';
import { Star, Shield, Medal, Trophy, Crown } from 'lucide-react';

interface RankAnimationProps {
    level: number;
    userName: string;
}

const RankAnimation: React.FC<RankAnimationProps> = ({ level, userName }) => {
    const getRankInfo = (lv: number) => {
        if (lv < 4) return { icon: <Star size={32} className="text-amber-700" />, label: '브론즈', nextLabel: '실버' };
        if (lv < 7) return { icon: <Shield size={32} className="text-gray-500" />, label: '실버', nextLabel: '골드' };
        if (lv < 10) return { icon: <Medal size={32} className="text-yellow-600" />, label: '골드', nextLabel: '플래티넘' };
        if (lv < 15) return { icon: <Trophy size={32} className="text-emerald-500" />, label: '플래티넘', nextLabel: '다이아몬드' };
        return { icon: <Crown size={32} className="text-purple-500" />, label: '다이아몬드', nextLabel: '레전드' };
    };

    const { icon, label, nextLabel } = getRankInfo(level);

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-2xl border border-gray-100 w-full max-w-[400px] h-40 relative overflow-hidden group shadow-inner">
            {/* Background Decorative Elements */}
            <div className="absolute top-2 left-2 flex gap-1 opacity-20">
                <div className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-75"></div>
            </div>

            {/* Labels Area */}
            <div className="absolute top-4 left-6 right-6 flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">현재 랭크</span>
                    <span className="text-sm font-black text-indigo-600">{label}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">목표</span>
                    <span className="text-sm font-black text-purple-600">{nextLabel}</span>
                </div>
            </div>

            {/* Run Track */}
            <div className="relative w-full h-16 mt-8 flex items-center overflow-hidden bg-gray-100/50 rounded-xl border border-gray-200/50">
                {/* Looping Character */}
                <div className="absolute inset-0 flex items-center animate-loop-run">
                    <div className="flex flex-col items-center ml-4">
                        <div className="animate-bounce">
                            {icon}
                        </div>
                        <div className="w-6 h-1 bg-black/5 rounded-full blur-[2px] mt-1"></div>
                    </div>
                </div>

                {/* Second Character for Seamless Loop */}
                <div className="absolute inset-0 flex items-center animate-loop-run-delayed">
                    <div className="flex flex-col items-center ml-4">
                        <div className="animate-bounce">
                            {icon}
                        </div>
                        <div className="w-6 h-1 bg-black/5 rounded-full blur-[2px] mt-1"></div>
                    </div>
                </div>

                {/* Finisher Line Effect */}
                <div className="absolute right-4 h-full flex flex-col justify-center opacity-20 invisible group-hover:visible transition-all">
                    <div className="w-1 h-10 bg-gradient-to-b from-transparent via-indigo-500 to-transparent rounded-full"></div>
                </div>
            </div>

            {/* Motivation Text */}
            <div className="mt-4 flex items-center gap-2">
                <div className="flex -space-x-1">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                    ))}
                </div>
                <p className="text-[11px] font-black text-indigo-700 tracking-tight">
                    {userName}님은 오늘도 성장 중!
                </p>
            </div>

            <style jsx>{`
                @keyframes loop-run {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(300%); }
                }
                .animate-loop-run {
                    animation: loop-run 4s linear infinite;
                }
                .animate-loop-run-delayed {
                    animation: loop-run 4s linear infinite;
                    animation-delay: -2s; /* Start halfway to make it look continuous */
                }
            `}</style>
        </div>
    );
};

export default RankAnimation;
