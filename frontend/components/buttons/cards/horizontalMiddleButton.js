import styles from "../../../styles/components/buttons/cards/horizontalMiddleButton.module.scss";
import ShoppingCartIcon from "../../../public/icons/shoppingCart";

function HorizontalMiddleButton({ added }) {
  return (
    <button added={added ? "added" : "unAdded"} className={styles.button}>
      <ShoppingCartIcon width="24px" height="24px" />
      <span className={styles.addCartText}>Sepete Ekle</span>
    </button>
  );
}

export default HorizontalMiddleButton;
