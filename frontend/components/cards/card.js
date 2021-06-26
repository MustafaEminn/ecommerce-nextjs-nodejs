import styles from "../../styles/components/cards/card.module.scss";

function Card({ width, height, children }) {
  return (
    <div className={styles.container} style={{ width: width, height: height }}>
      {children}
    </div>
  );
}

export default Card;
