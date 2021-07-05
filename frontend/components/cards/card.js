import styles from "../../styles/components/cards/card.module.scss";

function Card({
  width,
  height,
  children,
  className = "1m1m1m1m",
  padding = "40px",
}) {
  return (
    <div
      className={className}
      id={styles.container}
      style={{ width: width, height: height, padding }}
    >
      {children}
    </div>
  );
}

export default Card;
