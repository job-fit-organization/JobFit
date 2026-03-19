import React from 'react';
import { Zap, Sparkles, Target } from 'lucide-react';
import { INITIAL_JOB_RECOMMENDATION } from '../data';

export const JobReport = ({ data }: { data: typeof INITIAL_JOB_RECOMMENDATION }) => (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6 relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-50 rounded-full blur-2xl opacity-50"></div>
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Zap className="text-amber-500" size={24} />
            직무 추천 리포트
        </h3>

        <div className="text-center py-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-widest opacity-80 mb-1">나의 직매칭 유형</p>
            <p className="text-4xl font-black mb-1">{data.type}</p>
            <p className="text-sm font-bold bg-white/20 inline-block px-3 py-1 rounded-full">{data.matchRate}% 적합</p>
        </div>

        <div className="space-y-3">
            <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <Sparkles size={18} className="text-indigo-500" />
                {data.title}
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">{data.description}</p>
        </div>

        <div className="space-y-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Target size={14} /> 추천 직무 키워드
            </p>
            <div className="flex flex-wrap gap-2">
                {data.recommendedJobs.map((job, idx) => (
                    <span key={idx} className="bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg">#{job}</span>
                ))}
            </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">유형 성향</span>
            </div>
            <div className="flex gap-2">
                {data.traits.map((trait, idx) => (
                    <div key={idx} className="flex-1 text-center p-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-black">{trait}</div>
                ))}
            </div>
        </div>
    </section>
);
