import styles from "../../styles/components/cards/CardProduct.module.scss";
import Link from "next/dist/client/link";
import HorizontalMiddleCartButton from "../buttons/cards/horizontalMiddleCartButton";
import HorizontalMiddleProductButton from "../buttons/cards/horizontalMiddleProductButton";
import Spacer from "../Spacer/spacer";

function CardProduct({ imageUrl, title, price, href }) {
  return (
    <Link href={`${href}`}>
      <a>
        <div className={styles.container}>
          <img loading="lazy" className={styles.img} src={imageUrl} />

          <span className={styles.linkTitle}>{title}</span>

          <span className={styles.price}>{price} TL</span>

          <span className={styles.cardDivider}></span>

          <HorizontalMiddleCartButton />
          <Spacer top="15px" />
          <HorizontalMiddleProductButton href={href} />
        </div>
      </a>
    </Link>
  );
}

export default CardProduct;
