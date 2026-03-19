import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const TestHistorySection = ({ title, icon: Icon, results, page, setPage, itemsPerPage, color }: any) => (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Icon className={`text-${color}-600`} size={24} />
                {title}
            </h3>
            {results.length > 0 && (
                <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-full border border-gray-100">
                    <button
                        onClick={() => setPage((prev: number) => Math.max(0, prev - 1))}
                        disabled={page === 0}
                        className="p-1.5 rounded-full hover:bg-white hover:shadow-sm disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft size={18} className="text-gray-600" />
                    </button>
                    <span className={`text-xs font-black text-${color}-600 w-6 text-center`}>{page + 1}</span>
                    <button
                        onClick={() => setPage((prev: number) => prev + 1)}
                        disabled={(page + 1) * itemsPerPage >= results.length}
                        className="p-1.5 rounded-full hover:bg-white hover:shadow-sm disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronRight size={18} className="text-gray-600" />
                    </button>
                </div>
            )}
        </div>

        {results.length === 0 ? (
            <div className={`text-center py-10 bg-gray-50/50 rounded-xl border border-dashed border-gray-200`}>
                <p className="text-gray-400 text-sm font-bold">아직 기록이 없습니다.</p>
                <p className="text-gray-400 text-xs mt-1">테스트를 진행하여 나만의 스탯을 채워보세요!</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-3">
                {results.slice(page * itemsPerPage, (page + 1) * itemsPerPage).map((result: any) => (
                    <div key={result.id} className={`group flex items-center justify-between p-4 rounded-xl border border-gray-50 bg-gray-50/30 hover:border-${color}-100 hover:bg-${color}-50/50 transition-all hover:translate-x-1`}>
                        <div>
                            <p className={`font-bold text-gray-900 group-hover:text-${color}-900`}>{result.category}</p>
                            <p className="text-[11px] font-medium text-gray-400 mt-0.5">{result.date}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-black shadow-sm bg-white border border-gray-100 ${result.score >= 80 ? 'text-green-600' : 'text-gray-500'}`}>
                            {result.score}점
                        </span>
                    </div>
                ))}
            </div>
        )}
    </section>
);
