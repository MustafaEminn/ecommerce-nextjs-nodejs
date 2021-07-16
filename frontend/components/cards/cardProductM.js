import styles from "../../styles/components/cards/cardProduct.module.scss";
import Link from "next/dist/client/link";
import HorizontalMiddleCartButton from "../buttons/cards/horizontalMiddleCartButton";
import HorizontalMiddleProductButton from "../buttons/cards/horizontalMiddleProductButton";
import Spacer from "../Spacer/spacer";
import Image from "next/dist/client/image";
import { srcLoader } from "../../utils/srcLoader";

function CardProductMobile({
  imageUrl,
  title,
  price,
  href,
  onAddCart = () => void 0,
}) {
  return (
    <div className={styles.container}>
      <div className={styles.imgContainer}>
        <Link href={`${href}`}>
          <a>
            <Image
              loader={srcLoader}
              loading="lazy"
              className={styles.img}
              src={imageUrl}
              layout="fill"
            />
          </a>
        </Link>
      </div>
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
