import { Star } from 'lucide-react';
import clsx from 'clsx';

interface RatingSectionProps {
  rating: number;
  onRate: (r: number) => void;
  // 부모로부터 받는 공통 스타일입니다.
  styles: any;
}

// 별점 선택하는 영역이에요.
const STYLE = {
  starBtn: "p-1 transition-transform hover:scale-110 focus:outline-none",
  starIcon: "w-8 h-8 md:w-10 md:h-10 transition-colors",
};

const RatingSection = ({ rating, onRate, styles }: RatingSectionProps) => {
  return (
    <div className={styles.section}>
      <label className={styles.label}>
        1. 전반적인 서비스 만족도는 어떠셨나요?
      </label>
      
      <div className={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRate(star)}
            className={STYLE.starBtn}
          >
            <Star
              className={clsx(
                STYLE.starIcon,
                // 점수에 따라 색상이 바뀝니다.
                star <= rating ? "text-yellow-400 fill-yellow-400" : "text-slate-300"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default RatingSection;
