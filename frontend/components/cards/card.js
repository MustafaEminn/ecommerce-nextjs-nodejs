import styles from "../../styles/components/cards/card.module.scss";

function Card({ width, height, children, className = "1m1m1m1m" }) {
  return (
    <div
      className={className}
      id={styles.container}
      style={{ width: width, height: height }}
    >
      {children}
    </div>
  );
}

export default Card;
