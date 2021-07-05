import styles from "../../styles/components/inputs/inputCheckbox.module.scss";
import Spacer from "../Spacer/spacer";

function InputCheckbox({
  labelText = "",
  name,
  onChange,
  defaultChecked = true,
}) {
  return (
    <label className={styles.label}>
      {labelText.length > 0 ? (
        <span className={styles.labelText}>{labelText}</span>
      ) : (
        <></>
      )}
      {labelText.length > 0 ? <Spacer top="10px" /> : <></>}
      <input
        onChange={onChange}
        type="checkbox"
        name={name}
        className={styles.input}
        defaultChecked={defaultChecked}
      />
    </label>
  );
}

export default InputCheckbox;
