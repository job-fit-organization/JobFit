import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ThemeClasses } from './common';

const STYLES = {
    section: "bg-white rounded-2xl shadow-sm border border-gray-100 p-6",
    header: "flex justify-between items-center mb-6",
    title: "text-xl font-bold text-gray-800 flex items-center gap-2",
    pagination: "flex items-center gap-2 bg-gray-50 p-1 rounded-full border border-gray-100",
    pageBtn: "p-1.5 rounded-full hover:bg-white hover:shadow-sm disabled:opacity-20 disabled:cursor-not-allowed transition-all",
    pageIcon: "text-gray-600",
    pageText: "text-xs font-black w-6 text-center",
    emptyState: "text-center py-10 bg-gray-50/50 rounded-xl border border-dashed border-gray-200",
    emptyTitle: "text-gray-400 text-sm font-bold",
    emptyDesc: "text-gray-400 text-xs mt-1",
    listGrid: "grid grid-cols-1 gap-3",
    listItem: "group flex items-center justify-between p-4 rounded-xl border border-gray-50 bg-gray-50/30 transition-all hover:translate-x-1 cursor-default",
    itemTitle: "font-bold text-gray-900 transition-colors",
    itemDate: "text-[11px] font-medium text-gray-400 mt-0.5",
    scoreBadgePass: "px-3 py-1 rounded-full text-xs font-black shadow-sm bg-white border border-gray-100 text-main-1",
    scoreBadgeFail: "px-3 py-1 rounded-full text-xs font-black shadow-sm bg-white border border-gray-100 text-gray-500"
};

// 클라이언트 사이드 페이징을 지원하는 활동 이력 히스토리 뷰 위젯
export const TestHistorySection = ({ title, icon: Icon, results, page, setPage, itemsPerPage, theme }: { title: string, icon: any, results: any[], page: number, setPage: any, itemsPerPage: number, theme: ThemeClasses }) => (
    <section className={STYLES.section}>
        <div className={STYLES.header}>
            <h3 className={STYLES.title}>
                <Icon className={theme.text} size={24} />
                {title}
            </h3>
            
            {/* 결과 데이터가 있을 때 좌우 페이저 활성화 */}
            {results.length > 0 && (
                <div className={STYLES.pagination}>
                    <button
                        onClick={() => setPage((prev: number) => Math.max(0, prev - 1))}
                        disabled={page === 0}
                        className={STYLES.pageBtn}
                    >
                        <ChevronLeft size={18} className={STYLES.pageIcon} />
                    </button>
                    <span className={`${STYLES.pageText} ${theme.text}`}>{page + 1}</span>
                    <button
                        onClick={() => setPage((prev: number) => prev + 1)}
                        // 전체 갯수에 비례해 Max 페이지 도달 시 disabled 방어
                        disabled={(page + 1) * itemsPerPage >= results.length}
                        className={STYLES.pageBtn}
                    >
                        <ChevronRight size={18} className={STYLES.pageIcon} />
                    </button>
                </div>
            )}
        </div>

        {/* 내역 없을 시 렌더링 할 Fallback 화면 */}
        {results.length === 0 ? (
            <div className={STYLES.emptyState}>
                <p className={STYLES.emptyTitle}>기록 내역이 없습니다.</p>
                <p className={STYLES.emptyDesc}>테스트를 진행하여 통계를 채워보세요.</p>
            </div>
        ) : (
            // (Page * Limit) 배열 슬라이스 렌더링
            <div className={STYLES.listGrid}>
                {results.slice(page * itemsPerPage, (page + 1) * itemsPerPage).map((result: any) => (
                    // row 아이템 호버 시 동적 테마 css 주입
                    <div key={result.id} className={`${STYLES.listItem} ${theme.borderHover} ${theme.bgHover}`}>
                        <div>
                            <p className={`${STYLES.itemTitle} group-hover:${theme.text}`}>{result.category}</p>
                            <p className={STYLES.itemDate}>{result.date}</p>
                        </div>
                        {/* 80점을 합격/우수 배지 분기 처리 기준으로 세팅 */}
                        <span className={result.score >= 80 ? STYLES.scoreBadgePass : STYLES.scoreBadgeFail}>
                            {result.score}점
                        </span>
                    </div>
                ))}
            </div>
        )}
    </section>
);
