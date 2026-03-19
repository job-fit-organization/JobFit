'use client';

import React from 'react';
import { Star, Shield, Medal, Trophy, Crown } from 'lucide-react';

interface RankAnimationProps {
    level: number;
    userName: string;
}

// 컨테이너 및 애니메이션 UI 스타일 설정
const STYLES = {
    container: [
        "flex flex-col items-center justify-center p-6",
        "bg-gradient-to-br from-main-1/5 to-main-2/5",
        "rounded-2xl border border-gray-100",
        "w-full max-w-[400px] h-40",
        "relative overflow-hidden group shadow-inner"
    ].join(" "),
    
    decoDotsLayer: "absolute top-2 left-2 flex gap-1 opacity-20",
    decoDot1: "w-1 h-1 bg-main-1 rounded-full animate-pulse",
    decoDot2: "w-1 h-1 bg-main-2 rounded-full animate-pulse delay-75",
    
    labelArea: "absolute top-4 left-6 right-6 flex justify-between items-center",
    labelTextDesc: "text-[10px] font-black text-gray-400 uppercase tracking-widest",
    labelCurrent: "text-sm font-black text-main-1",
    labelTarget: "text-sm font-black text-main-2",
    
    track: [
        "relative w-full h-16 mt-8 flex items-center overflow-hidden",
        "bg-gray-100/50 rounded-xl border border-gray-200/50"
    ].join(" "),
    
    character: "flex flex-col items-center ml-4",
    characterShadow: "w-6 h-1 bg-black/5 rounded-full blur-[2px] mt-1",
    
    finisherWrapper: "absolute right-4 h-full flex flex-col justify-center opacity-20 invisible group-hover:visible transition-all",
    finisherLine: "w-1 h-10 bg-gradient-to-b from-transparent via-main-1 to-transparent rounded-full",
    
    motivationWrapper: "mt-4 flex items-center gap-2",
    motivationDots: "flex -space-x-1",
    motivationText: "text-[11px] font-black text-main-1 tracking-tight"
};

// 우상단 유저 랭크 성장 애니메이션 위젯
const RankAnimation: React.FC<RankAnimationProps> = ({ level, userName }) => {
    // 레벨 구간별 뱃지 메타데이터 (1~15 등급 체계)
    const getRankInfo = (lv: number) => {
        if (lv < 4) return { icon: <Star size={32} className="text-serve-1" />, label: '뉴비', nextLabel: '루키' };
        if (lv < 7) return { icon: <Shield size={32} className="text-serve-4" />, label: '루키', nextLabel: '주니어' };
        if (lv < 10) return { icon: <Medal size={32} className="text-serve-3" />, label: '주니어', nextLabel: '시니어' };
        if (lv < 15) return { icon: <Trophy size={32} className="text-main-2" />, label: '시니어', nextLabel: '엑스퍼트' };
        return { icon: <Crown size={32} className="text-main-1" />, label: '엑스퍼트', nextLabel: '마스터' };
    };

    const { icon, label, nextLabel } = getRankInfo(level);

    return (
        <div className={STYLES.container}>
            {/* 배경 블러 이펙트 닷 */}
            <div className={STYLES.decoDotsLayer}>
                <div className={STYLES.decoDot1} />
                <div className={STYLES.decoDot2} />
            </div>

            {/* 현재 등급 -> 승급 목표 레이블 */}
            <div className={STYLES.labelArea}>
                <div className="flex flex-col">
                    <span className={STYLES.labelTextDesc}>현재 랭크</span>
                    <span className={STYLES.labelCurrent}>{label}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className={STYLES.labelTextDesc}>목표</span>
                    <span className={STYLES.labelTarget}>{nextLabel}</span>
                </div>
            </div>

            {/* 무한 달리기 트랙 애니메이션 블록 */}
            <div className={STYLES.track}>
                {/* 1번 메인 뷰 캐릭터 */}
                <div className="absolute inset-0 flex items-center animate-loop-run">
                    <div className={STYLES.character}>
                        <div className="animate-bounce">{icon}</div>
                        <div className={STYLES.characterShadow} />
                    </div>
                </div>

                {/* 1번 공백을 채워주기 위해 지연 출발하는 복제 2번 캐릭터 */}
                <div className="absolute inset-0 flex items-center animate-loop-run-delayed">
                    <div className={STYLES.character}>
                        <div className="animate-bounce">{icon}</div>
                        <div className={STYLES.characterShadow} />
                    </div>
                </div>

                {/* Hover 동작 시 등장하는 결승점 라인 */}
                <div className={STYLES.finisherWrapper}>
                    <div className={STYLES.finisherLine} />
                </div>
            </div>

            {/* 동기 부여 문구 영역 */}
            <div className={STYLES.motivationWrapper}>
                <div className={STYLES.motivationDots}>
                    {[1, 2, 3].map((_, i) => (
                        <div 
                            key={i} 
                            className="w-1.5 h-1.5 rounded-full bg-main-1/50 animate-pulse" 
                            style={{ animationDelay: `${i * 0.2}s` }} 
                        />
                    ))}
                </div>
                <p className={STYLES.motivationText}>
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
                    /* 끊김 방지를 위해 타이밍을 음수로 잡음 (-2s offset) */
                    animation-delay: -2s;
                }
            `}</style>
        </div>
    );
};

export default RankAnimation;
