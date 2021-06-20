import { BASE } from "../../constants/base";
import styles from "../../styles/components/Layout/LayoutMain.module.scss";
import Navbar from "../navbar/navbar";

function LayoutMain({ children }) {
  return (
    <div>
      <Navbar />
      <div className={styles.main} style={{ width: BASE.widthPage }}>
        {children}
      </div>
    </div>
  );
}

export default LayoutMain;
