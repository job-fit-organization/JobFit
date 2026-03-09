'use client';

import Link from 'next/link';
import { Brain, GraduationCap, ClipboardList, LogIn } from 'lucide-react';

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-[1000] border-b border-white/5 bg-black/60 backdrop-blur-3xl">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all">
                        <Brain className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-black tracking-tighter text-foreground italic">JOBFIT</span>
                </Link>

                {/* Navigation */}
                <div className="flex items-center gap-6">
                    <nav className="hidden md:flex items-center gap-8 mr-8 border-r border-white/5 pr-8">
                        <Link href="/test" className="text-sm font-bold text-muted hover:text-foreground transition-colors flex items-center gap-2">
                            <ClipboardList className="w-4 h-4" />
                            테스트
                        </Link>
                        <Link href="/learning" className="text-sm font-bold text-muted hover:text-foreground transition-colors flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" />
                            학습
                        </Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/login"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm transition-all shadow-lg active:scale-95"
                        >
                            <LogIn className="w-4 h-4" />
                            로그인
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
