import { BASE } from "../../constants/base";
import styles from "../../styles/components/Layout/LayoutMain.module.scss";
import Navbar from "../navbar/navbar";
import FooterComp from "../footer/footer";

function LayoutMain({
  children,
  authCheck = true,
  fadeBG = false,
  centerContent = false,
}) {
  return (
    <div
      className={styles.container}
      style={{ backgroundColor: fadeBG ? "#fbfbfa" : "#ffffff" }}
    >
      <Navbar />
      <div
        className={styles.main}
        style={{
          width: BASE.widthPage,
          display: centerContent ? "flex" : "initial",
        }}
      >
        {children}
      </div>
      <FooterComp />
    </div>
  );
}

export default LayoutMain;
