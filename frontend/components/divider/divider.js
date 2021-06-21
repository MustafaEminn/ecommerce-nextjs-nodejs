import styles from "../../styles/components/divider/divider.module.scss";

function Divider({ children, direction }) {
  return (
    <span className={styles.divider} direction={direction}>
      {children}
    </span>
  );
}

export default Divider;
