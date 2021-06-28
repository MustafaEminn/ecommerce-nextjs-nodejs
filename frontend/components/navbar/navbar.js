import { BASE, PAGE } from "../../constants/index";
import ShoppingCartIcon from "../../public/icons/shoppingCart";
import UserIcon from "../../public/icons/user";
import styles from "../../styles/components/navbar/navbar.module.scss";
import Logo from "../logo";
import SearchBar from "../SearchBar/searchbar";
import Link from "next/link";
import { useRouter } from "next/router";
import { ListPopupContainer, ListPopup } from "../popups/listPopup";

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

  const NavbarPopupItem = ({ title, href }) => {
    return (
      <li className={styles.navbarPopupItem}>
        <Link href={href}>
          <a>{title}</a>
        </Link>
      </li>
    );
  };

  return (
    <div className={styles.container}>
      {/* Navbar Head Begin */}
      <div className={styles.navbarHead} style={{ width: BASE.widthNavbar }}>
        <Link href={PAGE.login.href}>
          <a>
            <Logo fontSize="46px" />
          </a>
        </Link>

        <SearchBar />

        <div className={styles.navbarHeadUserSectionContainer}>
          <ul className={styles.navbarHeadUserSectionUl}>
            <li className={styles.navbarHeadUserSectionLiMyAccount}>
              <ListPopupContainer>
                {isLogined ? (
                  <div>
                    <Link href={PAGE.myAccount.href}>
                      <a>
                        <UserIcon width="16px" height="16px" />
                        <span>Hesabım</span>
                      </a>
                    </Link>
                    <ListPopup>
                      <ul>
                        <NavbarPopupItem
                          href={PAGE.myAccount.href}
                          title="Hesabım"
                        />
                        <NavbarPopupItem title="Siparişlerim" />
                        <NavbarPopupItem title="Çıkış Yap" />
                      </ul>
                    </ListPopup>
                  </div>
                ) : (
                  <div>
                    <Link href={PAGE.login.href}>
                      <a>
                        <UserIcon width="16px" height="16px" />
                        <span>Giriş Yap</span>
                      </a>
                    </Link>
                    <ListPopup>
                      <ul>
                        <NavbarPopupItem
                          href={PAGE.register.href}
                          title="Kayıt Ol"
                        />
                        <NavbarPopupItem
                          href={PAGE.login.href}
                          title="Giriş Yap"
                        />
                      </ul>
                    </ListPopup>
                  </div>
                )}
              </ListPopupContainer>
            </li>

            <li className={styles.navbarHeadUserSectionLiMyCart}>
              <Link href={PAGE.cart.href}>
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
            title={PAGE.home.name}
            activeLinkText={PAGE.home.urlPathname}
            href={PAGE.home.href}
          />
          <NavbarFooterItem
            title={PAGE.aboutUs.name}
            activeLinkText={PAGE.aboutUs.urlPathname}
            href={PAGE.aboutUs.href}
          />
        </ul>
      </div>
      {/* Navbar Footer End */}

      <div className={styles.bottomBorder}></div>
    </div>
  );
}

export default Navbar;
