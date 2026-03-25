'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Scale } from 'lucide-react';

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

export default function TermsPage() {
    return (
        <div className={STYLES.container}>
            <div className={STYLES.contentCard}>
                <Link href="/login" className={STYLES.backLink}>
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    로그인으로 돌아가기
                </Link>

                <header className={STYLES.header}>
                    <div className={STYLES.iconWrapper}>
                        <Scale size={24} />
                    </div>
                    <h1 className={STYLES.title}>이용약관</h1>
                    <p className={STYLES.date}>최시 업데이트: 2026년 3월 25일</p>
                </header>

                <div className={STYLES.text}>
                    <section className={STYLES.section}>
                        <h2 className={STYLES.sectionTitle}>제 1 조 (목적)</h2>
                        <p>
                            본 약관은 JobFit(이하 "회사")이 제공하는 모든 서비스(이하 "서비스")의 이용조건 및 절차, 회사와 회원 간의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.
                        </p>
                    </section>

                    <section className={STYLES.section}>
                        <h2 className={STYLES.sectionTitle}>제 2 조 (용어의 정의)</h2>
                        <ul className={STYLES.listItem}>
                            <li>"서비스"라 함은 회사가 제공하는 AI 직무 분석 및 커리어 로드맵 제안 서비스를 의미합니다.</li>
                            <li>"회원"이라 함은 본 약관에 동의하고 서비스를 이용하는 이용자를 의미합니다.</li>
                            <li>"아이디(ID)"라 함은 회원의 식별과 서비스 이용을 위해 회원이 설정하고 회사가 승인하여 등록된 이메일 주소 등을 의미합니다.</li>
                        </ul>
                    </section>

                    <section className={STYLES.section}>
                        <h2 className={STYLES.sectionTitle}>제 3 조 (약관의 명시와 개정)</h2>
                        <p>
                            회사는 본 약관의 내용을 회원이 쉽게 알 수 있도록 서비스 초기 화면 등에 게시합니다. 회사는 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있으며, 개정 시 적용일자 및 개정 사유를 명시하여 공지합니다.
                        </p>
                    </section>

                    <section className={STYLES.section}>
                        <h2 className={STYLES.sectionTitle}>제 4 조 (서비스 이용 및 제한)</h2>
                        <p>
                            회원은 회사가 제공하는 분석 도구 및 콘텐츠를 개인적인 용도로만 이용해야 하며, 영리 목적의 재배포나 무단 도용은 금지됩니다. 서비스 이용 중 타인의 저작권을 침해하거나 서비스 운영을 방해하는 행위를 할 경우 이용이 제한될 수 있습니다.
                        </p>
                    </section>

                    <section className={STYLES.section}>
                        <h2 className={STYLES.sectionTitle}>제 5 조 (책임의 한계)</h2>
                        <p>
                            회사가 제공하는 AI 분석 결과 및 추천 정보는 데이터에 기반한 제안일 뿐이며, 최종적인 직업 선택 및 결과에 대한 책임은 이용자 본인에게 있습니다.
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
