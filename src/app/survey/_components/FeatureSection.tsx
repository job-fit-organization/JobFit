import { cn } from '@/components/Button';

interface FeatureSectionProps {
  selectedFeatures: string[];
  onToggle: (f: string) => void;
  styles: any;
}

const STYLE = {
  featureBtn: "px-4 py-3 rounded-xl text-left text-sm font-medium transition-all border",
  selected: "bg-main-1/5 border-main-1 text-main-1 shadow-sm",
  unselected: "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50",
};

const FeatureSection = ({ selectedFeatures, onToggle, styles }: FeatureSectionProps) => {
  // 일단은 하드코딩
  const features = [
    '직무 적합도 테스트',
    '직무별 상세 로드맵',
    '퀴즈 및 학습 트래킹'
  ];

  return (
    <div className={styles.section}>
      <label className={styles.label}>
        2. 가장 유용했던 기능은 무엇인가요? (복수 선택 가능)
      </label>

      <div className={styles.featureGrid}>
        {features.map((feature) => (
          <button
            key={feature}
            type="button"
            onClick={() => onToggle(feature)}
            className={cn(
              STYLE.featureBtn,
              selectedFeatures.includes(feature) ? STYLE.selected : STYLE.unselected
            )}
          >
            {feature}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FeatureSection;
