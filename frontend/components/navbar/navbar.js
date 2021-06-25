import { BASE, PAGE } from "../../constants/index";
import ShoppingCartIcon from "../../public/icons/shoppingCart";
import UserIcon from "../../public/icons/user";
import styles from "../../styles/components/navbar/navbar.module.scss";
import Logo from "../logo";
import SearchBar from "../SearchBar/searchbar";
import Link from "next/link";
import { useRouter } from "next/router";
import { ListPopupContainer, ListPopup } from "../popups/listPopup";
import Divider from "../divider/divider";

function Navbar({ isLogined }) {
  const router = useRouter();
  const NavbarFooterItem = ({ title, activeLinkText, href }) => {
    return router.pathname.split("/")[1] === activeLinkText ? (
      <li className={styles.activeFooterItem}>
        <Link href={href}>
          <a>{title}</a>
        </Link>
      </li>
    ) : (
      <li className={styles.deactiveFooterItem}>
        <Link href={href}>
          <a>{title}</a>
        </Link>
      </li>
    );
  };

  const NavbarPopupItem = ({ title }) => {
    return (
      <li className={styles.navbarPopupItem}>
        <Link href={PAGE.Hesabim.href}>
          <a>{title}</a>
        </Link>
      </li>
    );
  };

  return (
    <div className={styles.container}>
      {/* Navbar Head Begin */}
      <div className={styles.navbarHead} style={{ width: BASE.widthNavbar }}>
        <Logo fontSize="46px" />
        <SearchBar />

        <div className={styles.navbarHeadUserSectionContainer}>
          <ul className={styles.navbarHeadUserSectionUl}>
            <li className={styles.navbarHeadUserSectionLiMyAccount}>
              <ListPopupContainer>
                {isLogined ? (
                  <div>
                    <Link href={PAGE.Hesabim.href}>
                      <a>
                        <UserIcon width="16px" height="16px" />
                        <span>Hesabım</span>
                      </a>
                    </Link>
                    <ListPopup>
                      <ul>
                        <NavbarPopupItem title="Hesabım" />
                        <NavbarPopupItem title="Siparişlerim" />
                        <NavbarPopupItem title="Çıkış Yap" />
                      </ul>
                    </ListPopup>
                  </div>
                ) : (
                  <div>
                    <Link href={PAGE.Giris.href}>
                      <a>
                        <UserIcon width="16px" height="16px" />
                        <span>Giriş Yap</span>
                      </a>
                    </Link>
                    <ListPopup>
                      <ul>
                        <NavbarPopupItem title="Kayıt Ol" />
                        <NavbarPopupItem title="Giriş Yap" />
                      </ul>
                    </ListPopup>
                  </div>
                )}
              </ListPopupContainer>
            </li>

            <li className={styles.navbarHeadUserSectionLiMyCart}>
              <Link href={PAGE.Sepetim.href}>
                <a>
                  <ShoppingCartIcon width="16px" height="16px" />
                  <span>Sepetim</span>
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      {/* Navbar Head End */}

      {/* Navbar Footer Begin */}
      <div className={styles.navbarFooter} style={{ width: BASE.widthNavbar }}>
        <ul className={styles.navbarFooterUl}>
          <NavbarFooterItem
            title={PAGE.AnaSayfa.name}
            activeLinkText={PAGE.AnaSayfa.urlPathname}
            href={PAGE.AnaSayfa.href}
          />
          <NavbarFooterItem
            title={PAGE.Hakkimizda.name}
            activeLinkText={PAGE.Hakkimizda.urlPathname}
            href={PAGE.Hakkimizda.href}
          />
        </ul>
      </div>
      {/* Navbar Footer End */}

      <div className={styles.bottomBorder}></div>
    </div>
  );
}

export default Navbar;
