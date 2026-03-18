'use client';

import { useState, useEffect } from 'react';
import {
    Award, Trophy, CheckCircle2, Zap, ZapOff, X
} from 'lucide-react';
import { ICON_MAP, LUCIDE_ICONS } from '@/app/learning/data/icon'
import { QUIZZES, QuizData, categoryList, Category, fetchSubcategories } from '@/app/learning/data/data'
import { HelpCircle } from 'lucide-react'; // 기본 아이콘용

const token = typeof window !== 'undefined' ? localStorage.getItem('access') : null;
const refresh = typeof window !== 'undefined' ? localStorage.getItem('refresh') : null;
const email = typeof window !== 'undefined' ? localStorage.getItem('email') : null;

console.log("현재 토큰 상태:", token);
console.log("현재 리프레시 토큰 상태:", refresh);
console.log("현재 이메일 상태:", email);

// --- Shared Components ---
const ProgressBar = ({
    progress,
    label,
    isActive = false,
    size = 'normal'
}: {
    progress: number;
    label: string;
    isActive?: boolean;
    size?: 'normal' | 'large'
}) => {
    const isLarge = size === 'large';

    return (
        <div className={isLarge ? "" : "mt-8"}>
            <div className={`flex justify-between ${isLarge ? 'items-end mb-4' : 'text-[10px] font-bold uppercase tracking-widest mb-2'}`}>
                <span className={isLarge ? 'text-slate-400 text-xs font-black uppercase tracking-widest' : (isActive ? 'text-indigo-200' : 'text-slate-500')}>
                    {label}
                </span>
                <span className={isLarge ? 'text-4xl font-black text-white italic' : (isActive ? 'text-white' : 'text-slate-300')}>
                    {Math.round(progress)}%
                </span>
            </div>
            <div className={`w-full overflow-hidden border ${isLarge ? 'h-3 bg-white/5 rounded-full border-white/5' : `h-1.5 rounded-full ${isActive ? 'bg-black/20 border-transparent' : 'bg-white/5 border-transparent'}`}`}>
                <div
                    className={`h-full transition-all duration-1000 ease-out ${isLarge ? 'bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-400' : (isActive ? 'bg-white' : 'bg-indigo-500/50')}`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

// --- Main Component ---
export default function PythonMasteryExplorer() {
    const [solved, setSolved] = useState<string[]>([]);
    const [isMounted, setIsMounted] = useState(false);
    const [currentStageId, setCurrentStageId] = useState<number | null>(null);
    const [modalNode, setModalNode] = useState<string | null>(null);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [userAnswers, setUserAnswers] = useState<number[]>([]);
    const [showingResults, setShowingResults] = useState(false);
    const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<any[]>([]);
    const [categoryProgress, setCategoryProgress] = useState<Record<number, number>>({});
    const [globalProgress, setGlobalProgress] = useState(0);
    const [dynamicQuizzes, setDynamicQuizzes] = useState<QuizData>({});

    useEffect(() => {
        categoryList().then(data => {
            // 각 카테고리에 progress 필드가 없다면 임의로 추가하거나, 
            // 서버에서 준 데이터(예: cat.proficiency)를 연결합니다.
            const mappedData = data.map((cat: any) => ({
                ...cat,
                currentProgress: cat.proficiency || 0 // 서버 데이터 명칭에 맞춰주세요!
            }));
            setCategories(mappedData);
        });
    }, []);

    useEffect(() => {
        // 카테고리 목록 불러오기
        categoryList().then(res => {
            setCategories(res);
            if (res.length > 0 && currentStageId === null) {
                setCurrentStageId(res[0].id);
            }
        });

        if (currentStageId) {
            console.log("email", email);
            // 서브카테고리 목록 불러오기
            fetchSubcategories(currentStageId, email).then(res => {
                console.log('subcategories', res);
                setSubcategories(res)
            });

            //서브카테고리별 문제 목록 불러오기
            // fetchQuestions(currentStageId).then(res => setDynamicQuizzes(res || {}));
        }
    }, [currentStageId]);

    console.log('dynamicQuizzes', dynamicQuizzes);


    useEffect(() => {
        setIsMounted(true);
        const saved = localStorage.getItem('python_mastery_solved');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    setSolved(parsed);
                }
            } catch (e) {
                console.error("Failed to parse solved nodes:", e);
            }
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('python_mastery_solved', JSON.stringify(solved));
        }
    }, [solved, isMounted]);

    // 진행률 통합 계산
    const updateProgressForCategory = (categoryId: number, currentSolved: string[], nodes: any[]) => {
        if (nodes.length === 0) return;

        const subIds = nodes.map(s => s.id.toString());
        const solvedInCat = currentSolved.filter(id => subIds.includes(id)).length;
        const progress = (solvedInCat / nodes.length) * 100;

        setCategoryProgress(prev => ({
            ...prev,
            [categoryId]: progress
        }));
    };

    const isStageUnlocked = (categoryId: number) => {
        if (categories.length > 0 && categoryId === categories[0]?.id) return true;
        const index = categories.findIndex(c => c.id === categoryId);
        if (index <= 0) return true;
        const prevCategory = categories[index - 1];
        return (categoryProgress[prevCategory.id] || 0) >= 80;
    };

    // 노드 위치 매핑 (데이터베이스 순서에 따라 배치)
    const getNodePosition = (index: number) => {
        const positions = [
            { x: 0.5, y: 0 }, { x: 1.5, y: 0 },
            { x: 0.5, y: 1 }, { x: 1.5, y: 1 },
            { x: 0.5, y: 2 }, { x: 1.5, y: 2 },
        ];
        return positions[index % positions.length];
    };

    const solvedCount = Array.isArray(solved) ? solved.length : 0;

    const handleQuizAnswer = (idx: number) => {
        if (!modalNode) return;
        const quiz = QUIZZES[modalNode];
        if (!quiz) return;

        const newAnswers = [...userAnswers, idx];
        setUserAnswers(newAnswers);

        if (currentQuestionIdx < quiz.questions.length - 1) {
            setCurrentQuestionIdx(prev => prev + 1);
        } else {
            setShowingResults(true);
        }
    };

    const handleClaimMastery = () => {
        if (!modalNode) return;
        if (!solved.includes(modalNode)) {
            const newSolved = [...solved, modalNode];
            setSolved(newSolved);

            // 현재 카테고리의 점수를 즉시 갱신하여 고정함
            if (currentStageId) {
                updateProgressForCategory(currentStageId, newSolved, subcategories);
            }

            setFeedback({ msg: '지식을 습득했습니다!', type: 'success' });
        }
        closeQuiz();
    };

    const closeQuiz = () => {
        setModalNode(null);
        setCurrentQuestionIdx(0);
        setUserAnswers([]);
        setShowingResults(false);
        setFeedback(null);
    };

    const calculateScore = () => {
        if (!modalNode) return 0;
        const quiz = QUIZZES[modalNode];
        if (!quiz) return 0;
        return userAnswers.reduce((acc, ans, idx) => {
            return acc + (ans === quiz.questions[idx].correct ? 1 : 0);
        }, 0);
    };

    const renderIcon = (iconName: string, className: string = "") => {
        const IconComponent = LUCIDE_ICONS[iconName as keyof typeof LUCIDE_ICONS] || HelpCircle;
        return <IconComponent className={className} />;
    };

    if (!isMounted) return null;

    const currentCategory = categories.find(c => c.id === currentStageId);

    return (
        <div className="min-h-screen bg-[#050508] text-slate-200 font-sans selection:bg-indigo-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150" />
            </div>

            <div className="relative max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 animate-slide-up">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-bold tracking-widest uppercase">
                                Learning Path
                            </div>
                            <div className="w-1 h-1 bg-slate-700 rounded-full" />
                            <div className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                                {currentCategory?.name || "Loading..."}
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-none italic">
                            KNOWLEDGE<br />EXPEDITION
                        </h1>
                        <p className="max-w-xl text-slate-400 text-lg font-medium leading-relaxed uppercase tracking-tighter opacity-80">
                            당신의 기술적 한계를 뛰어넘는 여정.<br />각 단계를 정복하고 진정한 마스터가 되십시오.
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-6">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 min-w-[320px] shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Trophy size={80} />
                            </div>
                            <div className="relative">
                                <ProgressBar
                                    progress={globalProgress}
                                    label="Total Progress"
                                    size="large"
                                />
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">LV. {Math.floor(globalProgress / 20) + 1} EXPERT</span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{solvedCount} / {subcategories.length || 0} NODES</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stage Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                    {categories.map((cat, idx) => {
                        const isUnlocked = isStageUnlocked(cat.id);
                        const progress = categoryProgress[cat.id] || 0;
                        const isActive = currentStageId === cat.id;

                        return (
                            <button
                                key={cat.id}
                                onClick={() => isUnlocked && setCurrentStageId(cat.id)}
                                className={`relative group p-8 rounded-[2rem] border-2 transition-all duration-500 text-left overflow-hidden h-40 ${isActive
                                    ? 'bg-indigo-600 border-indigo-400 shadow-[0_0_50px_-12px_rgba(79,70,229,0.5)]'
                                    : isUnlocked
                                        ? 'bg-white/5 border-white/10 hover:border-indigo-500/50 hover:bg-white/[0.08]'
                                        : 'bg-black/40 border-white/5 opacity-50 cursor-not-allowed'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${isActive ? 'text-indigo-200' : 'text-slate-500'}`}>
                                            {idx + 1}차 전직
                                        </div>
                                        <h3 className={`text-2xl font-black tracking-tight ${isActive ? 'text-white' : 'text-slate-300'}`}>{cat.name}</h3>
                                    </div>
                                    <div className={`p-3 rounded-2xl transition-all duration-500 ${isActive ? 'bg-white/20' : 'bg-white/5 group-hover:scale-110'}`}>
                                        {renderIcon(ICON_MAP[cat.name as keyof typeof ICON_MAP] || "Zap", `w-6 h-6 ${isActive ? 'text-white' : 'text-slate-400'}`)}
                                    </div>
                                </div>

                                <ProgressBar
                                    // 상태에 저장된 값이 있으면 쓰고, 없으면 기본값 사용
                                    progress={categoryProgress[cat.id] || cat.currentProgress || 0}
                                    label="Proficiency"
                                    isActive={isActive}
                                />

                                {!isUnlocked && (
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ZapOff className="text-white/40 w-8 h-8" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Canvas Area */}
                <div className="relative min-h-[600px] bg-white/[0.02] border border-white/5 rounded-[3rem] p-12 overflow-hidden shadow-inner backdrop-blur-3xl animate-fade-in group/canvas">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.05),transparent_70%)]" />

                    {/* Stage Details Header */}
                    <div className="relative flex flex-col items-center mb-20 text-center">
                        <div className="w-px h-16 bg-gradient-to-b from-transparent to-indigo-500/50 mb-6" />
                        <h2 className="text-3xl font-black text-white mb-2">{currentCategory?.name || "Loading..."} Core Mastery</h2>
                        <span className="text-indigo-400 text-xs font-bold tracking-widest uppercase">Select a node to begin the trial</span>
                    </div>

                    <div className="relative flex justify-center">
                        {/* Lines SVG */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: "600px" }}>
                            {subcategories.map((node, i) => {
                                const pos = getNodePosition(i);
                                const x1 = pos.x * 200 + 100;
                                const y1 = pos.y * 150 + 44;

                                if (node.req) {
                                    const reqIndex = subcategories.findIndex(n => n.id === node.req || n.name === node.req);
                                    if (reqIndex !== -1) {
                                        const reqPos = getNodePosition(reqIndex);
                                        const x2 = reqPos.x * 200 + 100;
                                        const y2 = reqPos.y * 150 + 44;
                                        const isReqSolved = solved.includes(node.req.toString());

                                        return (
                                            <line
                                                key={`line-${node.id}`}
                                                x1={x2} y1={y2} x2={x1} y2={y1}
                                                stroke={isReqSolved ? "#6366f1" : "rgba(255,255,255,0.05)"}
                                                strokeWidth="2"
                                                strokeDasharray={isReqSolved ? "0" : "8,8"}
                                                className="transition-all duration-1000"
                                            />
                                        );
                                    }
                                }
                                return null;
                            })}
                        </svg>

                        {/* Nodes */}
                        <div className="grid grid-cols-2 gap-x-24 gap-y-20 relative px-12">
                            {subcategories.map((node, i) => {
                                const isSolved = solved.includes(node.id.toString());
                                const canUnlock = node.req ? solved.includes(node.req.toString()) : true;

                                return (
                                    <div
                                        key={node.id}
                                        className="relative flex flex-col items-center"
                                    >
                                        <button
                                            disabled={!canUnlock}
                                            onClick={() => setModalNode(node.id.toString())}
                                            className={`group w-44 p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${isSolved ? 'bg-indigo-600 border-indigo-400 shadow-glow' :
                                                canUnlock ? 'bg-white/5 border-white/10 hover:border-indigo-500' : 'bg-black/40 border-white/5 opacity-40 grayscale'
                                                }`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isSolved ? 'bg-white/20' : 'bg-black/50'}`}>
                                                {isSolved ? <CheckCircle2 className="text-white w-5 h-5" /> : <Zap className={`${canUnlock ? 'text-indigo-400' : 'text-slate-600'} w-5 h-5`} />}
                                            </div>
                                            <div className="text-center">
                                                <div className={`text-[8px] font-bold uppercase mb-1 ${isSolved ? 'text-indigo-200' : 'text-slate-500'}`}>NODE {node.id}</div>
                                                <div className="text-xs font-black text-white leading-tight">{node.name}</div>
                                            </div>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quiz Modal */}
            {modalNode && QUIZZES[modalNode] && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 text-white">
                    <div className="bg-[#1a1a22] border border-white/10 w-full max-w-lg rounded-[2rem] p-8 shadow-2xl relative animate-scale-in">
                        <button onClick={closeQuiz} className="absolute top-6 right-6 text-slate-500 hover:text-white">
                            <X className="w-6 h-6" />
                        </button>

                        {!showingResults ? (
                            <>
                                <div className="mb-6 text-center">
                                    <div className="text-indigo-400 text-[10px] font-bold tracking-[0.3em] uppercase mb-2">
                                        Knowledge Trial ({currentQuestionIdx + 1} / {QUIZZES[modalNode].questions.length})
                                    </div>
                                    <h3 className="text-2xl font-black italic">{subcategories.find(n => n.id.toString() === modalNode)?.name}</h3>
                                    <div className="w-full h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-500 transition-all duration-500"
                                            style={{ width: `${((currentQuestionIdx + 1) / QUIZZES[modalNode].questions.length) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                <p className="text-lg text-slate-300 mb-8 text-center font-medium leading-relaxed">
                                    {QUIZZES[modalNode].questions[currentQuestionIdx]?.q}
                                </p>

                                <div className="grid gap-3">
                                    {QUIZZES[modalNode].questions[currentQuestionIdx]?.a.map((opt, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleQuizAnswer(idx)}
                                            className="w-full p-4 text-left rounded-2xl bg-white/5 border border-white/5 hover:bg-indigo-600/20 hover:border-indigo-500 transition-all text-slate-300 font-bold group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-6 h-6 rounded-full bg-black/50 flex items-center justify-center text-[10px] border border-white/10 text-slate-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                                    {idx + 1}
                                                </div>
                                                {opt}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-4 animate-fade-in">
                                <div className="mb-8">
                                    <div className="w-24 h-24 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
                                        <Trophy className={`w-12 h-12 ${calculateScore() / QUIZZES[modalNode].questions.length >= 0.8 ? 'text-yellow-500' : 'text-slate-500'}`} />
                                    </div>
                                    <h3 className="text-3xl font-black mb-2 italic">TRIAL COMPLETE</h3>
                                    <p className="text-slate-400 font-bold">
                                        당신의 통찰력: {calculateScore()} / {QUIZZES[modalNode].questions.length}
                                    </p>
                                </div>

                                {calculateScore() / QUIZZES[modalNode].questions.length >= 0.8 ? (
                                    <div>
                                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl mb-8 text-emerald-400 font-bold text-sm">
                                            축하합니다! 80% 이상의 정답률로<br />지식 계통도를 활성화했습니다.
                                        </div>
                                        <button
                                            onClick={handleClaimMastery}
                                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black text-lg shadow-glow transition-all active:scale-95"
                                        >
                                            마스터리 획득
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl mb-8 text-rose-400 font-bold text-sm">
                                            아쉽습니다. 80% 이상의 정답률이 필요합니다.<br />다시 시도해 보시겠습니까?
                                        </div>
                                        <button
                                            onClick={closeQuiz}
                                            className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-black text-lg transition-all"
                                        >
                                            다시 도전하기
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {feedback && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-slide-up">
                    <div className={`px-8 py-4 rounded-2xl font-black shadow-2xl flex items-center gap-3 border ${feedback.type === 'success' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-rose-500 text-white border-rose-400'}`}>
                        {feedback.type === 'success' ? <CheckCircle2 /> : <ZapOff />}
                        {feedback.msg}
                    </div>
                </div>
            )}
        </div>
    );
}
