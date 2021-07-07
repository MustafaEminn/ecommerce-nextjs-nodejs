import styles from "../../styles/components/inputs/inputSelect.module.scss";
import Spacer from "../Spacer/spacer";

function InputSelect({
  labelText = "",
  name,
  options = [],
  width = "301px",
  onChange,
  pattern,
  defaultValue = "-",
}) {
  return (
    <label className={styles.label}>
      {labelText.length > 0 ? (
        <span className={styles.labelText}>{labelText}</span>
      ) : (
        <></>
      )}
      {labelText.length > 0 ? <Spacer top="10px" /> : <></>}
      <select
        style={{ width: width }}
        onChange={onChange}
        className={styles.select}
        name={name}
        required
        defaultValue={defaultValue}
      >
        <option className={styles.option} value="">
          Seçiniz
        </option>
        {options.map((item) => {
          return (
            <option className={styles.option} value={item?.value}>
              {item?.title}
            </option>
          );
        })}
      </select>
    </label>
  );
}

export default InputSelect;
