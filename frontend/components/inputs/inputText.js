import styles from "../../styles/components/inputs/inputText.module.scss";
import Spacer from "../Spacer/spacer";

function InputText({
  labelText = "",
  name,
  type = "text",
  width = "301px",
  pattern,
  onChange,
}) {
  return (
    <label>
      {labelText.length > 0 ? (
        <span className={styles.labelText}>{labelText}</span>
      ) : (
        <></>
      )}
      {labelText.length > 0 ? <Spacer top="10px" /> : <></>}
      <input
        onChange={onChange}
        pattern={pattern}
        style={{ width: width }}
        type={type}
        name={name}
        className={styles.input}
      />
    </label>
  );
}

export default InputText;