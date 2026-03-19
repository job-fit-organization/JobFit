import React from 'react';
import { TrendingUp, BarChart3, Target, Users } from 'lucide-react';
import { INITIAL_OVERALL_STATISTICS } from '../data';

const STYLES = {
    section: "bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6 relative overflow-hidden",
    header: "text-xl font-bold text-gray-800 flex items-center gap-2",
    
    totalCard: "bg-gradient-to-br from-serve-5 to-gray-900 rounded-xl p-5 text-white shadow-md relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300",
    totalIcon: "absolute -bottom-4 -right-2 text-white/10 group-hover:scale-110 transition-transform duration-500",
    totalLabel: "text-gray-300 text-xs font-bold uppercase tracking-wider mb-1",
    totalValue: "text-3xl font-black",
    
    statsGrid: "grid grid-cols-1 gap-4",
    statCard1: "bg-serve-3/10 rounded-xl p-4 border border-serve-3/20 flex items-center justify-between group hover:bg-serve-3/20 transition-colors",
    statLabel1: "text-serve-3 text-[10px] font-black uppercase tracking-wider",
    
    statCard2: "bg-serve-6/10 rounded-xl p-4 border border-serve-6/20 flex items-center justify-between group hover:bg-serve-6/20 transition-colors",
    statLabel2: "text-serve-6 text-[10px] font-black uppercase tracking-wider",
    
    statValueCommon: "text-xl font-black text-gray-900",
    statIconWrapper: "h-10 w-10 bg-white/50 rounded-full flex items-center justify-center shadow-sm"
};

export const StatsSection = ({ data }: { data: typeof INITIAL_OVERALL_STATISTICS }) => (
    <section className={STYLES.section}>
        <h3 className={STYLES.header}>
            <TrendingUp className="text-serve-4" size={24} />
            전체 통계 차트
        </h3>

        <div className={STYLES.totalCard}>
            <Users className={STYLES.totalIcon} size={100} />
            <p className={STYLES.totalLabel}>플랫폼 전체 참여</p>
            <p className={STYLES.totalValue}>{data.totalParticipants.toLocaleString()}명</p>
        </div>

        <div className={STYLES.statsGrid}>
            <div className={STYLES.statCard1}>
                <div>
                    <p className={STYLES.statLabel1}>평균 플랫폼 점수</p>
                    <p className={STYLES.statValueCommon}>{data.averagePlatformScore}점</p>
                </div>
                <div className={STYLES.statIconWrapper}>
                    <BarChart3 size={20} className="text-serve-3" />
                </div>
            </div>
            <div className={STYLES.statCard2}>
                <div>
                    <p className={STYLES.statLabel2}>인기 직무</p>
                    <p className={STYLES.statValueCommon}>{data.popularCategory}</p>
                </div>
                <div className={STYLES.statIconWrapper}>
                    <Target size={20} className="text-serve-6" />
                </div>
            </div>
        </div>
    </section>
);
