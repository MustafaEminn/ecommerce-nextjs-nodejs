import styles from "../../styles/components/buttons/whiteButton.module.scss";

function WhiteButton({ text, width = "100%", height = "30px", type }) {
  return (
    <button
      type={type}
      style={{ width: width, height: height }}
      className={styles.button}
    >
      {text}
    </button>
  );
}
export default WhiteButton;
