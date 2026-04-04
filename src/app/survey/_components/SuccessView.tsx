import Button from '@/components/Button';
import { CheckCircle2 } from 'lucide-react';

// 제출 완료 후 보여줄 화면 스타일
const STYLE = {
  overlay: "min-h-screen bg-slate-50 flex items-center justify-center p-4",
  card: "bg-white max-w-md w-full p-8 rounded-2xl shadow-xl text-center space-y-6",
  iconWrapper: "w-20 h-20 bg-serve-2/10 rounded-full flex items-center justify-center mx-auto",
  icon: "w-10 h-10 text-serve-2",
  title: "text-2xl font-bold text-slate-900",
  description: "text-slate-600",
  button: "w-full bg-main-1 hover:bg-main-1/90",
};

const SuccessView = ({ onHomeClick }: { onHomeClick: () => void }) => {
  return (
    <div className={STYLE.overlay}>
      <div className={STYLE.card}>
        <div className={STYLE.iconWrapper}>
          <CheckCircle2 className={STYLE.icon} />
        </div>

        <h2 className={STYLE.title}>소중한 의견 감사합니다!</h2>
        <p className={STYLE.description}>
          보내주신 피드백을 바탕으로<br />
          더 나은 서비스를 만들겠습니다.
        </p>

        <Button onClick={onHomeClick} className={STYLE.button}>
          메인으로 돌아가기
        </Button>
      </div>
    </div>
  );
};

export default SuccessView;
