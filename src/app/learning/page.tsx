'use client';
import { useState } from 'react';
import { DIFFICULTIES, STORE_ITEMS, Difficulty, StoreItem } from '@/app/learning/data/data';
import { Award, User, Trophy, Book, ShoppingCart, ShoppingBag, ChartLine, CheckCircle, Lock, LockOpen, Brain, RotateCcw } from 'lucide-react';
import { IconName, LUCIDE_ICONS } from '@/app/learning/data/icon'
import TitleCard from '@/app/learning/layout/titlecard'

export default function LearningPage() {
    // --- 상태 관리 --- 데이터형태
    const [view, setView] = useState<'main' | 'titles' | 'store' | 'quiz' | 'history'>('main');
    const [user, setUser] = useState({
        name: "홍길동",
        mbti: "INTJ",
        availableSp: 0,
        totalSp: 1000,
        ownedTitles: ["코딩 입문자"],
        activeTitle: "코딩 입문자"
    });

    const renderIcon = (iconName: IconName, className: string = "") => {
        const LucideIconComponent = LUCIDE_ICONS[iconName];
        if (LucideIconComponent) {
            return <LucideIconComponent className={`w-full h-full ${className}`} />;
        }
        // Fallback to Font Awesome if starts with fa-
        if (iconName.startsWith('fa-')) {
            return <i className={`fas ${iconName} ${className}`}></i>;
        }
        return <i className={`fas fa-question ${className}`}></i>;
    };

    const [currentQuiz, setCurrentQuiz] = useState<Difficulty | null>(null);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [userAnswers, setUserAnswers] = useState<number[]>([]);
    const [quizResult, setQuizResult] = useState<{ passed: boolean; score: number } | null>(null);

    // --- 비즈니스 로직 ---
    const handleStartQuiz = (diff: Difficulty) => {
        const diffIndex = DIFFICULTIES.findIndex(d => d.id === diff.id);
        if (diffIndex > 0) {
            const prevDiff = DIFFICULTIES[diffIndex - 1];
            if (!user.ownedTitles.includes(prevDiff.title)) {
                alert(`${user.name}님, "${prevDiff.title}" 칭호를 먼저 획득하셔야 다음 단계 연구가 가능합니다!`);
                return;
            }
        }
        setCurrentQuiz(diff);
        setCurrentQuestionIdx(0);
        setUserAnswers([]);
        setQuizResult(null);
        setView('quiz');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAnswer = (idx: number) => {
        const newAnswers = [...userAnswers, idx];
        setUserAnswers(newAnswers);

        if (currentQuestionIdx < 4) {
            setCurrentQuestionIdx(prev => prev + 1);
        } else {
            const correctCount = newAnswers.filter((ans, i) => ans === currentQuiz!.questions[i].correct).length;
            const passed = correctCount >= 4;
            const score = correctCount * 20;

            if (passed) {
                setUser(prev => ({
                    ...prev,
                    availableSp: prev.availableSp + currentQuiz!.spReward,
                    totalSp: prev.totalSp + currentQuiz!.spReward,
                    ownedTitles: Array.from(new Set([...prev.ownedTitles, currentQuiz!.title])),
                    activeTitle: currentQuiz!.title
                }));
            }
            setQuizResult({ passed, score });
        }
    };

    const handlePurchaseItem = (item: StoreItem) => {
        if (user.ownedTitles.includes(item.title)) {
            alert("이미 보유 중인 아이템입니다.");
            return;
        }
        if (user.availableSp < item.price) {
            alert("SP가 부족합니다.");
            return;
        }
        setUser(prev => ({
            ...prev,
            availableSp: prev.availableSp - item.price,
            ownedTitles: [...prev.ownedTitles, item.title]
        }));
        alert(`"${item.title}"을(를) 구매했습니다!`);
    };

    const handleEquipTitle = (title: string) => {
        setUser(prev => ({ ...prev, activeTitle: title }));
    };

    const isSpecialLocked = user.totalSp < 1000;

    return (
        <div className="min-h-screen p-4 md:p-8 bg-[#0b0f1a] text-[#e2e8f0] font-sans selection:bg-indigo-500/30">
            <div className="max-w-6xl mx-auto">
                {/* 상단 프로필 헤더 */}
                <header className="glass-card rounded-[2.5rem] p-8 flex flex-wrap items-center justify-between gap-8 shadow-2xl mb-8 animate-fade-in">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-[2rem] flex items-center justify-center shadow-lg relative overflow-hidden">
                            <User className="w-10 h-10 text-white z-10" />
                            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-black text-white">{user.name}</h1>
                                <span className="bg-indigo-500/20 text-indigo-400 text-xs px-3 py-1 rounded-full border border-indigo-500/30 font-bold tracking-widest uppercase">{user.mbti}</span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <span className="text-xs font-bold text-yellow-500 bg-yellow-500/10 px-4 py-1.5 rounded-xl border border-yellow-500/20 flex items-center gap-1.5">
                                    <Award className="w-4 h-4" /> {user.activeTitle}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold px-4 py-1.5 rounded-xl border bg-indigo-500/10 border-indigo-500/20 text-indigo-400">
                                        <ShoppingBag className="w-4 h-4 mr-1.5 inline" /> 자산: {user.availableSp.toLocaleString()} SP
                                    </span>
                                    <span className="text-xs font-bold px-4 py-1.5 rounded-xl border bg-purple-500/10 border-purple-500/20 text-purple-400">
                                        <ChartLine className="w-4 h-4 mr-1.5 inline" /> 누적: {user.totalSp.toLocaleString()} SP
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <nav className="flex gap-4">
                        <button onClick={() => setView('main')}
                            className={`px-6 py-3 rounded-2xl font-black text-sm transition-all flex items-center gap-2 ${view === 'main' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : 'bg-slate-700/50 text-slate-400 hover:text-white'}`}>
                            <Trophy className="w-4 h-4" /> 실력 로드맵
                        </button>
                        <button onClick={() => setView('titles')}
                            className={`px-6 py-3 rounded-2xl font-black text-sm transition-all flex items-center gap-2 ${view === 'titles' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : 'bg-slate-700/50 text-slate-400 hover:text-white'}`}>
                            <Book className="w-4 h-4" /> 칭호 도감
                        </button>
                        <button onClick={() => setView('store')}
                            className={`px-6 py-3 rounded-2xl font-black text-sm transition-all flex items-center gap-2 ${view === 'store' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : 'bg-slate-700/50 text-slate-400 hover:text-white'}`}>
                            <ShoppingCart className="w-4 h-4" /> 상점
                        </button>
                        <button onClick={() => setView('history')}
                            className={`px-6 py-3 rounded-2xl font-black text-sm transition-all flex items-center gap-2 ${view === 'history' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : 'bg-slate-700/50 text-slate-400 hover:text-white'}`}>
                            <ShoppingCart className="w-4 h-4" /> 히스토리
                        </button>
                    </nav>
                </header>

                <main className="animate-fade-in min-h-[50vh]">
                    {view === 'main' && (
                        <>
                            <section className="mb-16">
                                {/* 상단 구분선: 더 밝은 인디고 그라데이션으로 변경 */}
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-indigo-500/40"></div>
                                    <h2 className="text-sm font-black text-indigo-300 uppercase tracking-[0.3em]">Mastery Path</h2>
                                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-indigo-500/40"></div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {DIFFICULTIES.filter(d => d.type === 'basic').map((diff) => {
                                        const isOwned = user.ownedTitles.includes(diff.title);
                                        const diffIndex = DIFFICULTIES.findIndex(d => d.id === diff.id);
                                        const isLocked = diffIndex > 0 && !user.ownedTitles.includes(DIFFICULTIES[diffIndex - 1].title);

                                        return (
                                            <div
                                                key={diff.id}
                                                className={`relative p-8 rounded-[3rem] flex flex-col items-center text-center group transition-all duration-300 border backdrop-blur-xl shadow-2xl ${isOwned
                                                    ? 'bg-emerald-500/10 border-emerald-500/40 shadow-emerald-900/20'
                                                    : isLocked
                                                        ? 'opacity-30 grayscale pointer-events-none border-white/5 bg-transparent'
                                                        : 'bg-white/10 border-white/20 hover:border-indigo-400/60 hover:-translate-y-2 hover:bg-white/15'}`}
                                            >
                                                {/* 아이콘 박스: 배경과 대비되도록 밝기 조절 */}
                                                <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center mb-8 transition-all shadow-inner ${isOwned ? 'bg-emerald-500/20 text-emerald-400' : isLocked ? 'bg-slate-800 text-slate-600' : 'bg-indigo-500/20 text-indigo-300 group-hover:scale-110'}`}>
                                                    <div className="w-10 h-10 flex items-center justify-center">
                                                        {isOwned ? <CheckCircle className="w-full h-full" /> : isLocked ? <Lock className="w-full h-full" /> : renderIcon(diff.icon)}
                                                    </div>
                                                </div>

                                                <h3 className="text-2xl font-black mb-3 text-white drop-shadow-md">{diff.label} 테스트</h3>

                                                {/* 설명 텍스트: 가독성을 위해 밝은 슬레이트로 변경 */}
                                                <p className="text-sm text-slate-300 mb-8 leading-relaxed font-medium">
                                                    {isLocked ? <span className="text-rose-400 font-bold opacity-80">이전 단계 클리어 필요</span> : <>통과 시 <span className="text-indigo-300 font-bold">&quot;{diff.title}&quot;</span> 획득</>}
                                                </p>

                                                <button
                                                    onClick={() => !isLocked && handleStartQuiz(diff)}
                                                    disabled={isLocked}
                                                    className={`w-full py-5 rounded-[1.5rem] font-black text-sm transition-all shadow-xl active:scale-95 ${isOwned ? 'bg-slate-700/50 text-slate-300 border border-white/10' : isLocked ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed' : 'bg-indigo-500 text-white hover:bg-indigo-400 shadow-indigo-500/30'}`}
                                                >
                                                    {isOwned ? '재도전 하기' : isLocked ? '잠겨 있음' : '테스트 시작'}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className={`h-px flex-1 bg-gradient-to-r from-transparent ${isSpecialLocked ? 'to-slate-800' : 'to-purple-900/50'}`}></div>
                                    <h2 className={`text-sm font-black uppercase tracking-[0.3em] flex items-center gap-3 transition-colors ${isSpecialLocked ? 'text-slate-700' : 'text-purple-400'}`}>
                                        Special Challenges {isSpecialLocked ? <Lock className="w-4 h-4" /> : <LockOpen className="w-4 h-4" />}
                                    </h2>
                                    <div className={`h-px flex-1 bg-gradient-to-l from-transparent ${isSpecialLocked ? 'to-slate-800' : 'to-purple-900/50'}`}></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {DIFFICULTIES.filter(d => d.type === 'challenge').map((diff) => {
                                        const isOwned = user.ownedTitles.includes(diff.title);
                                        const diffIndex = DIFFICULTIES.findIndex(d => d.id === diff.id);
                                        const isLocked = diffIndex > 0 && !user.ownedTitles.includes(DIFFICULTIES[diffIndex - 1].title);

                                        return (
                                            <div
                                                key={diff.id}
                                                className={`relative p-8 rounded-[3rem] flex flex-col items-center text-center group transition-all duration-300 border backdrop-blur-xl shadow-2xl ${isOwned
                                                    ? 'bg-emerald-500/10 border-emerald-500/40 shadow-emerald-900/20'
                                                    : isLocked
                                                        ? 'opacity-30 grayscale pointer-events-none border-white/5 bg-transparent'
                                                        : 'bg-white/10 border-white/20 hover:border-indigo-400/60 hover:-translate-y-2 hover:bg-white/15'}`}
                                            >     <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center mb-8 transition-all ${isOwned ? 'bg-emerald-500/20 text-emerald-400' : isLocked ? 'bg-slate-800 text-slate-600' : 'bg-slate-700/50 text-indigo-400 group-hover:scale-110'}`}>
                                                    <div className="w-10 h-10 flex items-center justify-center">
                                                        {isOwned ? <CheckCircle className="w-full h-full" /> : isLocked ? <Lock className="w-full h-full" /> : renderIcon(diff.icon)}
                                                    </div>
                                                </div>
                                                <h3 className="text-2xl font-black mb-3 text-white">{diff.label} 테스트</h3>
                                                <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                                                    {isLocked ? <span className="text-rose-500/70 font-bold">이전 단계 클리어 필요</span> : <>통과 시 <span className="text-indigo-400 font-bold">&quot;{diff.title}&quot;</span> 획득</>}
                                                </p>
                                                <button onClick={() => !isLocked && handleStartQuiz(diff)} disabled={isLocked} className={`w-full py-5 rounded-[1.5rem] font-black text-sm transition-all shadow-lg active:scale-95 ${isOwned ? 'bg-slate-700 text-slate-300' : isLocked ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-white text-slate-900 hover:bg-indigo-500 hover:text-white'}`}>
                                                    {isOwned ? '재도전 하기' : isLocked ? '잠겨 있음' : '테스트 시작'}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        </>
                    )}

                    {view === 'titles' && (
                        <div className="space-y-12 animate-fade-in">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-yellow-500 rounded-2xl shadow-lg shadow-yellow-500/20 text-slate-900">
                                    <Trophy className="w-6 h-6" />
                                </div>
                                <h2 className="text-3xl font-black text-white">My Title Collection</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* 기본 칭호 */}
                                <TitleCard title="코딩 입문자" label="Default" icon="CodeXml" isOwned={true} isActive={user.activeTitle === "코딩 입문자"} onEquip={() => handleEquipTitle("코딩 입문자")} renderIcon={renderIcon} />
                                {DIFFICULTIES.map(diff => (
                                    <TitleCard key={diff.id} title={diff.title} label={diff.label} icon={diff.icon} isOwned={user.ownedTitles.includes(diff.title)} isActive={user.activeTitle === diff.title} onEquip={() => handleEquipTitle(diff.title)} renderIcon={renderIcon} />
                                ))}
                            </div>
                        </div>
                    )}

                    {view === 'store' && (
                        <div className="space-y-12 animate-fade-in">
                            <div className="flex items-center justify-between gap-4 mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/20 text-white">
                                        <ShoppingCart className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-3xl font-black text-white">SP Point Store</h2>
                                </div>
                                <div className="hidden md:block text-right">
                                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">환상님의 가용 자산</p>
                                    <p className="text-2xl font-black text-indigo-400">{user.availableSp.toLocaleString()} SP</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {STORE_ITEMS.map(item => {
                                    const isOwned = user.ownedTitles.includes(item.title);
                                    return (
                                        <div key={item.id} className="item-card glass-card rounded-[3.5rem] p-10 flex flex-col border border-white/5 relative group transition-all hover:bg-white/[0.03] overflow-hidden">
                                            <div className="flex justify-between items-start mb-12">
                                                <div className="w-16 h-16 bg-slate-800/80 rounded-2xl flex items-center justify-center shadow-inner border border-white/5">
                                                    <div className={`w-8 h-8 ${item.color}`}>
                                                        {renderIcon(item.icon)}
                                                    </div>
                                                </div>
                                                <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-2">{item.category}</span>
                                            </div>
                                            <div className="mb-10">
                                                <h3 className="text-3xl font-black text-white mb-4 group-hover:text-indigo-400 transition-colors">{item.title}</h3>
                                                <p className="text-slate-400 text-lg leading-relaxed font-medium opacity-80">{item.desc}</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Price</span>
                                                    <span className="text-2xl font-black text-indigo-400">{item.price.toLocaleString()} <span className="text-sm">SP</span></span>
                                                </div>
                                                <button onClick={() => !isOwned && handlePurchaseItem(item)} disabled={isOwned} className={`px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-xl active:scale-95 ${isOwned ? 'bg-emerald-500/10 text-emerald-500 cursor-default border border-emerald-500/20' : 'bg-white text-slate-900 hover:bg-indigo-500 hover:text-white'}`}>
                                                    {isOwned ? '보유 중' : '구매하기'}
                                                </button>
                                            </div>
                                            <div className="absolute -right-20 -bottom-20 w-40 h-40 bg-indigo-500/5 blur-[80px] rounded-full group-hover:bg-indigo-500/10 transition-colors"></div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {view === 'history' && (
                        <div className="space-y-12 animate-fade-in">
                            <div className="flex items-center justify-between gap-4 mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/20 text-white">
                                        <ShoppingCart className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-3xl font-black text-white">SP Point Store</h2>
                                </div>
                                <div className="hidden md:block text-right">
                                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">환상님의 가용 자산</p>
                                    <p className="text-2xl font-black text-indigo-400">{user.availableSp.toLocaleString()} SP</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {STORE_ITEMS.map(item => {
                                    const isOwned = user.ownedTitles.includes(item.title);
                                    return (
                                        <div key={item.id} className="item-card glass-card rounded-[3.5rem] p-10 flex flex-col border border-white/5 relative group transition-all hover:bg-white/[0.03] overflow-hidden">
                                            <div className="flex justify-between items-start mb-12">
                                                <div className="w-16 h-16 bg-slate-800/80 rounded-2xl flex items-center justify-center shadow-inner border border-white/5">
                                                    <div className={`w-8 h-8 ${item.color}`}>
                                                        {renderIcon(item.icon)}
                                                    </div>
                                                </div>
                                                <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-2">{item.category}</span>
                                            </div>
                                            <div className="mb-10">
                                                <h3 className="text-3xl font-black text-white mb-4 group-hover:text-indigo-400 transition-colors">{item.title}</h3>
                                                <p className="text-slate-400 text-lg leading-relaxed font-medium opacity-80">{item.desc}</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Price</span>
                                                    <span className="text-2xl font-black text-indigo-400">{item.price.toLocaleString()} <span className="text-sm">SP</span></span>
                                                </div>
                                                <button onClick={() => !isOwned && handlePurchaseItem(item)} disabled={isOwned} className={`px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-xl active:scale-95 ${isOwned ? 'bg-emerald-500/10 text-emerald-500 cursor-default border border-emerald-500/20' : 'bg-white text-slate-900 hover:bg-indigo-500 hover:text-white'}`}>
                                                    {isOwned ? '보유 중' : '구매하기'}
                                                </button>
                                            </div>
                                            <div className="absolute -right-20 -bottom-20 w-40 h-40 bg-indigo-500/5 blur-[80px] rounded-full group-hover:bg-indigo-500/10 transition-colors"></div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}


                    {view === 'quiz' && currentQuiz && !quizResult && (
                        <div className="max-w-3xl mx-auto glass-card rounded-[4rem] p-8 md:p-16 shadow-2xl border border-white/10 animate-fade-in">
                            <div className="flex justify-between items-center mb-12">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">{currentQuiz.label} Phase</span>
                                    <h2 className="text-lg font-bold text-white">Question {currentQuestionIdx + 1} of 5</h2>
                                </div>
                                <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                    <Brain className="w-8 h-8" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-black mb-12 leading-tight text-white">{currentQuiz.questions[currentQuestionIdx].q}</h2>
                            <div className="grid gap-5">
                                {currentQuiz.questions[currentQuestionIdx].a.map((opt, i) => (
                                    <button key={i} onClick={() => handleAnswer(i)} className="group w-full p-6 bg-slate-700/30 hover:bg-indigo-600 border border-white/5 rounded-[2rem] text-left font-bold transition-all flex items-center">
                                        <span className="w-10 h-10 bg-black/30 rounded-xl flex items-center justify-center mr-6 text-xs text-slate-400 group-hover:text-white">{i + 1}</span>
                                        <span className="text-slate-200 group-hover:text-white text-lg">{opt}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {view === 'quiz' && quizResult && (
                        <div className="max-w-3xl mx-auto glass-card rounded-[4rem] p-16 text-center animate-fade-in border border-white/10">
                            <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-10 shadow-2xl ${quizResult.passed ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-red-500 shadow-red-500/30'}`}>
                                {quizResult.passed ? <CheckCircle className="w-16 h-16 text-white" /> : <RotateCcw className="w-16 h-16 text-white" />}
                            </div>
                            <h2 className="text-6xl font-black mb-6 text-white">{quizResult.score}%</h2>
                            <div className="bg-white/5 p-8 rounded-[2.5rem] mb-12 border border-white/5">
                                <p className="text-slate-400 text-lg leading-relaxed whitespace-pre-wrap">
                                    {quizResult.passed ?
                                        `축하합니다 ${user.name}님! ${currentQuiz?.title} 칭호를 획득하셨습니다.\n'칭호 도감'에서 확인해 보세요.`
                                        : `${user.name}, 아쉽게도 이번 연구는 데이터가 조금 부족했습니다.\n다시 한번 도전해 보세요!`}
                                </p>
                            </div>
                            <button onClick={() => setView('main')} className="px-16 py-5 bg-white text-slate-900 rounded-[2rem] font-black text-sm hover:bg-indigo-500 hover:text-white shadow-xl transition-all">로드맵으로 돌아가기</button>
                        </div>
                    )}
                </main>

                {/* 연구실 마스터의 조언 */}
                <footer className="mt-24 p-8 md:p-12 bg-gradient-to-br from-indigo-900/40 via-slate-900/40 rounded-[4rem] border border-white/5 animate-fade-in">
                    <div className="flex flex-col md:flex-row gap-12 items-center text-center md:text-left">
                        <div className="w-24 h-24 bg-gradient-to-b from-indigo-400 to-indigo-600 rounded-[2rem] flex items-center justify-center shrink-0 shadow-2xl">
                            <User className="w-12 h-12 text-white" />
                        </div>
                        <div>
                            <h4 className="text-2xl font-black text-white mb-4">연구실 마스터의 조언 🎓</h4>
                            <p className="text-slate-400 text-lg leading-relaxed font-medium">
                                &quot;{user.name}님, 아키텍트의 명예는 그가 거쳐온 험난한 여정의 기록인 <strong>&apos;칭호&apos;</strong>에서 나옵니다.
                                제가 새로 추가한 <strong>&apos;칭호 도감&apos;</strong>에서는 {user.name}님이 획득한 모든 칭호를 한자리에 모았습니다.
                                칭호를 하나하나 해금해 나가며 도감을 완성하는 그날까지, 저도 {user.name}님의 곁에서 최선을 다해 연구를 돕겠습니다!&quot;
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}