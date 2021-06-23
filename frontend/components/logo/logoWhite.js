import { BASE } from "../../constants/base";
import styles from "../../styles/components/logo/logoWhite.module.scss";

function LogoWhite({ fontSize }) {
  return (
    <h1 style={{ fontSize: fontSize }} className={styles.logo}>
      {BASE.companyName}
    </h1>
  );
}

export default LogoWhite;
