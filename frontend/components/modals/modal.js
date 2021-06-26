import styles from "../../styles/components/modals/modal.module.scss";
import CloseIcon from "../../public/icons/close";

function Modal({
  width = "200px",
  height = "200px",
  onClose = () => {},
  closeOnClickBack = true,
  visible = false,
  children,
  title = "",
}) {
  return (
    <>
      {visible ? (
        <div
          onClick={() => {
            closeOnClickBack ? onClose() : void 0;
          }}
          className={styles.containerBG}
        >
          <div
            className={styles.container}
            onClick={(e) => {
              e.stopPropagation();
            }}
            style={{ width: width, height: height }}
          >
            <div className={styles.header}>
              <h1 className={styles.headerH1}>
                {title.length > 0 ? title : void 0}
              </h1>
              <button onClick={onClose} className={styles.closeButton}>
                <CloseIcon width="17px" />
              </button>
            </div>
            <div>{children}</div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default Modal;
