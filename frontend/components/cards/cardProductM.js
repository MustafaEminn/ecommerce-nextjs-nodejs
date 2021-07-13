import styles from "../../styles/components/cards/CardProduct.module.scss";
import Link from "next/dist/client/link";
import HorizontalMiddleCartButton from "../buttons/cards/horizontalMiddleCartButton";
import HorizontalMiddleProductButton from "../buttons/cards/horizontalMiddleProductButton";
import Spacer from "../Spacer/spacer";

function CardProductMobile({
  imageUrl,
  title,
  price,
  href,
  onAddCart = () => void 0,
}) {
  return (
    <div className={styles.container}>
      <Link href={`${href}`}>
        <a>
          <img loading="lazy" className={styles.img} src={imageUrl} />
        </a>
      </Link>
      <Link href={`${href}`}>
        <a className={styles.linkTitle}>{title}</a>
      </Link>
      <span className={styles.price}>{price} TL</span>
      <span className={styles.cardDivider}></span>
      <HorizontalMiddleCartButton width="100%" onClick={onAddCart} />
      <Spacer top="15px" />
      <HorizontalMiddleProductButton width="100%" href={href} />
    </div>
  );
}

export default CardProductMobile;
