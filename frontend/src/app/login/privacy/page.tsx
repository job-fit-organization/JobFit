'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ShieldCheck } from 'lucide-react';

const STYLES = {
    container: "min-h-screen bg-gray-50 flex flex-col items-center p-4 py-12 md:py-20",
    contentCard: "w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 relative overflow-hidden",
    backLink: "inline-flex items-center text-sm font-bold text-gray-500 hover:text-main-1 transition-colors mb-8 group",
    header: "mb-10",
    iconWrapper: "w-12 h-12 bg-main-1/10 rounded-xl flex items-center justify-center text-main-1 mb-4",
    title: "text-3xl font-black text-gray-900 mb-2",
    date: "text-sm text-gray-400",
    section: "mb-10",
    sectionTitle: "text-xl font-bold text-gray-800 mb-4 border-l-4 border-main-1 pl-3",
    text: "text-gray-600 leading-relaxed space-y-4",
    listItem: "list-disc ml-5 space-y-2",
    footer: "mt-12 pt-8 border-t border-gray-100 text-center text-sm text-gray-400"
};

export default function PrivacyPage() {
    return (
        <div className={STYLES.container}>
            <div className={STYLES.contentCard}>
                <Link href="/login" className={STYLES.backLink}>
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    로그인으로 돌아가기
                </Link>

                <header className={STYLES.header}>
                    <div className={STYLES.iconWrapper}>
                        <ShieldCheck size={24} />
                    </div>
                    <h1 className={STYLES.title}>개인정보처리방침</h1>
                    <p className={STYLES.date}>최초 공고일: 2026년 3월 25일</p>
                </header>

                <div className={STYLES.text}>
                    <section className={STYLES.section}>
                        <h2 className={STYLES.sectionTitle}>제 1 조 (개인정보의 처리 목적)</h2>
                        <ul className={STYLES.listItem}>
                            <li>서비스 가입 수단(소셜 로그인) 연동 및 회원 식별</li>
                            <li>AI 기반 맞춤형 직무 분석 및 결과 제공</li>
                            <li>이용 문의 응대 및 서비스 품질 개선</li>
                        </ul>
                    </section>

                    <section className={STYLES.section}>
                        <h2 className={STYLES.sectionTitle}>제 2 조 (처리하는 개인정보의 항목)</h2>
                        <ul className={STYLES.listItem}>
                            <li>[필수] 이메일, 닉네임, 프로필 이미지 (소셜 로그인 제공 정보)</li>
                            <li>[선택] 설문조사 응답 내용, 테스트 결과 데이터</li>
                        </ul>
                    </section>

                    <section className={STYLES.section}>
                        <h2 className={STYLES.sectionTitle}>제 3 조 (개인정보의 처리 및 보유 기간)</h2>
                        <p>
                            회원의 개인정보는 서비스 이용 기간 동안 보유하며, 회원 탈퇴 시 즉시 파기합니다. 단, 관련 법령(상법, 전자상거래 등에서의 소비자보호에 관한 법률 등)에 의하여 보존할 필요가 있는 경우 해당 법령에 정한 기간 동안 보관할 수 있습니다.
                        </p>
                    </section>

                    <section className={STYLES.section}>
                        <h2 className={STYLES.sectionTitle}>제 4 조 (개인정보의 파기 절차 및 방법)</h2>
                        <p>
                            파기 대상 정보는 복구가 불가능한 방법으로 안전하게 파기하며, 전자적 파일 형태는 기술적 방법을 이용하여 영구 삭제합니다.
                        </p>
                    </section>

                    <section className={STYLES.section}>
                        <h2 className={STYLES.sectionTitle}>제 5 조 (정보주체의 권리 및 의무)</h2>
                        <p>
                            회원은 언제든지 자신의 개인정보를 열람, 수정하거나 삭제(탈퇴)를 요청할 수 있습니다. 회사는 회원의 요청에 지체 없이 조치하겠습니다.
                        </p>
                    </section>
                </div>

                <footer className={STYLES.footer}>
                    <p>© 2026 JobFit Organization. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}
