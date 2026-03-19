import React from 'react';
import { TrendingUp, BarChart3, Target } from 'lucide-react';
import { INITIAL_OVERALL_STATISTICS } from '../data';

export const StatsSection = ({ data }: { data: typeof INITIAL_OVERALL_STATISTICS }) => (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className="text-indigo-600" size={24} />
            전체 통계 차트
        </h3>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-5 text-white shadow-md relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
            <BarChart3 className="absolute -bottom-4 -right-4 text-white/10 group-hover:scale-110 transition-transform" size={100} />
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">플랫폼 전체 참여</p>
            <p className="text-3xl font-black">{data.totalParticipants.toLocaleString()}명</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
            <div className="bg-purple-50/50 rounded-xl p-4 border border-purple-100 flex items-center justify-between">
                <div>
                    <p className="text-purple-600 text-[10px] font-black uppercase tracking-wider">인기 직무</p>
                    <p className="text-lg font-black text-purple-900">{data.popularCategory}</p>
                </div>
                <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Target size={20} className="text-purple-600" />
                </div>
            </div>
        </div>
    </section>
);
