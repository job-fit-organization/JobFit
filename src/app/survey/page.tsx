'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';
import Button, { cn } from '@/components/Button';
import { postSurvey } from '@/app/learning/data/apiClient';

// 설문조사 각 영역을 담당하는 작은 컴포넌트들이에요.
import SurveyHeader from './_components/SurveyHeader';
import SuccessView from './_components/SuccessView';
import RatingSection from './_components/RatingSection';
import FeatureSection from './_components/FeatureSection';
import FeedbackSection from './_components/FeedbackSection';

// 전체적인 레이아웃 스타일입니다.
const STYLE = {
    container: "min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8",
    card: "bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-8",
    section: "space-y-3",
    label: "block text-sm font-semibold text-slate-900",
    textArea: "w-full px-4 py-3 rounded-xl bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none transition-all",
    starContainer: "flex gap-2 justify-center py-4 bg-slate-50 rounded-xl",
    featureGrid: "grid grid-cols-1 md:grid-cols-2 gap-3",
    submitBtn: "w-full py-4 text-lg font-semibold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-1 transition-all",
};

export default function SurveyPage() {
    const router = useRouter();

    // 상태 관리: 제출 여부, 별점, 선택한 기능, 피드백 내용
    const [submitted, setSubmitted] = useState(false);
    const [rating, setRating] = useState<number>(0);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [feedback, setFeedback] = useState('');

    // 기능 선택/해제 토글 함수입니다.
    const toggleFeature = (feature: string) => {
        setSelectedFeatures(prev =>
            prev.includes(feature)
                ? prev.filter(f => f !== feature)
                : [...prev, feature]
        );
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await postSurvey({ rating, features: selectedFeatures, feedback });
            console.log('성공적으로 제출되었습니다.');
        } catch (error) {
            console.error('API 호출 중 에러 발생:', error);
            // 에러 발생 시에도 사용자 경험을 위해 성공 페이지로 넘기거나 알림을 줄 수 있음
        }

        setTimeout(() => {
            setSubmitted(true);
        }, 500);
    };

    // 제출 완료 시 보여줄 화면
    if (submitted) {
        return <SuccessView onHomeClick={() => router.push('/')} />;
    }

    return (
        <div className={STYLE.container}>
            <div className="max-w-xl mx-auto">
                <SurveyHeader />

                <form onSubmit={handleSubmit} className={STYLE.card}>
                    {/* 각 섹션별 컴포넌트 */}
                    <RatingSection
                        rating={rating}
                        onRate={setRating}
                        styles={STYLE}
                    />

                    <FeatureSection
                        selectedFeatures={selectedFeatures}
                        onToggle={toggleFeature}
                        styles={STYLE}
                    />

                    <FeedbackSection
                        value={feedback}
                        onChange={setFeedback}
                        styles={STYLE}
                    />

                    <Button
                        type="submit"
                        disabled={rating === 0}
                        className={STYLE.submitBtn}
                    >
                        <Send className="w-5 h-5" />
                        의견 제출하기
                    </Button>
                </form>
            </div>
        </div>
    );
}
