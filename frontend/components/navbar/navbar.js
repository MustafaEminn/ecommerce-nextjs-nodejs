import { BASE } from "../../constants/base";
import ShoppingCartIcon from "../../public/icons/shoppingCart";
import UserIcon from "../../public/icons/user";
import styles from "../../styles/components/navbar/navbar.module.scss";
import Logo from "../logo";
import SearchBar from "../SearchBar/searchbar";

function Navbar() {
  return (
    <div>
      <div className={styles.navbarHead} style={{ width: BASE.widthNavbar }}>
        <Logo fontSize="46px" />
        <SearchBar />

        <div className={styles.navbarHeadUserSectionContainer}>
          <ul className={styles.navbarHeadUserSectionUl}>
            <li className={styles.navbarHeadUserSectionLiMyAccount}>
              <div>
                <UserIcon width="16px" height="16px" />
                <span>Hesabım</span>
              </div>
            </li>
            <li className={styles.navbarHeadUserSectionLiMyCart}>
              <div>
                <ShoppingCartIcon width="16px" height="16px" />
                <span>Sepetim</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
