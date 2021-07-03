import styles from "../../styles/components/inputs/inputTextbox.module.scss";
import Spacer from "../Spacer/spacer";

function InputTextbox({
  labelText = "",
  name,
  type = "text",
  width = "301px",
  pattern,
  onChange,
  defaultValue = "",
  rows = 4,
  maxHeight = "150px",
  maxWidth = "301px",
  height,
}) {
  return (
    <label className={styles.label}>
      {labelText.length > 0 ? (
        <span className={styles.labelText}>{labelText}</span>
      ) : (
        <></>
      )}
      {labelText.length > 0 ? <Spacer top="10px" /> : <></>}
      <textarea
        wrap={true}
        onChange={onChange}
        pattern={pattern}
        style={{
          width: width,
          maxWidth: maxWidth,
          maxHeight: maxHeight,
          height: height,
        }}
        rows={rows}
        type={type}
        name={name}
        defaultValue={defaultValue}
        className={styles.input}
      />
    </label>
  );
}

export default InputTextbox;
