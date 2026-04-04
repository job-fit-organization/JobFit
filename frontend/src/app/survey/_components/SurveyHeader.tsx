import { MessageSquare } from 'lucide-react';

const STYLE = {
  container: "text-center mb-10",
  title: "text-3xl font-bold text-slate-900 flex items-center justify-center gap-3",
  icon: "w-8 h-8 text-main-1",
  description: "mt-2 text-slate-600",
};

const SurveyHeader = () => {
  return (
    <div className={STYLE.container}>
      <h1 className={STYLE.title}>
        <MessageSquare className={STYLE.icon} />
        서비스 만족도 설문조사
      </h1>
      <p className={STYLE.description}>
        Job Fit 서비스를 이용해주셔서 감사합니다.<br />
        여러분의 솔직한 의견을 들려주세요.
      </p>
    </div>
  );
};

export default SurveyHeader;
