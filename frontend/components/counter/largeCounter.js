import styles from "../../styles/components/counter/largeCounter.module.scss";

function LargeCounter({ onChange = () => {}, value = 50 }) {
  return (
    <div className={styles.container}>
      <button
        onClick={() => {
          if (value > 50) {
            onChange(-50);
          }
        }}
        className={styles.minus}
      >
        -
      </button>
      <div className={styles.count}>{value}</div>
      <button
        onClick={() => {
          onChange(+50);
        }}
        className={styles.plus}
      >
        +
      </button>
    </div>
  );
}

export default LargeCounter;
