import styles from "../../styles/components/cards/cardProduct.module.scss";
import Link from "next/dist/client/link";
import HorizontalMiddleCartButton from "../buttons/cards/horizontalMiddleCartButton";
import HorizontalMiddleProductButton from "../buttons/cards/horizontalMiddleProductButton";
import Spacer from "../Spacer/spacer";
import Image from "next/dist/client/image";
import { srcLoader } from "../../utils/srcLoader";

function CardProduct({
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
          <Image
            width="188px"
            height="150px"
            loading="lazy"
            className={styles.img}
            loader={srcLoader}
            src={imageUrl}
          />
        </a>
      </Link>
      <Link href={`${href}`}>
        <a className={styles.linkTitle}>{title}</a>
      </Link>
      <span className={styles.price}>{price} TL</span>
      <span className={styles.cardDivider}></span>
      <HorizontalMiddleCartButton onClick={onAddCart} />
      <Spacer top="15px" />
      <HorizontalMiddleProductButton href={href} />
    </div>
  );
}

export default CardProduct;
