import React from "react";
import styles from "../../styles/components/buttons/iconButton.module.scss";

//Color Options: Main or White
function IconButton(props) {
  return (
    <button {...props} className={styles.button} color={props.color || "main"}>
      {props.icon || <></>}
    </button>
  );
}

export default IconButton;
