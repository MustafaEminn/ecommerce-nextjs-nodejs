import { BASE } from "../../constants/base";
import styles from "../../styles/components/logo/logo.module.css";

function Logo({ className }) {
  return (
    <h1 className={className} id={styles.logo}>
      {BASE.companyName}
    </h1>
  );
}

export default Logo;
