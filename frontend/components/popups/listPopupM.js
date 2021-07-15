import styles from "../../styles/components/popups/listPopupM.module.scss";

export function ListPopupMobileContainer({ children }) {
  return <div className={styles.popupContainer}>{children}</div>;
}

export function ListPopupMobile({ children, topPadding = "15px" }) {
  return (
    <div
      className={styles.listPopupContainer}
      style={{ paddingTop: topPadding }}
    >
      <div className={styles.listPopup}>{children}</div>
    </div>
  );
}
