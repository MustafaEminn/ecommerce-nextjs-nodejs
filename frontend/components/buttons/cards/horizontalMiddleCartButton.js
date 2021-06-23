import styles from "../../../styles/components/buttons/cards/horizontalMiddleCartButton.module.scss";
import ShoppingCartIcon from "../../../public/icons/shoppingCart";

function HorizontalMiddleCartButton() {
  return (
    <button className={styles.button}>
      <ShoppingCartIcon width="24px" height="24px" />
      <span className={styles.addCartText}>Sepete Ekle</span>
    </button>
  );
}

export default HorizontalMiddleCartButton;
