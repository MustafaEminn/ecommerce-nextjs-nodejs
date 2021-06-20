import { BASE } from "../../constants/base";
import styles from "../../styles/components/logo/logo.module.scss";

function Logo({ fontSize }) {
  return (
    <h1 style={{ fontSize: fontSize }} className={styles.logo}>
      {BASE.companyName}
    </h1>
  );
}

export default Logo;
