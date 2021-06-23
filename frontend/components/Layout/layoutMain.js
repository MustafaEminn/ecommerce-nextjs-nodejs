import { BASE } from "../../constants/base";
import styles from "../../styles/components/Layout/LayoutMain.module.scss";
import Navbar from "../navbar/navbar";
import FooterComp from "../footer/footer";

function LayoutMain({ children }) {
  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.main} style={{ width: BASE.widthPage }}>
        {children}
      </div>
      <FooterComp />
    </div>
  );
}

export default LayoutMain;
