import React, { useState } from "react";
import styles from "../../styles/components/inputs/inputCardRadio.module.scss";

function InputCardRadio({
  name = "",
  options = [],
  width = "301px",
  defaultCheckedIndex = 0,
  onChange = () => void 0,
}) {
  const [selectedIndex, setSelectedIndex] = useState(defaultCheckedIndex);

  const onChangeCardContainer = (e, index) => {
    setSelectedIndex(index);
    e.target.childNodes[0].checked = true;
    onChange(e.target.childNodes[0].value);
  };

  const onChangeTitle = (e, index) => {
    setSelectedIndex(index);
    e.target.previousSibling.checked = true;
    onChange(e.target.previousSibling.value);
  };
  return (
    <div className={styles.container}>
      {options.map((item, index) => {
        return (
          <>
            <div
              key={index}
              onClick={(e) => onChangeCardContainer(e, index)}
              style={{ width: width }}
              className={styles.cardItemContainer}
            >
              <input
                type="radio"
                name={name}
                value={item.value}
                defaultChecked={defaultCheckedIndex === index}
              />
              <span onClick={(e) => onChangeTitle(e, index)}>{item.title}</span>
            </div>
            {item?.explain && selectedIndex === index ? item.explain : void 0}
          </>
        );
      })}
    </div>
  );
}

export default InputCardRadio;
