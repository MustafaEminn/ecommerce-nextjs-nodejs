import styles from "../../styles/components/cards/CardProduct.module.scss";
import Link from "next/dist/client/link";
import HorizontalMiddleButton from "../buttons/cards/horizontalMiddleButton";

function CardProduct({ imageUrl, title }) {
  return (
    <Link href="/">
      <a>
        <div className={styles.container}>
          <img className={styles.img} src={imageUrl} />

          <span className={styles.linkTitle}>{title}</span>

          <HorizontalMiddleButton />
        </div>
      </a>
    </Link>
  );
}

export default CardProduct;
