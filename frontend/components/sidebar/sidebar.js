import { API, BASE, PAGE } from "../../constants/index";
import ShoppingCartIcon from "../../public/icons/shoppingCart";
import UserIcon from "../../public/icons/user";
import styles from "../../styles/components/sidebar/sidebar.module.scss";
import Logo from "../logo";
import SearchBar from "../SearchBar/searchbar";
import Link from "next/link";
import { ListPopupContainer, ListPopup } from "../popups/listPopup";

function Sidebar() {
  return (
    <div className={styles.container}>
      <ul>
        <li>
          <Link href={PAGE.myAccount.href}>
            <a>{PAGE.myAccount.name}</a>
          </Link>
        </li>
        <li>
          <Link href={PAGE.myOrders.href}>
            <a>{PAGE.myOrders.name}</a>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
