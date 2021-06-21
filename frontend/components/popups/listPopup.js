import styles from "../../styles/components/popups/listPopup.module.scss";

export function ListPopupContainer({ children }) {
  return <div className={styles.popupContainer}>{children}</div>;
}

export function ListPopup({ children, topPadding = "15px" }) {
  return (
    <div
      className={styles.listPopupContainer}
      style={{ paddingTop: topPadding }}
    >
      <div className={styles.listPopup}>{children}</div>
    </div>
  );
}
