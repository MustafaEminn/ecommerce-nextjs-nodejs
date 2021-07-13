import styles from "../../../styles/components/buttons/cards/horizontalMiddleProductButton.module.scss";
import VisitCardIcon from "../../../public/icons/visitCard";
import Link from "next/dist/client/link";

function HorizontalMiddleProductButton({ href, width = "80%" }) {
  return (
    <Link href={`${href}`}>
      <a style={{ width }} className={styles.button}>
        <VisitCardIcon width="24px" height="24px" />
        <span className={styles.addCartText}>Ürüne Git</span>
      </a>
    </Link>
  );
}

export default HorizontalMiddleProductButton;
