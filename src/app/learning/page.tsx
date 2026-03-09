'use client';

import { useState, useEffect } from 'react';
import {
    Award, User, Trophy, Book, ShoppingCart, ShoppingBag,
    ChartLine, CheckCircle, CheckCircle2, Lock, LockOpen,
    Brain, RotateCcw, Check, Zap, ZapOff, X, ChevronRight,
    Binary, Cpu, Database, LayoutGrid, Star, Shield, BookOpen
} from 'lucide-react';
import { IconName, LUCIDE_ICONS } from '@/app/learning/data/icon'
import { QUIZZES, SKILL_STAGES, TITLES } from '@/app/learning/data/data'

// --- Main Component ---
export default function PythonMasteryExplorer() {
    const [solved, setSolved] = useState<string[]>([]);
    const [isMounted, setIsMounted] = useState(false);
    const [currentStageId, setCurrentStageId] = useState(1);
    const [modalNode, setModalNode] = useState<string | null>(null);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [userAnswers, setUserAnswers] = useState<number[]>([]);
    const [showingResults, setShowingResults] = useState(false);
    const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
    const [showCollection, setShowCollection] = useState(false);

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

    const getStageProgress = (stageId: number) => {
        const stage = SKILL_STAGES.find(s => s.id === stageId);
        if (!stage) return 0;
        const stageNodes = stage.nodes.map(n => n.id);
        const solvedCount = Array.isArray(solved) ? solved.filter(id => stageNodes.includes(id)).length : 0;
        return (stageNodes.length > 0 ? (solvedCount / stageNodes.length) * 100 : 0);
    };

    const isStageUnlocked = (stageId: number) => {
        if (stageId === 1) return true;
        return getStageProgress(stageId - 1) >= 80;
    };

    const totalNodesCount = SKILL_STAGES.reduce((acc, s) => acc + (s.nodes?.length || 0), 0);
    const solvedCount = Array.isArray(solved) ? solved.length : 0;
    const globalProgress = totalNodesCount > 0 ? (solvedCount / totalNodesCount) * 100 : 0;

    const handleQuizAnswer = (idx: number) => {
        if (!modalNode) return;
        const quiz = QUIZZES[modalNode];
        if (!quiz) return;

        const newAnswers = [...userAnswers, idx];
        setUserAnswers(newAnswers);

        if (currentQuestionIdx < quiz.questions.length - 1) {
            setCurrentQuestionIdx(prev => prev + 1);
        } else {
            // End of quiz, show results
            setShowingResults(true);
        }
    };

    const handleClaimMastery = () => {
        if (!modalNode) return;
        if (!solved.includes(modalNode)) {
            setSolved(prev => [...prev, modalNode]);
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
        const IconComponent = LUCIDE_ICONS[iconName as IconName] || Zap;
        return <IconComponent className={className} />;
    };

    return (
        <div className="min-h-screen bg-background text-slate-200 p-4 md:p-8 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-black italic tracking-tighter text-white">
                        PYTHON MASTERY <span className="text-primary underline underline-offset-8 decoration-primary/30">EXPLORER</span>
                    </h1>
                    <p className="text-muted font-medium mt-3">환상 연구원의 지식 계통도 및 칭호 시스템</p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => setShowCollection(true)}
                        className="bg-[#1a1a22] border border-indigo-500/30 px-5 py-2 rounded-xl hover:bg-indigo-600/10 transition-all flex items-center gap-2"
                    >
                        <Award className="w-5 h-5 text-indigo-400" />
                        <span className="font-bold">칭호 도감</span>
                    </button>
                    <div className="bg-[#1a1a22] border border-white/10 px-6 py-2 rounded-xl text-right">
                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Global Progress</div>
                        <div className="text-xl font-black text-indigo-400">{globalProgress.toFixed(1)}%</div>
                    </div>
                </div>
            </div>

            {/* Stage Selection */}
            <div className="flex gap-3 mb-10 overflow-x-auto pb-4 scrollbar-hide">
                {SKILL_STAGES.map(stage => {
                    const unlocked = isStageUnlocked(stage.id);
                    const active = currentStageId === stage.id;
                    return (
                        <button
                            key={stage.id}
                            onClick={() => unlocked && setCurrentStageId(stage.id)}
                            className={`min-w-[200px] p-5 rounded-2xl border-2 transition-all text-left ${active ? 'bg-indigo-600/20 border-indigo-500 shadow-lg' :
                                unlocked ? 'bg-slate-900/50 border-white/5 opacity-80' : 'bg-black border-white/5 opacity-30 cursor-not-allowed'
                                }`}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className={active ? 'text-indigo-400' : 'text-slate-600'}>
                                    {renderIcon(stage.icon, "w-5 h-5")}
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-slate-500">{stage.id}차 전직</div>
                                    <div className="text-sm font-black text-white">{stage.name.split(': ')[1] || stage.name}</div>
                                </div>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full">
                                <div
                                    className="h-full bg-indigo-500 transition-all duration-1000"
                                    style={{ width: `${getStageProgress(stage.id)}%` }}
                                />
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Canvas Area */}
            <div className="bg-card/50 rounded-[2.5rem] border border-white/5 p-12 min-h-[600px] relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--primary) 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} />

                <div className="relative flex flex-col items-center">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-white mb-2">{SKILL_STAGES.find(s => s.id === currentStageId)?.name}</h2>
                        <span className="px-4 py-1 bg-white/5 rounded-full text-indigo-400 text-xs font-bold tracking-widest uppercase border border-indigo-500/20">
                            {SKILL_STAGES.find(s => s.id === currentStageId)?.theme}
                        </span>
                    </div>

                    <div className="relative w-[800px] h-[400px]">
                        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                            {SKILL_STAGES.find(s => s.id === currentStageId)?.nodes.map(node => {
                                if (!node.req) return null;
                                const currentNodes = SKILL_STAGES.find(s => s.id === currentStageId)?.nodes;
                                const reqNode = currentNodes?.find(n => n.id === node.req);
                                if (!reqNode) return null;
                                const isSolved = solved.includes(node.id);
                                return (
                                    <line
                                        key={`line-${node.id}`}
                                        x1={reqNode.x * 280 + 80} y1={reqNode.y * 150 + 40}
                                        x2={node.x * 280 + 80} y2={node.y * 150 + 40}
                                        stroke={isSolved ? '#6366f1' : '#2d2d35'}
                                        strokeWidth="3"
                                        strokeDasharray={!solved.includes(node.req) ? "5,5" : "0"}
                                    />
                                );
                            })}
                        </svg>

                        {SKILL_STAGES.find(s => s.id === currentStageId)?.nodes.map(node => {
                            const isSolved = Array.isArray(solved) && solved.includes(node.id);
                            const canUnlock = !node.req || (Array.isArray(solved) && solved.includes(node.req));
                            return (
                                <div
                                    key={node.id}
                                    className="absolute transform -translate-x-1/2"
                                    style={{ left: node.x * 280 + 80, top: node.y * 150 }}
                                >
                                    <button
                                        disabled={!canUnlock}
                                        onClick={() => setModalNode(node.id)}
                                        className={`group w-44 p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${isSolved ? 'bg-primary/90 border-primary shadow-glow' :
                                            canUnlock ? 'bg-card border-white/10 hover:border-primary' : 'bg-background border-white/5 opacity-40 grayscale'
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
                                    <h3 className="text-2xl font-black italic">{SKILL_STAGES.flatMap(s => s.nodes).find(n => n.id === modalNode)?.name}</h3>
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
                                            아쉽게도 정답률이 부족합니다.<br />(80% 이상 활성화 가능)
                                        </div>
                                        <button
                                            onClick={() => {
                                                setCurrentQuestionIdx(0);
                                                setUserAnswers([]);
                                                setShowingResults(false);
                                            }}
                                            className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black text-lg transition-all active:scale-95"
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

            {/* Title Collection Modal */}
            {showCollection && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
                    <div className="bg-[#121216] border border-white/10 w-full max-w-2xl rounded-[2.5rem] p-10 relative animate-scale-in">
                        <button onClick={() => setShowCollection(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white">
                            <X className="w-6 h-6" />
                        </button>
                        <div className="mb-10 flex items-center gap-4">
                            <Award className="w-10 h-10 text-indigo-500" />
                            <div>
                                <h3 className="text-3xl font-black text-white">환상님의 칭호 도감</h3>
                                <p className="text-slate-500">연구의 흔적이 기록된 명예의 전당입니다.</p>
                            </div>
                        </div>

                        <div className="grid gap-4 max-h-[60vh] overflow-y-auto pr-4 scrollbar-hide">
                            {TITLES.map(title => {
                                const isEarned = (title.id === 't1' && solved.includes('1-1')) ||
                                    (title.id === 't2' && solved.includes('2-2')) ||
                                    (title.id === 't3' && globalProgress >= 50);
                                return (
                                    <div key={title.id} className={`p-6 rounded-2xl border flex items-center gap-6 transition-all ${isEarned ? 'bg-indigo-600/10 border-indigo-500/40 opacity-100' : 'bg-white/5 border-white/5 opacity-40 grayscale'
                                        }`}>
                                        <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-2xl shadow-inner border border-white/5">
                                            {isEarned ? renderIcon(title.icon, "w-6 h-6 text-yellow-500") : <ZapOff className="w-6 h-6 text-slate-700" />}
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className="font-black text-white text-lg">{title.name}</h4>
                                            <p className="text-sm text-slate-400">{title.description}</p>
                                        </div>
                                        <div className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full uppercase border border-indigo-500/20">
                                            {isEarned ? 'Acquired' : 'Locked'}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}