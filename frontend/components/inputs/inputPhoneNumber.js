import styles from "../../styles/components/inputs/inputPhoneNumber.module.scss";
import Spacer from "../Spacer/spacer";

function InputPhoneNumber({ labelText = "", name, width = "301px", pattern }) {
  return (
    <label className={styles.label}>
      {labelText.length > 0 ? (
        <span className={styles.labelText}>{labelText}</span>
      ) : (
        <></>
      )}
      {labelText.length > 0 ? <Spacer top="10px" /> : <></>}
      <input
        style={{ width: width }}
        type="tel"
        name={name}
        pattern={pattern}
        className={styles.input}
      />
    </label>
  );
}

export default InputPhoneNumber;
