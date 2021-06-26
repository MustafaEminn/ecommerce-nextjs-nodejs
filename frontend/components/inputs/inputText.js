import styles from "../../styles/components/inputs/inputText.module.scss";
import Spacer from "../Spacer/spacer";

function InputText({ labelText = "", name, type = "text", width = "301px" }) {
  return (
    <label>
      {labelText.length > 0 ? (
        <span className={styles.labelText}>{labelText}</span>
      ) : (
        <></>
      )}
      {labelText.length > 0 ? <Spacer top="10px" /> : <></>}
      <input
        style={{ width: width }}
        type={type}
        name={name}
        className={styles.input}
      />
    </label>
  );
}

export default InputText;
