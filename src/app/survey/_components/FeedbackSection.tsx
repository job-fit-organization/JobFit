interface FeedbackSectionProps {
  value: string;
  onChange: (v: string) => void;
  styles: any;
}

// 자유 의견 작성란
const FeedbackSection = ({ value, onChange, styles }: FeedbackSectionProps) => {
  return (
    <div className={styles.section}>
      <label className={styles.label}>
        3. 더 바라는 점이나 개선할 부분이 있다면 알려주세요.
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="자유롭게 작성해주세요..."
        rows={4}
        className={styles.textArea}
      />
    </div>
  );
};

export default FeedbackSection;
