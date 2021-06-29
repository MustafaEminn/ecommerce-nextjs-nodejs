import styles from "../../styles/components/counter/largeCounter.module.scss";

function LargeCounter({ onChange = () => {}, value = 100 }) {
  return (
    <div className={styles.container}>
      <button
        onClick={() => {
          if (value > 100) {
            onChange(-100);
          }
        }}
        className={styles.minus}
      >
        -
      </button>
      <div className={styles.count}>{value}</div>
      <button
        onClick={() => {
          onChange(+100);
        }}
        className={styles.plus}
      >
        +
      </button>
    </div>
  );
}

export default LargeCounter;
