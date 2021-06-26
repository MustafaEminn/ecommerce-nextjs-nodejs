import styles from "../../styles/components/buttons/mainColorButton.module.scss";

function MainColorButton({ text, width = "100%", height = "30px" }) {
  return (
    <button style={{ width: width, height: height }} className={styles.button}>
      {text}
    </button>
  );
}
export default MainColorButton;
