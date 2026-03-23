'use client';

import { useState, useEffect } from 'react';
import {
    Award, Trophy, CheckCircle2, Zap, ZapOff, X
} from 'lucide-react';
import { ICON_MAP, LUCIDE_ICONS } from '@/app/learning/data/icon'
import { QUIZZES, QuizData, Category, SubCategory, categoryList, fetchSubcategories } from '@/app/learning/data/data'
import { HelpCircle } from 'lucide-react'; // 기본 아이콘용

const token = typeof window !== 'undefined' ? localStorage.getItem('access') : null;
const refresh = typeof window !== 'undefined' ? localStorage.getItem('refresh') : null;
const email = typeof window !== 'undefined' ? localStorage.getItem('email') : null;

console.log("현재 토큰 상태:", token);
console.log("현재 리프레시 토큰 상태:", refresh);
console.log("현재 이메일 상태:", email);

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
                <span className={isLarge ? 'text-gray-400 text-xs font-black uppercase tracking-widest' : (isActive ? 'text-white/80' : 'text-gray-500')}>
                    {label}
                </span>
                <span className={isLarge ? 'text-4xl font-black text-black italic' : (isActive ? 'text-white' : 'text-gray-400')}>
                    {Math.round(progress)}%
                </span>
            </div>
            <div className={`w-full overflow-hidden ${isLarge ? 'h-3 bg-gray-100 rounded-full' : `h-1.5 rounded-full ${isActive ? 'bg-black/10' : 'bg-gray-100'}`}`}>
                <div
                    className={`h-full transition-all duration-1000 ease-out ${isLarge ? 'bg-gradient-primary' : (isActive ? 'bg-white' : 'bg-[#f47725]')}`}
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
    const [dynamicQuizzes, setDynamicQuizzes] = useState<QuizData>({});
    const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});
    const nodeRefs = useState<Record<string, HTMLButtonElement | null>>({})[0];
    const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
    const [categoryProgress, setCategoryProgress] = useState<Record<number, number>>({});
    const [globalProgress, setGlobalProgress] = useState(0);
    const [totalNodesCount, setTotalNodesCount] = useState(0);


    //  -- db연결 데이터 -- 
    // useEffect(() => {
    //     categoryList().then(data => {
    //         // 각 카테고리에 progress 필드가 없다면 임의로 추가하거나, 
    //         // 서버에서 준 데이터(예: cat.proficiency)를 연결합니다.
    //         const mappedData = data.map((cat: any) => ({
    //             ...cat,
    //             currentProgress: cat.proficiency || 0 // 서버 데이터 명칭에 맞춰주세요!
    //         }));
    //         setCategories(mappedData);
    //     });
    // }, []);

    // useEffect(() => {
    //     // 카테고리 목록 불러오기
    //     categoryList().then(res => {
    //         setCategories(res);
    //         if (res.length > 0 && currentStageId === null) {
    //             setCurrentStageId(res[0].id);
    //         }
    //     });

    //     if (currentStageId) {
    //         console.log("email", email);
    //         // 서브카테고리 목록 불러오기
    //         fetchSubcategories(currentStageId, email).then(res => {
    //             console.log('subcategories', res);
    //             setSubcategories(res)
    //         });

    //         //서브카테고리별 문제 목록 불러오기
    //         // fetchQuestions(currentStageId).then(res => setDynamicQuizzes(res || {}));
    //     }
    // }, [currentStageId]);

    // console.log('dynamicQuizzes', dynamicQuizzes);


    //  test 데이터 
    useEffect(() => {
        // 카테고리 목록 불러오기
        categoryList().then(res => {
            setCategories(res);
            if (res.length > 0 && currentStageId === null) {
                setCurrentStageId(res[0].id);
            }
        });
    }, [currentStageId]);

    useEffect(() => {
        if (currentStageId) {
            // 서브카테고리 목록 불러오기
            fetchSubcategories(currentStageId, email).then(res => {
                setSubcategories(res);
            });
        }
    }, [currentStageId, email]);

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

    const updateNodePositions = () => {
        const newPositions: Record<string, { x: number; y: number }> = {};
        const canvasElement = document.getElementById('knowledge-canvas');
        if (!canvasElement) return;

        const canvasRect = canvasElement.getBoundingClientRect();

        Object.entries(nodeRefs).forEach(([id, el]) => {
            if (el) {
                const rect = el.getBoundingClientRect();
                newPositions[id] = {
                    x: (rect.left + rect.right) / 2 - canvasRect.left,
                    y: (rect.top + rect.bottom) / 2 - canvasRect.top
                };
            }
        });
        setNodePositions(newPositions);
    };

    useEffect(() => {
        if (isMounted && subcategories.length > 0) {
            // Wait for DOM to update
            const timer = setTimeout(updateNodePositions, 100);
            window.addEventListener('resize', updateNodePositions);
            
            const observer = new ResizeObserver(updateNodePositions);
            const canvasElement = document.getElementById('knowledge-canvas');
            if (canvasElement) observer.observe(canvasElement);

            return () => {
                clearTimeout(timer);
                window.removeEventListener('resize', updateNodePositions);
                observer.disconnect();
            };
        }
    }, [isMounted, subcategories, currentStageId]);

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('python_mastery_solved', JSON.stringify(solved));
        }
    }, [solved, isMounted]);

    // 전체 노드 개수 계산 (모든 카테고리의 서브카테고리 합계)
    useEffect(() => {
        if (categories.length > 0) {
            const fetchAllSubcategories = async () => {
                try {
                    const allSubcategoriesPromises = categories.map(cat => fetchSubcategories(cat.id, email));
                    const allSubcategoriesResults = await Promise.all(allSubcategoriesPromises);
                    const total = allSubcategoriesResults.reduce((acc: number, sub: any[]) => acc + sub.length, 0);
                    setTotalNodesCount(total);
                } catch (error) {
                    console.error("Failed to fetch all subcategories for progress calculation:", error);
                }
            };
            fetchAllSubcategories();
        }
    }, [categories, email]);

    // 전체 진행률 계산
    useEffect(() => {
        if (totalNodesCount > 0) {
            const progress = (solved.length / totalNodesCount) * 100;
            setGlobalProgress(progress);
        }
    }, [solved, totalNodesCount]);

    // 진행률 통합 계산
    const updateProgressForCategory = (categoryId: number, currentSolved: string[], nodes: SubCategory[]) => {
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
        <div className="min-h-screen bg-[#f8f9fa] text-[#1a1a1a] font-sans selection:bg-[#ea002c]/10">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ea002c]/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#f47725]/5 blur-[120px] rounded-full" />
            </div>

            <div className="relative max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 animate-up">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="px-3 py-1 bg-[#f47725]/10 rounded-full text-[#f47725] text-xs font-bold tracking-widest uppercase">
                                Learning Path
                            </div>
                            <div className="w-1 h-1 bg-gray-300 rounded-full" />
                            <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                                {currentCategory?.name || "Loading..."}
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-black mb-6 tracking-tight leading-none">
                            KNOWLEDGE<br /><span className="text-gradient">EXPEDITION</span>
                        </h1>
                        <p className="max-w-xl text-gray-500 text-lg font-medium leading-relaxed uppercase tracking-tighter opacity-80">
                            당신의 기술적 한계를 뛰어넘는 여정.<br />각 단계를 정복하고 진정한 마스터가 되십시오.
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-6">
                        <div className="white-card rounded-[2.5rem] p-8 min-w-[320px] relative overflow-hidden group border-none shadow-xl">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Trophy size={80} className="text-[#f47725]" />
                            </div>
                            <div className="relative">
                                <ProgressBar
                                    progress={globalProgress}
                                    label="Total Progress"
                                    size="large"
                                />
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">LV. {Math.floor(globalProgress / 20) + 1} EXPERT</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{solvedCount} / {totalNodesCount || 0} NODES</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stage Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 md:px-0 px-4">
                    {categories.map((cat, idx) => {
                        const isUnlocked = isStageUnlocked(cat.id);
                        const isActive = currentStageId === cat.id;

                        return (
                            <button
                                key={cat.id}
                                onClick={() => isUnlocked && setCurrentStageId(cat.id)}
                                className={`relative group p-8 rounded-[2rem] transition-all duration-500 text-left overflow-hidden h-40 ${isActive
                                    ? 'bg-gradient-primary shadow-[0_12px_30px_rgba(234,0,44,0.2)]'
                                    : isUnlocked
                                        ? 'white-card'
                                        : 'bg-gray-100 opacity-50 cursor-not-allowed border-none'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${isActive ? 'text-white/70' : 'text-gray-400'}`}>
                                            {idx + 1}차 전직
                                        </div>
                                        <h3 className={`text-2xl font-black tracking-tight ${isActive ? 'text-white' : 'text-black'}`}>{cat.name}</h3>
                                    </div>
                                    <div className={`p-3 rounded-2xl transition-all duration-500 ${isActive ? 'bg-white/20' : 'bg-gray-50 group-hover:scale-110'}`}>
                                        {renderIcon(ICON_MAP[cat.name as keyof typeof ICON_MAP] || "Zap", `w-6 h-6 ${isActive ? 'text-white' : 'text-[#f47725]'}`)}
                                    </div>
                                </div>

                                <ProgressBar
                                    progress={categoryProgress[cat.id] || cat.currentProgress || 0}
                                    label="Proficiency"
                                    isActive={isActive}
                                />

                                {!isUnlocked && (
                                    <div className="absolute inset-0 bg-gray-50/60 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ZapOff className="text-gray-400 w-8 h-8" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Canvas Area */}
                <div className="relative min-h-[600px] bg-white border border-gray-100 rounded-[3rem] p-12 overflow-hidden shadow-xl animate-fade-in group/canvas">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(244,119,37,0.03),transparent_70%)]" />

                    {/* Stage Details Header */}
                    <div className="relative flex flex-col items-center mb-20 text-center">
                        <div className="w-px h-16 bg-gradient-to-b from-transparent to-[#f47725]/30 mb-6" />
                        <h2 className="text-3xl font-black text-black mb-2 uppercase italic">{currentCategory?.name || "Loading..."} <span className="text-gradient">Core Mastery</span></h2>
                        <span className="text-gray-400 text-xs font-bold tracking-widest uppercase">Select a node to begin the trial</span>
                    </div>

                        {/* Nodes Container */}
                        <div id="knowledge-canvas" className="relative">
                            {/* Lines SVG */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                                {subcategories.map((node) => {
                                    const center = nodePositions[node.id.toString()];
                                    if (!center) return null;

                                    if (node.req) {
                                        const reqCenter = nodePositions[node.req.toString()];
                                        if (reqCenter) {
                                            const isReqSolved = solved.includes(node.req.toString());
                                            return (
                                                <line
                                                    key={`line-${node.id}`}
                                                    x1={reqCenter.x} y1={reqCenter.y}
                                                    x2={center.x} y2={center.y}
                                                    stroke={isReqSolved ? "#f47725" : "#f1f5f9"}
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

                            <div className="grid grid-cols-2 gap-x-24 gap-y-20 relative px-12 pb-12">
                                {subcategories.map((node) => {
                                    const isSolved = solved.includes(node.id.toString());
                                    const canUnlock = node.req ? solved.includes(node.req.toString()) : true;

                                    return (
                                        <div
                                            key={node.id}
                                            className="relative flex flex-col items-center"
                                        >
                                            <button
                                                ref={(el) => { nodeRefs[node.id.toString()] = el; }}
                                                disabled={!canUnlock}
                                                onClick={() => setModalNode(node.id.toString())}
                                                className={`group w-44 p-5 rounded-3xl transition-all ${isSolved
                                                    ? 'bg-gradient-primary text-white shadow-lg' :
                                                    canUnlock ? 'white-card hover:border-[#f47725]' : 'bg-gray-50 opacity-40 grayscale pointer-events-none'
                                                    }`}
                                            >
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all ${isSolved ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-[#f47725]/10'}`}>
                                                {isSolved ? <CheckCircle2 className="text-white w-6 h-6" /> : <Zap className={`${canUnlock ? 'text-[#f47725]' : 'text-gray-400'} w-6 h-6`} />}
                                            </div>
                                            <div className="text-center">
                                                <div className={`text-[8px] font-bold uppercase mb-1 tracking-widest ${isSolved ? 'text-white/70' : 'text-gray-400'}`}>NODE {node.id}</div>
                                                <div className={`text-sm font-black italic uppercase ${isSolved ? 'text-white' : 'text-black'}`}>{node.name}</div>
                                            </div>
                                        </button>
                                    </div>
                                );
                            })}
                            </div>
                        </div>
                    </div>

            {/* Quiz Modal */}
            {modalNode && QUIZZES[modalNode as string] && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative animate-up">
                        <button onClick={closeQuiz} className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors">
                            <X className="w-6 h-6" />
                        </button>

                        {!showingResults ? (
                            <>
                                <div className="mb-8 text-center">
                                    <div className="text-[#f47725] text-[10px] font-black tracking-[0.3em] uppercase mb-3">
                                        Knowledge Trial ({currentQuestionIdx + 1} / {QUIZZES[modalNode].questions.length})
                                    </div>
                                    <h3 className="text-3xl font-black text-black italic uppercase">{subcategories.find(n => n.id.toString() === modalNode)?.name}</h3>
                                    <div className="w-full h-2 bg-gray-100 rounded-full mt-6 overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-primary transition-all duration-500"
                                            style={{ width: `${((currentQuestionIdx + 1) / QUIZZES[modalNode].questions.length) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                <p className="text-xl text-black mb-10 text-center font-bold leading-relaxed">
                                    {QUIZZES[modalNode].questions[currentQuestionIdx]?.q}
                                </p>

                                <div className="grid gap-4">
                                    {QUIZZES[modalNode].questions[currentQuestionIdx]?.a.map((opt, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleQuizAnswer(idx)}
                                            className="w-full p-5 text-left rounded-2xl bg-[#f8f9fa] border-2 border-transparent hover:border-[#f47725] hover:bg-white transition-all text-gray-700 font-bold group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-xl bg-gray-200 flex items-center justify-center text-xs text-gray-500 group-hover:bg-[#f47725] group-hover:text-white transition-all">
                                                    {idx + 1}
                                                </div>
                                                {opt}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-4 animate-up">
                                <div className="mb-10">
                                    <div className="w-24 h-24 bg-[#f47725]/10 rounded-full flex items-center justify-center mx-auto mb-8">
                                        <Trophy className={`w-12 h-12 ${calculateScore() / QUIZZES[modalNode].questions.length >= 0.8 ? 'text-[#f47725]' : 'text-gray-300'}`} />
                                    </div>
                                    <h3 className="text-4xl font-black mb-3 text-black italic uppercase">TRIAL COMPLETE</h3>
                                    <p className="text-gray-400 font-black tracking-widest text-sm">
                                        SCORE: {calculateScore()} / {QUIZZES[modalNode].questions.length}
                                    </p>
                                </div>

                                {calculateScore() / QUIZZES[modalNode].questions.length >= 0.8 ? (
                                    <div>
                                        <div className="bg-[#f47725]/5 border border-[#f47725]/10 p-6 rounded-3xl mb-10 text-[#f47725] font-bold text-sm leading-relaxed">
                                            축하합니다! 전문가 수준의 이해도를 증명하셨습니다.<br />지식 마스터리를 획득할 준비가 되었습니다.
                                        </div>
                                        <button
                                            onClick={handleClaimMastery}
                                            className="w-full py-5 btn-primary rounded-2xl font-black text-xl shadow-xl active:scale-95"
                                        >
                                            마스터리 획득하기
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="bg-gray-50 p-6 rounded-3xl mb-10 text-gray-500 font-bold text-sm leading-relaxed">
                                            정답률이 부족합니다 (80% 이상 권장).<br />개념을 다시 복습하고 도전해 보세요.
                                        </div>
                                        <button
                                            onClick={closeQuiz}
                                            className="w-full py-5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-black text-xl transition-all"
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
        </div>
    );
}
