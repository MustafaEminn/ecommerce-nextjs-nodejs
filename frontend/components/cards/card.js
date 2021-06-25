import styles from "../../styles/components/cards/card.module.scss";

function Card({ width, height }) {
  return (
    <div
      className={styles.container}
      style={{ width: width, height: height }}
    ></div>
  );
}

export default Card;
