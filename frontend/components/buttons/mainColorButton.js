import styles from "../../styles/components/buttons/mainColorButton.module.scss";

function MainColorButton({
  type,
  disabled,
  text,
  width = "100%",
  height = "30px",
  onClick = () => {},
  icon = <></>,
  center = false,
}) {
  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      style={{ width: width, height: height, margin: center ? "0 auto" : "0" }}
      className={styles.button}
    >
      {icon} {text}
    </button>
  );
}
export default MainColorButton;
